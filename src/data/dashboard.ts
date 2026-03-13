/** @file Dashboard fixture data: KPIs, system health, activity feed, agent utilization.
 *
 * All values are static fixtures rendered on the dashboard. The data
 * shapes mirror what a real SSE-fed dashboard would receive.
 *
 * Entity strings live in `localizations` maps per the data model-driven
 * card architecture. Fluent retains only UI chrome.
 */

import type { EntityLocalizations } from "../app/domain/entities/localization";
import { loc } from "./localization-helpers";
import type { TaskId } from "./tasks";

/* ── KPI data ──────────────────────────────────────────────────────── */

export type TrendDirection = "up" | "down" | "flat";
export type KpiValueFormat = "integer" | "percentage" | "milliseconds";

export interface KpiMetric {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly value: number;
  readonly valueFormat: KpiValueFormat;
  readonly trend: TrendDirection;
  readonly trendLocalizations: EntityLocalizations;
}

export const KPI_METRICS: readonly KpiMetric[] = [
  {
    id: "active-tasks",
    localizations: { "en-GB": { name: "Active Tasks", description: "across 4 projects" } },
    value: 47,
    valueFormat: "integer",
    trend: "up",
    trendLocalizations: loc("+3 this week"),
  },
  {
    id: "agent-utilization",
    localizations: {
      "en-GB": { name: "Agent Utilization", description: "2 of 3 backends active" },
    },
    value: 83,
    valueFormat: "percentage",
    trend: "up",
    trendLocalizations: loc("+5% from yesterday"),
  },
  {
    id: "tool-success-rate",
    localizations: { "en-GB": { name: "Tool Success Rate", description: "last 24 hours" } },
    value: 98.2,
    valueFormat: "percentage",
    trend: "flat",
    trendLocalizations: loc("stable"),
  },
  {
    id: "sla-p95",
    localizations: { "en-GB": { name: "SLA P95 Latency", description: "target: <1000ms" } },
    value: 820,
    valueFormat: "milliseconds",
    trend: "down",
    trendLocalizations: loc("-40ms from last week"),
  },
];

/* ── System health ─────────────────────────────────────────────────── */

export type HealthStatus = "healthy" | "degraded" | "critical";

export interface ComponentHealth {
  readonly localizations: EntityLocalizations;
  readonly status: HealthStatus;
}

export interface SystemHealth {
  readonly overall: HealthStatus;
  readonly lastChecked: string;
  readonly components: readonly ComponentHealth[];
}

export const SYSTEM_HEALTH: SystemHealth = {
  overall: "healthy",
  lastChecked: "2026-03-12T09:14:00Z",
  components: [
    { localizations: loc("Agent Gateway"), status: "healthy" },
    { localizations: loc("Tool Registry"), status: "healthy" },
    { localizations: loc("Hook Engine"), status: "healthy" },
    { localizations: loc("Event Bus"), status: "healthy" },
    { localizations: loc("Audit Store"), status: "degraded" },
  ],
};

/* ── Recent activity feed ──────────────────────────────────────────── */

export type DashboardEventKind =
  | "state_change"
  | "tool_call"
  | "agent_turn"
  | "subtask_completed"
  | "branch_associated"
  | "pr_opened"
  | "comment";

export type DashboardEventId = `da-${number}`;

export interface DashboardEvent {
  readonly id: DashboardEventId;
  readonly kind: DashboardEventKind;
  readonly timestamp: string;
  readonly actor: string;
  readonly localizations: EntityLocalizations;
  readonly taskRef: TaskId | undefined;
}

export const RECENT_ACTIVITY: readonly DashboardEvent[] = [
  {
    id: "da-1",
    kind: "state_change",
    timestamp: "2026-03-12T09:14:00Z",
    actor: "Ava Chen",
    localizations: loc("Transitioned TASK-1001 to In Progress"),
    taskRef: "TASK-1001",
  },
  {
    id: "da-2",
    kind: "branch_associated",
    timestamp: "2026-03-12T09:15:00Z",
    actor: "Ava Chen",
    localizations: loc("Associated branch feature/claude-sdk-backend"),
    taskRef: "TASK-1001",
  },
  {
    id: "da-3",
    kind: "subtask_completed",
    timestamp: "2026-03-12T11:42:00Z",
    actor: "Ava Chen",
    localizations: loc("Completed subtask: Define agent adapter interface"),
    taskRef: "TASK-1001",
  },
  {
    id: "da-4",
    kind: "tool_call",
    timestamp: "2026-03-12T12:05:00Z",
    actor: "Claude Code SDK",
    localizations: loc("Invoked file_write on src/agent/adapter.ts"),
    taskRef: "TASK-1001",
  },
  {
    id: "da-5",
    kind: "agent_turn",
    timestamp: "2026-03-12T12:06:00Z",
    actor: "Claude Code SDK",
    localizations: loc("Completed turn 142 — 3 tool calls, 0 errors"),
    taskRef: "TASK-1001",
  },
  {
    id: "da-7",
    kind: "state_change",
    timestamp: "2026-03-12T14:30:00Z",
    actor: "Marcus Webb",
    localizations: loc("Transitioned TASK-1002 to In Review"),
    taskRef: "TASK-1002",
  },
  {
    id: "da-6",
    kind: "pr_opened",
    timestamp: "2026-03-12T14:32:00Z",
    actor: "Marcus Webb",
    localizations: loc("Opened PR #251 for tool registry schema"),
    taskRef: "TASK-1002",
  },
  {
    id: "da-8",
    kind: "comment",
    timestamp: "2026-03-12T15:00:00Z",
    actor: "Priya Sharma",
    localizations: loc("Left comment on TASK-1006: Tool call panel needs expand/collapse"),
    taskRef: "TASK-1006",
  },
  {
    id: "da-9",
    kind: "agent_turn",
    timestamp: "2026-03-12T15:30:00Z",
    actor: "Codex CLI",
    localizations: loc("Completed turn 87 — schema validation pass"),
    taskRef: "TASK-1016",
  },
  {
    id: "da-10",
    kind: "state_change",
    timestamp: "2026-03-12T16:00:00Z",
    actor: "Elena Rossi",
    localizations: loc("Transitioned TASK-1007 to Done"),
    taskRef: "TASK-1007",
  },
  {
    id: "da-11",
    kind: "tool_call",
    timestamp: "2026-03-12T16:15:00Z",
    actor: "Claude Code SDK",
    localizations: loc("Invoked bash: bun test — all passing"),
    taskRef: "TASK-1011",
  },
  {
    id: "da-12",
    kind: "subtask_completed",
    timestamp: "2026-03-12T16:45:00Z",
    actor: "Tomás Herrera",
    localizations: loc("Completed subtask: Implement scope middleware"),
    taskRef: "TASK-1011",
  },
];

/* ── Agent utilization ─────────────────────────────────────────────── */

export type AgentStatus = "active" | "inactive" | "error";

export interface AgentBackend {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly status: AgentStatus;
  readonly turnCount: number;
}

export const AGENT_BACKENDS: readonly AgentBackend[] = [
  {
    id: "claude_code_sdk",
    localizations: loc("Claude Code SDK"),
    status: "active",
    turnCount: 142,
  },
  {
    id: "codex_cli",
    localizations: loc("Codex CLI"),
    status: "active",
    turnCount: 87,
  },
  {
    id: "custom_backend",
    localizations: loc("Custom Backend"),
    status: "inactive",
    turnCount: 0,
  },
];
