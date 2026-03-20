/** @file Monitoring screen — Grafana-style metric panels, alerts, health checks.
 *
 * Metric panels use static SVG to suggest chart areas. No actual
 * charting library is used — coloured rectangles with labelled axes
 * and plotted points evoke the Grafana aesthetic.
 */

import { IconAlertTriangle, IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { HealthStatus } from "../../../data/dashboard";
import {
  type AlertSeverity,
  HEALTH_CHECKS,
  MONITORING_ALERTS,
  MONITORING_METRICS,
  type MonitoringMetric,
} from "../../../data/monitoring";
import { healthStatusDescriptors } from "../../../data/registries";
import { pickLocalization } from "../../domain/entities/localization";
import { formatTimelineTimestamp } from "../../utils/date-formatting";
import { HealthBadge } from "./components/health-badge";
import { RegistryList } from "./components/registry-list";

/* ── Skeletal chart panel ─────────────────────────────────────────── */

/** Colour for the chart line/fill by metric health. */
function chartColour(metric: MonitoringMetric): string {
  if (metric.threshold === undefined) return "#1A6E6E"; /* primary teal */
  const lastPoint = metric.series[metric.series.length - 1];
  if (!lastPoint) return "#1A6E6E";
  if (lastPoint.value > metric.threshold) return "#A04535"; /* error */
  if (lastPoint.value > metric.threshold * 0.8) return "#B08878"; /* warning */
  return "#5A6B48"; /* success / olive */
}

function MetricPanel({
  metric,
  locale,
}: {
  readonly metric: MonitoringMetric;
  readonly locale: string;
}): JSX.Element {
  const loc = pickLocalization(metric.localizations, locale);
  const colour = chartColour(metric);
  const maxVal = Math.max(...metric.series.map((p) => p.value), metric.threshold ?? 1, 1);
  const lastPoint = metric.series[metric.series.length - 1];
  const currentValue = lastPoint?.value ?? 0;

  /* Compute SVG polyline points for the sparkline. */
  const svgW = 240;
  const svgH = 80;
  const padding = 4;
  const points = metric.series
    .map((p, i) => {
      const x = padding + (i / Math.max(metric.series.length - 1, 1)) * (svgW - 2 * padding);
      const y = svgH - padding - (p.value / maxVal) * (svgH - 2 * padding);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-lg border border-base-300 bg-base-100 p-4">
      <p className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
        {loc.name}
      </p>
      <p className="mt-1 tabular-nums text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {currentValue}
        <span className="ml-1 text-[length:var(--font-size-sm)] font-normal text-base-content/60">
          {metric.unit}
        </span>
      </p>
      {loc.description ? (
        <p className="mt-0.5 text-[length:var(--font-size-xs)] text-base-content/60">
          {loc.description}
        </p>
      ) : null}
      {/* Skeletal SVG chart */}
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="mt-3 h-20 w-full" aria-hidden="true">
        {/* Background fill */}
        <rect x="0" y="0" width={svgW} height={svgH} rx="4" className="fill-base-200/50" />
        {/* Threshold line */}
        {metric.threshold !== undefined ? (
          <line
            x1={padding}
            y1={svgH - padding - (metric.threshold / maxVal) * (svgH - 2 * padding)}
            x2={svgW - padding}
            y2={svgH - padding - (metric.threshold / maxVal) * (svgH - 2 * padding)}
            stroke="#A04535"
            strokeWidth="1"
            strokeDasharray="4 2"
            opacity="0.5"
          />
        ) : null}
        {/* Data line */}
        <polyline
          points={points}
          fill="none"
          stroke={colour}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Data points */}
        {metric.series.map((p, i) => {
          const x = padding + (i / Math.max(metric.series.length - 1, 1)) * (svgW - 2 * padding);
          const y = svgH - padding - (p.value / maxVal) * (svgH - 2 * padding);
          return <circle key={p.timestamp} cx={x} cy={y} r="3" fill={colour} />;
        })}
      </svg>
    </div>
  );
}

/* ── Alert severity icon ──────────────────────────────────────────── */

function getAlertStyle(severity: AlertSeverity): {
  readonly icon: typeof IconAlertTriangle;
  readonly colour: string;
} {
  if (severity === "critical") return { icon: IconCircleX, colour: "text-error" };
  return { icon: IconAlertTriangle, colour: "text-warning" };
}

/* ── Health check card colours ────────────────────────────────────── */

const HC_ICON: Record<HealthStatus, typeof IconCircleCheck> = {
  healthy: IconCircleCheck,
  degraded: IconAlertTriangle,
  critical: IconCircleX,
};

const HC_COLOUR: Record<HealthStatus, string> = {
  healthy: "text-success",
  degraded: "text-warning",
  critical: "text-error",
};

function AlertsSection({
  locale,
  regionLabel,
  headingLabel,
  tableLabel,
  severityLabel,
  descriptionLabel,
  firedLabel,
  acknowledgedLabel,
  acknowledgedYesLabel,
  acknowledgedNoLabel,
  emptyLabel,
}: {
  readonly locale: string;
  readonly regionLabel: string;
  readonly headingLabel: string;
  readonly tableLabel: string;
  readonly severityLabel: string;
  readonly descriptionLabel: string;
  readonly firedLabel: string;
  readonly acknowledgedLabel: string;
  readonly acknowledgedYesLabel: string;
  readonly acknowledgedNoLabel: string;
  readonly emptyLabel: string;
}): JSX.Element {
  return (
    <section
      className="mt-6 card border border-base-300 bg-base-100 shadow-sm"
      aria-label={regionLabel}
    >
      <div className="card-body p-5">
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
          {headingLabel}
        </h2>
        {MONITORING_ALERTS.length > 0 ? (
          <div>
            <table className="table table-zebra w-full" aria-label={tableLabel}>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                  >
                    {severityLabel}
                  </th>
                  <th
                    scope="col"
                    className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                  >
                    {descriptionLabel}
                  </th>
                  <th
                    scope="col"
                    className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                  >
                    {firedLabel}
                  </th>
                  <th
                    scope="col"
                    className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                  >
                    {acknowledgedLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                {MONITORING_ALERTS.map((alert) => {
                  const alertLoc = pickLocalization(alert.localizations, locale);
                  const style = getAlertStyle(alert.severity);
                  const Icon = style.icon;
                  return (
                    <tr key={alert.id} className="min-h-9 hover:bg-base-200/40">
                      <td>
                        <span className={`inline-flex items-center gap-1 ${style.colour}`}>
                          <Icon size={16} stroke={1.5} aria-hidden="true" />
                          <span className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase">
                            {alert.severity}
                          </span>
                        </span>
                      </td>
                      <td>
                        <p className="text-[length:var(--font-size-sm)] font-semibold text-base-content">
                          {alertLoc.name}
                        </p>
                        {alertLoc.description ? (
                          <p className="text-[length:var(--font-size-xs)] text-base-content/60">
                            {alertLoc.description}
                          </p>
                        ) : null}
                      </td>
                      <td className="whitespace-nowrap font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60">
                        <time dateTime={alert.firedAt}>
                          {formatTimelineTimestamp(alert.firedAt, locale)}
                        </time>
                      </td>
                      <td className="text-[length:var(--font-size-sm)]">
                        {alert.acknowledged ? acknowledgedYesLabel : acknowledgedNoLabel}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-base-content/60">{emptyLabel}</p>
        )}
      </div>
    </section>
  );
}

function HealthChecksSection({
  locale,
  regionLabel,
  headingLabel,
  getHealthLabel,
  formatDuration,
}: {
  readonly locale: string;
  readonly regionLabel: string;
  readonly headingLabel: string;
  readonly getHealthLabel: (status: HealthStatus) => string;
  readonly formatDuration: (value: number) => string;
}): JSX.Element {
  return (
    <section className="mt-6" aria-label={regionLabel}>
      <h2 className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
        {headingLabel}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {HEALTH_CHECKS.map((hc) => {
          const hcLoc = pickLocalization(hc.localizations, locale);
          const HcIcon = HC_ICON[hc.status];
          return (
            <div key={hc.path} className="rounded-lg border border-base-300 bg-base-100 p-4">
              <div className="flex items-center gap-2">
                <HcIcon size={18} className={HC_COLOUR[hc.status]} aria-hidden="true" />
                <p className="font-semibold text-[length:var(--font-size-sm)] text-base-content">
                  {hcLoc.name}
                </p>
              </div>
              <p className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60">
                {hc.path}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <HealthBadge status={hc.status} label={getHealthLabel(hc.status)} />
                <span className="tabular-nums font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60">
                  {formatDuration(hc.responseTimeMs)}
                </span>
              </div>
              {hcLoc.description ? (
                <p className="mt-1 text-[length:var(--font-size-xs)] text-base-content/60">
                  {hcLoc.description}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function MonitoringScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const getHealthLabel = (status: HealthStatus): string =>
    pickLocalization(healthStatusDescriptors[status].localizations, locale).name;

  return (
    <RegistryList
      heading={t("page-monitoring", { defaultValue: "Monitoring" })}
      subtitle={t("page-monitoring-sub", {
        defaultValue: "System health, logs, and performance metrics.",
      })}
    >
      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        aria-label={t("monitoring-metrics-region", { defaultValue: "Metric panels" })}
      >
        {MONITORING_METRICS.map((m) => (
          <MetricPanel key={m.id} metric={m} locale={locale} />
        ))}
      </section>
      <AlertsSection
        locale={locale}
        regionLabel={t("monitoring-alerts-region", { defaultValue: "Active alerts" })}
        headingLabel={t("monitoring-alerts-heading", { defaultValue: "Active Alerts" })}
        tableLabel={t("monitoring-alerts-table", { defaultValue: "Alert list" })}
        severityLabel={t("alert-col-severity", { defaultValue: "Severity" })}
        descriptionLabel={t("alert-col-description", { defaultValue: "Alert" })}
        firedLabel={t("alert-col-fired", { defaultValue: "Fired" })}
        acknowledgedLabel={t("alert-col-ack", { defaultValue: "Acknowledged" })}
        acknowledgedYesLabel={t("alert-ack-yes", { defaultValue: "Yes" })}
        acknowledgedNoLabel={t("alert-ack-no", { defaultValue: "No" })}
        emptyLabel={t("monitoring-no-alerts", { defaultValue: "No active alerts." })}
      />
      <HealthChecksSection
        locale={locale}
        regionLabel={t("monitoring-health-region", { defaultValue: "Health checks" })}
        headingLabel={t("monitoring-health-heading", {
          defaultValue: "Health Check Endpoints",
        })}
        getHealthLabel={getHealthLabel}
        formatDuration={(value) => t("unit-ms", { defaultValue: "{{value}}ms", value })}
      />
    </RegistryList>
  );
}
