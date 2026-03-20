/** @file Summary statistics bar for the AI Suggestions page.
 *
 * Displays four metric tiles: items analysed, tasks suggested,
 * average confidence, and last-updated timestamp.
 */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

interface SummaryBarProps {
  readonly analysedCount: number;
  readonly suggestedCount: number;
  readonly averageConfidence: number;
  readonly lastUpdated: string;
}

export function SummaryBar({
  analysedCount,
  suggestedCount,
  averageConfidence,
  lastUpdated,
}: SummaryBarProps): JSX.Element {
  const { t } = useTranslation();

  const tiles = [
    {
      id: "analysed",
      label: t("suggestion-metric-analysed", {
        defaultValue: "Items Analysed",
      }),
      value: String(analysedCount),
    },
    {
      id: "suggested",
      label: t("suggestion-metric-suggested", {
        defaultValue: "Tasks Suggested",
      }),
      value: String(suggestedCount),
    },
    {
      id: "confidence",
      label: t("suggestion-metric-confidence", {
        defaultValue: "Avg. Confidence",
      }),
      value: `${String(Math.round(averageConfidence))}%`,
    },
    {
      id: "updated",
      label: t("suggestion-metric-updated", {
        defaultValue: "Last Updated",
      }),
      value: lastUpdated,
    },
  ];

  return (
    <section
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      aria-label={t("suggestion-summary-region", {
        defaultValue: "Suggestion summary",
      })}
    >
      {tiles.map((tile) => (
        <div key={tile.id} className="rounded-lg bg-base-100 p-3">
          <p className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-base-content/60">
            {tile.label}
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--font-size-xl)] font-bold text-base-content">
            {tile.value}
          </p>
        </div>
      ))}
    </section>
  );
}
