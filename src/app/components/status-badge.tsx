/** @file Status badge for task states — icon + text + colour (WCAG 1.4.1). */

import {
  IconCircleCheck,
  IconCircleDashed,
  IconCircleX,
  IconLoader,
  IconPlayerPause,
  IconSearch,
} from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { TaskState } from "../../data/tasks";

/* ── Visual mapping ────────────────────────────────────────────────── */

interface BadgeStyle {
  readonly bg: string;
  readonly text: string;
  readonly icon: typeof IconCircleDashed;
}

const STYLE_MAP: Record<TaskState, BadgeStyle> = {
  [TaskState.Draft]: {
    bg: "bg-base-300/40",
    text: "text-base-content/70",
    icon: IconCircleDashed,
  },
  [TaskState.InProgress]: {
    bg: "bg-warning/15",
    text: "text-warning",
    icon: IconLoader,
  },
  [TaskState.InReview]: {
    bg: "bg-info/15",
    text: "text-info",
    icon: IconSearch,
  },
  [TaskState.Paused]: {
    bg: "bg-accent/15",
    text: "text-accent",
    icon: IconPlayerPause,
  },
  [TaskState.Done]: {
    bg: "bg-success/15",
    text: "text-success",
    icon: IconCircleCheck,
  },
  [TaskState.Abandoned]: {
    bg: "bg-base-300/40",
    text: "text-base-content/50",
    icon: IconCircleX,
  },
};

const LABEL_DEFAULTS: Record<TaskState, string> = {
  [TaskState.Draft]: "Draft",
  [TaskState.InProgress]: "In Progress",
  [TaskState.InReview]: "In Review",
  [TaskState.Paused]: "Paused",
  [TaskState.Done]: "Done",
  [TaskState.Abandoned]: "Abandoned",
};

/* ── Component ─────────────────────────────────────────────────────── */

interface StatusBadgeProps {
  readonly state: TaskState;
  readonly className?: string;
}

export function StatusBadge({ state, className = "" }: StatusBadgeProps): JSX.Element {
  const { t } = useTranslation();
  const style = STYLE_MAP[state];
  const Icon = style.icon;
  const key = `task-state-${state.replace(/_/g, "-")}`;
  const label = t(key, { defaultValue: LABEL_DEFAULTS[state] });

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wide ${style.bg} ${style.text} ${className}`}
    >
      <Icon size={14} stroke={1.8} aria-hidden="true" />
      {label}
    </span>
  );
}
