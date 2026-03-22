/** @file Shared presentational badge for short system status labels. */

import type { JSX } from "react";

export type StatusBadgeTone = "success" | "neutral" | "error" | "info";
export type StatusBadgeSize = "compact" | "regular";

const STATUS_BADGE_TONE_CLASS: Record<StatusBadgeTone, string> = {
  success: "bg-success/15 text-success",
  neutral: "bg-base-300/40 text-base-content/50",
  error: "bg-error/15 text-error",
  info: "bg-info/15 text-info",
};

const STATUS_BADGE_SIZE_CLASS: Record<StatusBadgeSize, string> = {
  compact: "px-2.5 py-0.5",
  regular: "px-3 py-1",
};

export function StatusBadge({
  label,
  tone,
  size = "compact",
}: {
  readonly label: string;
  readonly tone: StatusBadgeTone;
  readonly size?: StatusBadgeSize;
}): JSX.Element {
  return (
    <span
      className={`inline-flex items-center rounded-full font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wide ${STATUS_BADGE_SIZE_CLASS[size]} ${STATUS_BADGE_TONE_CLASS[tone]}`}
    >
      {label}
    </span>
  );
}
