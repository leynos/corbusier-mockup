/** @file Status badge for conversation active/idle state. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { ConversationStatus } from "../../../../data/conversations";

interface ConversationStatusBadgeProps {
  readonly status: ConversationStatus;
  readonly className?: string;
}

const STYLE_MAP: Record<
  ConversationStatus,
  { readonly bg: string; readonly text: string; readonly dotBg: string }
> = {
  active: { bg: "bg-success/15", text: "text-success", dotBg: "bg-success" },
  idle: { bg: "bg-base-300/40", text: "text-base-content/70", dotBg: "bg-base-content/40" },
};

const LABEL_KEYS: Record<ConversationStatus, string> = {
  active: "conversation-status-active",
  idle: "conversation-status-idle",
};

const LABEL_DEFAULTS: Record<ConversationStatus, string> = {
  active: "Active",
  idle: "Idle",
};

export function ConversationStatusBadge({
  status,
  className = "",
}: ConversationStatusBadgeProps): JSX.Element {
  const { t } = useTranslation();
  const style = STYLE_MAP[status];
  const label = t(LABEL_KEYS[status], { defaultValue: LABEL_DEFAULTS[status] });

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wide ${style.bg} ${style.text} ${className}`}
    >
      <span className={`h-2 w-2 rounded-full ${style.dotBg}`} aria-hidden="true" />
      {label}
    </span>
  );
}
