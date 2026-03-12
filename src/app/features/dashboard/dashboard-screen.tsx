/** @file Dashboard screen — the operations room overview.
 *
 * Four panels in visual hierarchy order (design language §5):
 * 1. System health status (loudest)
 * 2. KPI cards
 * 3. Recent activity feed
 * 4. Agent utilization summary
 */

import {
  IconActivity,
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconRobot,
} from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import {
  AGENT_BACKENDS,
  type AgentBackend,
  type HealthStatus,
  KPI_METRICS,
  RECENT_ACTIVITY,
  SYSTEM_HEALTH,
} from "../../../data/dashboard";
import { ActivityTimeline } from "../../components/activity-timeline";
import { KpiCard } from "../../components/kpi-card";

/* ── System health panel ───────────────────────────────────────────── */

const HEALTH_ICON: Record<HealthStatus, typeof IconCircleCheck> = {
  healthy: IconCircleCheck,
  degraded: IconAlertTriangle,
  critical: IconCircleX,
};

const HEALTH_COLOUR: Record<HealthStatus, string> = {
  healthy: "text-success",
  degraded: "text-warning",
  critical: "text-error",
};

const HEALTH_LABEL: Record<HealthStatus, string> = {
  healthy: "HEALTHY",
  degraded: "DEGRADED",
  critical: "CRITICAL",
};

function SystemHealthPanel(): JSX.Element {
  const Icon = HEALTH_ICON[SYSTEM_HEALTH.overall];
  const colour = HEALTH_COLOUR[SYSTEM_HEALTH.overall];
  const label = HEALTH_LABEL[SYSTEM_HEALTH.overall];

  return (
    <section
      aria-label="System health"
      className="card bg-base-100 border border-base-300 shadow-sm"
    >
      <div className="card-body flex-row items-center gap-4 p-5">
        <Icon size={32} stroke={1.5} className={colour} aria-hidden="true" />
        <div>
          <p className="font-[family-name:var(--font-display)] text-[length:var(--font-size-lg)] font-bold text-base-content">
            System Status: {label}
          </p>
          <p className="text-[length:var(--font-size-xs)] text-base-content/60">
            Last checked:{" "}
            <time dateTime={SYSTEM_HEALTH.lastChecked}>
              {new Date(SYSTEM_HEALTH.lastChecked).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Agent utilization panel ───────────────────────────────────────── */

const INACTIVE_STYLE = { dot: "bg-base-content/30", text: "text-base-content/60" } as const;

const AGENT_STATUS_STYLE: Record<string, { readonly dot: string; readonly text: string }> = {
  active: { dot: "bg-success", text: "text-base-content/80" },
  inactive: INACTIVE_STYLE,
  error: { dot: "bg-error", text: "text-base-content/80" },
};

function AgentRow({ agent }: { readonly agent: AgentBackend }): JSX.Element {
  const style = AGENT_STATUS_STYLE[agent.status] ?? INACTIVE_STYLE;
  return (
    <li className="flex items-center gap-3 py-2">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} aria-hidden="true" />
      <span className="flex-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)] text-base-content">
        {agent.displayName}
      </span>
      <span className={`text-[length:var(--font-size-xs)] font-semibold ${style.text}`}>
        {agent.status === "active" ? "Active" : "Inactive"}
      </span>
      <span className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60">
        {String(agent.turnCount)} turns
      </span>
    </li>
  );
}

function AgentUtilizationPanel(): JSX.Element {
  return (
    <section
      aria-label="Agent utilization"
      className="card bg-base-100 border border-base-300 shadow-sm"
    >
      <div className="card-body p-5">
        <h2 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
          <IconRobot size={16} stroke={1.5} aria-hidden="true" />
          Agent Utilization
        </h2>
        <ul className="divide-y divide-base-300/50">
          {AGENT_BACKENDS.map((a) => (
            <AgentRow key={a.name} agent={a} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Dashboard screen ──────────────────────────────────────────────── */

export function DashboardScreen(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {t("page-dashboard", { defaultValue: "Dashboard" })}
      </h1>

      {/* 1. System health — loudest */}
      <SystemHealthPanel />

      {/* 2. KPI cards */}
      <section
        aria-label="Key metrics"
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {KPI_METRICS.map((m) => (
          <KpiCard
            key={m.id}
            label={m.label}
            value={m.value}
            context={m.context}
            trend={m.trend}
            trendLabel={m.trendLabel}
          />
        ))}
      </section>

      {/* 3 + 4. Activity feed + Agent utilization */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity feed — 2/3 width */}
        <section
          aria-label="Recent activity"
          className="card bg-base-100 border border-base-300 shadow-sm lg:col-span-2"
        >
          <div className="card-body p-5">
            <h2 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
              <IconActivity size={16} stroke={1.5} aria-hidden="true" />
              Recent Activity
            </h2>
            <ActivityTimeline
              entries={RECENT_ACTIVITY.slice(0, 10).map((e) => ({
                id: e.id,
                kind: e.kind === "tool_call" || e.kind === "agent_turn" ? "agent_action" : e.kind,
                timestamp: e.timestamp,
                actor: e.actor,
                description: e.description,
              }))}
            />
          </div>
        </section>

        {/* Agent utilization — 1/3 width */}
        <AgentUtilizationPanel />
      </div>
    </div>
  );
}
