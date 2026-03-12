/** @file Dashboard fixture data: KPIs, system health, activity feed, agent utilization.
 *
 * All values are static fixtures rendered on the dashboard. The data
 * shapes mirror what a real SSE-fed dashboard would receive.
 */

/* ── KPI data ──────────────────────────────────────────────────────── */

export type TrendDirection = "up" | "down" | "flat";

export interface KpiMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly context: string;
  readonly trend: TrendDirection;
  readonly trendLabel: string;
}

export const KPI_METRICS: readonly KpiMetric[] = [
  {
    id: "active-tasks",
    label: "Active Tasks",
    value: "47",
    context: "across 4 projects",
    trend: "up",
    trendLabel: "+3 this week",
  },
  {
    id: "agent-utilization",
    label: "Agent Utilization",
    value: "83%",
    context: "2 of 3 backends active",
    trend: "up",
    trendLabel: "+5% from yesterday",
  },
  {
    id: "tool-success-rate",
    label: "Tool Success Rate",
    value: "98.2%",
    context: "last 24 hours",
    trend: "flat",
    trendLabel: "stable",
  },
  {
    id: "sla-p95",
    label: "SLA P95 Latency",
    value: "820ms",
    context: "target: <1000ms",
    trend: "down",
    trendLabel: "-40ms from last week",
  },
];

/* ── System health ─────────────────────────────────────────────────── */

export type HealthStatus = "healthy" | "degraded" | "critical";

export interface ComponentHealth {
  readonly name: string;
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
    { name: "Agent Gateway", status: "healthy" },
    { name: "Tool Registry", status: "healthy" },
    { name: "Hook Engine", status: "healthy" },
    { name: "Event Bus", status: "healthy" },
    { name: "Audit Store", status: "degraded" },
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

export interface DashboardEvent {
  readonly id: string;
  readonly kind: DashboardEventKind;
  readonly timestamp: string;
  readonly actor: string;
  readonly description: string;
  readonly taskRef: string | undefined;
}

export const RECENT_ACTIVITY: readonly DashboardEvent[] = [
  {
    id: "da-1",
    kind: "state_change",
    timestamp: "2026-03-12T09:14:00Z",
    actor: "Ava Chen",
    description: "Transitioned TASK-1001 to In Progress",
    taskRef: "TASK-1001",
  },
  {
    id: "da-2",
    kind: "branch_associated",
    timestamp: "2026-03-12T09:15:00Z",
    actor: "Ava Chen",
    description: "Associated branch feature/claude-sdk-backend",
    taskRef: "TASK-1001",
  },
  {
    id: "da-3",
    kind: "subtask_completed",
    timestamp: "2026-03-12T11:42:00Z",
    actor: "Ava Chen",
    description: "Completed subtask: Define agent adapter interface",
    taskRef: "TASK-1001",
  },
  {
    id: "da-4",
    kind: "tool_call",
    timestamp: "2026-03-12T12:05:00Z",
    actor: "claude_code_sdk",
    description: "Invoked file_write on src/agent/adapter.ts",
    taskRef: "TASK-1001",
  },
  {
    id: "da-5",
    kind: "agent_turn",
    timestamp: "2026-03-12T12:06:00Z",
    actor: "claude_code_sdk",
    description: "Completed turn 142 — 3 tool calls, 0 errors",
    taskRef: "TASK-1001",
  },
  {
    id: "da-6",
    kind: "pr_opened",
    timestamp: "2026-03-12T14:32:00Z",
    actor: "Marcus Webb",
    description: "Opened PR #251 for tool registry schema",
    taskRef: "TASK-1002",
  },
  {
    id: "da-7",
    kind: "state_change",
    timestamp: "2026-03-12T14:30:00Z",
    actor: "Marcus Webb",
    description: "Transitioned TASK-1002 to In Review",
    taskRef: "TASK-1002",
  },
  {
    id: "da-8",
    kind: "comment",
    timestamp: "2026-03-12T15:00:00Z",
    actor: "Priya Sharma",
    description: "Left comment on TASK-1006: Tool call panel needs expand/collapse",
    taskRef: "TASK-1006",
  },
  {
    id: "da-9",
    kind: "agent_turn",
    timestamp: "2026-03-12T15:30:00Z",
    actor: "codex_cli",
    description: "Completed turn 87 — schema validation pass",
    taskRef: "TASK-1016",
  },
  {
    id: "da-10",
    kind: "state_change",
    timestamp: "2026-03-12T16:00:00Z",
    actor: "Elena Rossi",
    description: "Transitioned TASK-1007 to Done",
    taskRef: "TASK-1007",
  },
  {
    id: "da-11",
    kind: "tool_call",
    timestamp: "2026-03-12T16:15:00Z",
    actor: "claude_code_sdk",
    description: "Invoked bash: bun test — all passing",
    taskRef: "TASK-1011",
  },
  {
    id: "da-12",
    kind: "subtask_completed",
    timestamp: "2026-03-12T16:45:00Z",
    actor: "Tomás Herrera",
    description: "Completed subtask: Implement scope middleware",
    taskRef: "TASK-1011",
  },
];

/* ── Agent utilization ─────────────────────────────────────────────── */

export type AgentStatus = "active" | "inactive" | "error";

export interface AgentBackend {
  readonly name: string;
  readonly displayName: string;
  readonly status: AgentStatus;
  readonly turnCount: number;
}

export const AGENT_BACKENDS: readonly AgentBackend[] = [
  {
    name: "claude_code_sdk",
    displayName: "Claude Code SDK",
    status: "active",
    turnCount: 142,
  },
  {
    name: "codex_cli",
    displayName: "Codex CLI",
    status: "active",
    turnCount: 87,
  },
  {
    name: "custom_backend",
    displayName: "Custom Backend",
    status: "inactive",
    turnCount: 0,
  },
];
