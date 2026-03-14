/** @file Conversation listing screen for a project.
 *
 * Displays all conversations scoped to the current project with
 * title, linked task ID, agent backend, message count, last
 * activity timestamp, and status badge. Clicking a row navigates
 * to the conversation detail view.
 */

import { IconMessage, IconRobot } from "@tabler/icons-react";
import { getRouteApi, Link } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import {
  type Conversation,
  getConversationsForProject,
  getLastActivityTimestamp,
} from "../../../data/conversations";
import { pickLocalization } from "../../domain/entities/localization";
import { formatTimelineTimestamp } from "../../utils/date-formatting";
import { ConversationStatusBadge } from "./components/conversation-status-badge";

/* ── Route API ────────────────────────────────────────────────────── */

const routeApi = getRouteApi("/projects/$slug/conversations");

/* ── Row component ────────────────────────────────────────────────── */

interface ConversationRowProps {
  readonly conversation: Conversation;
  readonly locale: string;
  readonly slug: string;
  readonly messageCountLabel: string;
}

function ConversationRow({
  conversation,
  locale,
  slug,
  messageCountLabel,
}: ConversationRowProps): JSX.Element {
  const loc = pickLocalization(conversation.localizations, locale);
  const lastActivity = getLastActivityTimestamp(conversation);

  return (
    <li>
      <Link
        to="/projects/$slug/conversations/$id"
        params={{ slug, id: conversation.id }}
        className="flex flex-col gap-2 rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-3 sm:items-center">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:mt-0">
            <IconMessage size={18} className="text-primary" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-display)] text-[length:var(--font-size-base)] font-semibold text-base-content">
              {loc.name}
            </p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[length:var(--font-size-sm)] text-base-content/60">
              <span className="font-[family-name:var(--font-mono)]">{conversation.taskId}</span>
              <span className="inline-flex items-center gap-1">
                <IconRobot size={14} stroke={1.5} aria-hidden="true" />
                {conversation.agentBackend}
              </span>
              <span>
                {conversation.messages.length} {messageCountLabel}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 ps-12 sm:ps-0">
          {lastActivity ? (
            <time
              dateTime={lastActivity}
              className="whitespace-nowrap font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60"
            >
              {formatTimelineTimestamp(lastActivity, locale)}
            </time>
          ) : null}
          <ConversationStatusBadge status={conversation.status} />
        </div>
      </Link>
    </li>
  );
}

/* ── Screen ───────────────────────────────────────────────────────── */

export function ConversationsScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const { slug } = routeApi.useParams();
  const conversations = getConversationsForProject(slug);

  const messageCountLabel = t("conversation-message-count-label", {
    defaultValue: "messages",
  });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {t("page-conversations", { defaultValue: "Conversations" })}
      </h1>
      <p className="mt-1 text-base-content/70">
        {t("page-conversations-sub", {
          defaultValue: "Agent conversation threads for this project.",
        })}
      </p>

      {conversations.length > 0 ? (
        <ol
          className="mt-6 space-y-3"
          aria-label={t("conversation-list-region", {
            defaultValue: "Conversation list",
          })}
        >
          {conversations.map((c) => (
            <ConversationRow
              key={c.id}
              conversation={c}
              locale={locale}
              slug={slug}
              messageCountLabel={messageCountLabel}
            />
          ))}
        </ol>
      ) : (
        <p className="mt-8 text-center text-base-content/60">
          {t("conversation-list-empty", {
            defaultValue: "No conversations for this project.",
          })}
        </p>
      )}
    </div>
  );
}
