/** @file Render the system reports registry view and its three panels.
 *
 * Purpose: host the Audit Trail, Performance, and Compliance tabs inside the
 * shared registry-page shell.
 *
 * Invariants: exactly one report tab is active at a time, whilst all three
 * tabpanel containers remain mounted for stable ARIA wiring.
 *
 * Related modules:
 * - `src/app/features/system/components/registry-list.tsx` for the shared
 *   registry page wrapper.
 * - `src/app/utils/date-formatting.ts` for timeline timestamp formatting.
 */

import { IconCheck, IconX } from "@tabler/icons-react";
import type { TFunction } from "i18next";
import { type JSX, type KeyboardEvent, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { formatTimelineTimestamp, resolveFormattingLocale } from "../../utils/date-formatting";
import { RegistryList } from "./components/registry-list";
import {
  AUDIT_ACTION_DEFAULT_LABELS,
  AUDIT_EVENTS,
  COMPLIANCE_CHECKS,
  COMPLIANCE_DEFAULT_DETAILS,
  COMPLIANCE_DEFAULT_LABELS,
  type ComplianceCheck,
  type DisplayAuditEvent,
  PERF_DEFAULT_LABELS,
  PERF_METRICS,
  type PerformanceMetric,
} from "./reports-fixtures";

/* ── Tab types ────────────────────────────────────────────────────── */

const TAB_IDS = ["audit", "performance", "compliance"] as const;

type ReportTab = (typeof TAB_IDS)[number];

interface LocalizedPerformanceMetric extends PerformanceMetric {
  readonly label: string;
  readonly valueLabel: string;
  readonly unitLabel: string;
}

interface LocalizedComplianceCheck extends ComplianceCheck {
  readonly label: string;
  readonly detail: string;
  readonly statusLabel: string;
}

interface TabNavContext {
  readonly index: number;
  readonly tab: ReportTab;
  readonly tabs: readonly ReportTab[];
  readonly setActiveTab: (t: ReportTab) => void;
  readonly focusAt: (i: number) => void;
}

interface LocalizedReportTab {
  readonly id: ReportTab;
  readonly label: string;
}

interface AuditReportModel {
  readonly rows: readonly DisplayAuditEvent[];
  readonly tableLabel: string;
  readonly timeLabel: string;
  readonly actorLabel: string;
  readonly actionLabel: string;
  readonly targetLabel: string;
}

interface PerformanceReportModel {
  readonly regionLabel: string;
  readonly metrics: readonly LocalizedPerformanceMetric[];
}

interface ComplianceReportModel {
  readonly checks: readonly LocalizedComplianceCheck[];
  readonly summaryLabel: string;
  readonly listLabel: string;
}

interface ReportsViewModel {
  readonly tabListLabel: string;
  readonly tabs: readonly LocalizedReportTab[];
  readonly audit: AuditReportModel;
  readonly performance: PerformanceReportModel;
  readonly compliance: ComplianceReportModel;
}

interface TabButtonRefs {
  current: Record<ReportTab, HTMLButtonElement | null>;
}

/* ── Sub-panels ───────────────────────────────────────────────────── */

/**
 * Render the localised audit-table view for report activity rows.
 *
 * Localisation contract: callers must pass display-ready labels and action text.
 *
 * @internal
 */
function AuditTrailPanel({ audit }: { readonly audit: AuditReportModel }): JSX.Element {
  const { rows, tableLabel, timeLabel, actorLabel, actionLabel, targetLabel } = audit;
  const columnHeaders = [
    { id: "time", label: timeLabel },
    { id: "actor", label: actorLabel },
    { id: "action", label: actionLabel },
    { id: "target", label: targetLabel },
  ] as const;

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full" aria-label={tableLabel}>
        <thead>
          <tr>
            {columnHeaders.map((header) => (
              <th
                key={header.id}
                scope="col"
                className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id} className="min-h-9 hover:bg-base-200/40">
              <td className="whitespace-nowrap font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60">
                <time dateTime={e.timestamp}>{e.timestampLabel}</time>
              </td>
              <td className="text-[length:var(--font-size-sm)]">{e.actor}</td>
              <td className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)]">
                {e.action}
              </td>
              <td className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)]">
                {e.target}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Render the performance metric cards with localised labels and values.
 *
 * Localisation contract: callers must provide display-ready strings for every metric.
 *
 * @internal
 */
