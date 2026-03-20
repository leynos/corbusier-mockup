/** @file Reports screen — three tabs: Audit Trail, Performance, Compliance. */

import { IconCheck, IconX } from "@tabler/icons-react";
import { type JSX, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { formatTimelineTimestamp } from "../../utils/date-formatting";
import { RegistryList } from "./components/registry-list";

/* ── Tab types ────────────────────────────────────────────────────── */

type ReportTab = "audit" | "performance" | "compliance";

/* ── Audit trail fixture ──────────────────────────────────────────── */

interface AuditEvent {
  readonly id: string;
  readonly timestamp: string;
  readonly actor: string;
  readonly action: string;
  readonly target: string;
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
  readonly id: string;
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
  readonly id: string;
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

interface LocalizedPerformanceMetric extends PerformanceMetric {
  readonly label: string;
}

interface LocalizedComplianceCheck extends ComplianceCheck {
  readonly label: string;
  readonly detail: string;
}

/* ── Sub-panels ───────────────────────────────────────────────────── */

function AuditTrailPanel({
  locale,
  tableLabel,
  timeLabel,
  actorLabel,
  actionLabel,
  targetLabel,
}: {
  readonly locale: string;
  readonly tableLabel: string;
  readonly timeLabel: string;
  readonly actorLabel: string;
  readonly actionLabel: string;
  readonly targetLabel: string;
}): JSX.Element {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full" aria-label={tableLabel}>
        <thead>
          <tr>
            <th
              scope="col"
              className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
            >
              {timeLabel}
            </th>
            <th
              scope="col"
              className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
            >
              {actorLabel}
            </th>
            <th
              scope="col"
              className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
            >
              {actionLabel}
            </th>
            <th
              scope="col"
              className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
            >
              {targetLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {AUDIT_EVENTS.map((e) => (
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
        const pct = Math.min((m.value / m.maxValue) * 100, 100);
        return (
          <div key={m.id} className="rounded-lg border border-base-300 bg-base-100 p-4">
            <p className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {m.label}
            </p>
            <p className="mt-1 tabular-nums text-[length:var(--font-size-2xl)] font-bold text-base-content">
              {m.value}
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

function CompliancePanel({
  checks,
  summaryLabel,
  listLabel,
}: {
  readonly checks: readonly LocalizedComplianceCheck[];
  readonly summaryLabel: string;
  readonly listLabel: string;
}): JSX.Element {
  const passCount = checks.filter((c) => c.passed).length;
  const totalCount = checks.length;
  return (
    <div>
      <p className="mb-4 tabular-nums text-[length:var(--font-size-sm)] text-base-content/70">
        {summaryLabel
          .replace("{{pass}}", String(passCount))
          .replace("{{total}}", String(totalCount))}
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
              <p className="font-semibold text-[length:var(--font-size-sm)] text-base-content">
                {c.label}
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

const TAB_IDS: readonly ReportTab[] = ["audit", "performance", "compliance"];

const TAB_LABELS: Record<ReportTab, { readonly key: string; readonly defaultValue: string }> = {
  audit: { key: "reports-tab-audit", defaultValue: "Audit Trail" },
  performance: { key: "reports-tab-perf", defaultValue: "Performance" },
  compliance: { key: "reports-tab-compliance", defaultValue: "Compliance" },
};

export function ReportsScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const [activeTab, setActiveTab] = useState<ReportTab>("audit");
  const tabButtonRefs = useRef<Record<ReportTab, HTMLButtonElement | null>>({
    audit: null,
    performance: null,
    compliance: null,
  });
  const tabListLabel = t("reports-tab-list", { defaultValue: "Report tabs" });
  const performanceMetrics: readonly LocalizedPerformanceMetric[] = PERF_METRICS.map((metric) => ({
    ...metric,
    label: t(`reports-performance-${metric.id}`, {
      defaultValue:
        metric.id === "perf-1"
          ? "P50 Latency"
          : metric.id === "perf-2"
            ? "P95 Latency"
            : metric.id === "perf-3"
              ? "P99 Latency"
              : "Throughput",
    }),
  }));
  const complianceChecks: readonly LocalizedComplianceCheck[] = COMPLIANCE_CHECKS.map((check) => ({
    ...check,
    label: t(`reports-compliance-${check.id}-label`, {
      defaultValue:
        check.id === "comp-1"
          ? "RBAC enforcement"
          : check.id === "comp-2"
            ? "Audit trail completeness"
            : check.id === "comp-3"
              ? "Data retention policy"
              : check.id === "comp-4"
                ? "Encryption at rest"
                : check.id === "comp-5"
                  ? "Token budget limits"
                  : "Branch protection rules",
    }),
    detail: t(`reports-compliance-${check.id}-detail`, {
      defaultValue:
        check.id === "comp-1"
          ? "All routes gated"
          : check.id === "comp-2"
            ? "100% of state changes logged"
            : check.id === "comp-3"
              ? "90-day retention active"
              : check.id === "comp-4"
                ? "AES-256 verified"
                : check.id === "comp-5"
                  ? "2 overruns in last 7 days"
                  : "All repos compliant",
    }),
  }));
  const auditTableLabel = t("reports-audit-table", { defaultValue: "Audit trail events" });
  const timeLabel = t("reports-col-time", { defaultValue: "Time" });
  const actorLabel = t("reports-col-actor", { defaultValue: "Actor" });
  const actionLabel = t("reports-col-action", { defaultValue: "Action" });
  const targetLabel = t("reports-col-target", { defaultValue: "Target" });
  const performanceRegionLabel = t("reports-perf-region", { defaultValue: "Performance metrics" });
  const complianceSummaryLabel = t("reports-compliance-summary", {
    defaultValue: "{{pass}} of {{total}} checks passing",
    pass: "{{pass}}",
    total: "{{total}}",
  });
  const complianceListLabel = t("reports-compliance-list", {
    defaultValue: "Compliance checks",
  });

  const focusTabAtIndex = (index: number): void => {
    const nextTab = TAB_IDS[index];
    if (!nextTab) return;
    tabButtonRefs.current[nextTab]?.focus();
  };

  return (
    <RegistryList
      heading={t("page-reports", { defaultValue: "Reports" })}
      subtitle={t("page-reports-sub", {
        defaultValue: "Analytics and performance dashboards.",
      })}
    >
      {/* Tab bar */}
      <div role="tablist" aria-label={tabListLabel} className="tabs tabs-bordered mb-6">
        {TAB_IDS.map((tab, index) => {
          const label = TAB_LABELS[tab];
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              ref={(element) => {
                tabButtonRefs.current[tab] = element;
              }}
              type="button"
              role="tab"
              tabIndex={isActive ? 0 : -1}
              aria-selected={isActive}
              aria-controls={`panel-${tab}`}
              id={`tab-${tab}`}
              className={`tab ${isActive ? "tab-active" : ""}`}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  focusTabAtIndex((index + 1) % TAB_IDS.length);
                  return;
                }
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  focusTabAtIndex((index - 1 + TAB_IDS.length) % TAB_IDS.length);
                  return;
                }
                if (event.key === "Home") {
                  event.preventDefault();
                  focusTabAtIndex(0);
                  return;
                }
                if (event.key === "End") {
                  event.preventDefault();
                  focusTabAtIndex(TAB_IDS.length - 1);
                  return;
                }
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveTab(tab);
                }
              }}
            >
              {t(label.key, { defaultValue: label.defaultValue })}
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      {TAB_IDS.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <div
            key={tab}
            id={`panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            hidden={!isActive}
            aria-hidden={!isActive}
          >
            {tab === "audit" ? (
              <AuditTrailPanel
                locale={locale}
                tableLabel={auditTableLabel}
                timeLabel={timeLabel}
                actorLabel={actorLabel}
                actionLabel={actionLabel}
                targetLabel={targetLabel}
              />
            ) : null}
            {tab === "performance" ? (
              <PerformancePanel regionLabel={performanceRegionLabel} metrics={performanceMetrics} />
            ) : null}
            {tab === "compliance" ? (
              <CompliancePanel
                checks={complianceChecks}
                summaryLabel={complianceSummaryLabel}
                listLabel={complianceListLabel}
              />
            ) : null}
          </div>
        );
      })}
    </RegistryList>
  );
}
