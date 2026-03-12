/** @file Priority tag component for task priority levels. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { Priority } from "../../data/tasks";

const STYLE_MAP: Record<Priority, { readonly bg: string; readonly text: string }> = {
  [Priority.Critical]: { bg: "bg-error/15", text: "text-error" },
  [Priority.High]: { bg: "bg-warning/15", text: "text-warning" },
  [Priority.Medium]: { bg: "bg-info/15", text: "text-info" },
  [Priority.Low]: { bg: "bg-base-300/40", text: "text-base-content/70" },
};

const LABEL_DEFAULTS: Record<Priority, string> = {
  [Priority.Critical]: "Critical",
  [Priority.High]: "High",
  [Priority.Medium]: "Medium",
  [Priority.Low]: "Low",
};

interface PriorityTagProps {
  readonly priority: Priority;
  readonly className?: string;
}

export function PriorityTag({ priority, className = "" }: PriorityTagProps): JSX.Element {
  const { t } = useTranslation();
  const style = STYLE_MAP[priority];
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-bold uppercase tracking-wider ${style.bg} ${style.text} ${className}`}
    >
      {t(`task-priority-${priority}`, { defaultValue: LABEL_DEFAULTS[priority] })}
    </span>
  );
}
