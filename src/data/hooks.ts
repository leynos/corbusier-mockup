/** @file Hook definition fixture data for the hooks and policies pages.
 *
 * Each hook has entity-owned localised strings, trigger type, predicate
 * expression, action chain, priority, enabled flag, and execution log.
 */

import * as v from "valibot";
import type { EntityLocalizations } from "../app/domain/entities/localization";
import { loc } from "./localization-helpers";

/* ── Types ────────────────────────────────────────────────────────── */

export type HookId = `HK-${number}`;

const hookIdSchema = v.pipe(v.string(), v.regex(/^HK-\d+$/, "Hook IDs must match HK-{number}."));

/**
 * Construct a validated `HookId` from raw input.
 *
 * Throws a `ValiError` when `raw` does not match the expected `HK-{number}` pattern.
 */
export function hookId(raw: string): HookId {
  return v.parse(hookIdSchema, raw) as HookId;
}

/**
 * Safely parse raw input into a `HookId`.
 *
 * Returns the branded hook id on success, or `undefined` when the input is invalid.
 */
export function parseHookId(raw: string): HookId | undefined {
  const result = v.safeParse(hookIdSchema, raw);
  return result.success ? (result.output as HookId) : undefined;
}

export type ExecutionOutcome = "pass" | "fail" | "skip";

export interface ExecutionLogEntry {
  readonly id: string;
  readonly timestamp: string;
  readonly outcome: ExecutionOutcome;
  readonly localizations: EntityLocalizations;
  readonly durationMs: number;
}

export interface HookDefinition {
  readonly id: HookId;
  readonly localizations: EntityLocalizations;
  readonly triggerType: string;
  readonly predicate: string;
  readonly actions: readonly string[];
  readonly priority: number;
  readonly enabled: boolean;
  readonly executionLog: readonly ExecutionLogEntry[];
}

/* ── Fixture data ─────────────────────────────────────────────────── */

export const HOOKS: readonly HookDefinition[] = [
  {
    id: hookId("HK-001"),
    localizations: loc(
      "Pre-commit lint gate",
      "Runs lint and type checks before any commit is created.",
    ),
    triggerType: "pre_commit",
    predicate: "event.type === 'commit' && event.branch !== 'main'",
    actions: ["run_lint", "run_typecheck"],
    priority: 10,
    enabled: true,
    executionLog: [
      {
        id: "el-1",
        timestamp: "2026-03-12T16:45:00Z",
        outcome: "pass",
        localizations: loc("Lint and typecheck passed"),
        durationMs: 2340,
      },
      {
        id: "el-2",
        timestamp: "2026-03-12T14:30:00Z",
        outcome: "pass",
        localizations: loc("Lint and typecheck passed"),
        durationMs: 2180,
      },
      {
        id: "el-3",
        timestamp: "2026-03-12T11:00:00Z",
        outcome: "fail",
        localizations: loc("Typecheck failed: 2 errors"),
        durationMs: 1890,
      },
    ],
  },
  {
    id: hookId("HK-002"),
    localizations: loc(
      "Task state audit trail",
      "Logs every task state transition to the audit store.",
    ),
    triggerType: "task_state_change",
    predicate: "event.newState !== event.previousState",
    actions: ["audit_log_write", "notify_watchers"],
    priority: 20,
    enabled: true,
    executionLog: [
      {
        id: "el-4",
        timestamp: "2026-03-12T16:00:00Z",
        outcome: "pass",
        localizations: loc("Audit entry written"),
        durationMs: 45,
      },
      {
        id: "el-5",
        timestamp: "2026-03-12T14:30:00Z",
        outcome: "pass",
        localizations: loc("Audit entry written"),
        durationMs: 38,
      },
    ],
  },
  {
    id: hookId("HK-003"),
    localizations: loc(
      "Agent turn cost limiter",
      "Blocks agent turns that exceed the per-turn token budget.",
    ),
    triggerType: "agent_turn_start",
    predicate: "event.estimatedTokens > config.maxTokensPerTurn",
    actions: ["block_turn", "notify_admin"],
    priority: 5,
    enabled: true,
    executionLog: [
      {
        id: "el-6",
        timestamp: "2026-03-12T15:30:00Z",
        outcome: "skip",
        localizations: loc("Below threshold — skipped"),
        durationMs: 2,
      },
      {
        id: "el-7",
        timestamp: "2026-03-12T12:00:00Z",
        outcome: "pass",
        localizations: loc("Turn blocked: 48k tokens estimated"),
        durationMs: 5,
      },
    ],
  },
  {
    id: hookId("HK-004"),
    localizations: loc(
      "PR merge compliance check",
      "Enforces branch protection rules before merge.",
    ),
    triggerType: "pr_merge",
    predicate: "event.approvalCount >= 1 && event.ciStatus === 'passed'",
    actions: ["verify_approvals", "verify_ci", "merge_pr"],
    priority: 15,
    enabled: true,
    executionLog: [
      {
        id: "el-8",
        timestamp: "2026-03-12T14:32:00Z",
        outcome: "pass",
        localizations: loc("PR #251 merge approved"),
        durationMs: 120,
      },
      {
        id: "el-9",
        timestamp: "2026-03-11T16:00:00Z",
        outcome: "fail",
        localizations: loc("PR #248 missing CI pass"),
        durationMs: 85,
      },
    ],
  },
  {
    id: hookId("HK-005"),
    localizations: loc(
      "Nightly backup trigger",
      "Triggers database backup at scheduled intervals. Currently disabled.",
    ),
    triggerType: "schedule",
    predicate: "cron('0 2 * * *')",
    actions: ["db_backup", "notify_ops"],
    priority: 50,
    enabled: false,
    executionLog: [
      {
        id: "el-10",
        timestamp: "2026-03-10T02:00:00Z",
        outcome: "pass",
        localizations: loc("Backup completed"),
        durationMs: 34200,
      },
    ],
  },
];

/* ── Lookup helpers ───────────────────────────────────────────────── */

export function findHookById(id: HookId): HookDefinition | undefined {
  return HOOKS.find((h) => h.id === id);
}
