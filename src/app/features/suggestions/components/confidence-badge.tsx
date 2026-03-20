/** @file Circular confidence percentage badge.
 *
 * Renders a small SVG circle with the confidence percentage inside.
 * The ring colour reflects the threshold: green for >= 90%, amber
 * for 80-89%, and grey for < 80%.
 */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

interface ConfidenceBadgeProps {
  /** Confidence value 0-100. */
  readonly value: number;
}

const RADIUS = 18;
const STROKE_WIDTH = 3;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const VIEW_SIZE = (RADIUS + STROKE_WIDTH) * 2;
const CENTRE = VIEW_SIZE / 2;

function ringColourClass(value: number): string {
  if (value >= 90) return "stroke-success";
  if (value >= 80) return "stroke-warning";
  return "stroke-base-content/40";
}

function textColourClass(value: number): string {
  if (value >= 90) return "fill-success";
  if (value >= 80) return "fill-warning";
  return "fill-base-content/60";
}

export function ConfidenceBadge({ value }: ConfidenceBadgeProps): JSX.Element {
  const { t } = useTranslation();
  const clamped = Math.max(0, Math.min(100, value));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

  return (
    <svg
      width={VIEW_SIZE}
      height={VIEW_SIZE}
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      role="img"
      aria-label={t("suggestion-confidence-label", {
        defaultValue: `${String(clamped)}% confidence`,
        value: String(clamped),
      })}
      className="shrink-0"
    >
      {/* Background track */}
      <circle
        cx={CENTRE}
        cy={CENTRE}
        r={RADIUS}
        fill="none"
        className="stroke-base-300"
        strokeWidth={STROKE_WIDTH}
      />
      {/* Filled arc */}
      <circle
        cx={CENTRE}
        cy={CENTRE}
        r={RADIUS}
        fill="none"
        className={ringColourClass(clamped)}
        strokeWidth={STROKE_WIDTH}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${CENTRE} ${CENTRE})`}
      />
      {/* Percentage text */}
      <text
        x={CENTRE}
        y={CENTRE}
        textAnchor="middle"
        dominantBaseline="central"
        className={`font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-bold ${textColourClass(clamped)}`}
      >
        {clamped}%
      </text>
    </svg>
  );
}
