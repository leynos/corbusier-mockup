/** @file Simple progress bar with configurable fill colour. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

interface ProgressBarProps {
  /** Percentage complete (0–100). */
  readonly value: number;
  /** Tailwind background class for the fill. Defaults to "bg-primary". */
  readonly fillClassName?: string;
  /** Additional classes on the outer track. */
  readonly className?: string;
  /** Accessible label for screen readers. When omitted, a translated default is used. */
  readonly label?: string;
}

export function ProgressBar({
  value,
  fillClassName = "bg-primary",
  className = "",
  label,
}: ProgressBarProps): JSX.Element {
  const { t } = useTranslation();
  const clamped = Math.max(0, Math.min(100, value));
  const resolvedLabel = label ?? t("progress-label", { defaultValue: "Progress" });
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-base-300/40 ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={resolvedLabel}
    >
      <div
        className={`h-full rounded-full transition-all ${fillClassName}`}
        style={{ width: `${String(clamped)}%` }}
      />
    </div>
  );
}
