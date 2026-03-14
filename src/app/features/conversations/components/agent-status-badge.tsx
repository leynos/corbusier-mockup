/** @file Agent status badge showing backend name, model, and turn state. */

import { IconLoader, IconPlayerPause, IconTool } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { TurnState } from "../../../../data/conversations";

/* ── Turn-state visual mapping ─────────────────────────────────────── */

interface TurnStyle {
  readonly bg: string;
  readonly text: string;
  readonly icon: typeof IconPlayerPause;
}

const TURN_STYLE: Record<TurnState, TurnStyle> = {
  idle: { bg: "bg-base-300/40", text: "text-base-content/70", icon: IconPlayerPause },
  processing: { bg: "bg-warning/15", text: "text-warning", icon: IconLoader },
  awaiting_tool_result: { bg: "bg-info/15", text: "text-info", icon: IconTool },
};

const TURN_LABEL_KEYS: Record<TurnState, string> = {
  idle: "agent-turn-idle",
  processing: "agent-turn-processing",
  awaiting_tool_result: "agent-turn-awaiting-tool",
};

const TURN_LABEL_DEFAULTS: Record<TurnState, string> = {
  idle: "Idle",
  processing: "Processing",
  awaiting_tool_result: "Awaiting tool result",
};

/* ── Component ─────────────────────────────────────────────────────── */

interface AgentStatusBadgeProps {
  readonly backend: string;
  readonly model: string;
  readonly turnState: TurnState;
  readonly className?: string;
}

export function AgentStatusBadge({
  backend,
  model,
  turnState,
  className = "",
}: AgentStatusBadgeProps): JSX.Element {
  const { t } = useTranslation();
  const style = TURN_STYLE[turnState];
  const Icon = style.icon;
  const turnLabel = t(TURN_LABEL_KEYS[turnState], {
    defaultValue: TURN_LABEL_DEFAULTS[turnState],
  });

  return (
    <output
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-base-300 bg-base-100 px-4 py-3 shadow-sm ${className}`}
      aria-label={t("agent-status-label", { defaultValue: "Agent status" })}
    >
      <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[length:var(--font-size-sm)]">
        <div className="flex items-center gap-1">
          <dt className="font-semibold text-base-content/60">
            {t("agent-status-backend", { defaultValue: "Backend" })}
          </dt>
          <dd className="font-[family-name:var(--font-mono)] text-base-content">{backend}</dd>
        </div>
        <div className="flex items-center gap-1">
          <dt className="font-semibold text-base-content/60">
            {t("agent-status-model", { defaultValue: "Model" })}
          </dt>
          <dd className="font-[family-name:var(--font-mono)] text-base-content">{model}</dd>
        </div>
      </dl>

      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wide ${style.bg} ${style.text}`}
      >
        <Icon size={14} stroke={1.8} aria-hidden="true" />
        {turnLabel}
      </span>
    </output>
  );
}
