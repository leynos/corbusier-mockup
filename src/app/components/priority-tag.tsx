/** @file Priority tag component for task priority levels. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { priorityDescriptors } from "../../data/registries";
import { Priority } from "../../data/tasks";
import { pickLocalization } from "../domain/entities/localization";

const STYLE_MAP: Record<Priority, { readonly bg: string; readonly text: string }> = {
  [Priority.Critical]: { bg: "bg-error/15", text: "text-error" },
  [Priority.High]: { bg: "bg-warning/15", text: "text-warning" },
  [Priority.Medium]: { bg: "bg-info/15", text: "text-info" },
  [Priority.Low]: { bg: "bg-base-300/40", text: "text-base-content/70" },
};

interface PriorityTagProps {
  readonly priority: Priority;
  readonly className?: string;
}

export function PriorityTag({ priority, className = "" }: PriorityTagProps): JSX.Element {
  const { i18n } = useTranslation();
  const style = STYLE_MAP[priority];
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-bold uppercase tracking-wider ${style.bg} ${style.text} ${className}`}
    >
      {pickLocalization(priorityDescriptors[priority]?.localizations, i18n.language).name}
    </span>
  );
}
