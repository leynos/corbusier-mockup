/** @file Dashboard screen — the operations room overview.
 *
 * Four panels in visual hierarchy order (design language §5):
 * 1. System health status (loudest)
 * 2. KPI cards
 * 3. Recent activity feed
 * 4. Agent utilization summary
 */

import { IconActivity } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { KPI_METRICS, type KpiValueFormat } from "../../../data/dashboard";
import { ActivityTimeline } from "../../components/activity-timeline";
import { KpiCard } from "../../components/kpi-card";
import { pickLocalization } from "../../domain/entities/localization";
import { getRecentActivityEntries } from "./activity-adapter";
import { AgentUtilizationPanel } from "./components/agent-utilization-panel";
import { SystemHealthPanel } from "./components/system-health-panel";

function formatKpiValue(value: number, valueFormat: KpiValueFormat, locale: string): string {
  switch (valueFormat) {
    case "integer":
      return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
    case "percentage":
      return new Intl.NumberFormat(locale, {
        style: "percent",
        maximumFractionDigits: Number.isInteger(value) ? 0 : 1,
      }).format(value / 100);
    case "milliseconds":
      return new Intl.NumberFormat(locale, {
        style: "unit",
        unit: "millisecond",
        unitDisplay: "narrow",
        maximumFractionDigits: 0,
      }).format(value);
  }
}

/**
 * Render the dashboard route in the intended visual hierarchy order.
 *
 * KPI value formatting and activity shaping are handled by upstream
 * helpers so this component remains responsible for composition.
 */
export function DashboardScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {t("page-dashboard", { defaultValue: "Dashboard" })}
      </h1>

      {/* 1. System health — loudest */}
      <SystemHealthPanel />

      {/* 2. KPI cards */}
      <section
        aria-label={t("dashboard-kpi-region", { defaultValue: "Key metrics" })}
        data-testid="dashboard-kpi-region"
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {KPI_METRICS.map((m) => (
          <KpiCard
            key={m.id}
            label={pickLocalization(m.localizations, locale).name}
            value={formatKpiValue(m.value, m.valueFormat, locale)}
            trend={m.trend}
            trendLabel={pickLocalization(m.trendLocalizations, locale).name}
            {...(() => {
              const context = pickLocalization(m.localizations, locale).description;
              return context ? { context } : {};
            })()}
          />
        ))}
      </section>

      {/* 3 + 4. Activity feed + Agent utilization */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity feed — 2/3 width */}
        <section
          aria-label={t("dashboard-activity-region", { defaultValue: "Recent activity" })}
          data-testid="dashboard-activity-region"
          className="card bg-base-100 border border-base-300 shadow-sm lg:col-span-2"
        >
          <div className="card-body p-5">
            <h2 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
              <IconActivity size={16} stroke={1.5} aria-hidden="true" />
              {t("dashboard-activity-heading", { defaultValue: "Recent Activity" })}
            </h2>
            <ActivityTimeline entries={getRecentActivityEntries()} />
          </div>
        </section>

        {/* Agent utilization — 1/3 width */}
        <AgentUtilizationPanel />
      </div>
    </div>
  );
}
