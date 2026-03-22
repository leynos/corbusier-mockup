/** @file Fixture data and default-label lookups for the reports screen.
 *
 * Exports `AuditEventId`, `AuditAction`, `PerformanceMetricId`,
 * `PerformanceUnit`, and `ComplianceCheckId` alongside the fixture
 * arrays and label maps consumed by `reports-screen.tsx`.
 *
 * @see `src/app/features/system/reports-screen.tsx`
 */

export type AuditEventId =
  | "aud-1"
  | "aud-2"
  | "aud-3"
  | "aud-4"
  | "aud-5"
  | "aud-6"
  | "aud-7"
  | "aud-8";
export type AuditAction = "state_change" | "pr_merge" | "tool_call" | "comment" | "agent_turn";
export type PerformanceMetricId = "perf-1" | "perf-2" | "perf-3" | "perf-4";
export type PerformanceUnit = "ms" | "req/s";
export type ComplianceCheckId = "comp-1" | "comp-2" | "comp-3" | "comp-4" | "comp-5" | "comp-6";

export interface AuditEvent {
  readonly id: AuditEventId;
  readonly timestamp: string;
  readonly actor: string;
  readonly action: AuditAction;
  readonly target: string;
}

export interface DisplayAuditEvent extends Omit<AuditEvent, "action"> {
  readonly action: string;
  readonly timestampLabel: string;
}

export interface PerformanceMetric {
  readonly id: PerformanceMetricId;
  readonly value: number;
  readonly unit: PerformanceUnit;
  readonly colour: string;
  readonly maxValue: number;
}

export interface ComplianceCheck {
  readonly id: ComplianceCheckId;
  readonly passed: boolean;
}

export const AUDIT_EVENTS: readonly AuditEvent[] = [
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
] as const;

export const PERF_METRICS: readonly PerformanceMetric[] = [
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
] as const;

export const COMPLIANCE_CHECKS: readonly ComplianceCheck[] = [
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
] as const;

export const PERF_DEFAULT_LABELS: Record<PerformanceMetricId, string> = {
  "perf-1": "P50 Latency",
  "perf-2": "P95 Latency",
  "perf-3": "P99 Latency",
  "perf-4": "Throughput",
};

export const COMPLIANCE_DEFAULT_LABELS: Record<ComplianceCheckId, string> = {
  "comp-1": "RBAC enforcement",
  "comp-2": "Audit trail completeness",
  "comp-3": "Data retention policy",
  "comp-4": "Encryption at rest",
  "comp-5": "Token budget limits",
  "comp-6": "Branch protection rules",
};

export const COMPLIANCE_DEFAULT_DETAILS: Record<ComplianceCheckId, string> = {
  "comp-1": "All routes gated",
  "comp-2": "100% of state changes logged",
  "comp-3": "90-day retention active",
  "comp-4": "AES-256 verified",
  "comp-5": "2 overruns in last 7 days",
  "comp-6": "All repos compliant",
};

export const AUDIT_ACTION_DEFAULT_LABELS: Record<AuditAction, string> = {
  state_change: "State change",
  pr_merge: "PR merge",
  tool_call: "Tool call",
  comment: "Comment",
  agent_turn: "Agent turn",
};
