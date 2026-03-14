/** @file Single message bubble with role-aware styling.
 *
 * - User: left-aligned on base surface
 * - Assistant: left-aligned on elevated surface with teal left border
 * - Tool: rendered via ToolCallCard (not this component)
 * - System: grey informational banner, full-width
 */

import { IconRobot, IconUser } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { Message } from "../../../../data/conversations";
import { formatTimelineTimestamp } from "../../../utils/date-formatting";

/* ── Role labels ───────────────────────────────────────────────────── */

const ROLE_LABEL_KEYS: Record<string, string> = {
  user: "message-role-user",
  assistant: "message-role-assistant",
  system: "message-role-system",
};

const ROLE_LABEL_DEFAULTS: Record<string, string> = {
  user: "User",
  assistant: "Agent",
  system: "System",
};

/* ── Component ─────────────────────────────────────────────────────── */

interface MessageBubbleProps {
  readonly message: Message;
  readonly locale: string;
}

export function MessageBubble({ message, locale }: MessageBubbleProps): JSX.Element {
  const { t } = useTranslation();
  const roleLabel = t(ROLE_LABEL_KEYS[message.role] ?? "", {
    defaultValue: ROLE_LABEL_DEFAULTS[message.role] ?? message.role,
  });

  if (message.role === "system") {
    return (
      <li className="rounded-lg bg-base-300/40 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[length:var(--font-size-sm)] text-base-content/70">
            {message.content}
          </p>
          <time
            dateTime={message.timestamp}
            className="shrink-0 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60"
          >
            {formatTimelineTimestamp(message.timestamp, locale)}
          </time>
        </div>
      </li>
    );
  }

  const isAssistant = message.role === "assistant";

  return (
    <li className="flex gap-3">
      {/* Avatar */}
      <span
        className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isAssistant ? "bg-primary/10" : "bg-base-300"
        }`}
        aria-hidden="true"
      >
        {isAssistant ? (
          <IconRobot size={16} className="text-primary" />
        ) : (
          <IconUser size={16} className="text-base-content/70" />
        )}
      </span>

      {/* Bubble */}
      <div
        className={`min-w-0 flex-1 rounded-lg border px-4 py-3 ${
          isAssistant
            ? "border-primary/30 border-s-2 border-s-primary bg-base-100"
            : "border-base-300 bg-base-200/60"
        }`}
      >
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold text-base-content">
            {roleLabel}
          </span>
          <time
            dateTime={message.timestamp}
            className="shrink-0 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60"
          >
            {formatTimelineTimestamp(message.timestamp, locale)}
          </time>
        </div>
        <p className="whitespace-pre-line text-[length:var(--font-size-sm)] text-base-content">
          {message.content}
        </p>
        {isAssistant && message.agentBackend ? (
          <p className="mt-2 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/50">
            {message.agentBackend}
          </p>
        ) : null}
      </div>
    </li>
  );
}
