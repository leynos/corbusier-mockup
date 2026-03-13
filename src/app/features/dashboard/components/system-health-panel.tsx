/** @file Shared dashboard panel showing the aggregate system health signal.
 *
 * This is the loudest dashboard surface. It maps the `SYSTEM_HEALTH`
 * fixture onto an icon, colour, translated status label, and localized
 * last-checked time.
 */

import { IconAlertTriangle, IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { type HealthStatus, SYSTEM_HEALTH } from "../../../../data/dashboard";
import { healthStatusDescriptors } from "../../../../data/registries";
import { pickLocalization } from "../../../domain/entities/localization";
import { formatShortTime } from "../../../utils/date-formatting";

/** Icon mapping that must stay exhaustive with `HealthStatus`. */
const HEALTH_ICON: Record<HealthStatus, typeof IconCircleCheck> = {
  healthy: IconCircleCheck,
  degraded: IconAlertTriangle,
  critical: IconCircleX,
};

/** Text-colour mapping mirroring the severity scale used by the status icon. */
const HEALTH_COLOUR: Record<HealthStatus, string> = {
  healthy: "text-success",
  degraded: "text-warning",
  critical: "text-error",
};

/**
 * Render the primary system-health summary card.
 *
 * The panel expects `SYSTEM_HEALTH.overall` and
 * `healthStatusDescriptors` to stay aligned so every status renders
 * with both a label and a visual treatment.
 */
export function SystemHealthPanel(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const Icon = HEALTH_ICON[SYSTEM_HEALTH.overall];
  const colour = HEALTH_COLOUR[SYSTEM_HEALTH.overall];
  const label = pickLocalization(
    healthStatusDescriptors[SYSTEM_HEALTH.overall].localizations,
    locale,
  ).name;

  return (
    <section
      aria-label={t("dashboard-health-region", { defaultValue: "System health" })}
      data-testid="dashboard-health-region"
      className="card border border-base-300 bg-base-100 shadow-sm"
    >
      <div className="card-body flex-row items-center gap-4 p-5">
        <Icon size={32} stroke={1.5} className={colour} aria-hidden="true" />
        <div>
          <p className="font-[family-name:var(--font-display)] text-[length:var(--font-size-lg)] font-bold text-base-content">
            {t("dashboard-health-status", {
              label,
              defaultValue: `System Status: ${label}`,
            })}
          </p>
          <p className="text-[length:var(--font-size-xs)] text-base-content/60">
            {t("dashboard-health-last-checked", { defaultValue: "Last checked:" })}{" "}
            <time dateTime={SYSTEM_HEALTH.lastChecked}>
              {formatShortTime(SYSTEM_HEALTH.lastChecked, locale)}
            </time>
          </p>
        </div>
      </div>
    </section>
  );
}
