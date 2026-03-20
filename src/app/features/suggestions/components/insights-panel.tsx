/** @file AI Insights bullet panel.
 *
 * Renders insight observations in a rounded-corner panel (not
 * chamfered — it is an informational fixture, not a moveable card).
 * Bullet markers use severity-based colours: teal for info, amber
 * for warning, terracotta for critical.
 */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { AiInsight, InsightSeverity } from "../../../../data/suggestions";
import { pickLocalization } from "../../../domain/entities/localization";

interface InsightsPanelProps {
  readonly insights: readonly AiInsight[];
  readonly locale: string;
}

function severityBulletClass(severity: InsightSeverity): string {
  switch (severity) {
    case "critical":
      return "bg-error";
    case "warning":
      return "bg-warning";
    case "info":
      return "bg-primary";
  }
}

function severityLabel(
  severity: InsightSeverity,
  t: (key: string, opts: { defaultValue: string }) => string,
): string {
  switch (severity) {
    case "critical":
      return t("insight-severity-critical", { defaultValue: "Critical" });
    case "warning":
      return t("insight-severity-warning", { defaultValue: "Warning" });
    case "info":
      return t("insight-severity-info", { defaultValue: "Info" });
  }
}

export function InsightsPanel({ insights, locale }: InsightsPanelProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <section
      className="rounded-lg bg-base-100 p-4"
      aria-label={t("suggestion-insights-region", {
        defaultValue: "AI Insights",
      })}
    >
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-lg)] font-bold text-base-content">
        {t("suggestion-insights-heading", {
          defaultValue: "AI Insights",
        })}
      </h2>

      <ul className="mt-3 space-y-3">
        {insights.map((insight) => {
          const loc = pickLocalization(insight.localizations, locale);
          return (
            <li key={insight.id} className="flex gap-3">
              <span
                className={`mt-1.5 size-2 shrink-0 rounded-full ${severityBulletClass(insight.severity)}`}
                aria-hidden="true"
              />
              <div>
                <p className="text-[length:var(--font-size-sm)] font-semibold text-base-content">
                  {loc.name}
                  <span className="ms-2 text-[length:var(--font-size-xs)] font-normal text-base-content/60">
                    {severityLabel(insight.severity, t)}
                  </span>
                </p>
                {loc.description ? (
                  <p className="mt-0.5 text-[length:var(--font-size-xs)] text-base-content/70">
                    {loc.description}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
