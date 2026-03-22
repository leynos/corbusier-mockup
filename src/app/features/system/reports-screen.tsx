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

import { DEFAULT_LOCALE } from "../../i18n/supported-locales";
import { formatTimelineTimestamp } from "../../utils/date-formatting";
import { RegistryList } from "./components/registry-list";

/* ── Tab types ────────────────────────────────────────────────────── */

const TAB_IDS = ["audit", "performance", "compliance"] as const;

type ReportTab = (typeof TAB_IDS)[number];
type AuditEventId = "aud-1" | "aud-2" | "aud-3" | "aud-4" | "aud-5" | "aud-6" | "aud-7" | "aud-8";
type AuditAction = "state_change" | "pr_merge" | "tool_call" | "comment" | "agent_turn";
type PerformanceMetricId = "perf-1" | "perf-2" | "perf-3" | "perf-4";
type ComplianceCheckId = "comp-1" | "comp-2" | "comp-3" | "comp-4" | "comp-5" | "comp-6";

/* ── Audit trail fixture ──────────────────────────────────────────── */

interface AuditEvent {
  readonly id: AuditEventId;
  readonly timestamp: string;
  readonly actor: string;
  readonly action: AuditAction;
  readonly target: string;
}

interface DisplayAuditEvent extends Omit<AuditEvent, "action"> {
  readonly action: string;
}

const AUDIT_EVENTS: readonly AuditEvent[] = [
  {
    id: "aud-1",
    timestamp: "2026-03-12T16:45:00Z",
    actor: "Ava Chen",
    action: "state_change",
    target: "TASK-1001",
  },
  {
    id: "aud-2",
    timestamp: "2026-03-12T14:32:00Z",
    actor: "Marcus Webb",
    action: "pr_merge",
    target: "PR #251",
  },
  {
    id: "aud-3",
    timestamp: "2026-03-12T14:30:00Z",
    actor: "Marcus Webb",
    action: "state_change",
    target: "TASK-1002",
  },
  {
    id: "aud-4",
    timestamp: "2026-03-12T12:05:00Z",
    actor: "Claude Code SDK",
    action: "tool_call",
    target: "file_write",
  },
  {
    id: "aud-5",
    timestamp: "2026-03-12T11:00:00Z",
    actor: "Priya Sharma",
    action: "comment",
    target: "TASK-1006",
  },
  {
    id: "aud-6",
    timestamp: "2026-03-12T09:14:00Z",
    actor: "Ava Chen",
    action: "state_change",
    target: "TASK-1001",
  },
  {
    id: "aud-7",
    timestamp: "2026-03-11T16:00:00Z",
    actor: "Elena Rossi",
    action: "state_change",
    target: "TASK-1007",
  },
  {
    id: "aud-8",
    timestamp: "2026-03-11T15:30:00Z",
    actor: "Codex CLI",
    action: "agent_turn",
    target: "Turn 87",
  },
];

/* ── Performance fixture ──────────────────────────────────────────── */

interface PerformanceMetric {
  readonly id: PerformanceMetricId;
  readonly value: number;
  readonly unit: string;
  readonly colour: string;
  readonly maxValue: number;
}

const PERF_METRICS: readonly PerformanceMetric[] = [
  {
    id: "perf-1",
    value: 420,
    unit: "ms",
    colour: "bg-success",
    maxValue: 1000,
  },
  {
    id: "perf-2",
    value: 820,
    unit: "ms",
    colour: "bg-warning",
    maxValue: 1000,
  },
  {
    id: "perf-3",
    value: 1150,
    unit: "ms",
    colour: "bg-error",
    maxValue: 1500,
  },
  {
    id: "perf-4",
    value: 345,
    unit: "req/s",
    colour: "bg-primary",
    maxValue: 500,
  },
];

/* ── Compliance fixture ───────────────────────────────────────────── */

interface ComplianceCheck {
  readonly id: ComplianceCheckId;
  readonly passed: boolean;
}

const COMPLIANCE_CHECKS: readonly ComplianceCheck[] = [
  { id: "comp-1", passed: true },
  {
    id: "comp-2",
    passed: true,
  },
  { id: "comp-3", passed: true },
  { id: "comp-4", passed: true },
  {
    id: "comp-5",
    passed: false,
  },
  { id: "comp-6", passed: true },
];

const PERF_DEFAULT_LABELS: Record<PerformanceMetricId, string> = {
  "perf-1": "P50 Latency",
  "perf-2": "P95 Latency",
  "perf-3": "P99 Latency",
  "perf-4": "Throughput",
};

const COMPLIANCE_DEFAULT_LABELS: Record<ComplianceCheckId, string> = {
  "comp-1": "RBAC enforcement",
  "comp-2": "Audit trail completeness",
  "comp-3": "Data retention policy",
  "comp-4": "Encryption at rest",
  "comp-5": "Token budget limits",
  "comp-6": "Branch protection rules",
};

const COMPLIANCE_DEFAULT_DETAILS: Record<ComplianceCheckId, string> = {
  "comp-1": "All routes gated",
  "comp-2": "100% of state changes logged",
  "comp-3": "90-day retention active",
  "comp-4": "AES-256 verified",
  "comp-5": "2 overruns in last 7 days",
  "comp-6": "All repos compliant",
};

const AUDIT_ACTION_DEFAULT_LABELS: Record<AuditAction, string> = {
  state_change: "State change",
  pr_merge: "PR merge",
  tool_call: "Tool call",
  comment: "Comment",
  agent_turn: "Agent turn",
};

interface LocalizedPerformanceMetric extends PerformanceMetric {
  readonly label: string;
  readonly valueLabel: string;
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
  readonly locale: string;
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

function resolveReportFormattingLocale(locale: string | undefined): string {
  if (locale) {
    return locale;
  }

  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language;
  }

  return DEFAULT_LOCALE;
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
  const { rows, locale, tableLabel, timeLabel, actorLabel, actionLabel, targetLabel } = audit;
  const columnHeaders = [timeLabel, actorLabel, actionLabel, targetLabel];

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full" aria-label={tableLabel}>
        <thead>
          <tr>
            {columnHeaders.map((header) => (
              <th
                key={header}
                scope="col"
                className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id} className="min-h-9 hover:bg-base-200/40">
              <td className="whitespace-nowrap font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60">
                <time dateTime={e.timestamp}>{formatTimelineTimestamp(e.timestamp, locale)}</time>
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
                {m.unit}
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
  const numberFormatter = new Intl.NumberFormat(resolveReportFormattingLocale(locale));
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
  }));
  const performanceMetrics: readonly LocalizedPerformanceMetric[] = PERF_METRICS.map((m) => ({
    ...m,
    label: t(`reports-performance-${m.id}`, { defaultValue: PERF_DEFAULT_LABELS[m.id] ?? m.id }),
    valueLabel: numberFormatter.format(m.value),
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
      locale,
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

function buildPanels(props: PanelProps): Record<ReportTab, () => JSX.Element> {
  return {
    audit: () => <AuditTrailPanel audit={props.audit} />,
    performance: () => (
      <PerformancePanel
        regionLabel={props.performance.regionLabel}
        metrics={props.performance.metrics}
      />
    ),
    compliance: () => (
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
  const panels: Record<ReportTab, () => JSX.Element> = useMemo(
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
            {panels[tab]()}
          </div>
        );
      })}
    </RegistryList>
  );
}
