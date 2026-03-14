/** @file Conversation detail screen.
 *
 * Renders the full agent-mediated conversation with:
 * - Agent status badge (backend, model, turn state)
 * - Message timeline (`<ol role="log">`)
 * - Tool execution cards (expandable, chamfered)
 * - Handoff annotations at handoff positions
 * - Slash command input (visual mockup)
 */

import { getRouteApi } from "@tanstack/react-router";
import type { JSX } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { findConversation, type Handoff, type Message } from "../../../data/conversations";
import { pickLocalization } from "../../domain/entities/localization";
import { AgentStatusBadge } from "./components/agent-status-badge";
import { HandoffAnnotation } from "./components/handoff-annotation";
import { MessageBubble } from "./components/message-bubble";
import { SlashCommandInput } from "./components/slash-command-input";
import { ToolCallCard } from "./components/tool-call-card";

/* ── Route API ────────────────────────────────────────────────────── */

const routeApi = getRouteApi("/projects/$slug/conversations/$id");

/* ── Timeline item ────────────────────────────────────────────────── */

type TimelineItem =
  | { readonly kind: "message"; readonly message: Message }
  | { readonly kind: "handoff"; readonly handoff: Handoff };

type NonToolMessage = Message & { readonly role: Exclude<Message["role"], "tool"> };
type ToolCallMessage = Message & {
  readonly role: "tool";
  readonly toolCall: NonNullable<Message["toolCall"]>;
};

function isToolCallMessage(message: Message): message is ToolCallMessage {
  return message.role === "tool" && message.toolCall !== undefined;
}

function isNonToolMessage(message: Message): message is NonToolMessage {
  return message.role !== "tool";
}

/** Merge messages and handoffs into a single ordered timeline. */
function buildTimeline(
  messages: readonly Message[],
  handoffs: readonly Handoff[],
): readonly TimelineItem[] {
  const items: TimelineItem[] = [];
  const handoffByPosition = new Map(handoffs.map((h) => [h.position, h]));

  for (let i = 0; i < messages.length; i++) {
    const handoff = handoffByPosition.get(i);
    if (handoff) {
      items.push({ kind: "handoff", handoff });
    }
    const msg = messages[i];
    if (msg) {
      items.push({ kind: "message", message: msg });
    }
  }

  return items;
}

/* ── Screen ───────────────────────────────────────────────────────── */

export function ConversationDetailScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const { slug, id } = routeApi.useParams();
  const conversation = findConversation(slug, id);

  const timeline = useMemo(
    () => (conversation ? buildTimeline(conversation.messages, conversation.handoffs) : []),
    [conversation],
  );

  if (!conversation) {
    return (
      <div className="py-12 text-center">
        <p className="text-[length:var(--font-size-lg)] font-semibold text-base-content">
          {t("conversation-not-found", {
            defaultValue: "Conversation not found",
          })}
        </p>
        <p className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)] text-base-content/60">
          {id}
        </p>
      </div>
    );
  }

  const loc = pickLocalization(conversation.localizations, locale);

  return (
    <div className="space-y-4">
      {/* Page heading */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
          {loc.name}
        </h1>
        {loc.description ? <p className="mt-1 text-base-content/70">{loc.description}</p> : null}
        <p className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)] text-base-content/60">
          {conversation.taskId}
        </p>
      </div>

      {/* Agent status badge */}
      <AgentStatusBadge
        backend={conversation.agentBackend}
        model={conversation.agentModel}
        turnState={conversation.turnState}
      />

      {/* Message timeline */}
      <section
        className="rounded-lg border border-base-300 bg-base-200/40 shadow-sm"
        aria-label={t("conversation-timeline-label", {
          defaultValue: "Conversation timeline",
        })}
      >
        <div role="log" aria-live="polite">
          <ol className="space-y-4 p-4">
            {timeline.map((item) => {
              if (item.kind === "handoff") {
                return (
                  <HandoffAnnotation
                    key={`handoff-${item.handoff.position}`}
                    handoff={item.handoff}
                  />
                );
              }

              const msg = item.message;
              if (isToolCallMessage(msg)) {
                return <ToolCallCard key={msg.id} message={msg} locale={locale} />;
              }

              if (!isNonToolMessage(msg)) return null;

              return <MessageBubble key={msg.id} message={msg} locale={locale} />;
            })}
          </ol>
        </div>

        {/* Slash command input */}
        <SlashCommandInput />
      </section>
    </div>
  );
}