function PerformancePanel({
  regionLabel,
  metrics,
}: {
  readonly regionLabel: string;
  readonly metrics: readonly LocalizedPerformanceMetric[];
}): JSX.Element {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label={regionLabel}>
      {metrics.map((m) => {
        const pct = m.maxValue <= 0 ? 0 : Math.max(0, Math.min((m.value / m.maxValue) * 100, 100));
        return (
          <div key={m.id} className="rounded-lg border border-base-300 bg-base-100 p-4">
            <p className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {m.label}
            </p>
            <p className="mt-1 tabular-nums text-[length:var(--font-size-2xl)] font-bold text-base-content">
              {m.valueLabel}
              <span className="ml-1 text-[length:var(--font-size-sm)] font-normal text-base-content/60">
                {m.unitLabel}
              </span>
            </p>
            {/* Skeletal bar chart */}
            <div className="mt-2 h-3 w-full rounded-full bg-base-300/40">
              <div className={`h-3 rounded-full ${m.colour}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </section>
  );
}

/**
 * Render the compliance checklist and summary using localised display strings.
 *
 * Localisation contract: callers must provide translated summary, labels, and details.
 *
 * @internal
 */
function CompliancePanel({
  checks,
  summaryLabel,
  listLabel,
}: {
  readonly checks: readonly LocalizedComplianceCheck[];
  readonly summaryLabel: string;
  readonly listLabel: string;
}): JSX.Element {
  return (
    <div>
      <p className="mb-4 tabular-nums text-[length:var(--font-size-sm)] text-base-content/70">
        {summaryLabel}
      </p>
      <ul className="space-y-2" aria-label={listLabel}>
        {checks.map((c) => (
          <li
            key={c.id}
            className="flex items-center gap-3 rounded-lg border border-base-300 bg-base-100 px-4 py-3"
          >
            {c.passed ? (
              <IconCheck size={18} className="shrink-0 text-success" aria-hidden="true" />
            ) : (
              <IconX size={18} className="shrink-0 text-error" aria-hidden="true" />
            )}
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-semibold text-[length:var(--font-size-sm)] text-base-content">
                {c.label}
                <span className={c.passed ? "text-success" : "text-error"}>{c.statusLabel}</span>
              </p>
              <p className="text-[length:var(--font-size-xs)] text-base-content/60">{c.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Screen ───────────────────────────────────────────────────────── */

const TAB_LABELS: Record<ReportTab, { readonly key: string; readonly defaultValue: string }> = {
  audit: { key: "reports-tab-audit", defaultValue: "Audit Trail" },
  performance: { key: "reports-tab-perf", defaultValue: "Performance" },
  compliance: { key: "reports-tab-compliance", defaultValue: "Compliance" },
};

/**
 * Move focus to the tab button at the requested index when it exists.
 *
 * Tab-navigation contract: this only shifts focus; selection remains caller-controlled.
 *
 * @internal
 */
function focusTabAtIndex(
  refs: Readonly<Record<ReportTab, HTMLButtonElement | null>>,
  tabs: readonly ReportTab[],
  index: number,
): void {
  const next = tabs[index];
  if (!next) return;
  refs[next]?.focus();
}

/**
 * Build the localised string model consumed by the reports screen and panels.
 *
 * Localisation contract: the provided locale is used for number formatting, and all
 * returned strings are ready for direct rendering.
 *
 * @internal
 */
function buildReportStrings(t: TFunction, locale: string): ReportsViewModel {
  const numberFormatter = new Intl.NumberFormat(resolveFormattingLocale(locale));
  const tabListLabel = t("reports-tab-list", { defaultValue: "Report tabs" });
  const tabs: readonly LocalizedReportTab[] = TAB_IDS.map((tab) => {
    const label = TAB_LABELS[tab];
    return {
      id: tab,
      label: t(label.key, { defaultValue: label.defaultValue }),
    };
  });
  const auditRows: readonly DisplayAuditEvent[] = AUDIT_EVENTS.map((event) => ({
    ...event,
    action: t(`reports-audit-action-${event.action}`, {
      defaultValue: AUDIT_ACTION_DEFAULT_LABELS[event.action] ?? event.action,
    }),
    timestampLabel: formatTimelineTimestamp(event.timestamp, locale),
  }));
  const unitLabels: Record<PerformanceMetric["unit"], string> = {
    ms: t("unit-ms", { defaultValue: "ms" }),
    "req/s": t("reports-unit-req-per-second", { defaultValue: "req/s" }),
  };
  const performanceMetrics: readonly LocalizedPerformanceMetric[] = PERF_METRICS.map((m) => ({
    ...m,
    label: t(`reports-performance-${m.id}`, { defaultValue: PERF_DEFAULT_LABELS[m.id] ?? m.id }),
    valueLabel: numberFormatter.format(m.value),
    unitLabel: unitLabels[m.unit],
  }));
  const passLabel = t("reports-check-pass", { defaultValue: "Passed" });
  const failLabel = t("reports-check-fail", { defaultValue: "Failed" });
  const complianceChecks: readonly LocalizedComplianceCheck[] = COMPLIANCE_CHECKS.map((c) => ({
    ...c,
    label: t(`reports-compliance-${c.id}-label`, {
      defaultValue: COMPLIANCE_DEFAULT_LABELS[c.id] ?? c.id,
    }),
    detail: t(`reports-compliance-${c.id}-detail`, {
      defaultValue: COMPLIANCE_DEFAULT_DETAILS[c.id] ?? "",
    }),
    statusLabel: c.passed ? passLabel : failLabel,
  }));
  return {
    tabListLabel,
    tabs,
    audit: {
      rows: auditRows,
      tableLabel: t("reports-audit-table", { defaultValue: "Audit trail events" }),
      timeLabel: t("reports-col-time", { defaultValue: "Time" }),
      actorLabel: t("reports-col-actor", { defaultValue: "Actor" }),
      actionLabel: t("reports-col-action", { defaultValue: "Action" }),
      targetLabel: t("reports-col-target", { defaultValue: "Target" }),
    },
    performance: {
      regionLabel: t("reports-perf-region", { defaultValue: "Performance metrics" }),
      metrics: performanceMetrics,
    },
    compliance: {
      checks: complianceChecks,
      summaryLabel: t("reports-compliance-summary", {
        defaultValue: "{{pass}} of {{total}} checks passing",
        pass: numberFormatter.format(complianceChecks.filter((check) => check.passed).length),
        total: numberFormatter.format(complianceChecks.length),
      }),
      listLabel: t("reports-compliance-list", { defaultValue: "Compliance checks" }),
    },
  };
}

/**
 * Handle keyboard navigation and activation for the reports tab strip.
 *
 * Tab-navigation contract: arrow keys move focus only, whilst Enter or Space activates
 * the current tab via the provided setter.
 *
 * @internal
 */
function handleTabKeyDown(
  event: KeyboardEvent<HTMLButtonElement>,
  { index, tab, tabs, setActiveTab, focusAt }: TabNavContext,
): void {
  switch (event.key) {
    case "ArrowRight":
      event.preventDefault();
      focusAt((index + 1) % tabs.length);
      break;
    case "ArrowLeft":
      event.preventDefault();
      focusAt((index - 1 + tabs.length) % tabs.length);
      break;
    case "Home":
      event.preventDefault();
      focusAt(0);
      break;
    case "End":
      event.preventDefault();
      focusAt(tabs.length - 1);
      break;
    case "Enter":
    case " ":
      event.preventDefault();
      setActiveTab(tab);
      break;
    default:
      break;
  }
}

/**
 * Render the roving-focus tab bar for the reports screen.
 *
 * Tab-navigation contract: arrow keys move focus only; click or Enter/Space
 * activates the tab via the provided `onActivate` callback.
 *
 * `@internal`
 */
function TabStrip({
  activeTab,
  onActivate,
  refs,
  tabListLabel,
  tabs,
}: {
  readonly activeTab: ReportTab;
  readonly onActivate: (tab: ReportTab) => void;
  readonly refs: TabButtonRefs;
  readonly tabListLabel: string;
  readonly tabs: readonly LocalizedReportTab[];
}): JSX.Element {
  const tabRefs = refs.current;
  const tabOrder = tabs.map(({ id }) => id);

  return (
    <div role="tablist" aria-label={tabListLabel} className="tabs tabs-bordered mb-6">
      {tabs.map(({ id: tab, label }, index) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            ref={(el) => {
              tabRefs[tab] = el;
            }}
            type="button"
            role="tab"
            tabIndex={isActive ? 0 : -1}
            aria-selected={isActive}
            aria-controls={`panel-${tab}`}
            id={`tab-${tab}`}
            className={`tab ${isActive ? "tab-active" : ""}`}
            onClick={() => onActivate(tab)}
            onKeyDown={(event) => {
              handleTabKeyDown(event, {
                index,
                tab,
                tabs: tabOrder,
                setActiveTab: onActivate,
                focusAt: (nextIndex) => {
                  focusTabAtIndex(tabRefs, tabOrder, nextIndex);
                },
              });
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

interface PanelProps {
  readonly audit: AuditReportModel;
  readonly performance: PerformanceReportModel;
  readonly compliance: ComplianceReportModel;
}

function buildPanels(props: PanelProps): Record<ReportTab, JSX.Element> {
  return {
    audit: <AuditTrailPanel audit={props.audit} />,
    performance: (
      <PerformancePanel
        regionLabel={props.performance.regionLabel}
        metrics={props.performance.metrics}
      />
    ),
    compliance: (
      <CompliancePanel
        checks={props.compliance.checks}
        summaryLabel={props.compliance.summaryLabel}
        listLabel={props.compliance.listLabel}
      />
    ),
  };
}

/**
 * Render the reports registry screen with localised tab labels and mounted panels.
 *
 * Tab-navigation contract: only one tab is active at a time, whilst focus can move
 * independently across the mounted tab buttons and panels.
 *
 * @returns A `JSX.Element` for the reports screen.
 */
export function ReportsScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const [activeTab, setActiveTab] = useState<ReportTab>("audit");
  const tabButtonRefs: TabButtonRefs = useRef<Record<ReportTab, HTMLButtonElement | null>>({
    audit: null,
    performance: null,
    compliance: null,
  });
  const reportStrings = useMemo(() => buildReportStrings(t, locale), [t, locale]);
  const { tabListLabel, tabs, audit, performance, compliance } = reportStrings;
  const panels: Record<ReportTab, JSX.Element> = useMemo(
    () =>
      buildPanels({
        audit,
        performance,
        compliance,
      }),
    [audit, performance, compliance],
  );

  return (
    <RegistryList
      heading={t("page-reports", { defaultValue: "Reports" })}
      subtitle={t("page-reports-sub", {
        defaultValue: "Analytics and performance dashboards.",
      })}
    >
      <TabStrip
        activeTab={activeTab}
        onActivate={setActiveTab}
        refs={tabButtonRefs}
        tabListLabel={tabListLabel}
        tabs={tabs}
      />

      {/* Tab panels */}
      {TAB_IDS.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <div
            key={tab}
            id={`panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            tabIndex={isActive ? 0 : -1}
            hidden={!isActive}
            aria-hidden={!isActive}
          >
            {panels[tab]}
          </div>
        );
      })}
    </RegistryList>
  );
}
