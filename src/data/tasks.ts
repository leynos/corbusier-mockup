/** @file Task domain model, state machine, and fixture data.
 *
 * Defines the Task entity with full metadata, the TaskState lifecycle
 * enum, priority levels, and a transition-validation function that
 * encodes the legal state machine edges. Fixture data uses realistic
 * Corbusier-themed content (agent orchestration, MCP integration, etc.).
 *
 * Entity strings live in `localizations` maps per the data model-driven
 * card architecture. Fluent retains only UI chrome.
 */

import type { EntityLocalizations } from "../app/domain/entities/localization";

/* ── Enums ─────────────────────────────────────────────────────────── */

export enum TaskState {
  Draft = "draft",
  InProgress = "in_progress",
  InReview = "in_review",
  Paused = "paused",
  Done = "done",
  Abandoned = "abandoned",
}

export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
  Critical = "critical",
}

/* ── Supporting types ──────────────────────────────────────────────── */

export interface Assignee {
  readonly name: string;
  readonly initials: string;
  readonly role: string;
}

export interface Subtask {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly done: boolean;
}

export interface Dependencies {
  readonly blockedBy: readonly string[];
  readonly blocks: readonly string[];
}

export type ActivityEventKind =
  | "state_change"
  | "subtask_completed"
  | "comment"
  | "agent_action"
  | "branch_associated"
  | "pr_opened";

export interface ActivityEvent {
  readonly id: string;
  readonly kind: ActivityEventKind;
  readonly timestamp: string;
  readonly actor: string;
  readonly localizations: EntityLocalizations;
}

export interface TaskHierarchy {
  readonly goal?: EntityLocalizations;
  readonly idea?: EntityLocalizations;
  readonly step?: EntityLocalizations;
}

/* ── Task interface ────────────────────────────────────────────────── */

export interface Task {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly state: TaskState;
  readonly priority: Priority;
  readonly projectSlug: string;
  readonly assignee: Assignee;
  readonly dueDate: string;
  readonly estimate: string | undefined;
  readonly labelIds: readonly string[];
  readonly subtasks: readonly Subtask[];
  readonly dependencies: Dependencies;
  readonly branchRef: string | undefined;
  readonly pullRequestRef: string | undefined;
  readonly activityLog: readonly ActivityEvent[];
  readonly hierarchy: TaskHierarchy;
  readonly relatedTasks: readonly string[];
}

/* ── State machine ─────────────────────────────────────────────────── */

const VALID_TRANSITIONS: ReadonlyMap<TaskState, readonly TaskState[]> = new Map([
  [TaskState.Draft, [TaskState.InProgress, TaskState.Abandoned]],
  [TaskState.InProgress, [TaskState.InReview, TaskState.Paused, TaskState.Abandoned]],
  [TaskState.InReview, [TaskState.Done, TaskState.InProgress, TaskState.Abandoned]],
  [TaskState.Paused, [TaskState.InProgress, TaskState.Abandoned]],
  [TaskState.Done, [TaskState.Abandoned]],
  [TaskState.Abandoned, []],
]);

/**
 * Check whether a state transition is valid.
 *
 * @example
 * ```ts
 * canTransitionTo(TaskState.Draft, TaskState.InProgress) // true
 * canTransitionTo(TaskState.Done, TaskState.Draft)       // false
 * ```
 */
export function canTransitionTo(from: TaskState, to: TaskState): boolean {
  return VALID_TRANSITIONS.get(from)?.includes(to) ?? false;
}

/**
 * Return the list of states reachable from the given state.
 */
export function validTransitions(from: TaskState): readonly TaskState[] {
  return VALID_TRANSITIONS.get(from) ?? [];
}

/* ── Localisation helpers ─────────────────────────────────────────── */

/** Shorthand: build an en-GB-only EntityLocalizations from name + optional description. */
function loc(name: string, description?: string): EntityLocalizations {
  const entry = description !== undefined ? { name, description } : { name };
  return { "en-GB": entry };
}

/* ── Assignees ─────────────────────────────────────────────────────── */

const AVA: Assignee = { name: "Ava Chen", initials: "AC", role: "Tech Lead" };
const MARCUS: Assignee = { name: "Marcus Webb", initials: "MW", role: "Backend Eng" };
const PRIYA: Assignee = { name: "Priya Sharma", initials: "PS", role: "Frontend Eng" };
const TOMAS: Assignee = { name: "Tomás Herrera", initials: "TH", role: "DevOps Eng" };
const ELENA: Assignee = { name: "Elena Rossi", initials: "ER", role: "QA Engineer" };
const JAMES: Assignee = { name: "James Okafor", initials: "JO", role: "Platform Eng" };

/* ── Fixture tasks ─────────────────────────────────────────────────── */

export const TASKS: readonly Task[] = [
  {
    id: "TASK-1001",
    localizations: loc(
      "Implement Claude Code SDK agent backend",
      "Integrate the Claude Code SDK as a first-class agent backend, including turn lifecycle management and tool dispatch.",
    ),
    state: TaskState.InProgress,
    priority: Priority.High,
    projectSlug: "platform-api-v3",
    assignee: AVA,
    dueDate: "2026-03-18",
    estimate: "5 pts",
    labelIds: ["backend", "agent"],
    subtasks: [
      { id: "st-1", localizations: loc("Define agent adapter interface"), done: true },
      { id: "st-2", localizations: loc("Implement SDK client wrapper"), done: true },
      { id: "st-3", localizations: loc("Add turn lifecycle hooks"), done: false },
      { id: "st-4", localizations: loc("Write integration tests"), done: false },
    ],
    dependencies: { blockedBy: [], blocks: ["TASK-1003", "TASK-1005"] },
    branchRef: "feature/claude-sdk-backend",
    pullRequestRef: "#247",
    activityLog: [
      {
        id: "ev-1",
        kind: "state_change",
        timestamp: "2026-03-10T09:14:00Z",
        actor: "Ava Chen",
        localizations: loc("Moved from Draft to In Progress"),
      },
      {
        id: "ev-2",
        kind: "branch_associated",
        timestamp: "2026-03-10T09:15:00Z",
        actor: "Ava Chen",
        localizations: loc("Associated branch feature/claude-sdk-backend"),
      },
      {
        id: "ev-3",
        kind: "subtask_completed",
        timestamp: "2026-03-11T11:42:00Z",
        actor: "Ava Chen",
        localizations: loc("Completed: Define agent adapter interface"),
      },
    ],
    hierarchy: {
      goal: loc("Multi-agent orchestration"),
      idea: loc("Pluggable agent backends"),
      step: loc("SDK integration"),
    },
    relatedTasks: ["TASK-1002", "TASK-1003"],
  },
  {
    id: "TASK-1002",
    localizations: loc(
      "Design MCP tool registry schema",
      "Define the JSON schema for registering tools in the MCP tool registry, including capability declarations and access policies.",
    ),
    state: TaskState.InReview,
    priority: Priority.High,
    projectSlug: "platform-api-v3",
    assignee: MARCUS,
    dueDate: "2026-03-15",
    estimate: "3 pts",
    labelIds: ["backend", "schema"],
    subtasks: [
      { id: "st-5", localizations: loc("Draft JSON schema document"), done: true },
      { id: "st-6", localizations: loc("Add capability declarations"), done: true },
      { id: "st-7", localizations: loc("Define access policy shape"), done: true },
      { id: "st-8", localizations: loc("Review with team"), done: false },
    ],
    dependencies: { blockedBy: [], blocks: ["TASK-1004"] },
    branchRef: "feature/tool-registry-schema",
    pullRequestRef: "#251",
    activityLog: [
      {
        id: "ev-4",
        kind: "state_change",
        timestamp: "2026-03-12T14:30:00Z",
        actor: "Marcus Webb",
        localizations: loc("Moved from In Progress to In Review"),
      },
      {
        id: "ev-5",
        kind: "pr_opened",
        timestamp: "2026-03-12T14:32:00Z",
        actor: "Marcus Webb",
        localizations: loc("Opened PR #251 for review"),
      },
    ],
    hierarchy: {
      goal: loc("Multi-agent orchestration"),
      idea: loc("Pluggable agent backends"),
      step: loc("Tool registry"),
    },
    relatedTasks: ["TASK-1001", "TASK-1004"],
  },
  {
    id: "TASK-1003",
    localizations: loc(
      "Build hook execution engine",
      "Implement the server-side hook execution engine that runs pre/post hooks around agent turns and tool calls.",
    ),
    state: TaskState.Draft,
    priority: Priority.Medium,
    projectSlug: "platform-api-v3",
    assignee: JAMES,
    dueDate: "2026-03-25",
    estimate: "8 pts",
    labelIds: ["backend", "hooks"],
    subtasks: [
      { id: "st-9", localizations: loc("Define hook lifecycle events"), done: false },
      { id: "st-10", localizations: loc("Implement pre-hook runner"), done: false },
      { id: "st-11", localizations: loc("Implement post-hook runner"), done: false },
      { id: "st-12", localizations: loc("Add timeout/retry logic"), done: false },
    ],
    dependencies: { blockedBy: ["TASK-1001"], blocks: [] },
    branchRef: undefined,
    pullRequestRef: undefined,
    activityLog: [],
    hierarchy: {
      goal: loc("Multi-agent orchestration"),
      idea: loc("Governance layer"),
      step: loc("Hook system"),
    },
    relatedTasks: ["TASK-1001"],
  },
  {
    id: "TASK-1004",
    localizations: loc(
      "Implement tool access policy evaluator",
      "Build the policy evaluation engine that checks whether an agent is permitted to invoke a given tool based on the access policy configuration.",
    ),
    state: TaskState.Draft,
    priority: Priority.Medium,
    projectSlug: "platform-api-v3",
    assignee: MARCUS,
    dueDate: "2026-03-28",
    estimate: "5 pts",
    labelIds: ["backend", "policy"],
    subtasks: [],
    dependencies: { blockedBy: ["TASK-1002"], blocks: ["TASK-1008"] },
    branchRef: undefined,
    pullRequestRef: undefined,
    activityLog: [],
    hierarchy: {
      goal: loc("Multi-agent orchestration"),
      idea: loc("Governance layer"),
      step: loc("Policy engine"),
    },
    relatedTasks: ["TASK-1002"],
  },
  {
    id: "TASK-1005",
    localizations: loc(
      "Add SSE streaming for agent turns",
      "Implement server-sent events endpoint for streaming agent turn progress to the dashboard in real time.",
    ),
    state: TaskState.InProgress,
    priority: Priority.High,
    projectSlug: "platform-api-v3",
    assignee: TOMAS,
    dueDate: "2026-03-20",
    estimate: "5 pts",
    labelIds: ["backend", "streaming"],
    subtasks: [
      { id: "st-13", localizations: loc("Set up SSE endpoint"), done: true },
      { id: "st-14", localizations: loc("Implement event serialization"), done: true },
      { id: "st-15", localizations: loc("Add client reconnection logic"), done: false },
    ],
    dependencies: { blockedBy: ["TASK-1001"], blocks: ["TASK-1009"] },
    branchRef: "feature/sse-agent-turns",
    pullRequestRef: undefined,
    activityLog: [
      {
        id: "ev-6",
        kind: "state_change",
        timestamp: "2026-03-11T08:00:00Z",
        actor: "Tomás Herrera",
        localizations: loc("Moved from Draft to In Progress"),
      },
    ],
    hierarchy: {
      goal: loc("Real-time visibility"),
      idea: loc("Live dashboard"),
      step: loc("SSE infrastructure"),
    },
    relatedTasks: ["TASK-1001", "TASK-1009"],
  },
  {
    id: "TASK-1006",
    localizations: loc(
      "Design conversation thread UI",
      "Create the conversation detail view showing agent messages, tool call results, and handoff annotations.",
    ),
    state: TaskState.InProgress,
    priority: Priority.Medium,
    projectSlug: "mobile-app-v2",
    assignee: PRIYA,
    dueDate: "2026-03-22",
    estimate: "5 pts",
    labelIds: ["frontend", "ui"],
    subtasks: [
      { id: "st-16", localizations: loc("Message bubble component"), done: true },
      { id: "st-17", localizations: loc("Tool call expansion panel"), done: false },
      { id: "st-18", localizations: loc("Handoff annotation badge"), done: false },
    ],
    dependencies: { blockedBy: [], blocks: ["TASK-1010"] },
    branchRef: "feature/conversation-ui",
    pullRequestRef: undefined,
    activityLog: [
      {
        id: "ev-7",
        kind: "state_change",
        timestamp: "2026-03-09T10:00:00Z",
        actor: "Priya Sharma",
        localizations: loc("Moved from Draft to In Progress"),
      },
      {
        id: "ev-8",
        kind: "subtask_completed",
        timestamp: "2026-03-10T16:20:00Z",
        actor: "Priya Sharma",
        localizations: loc("Completed: Message bubble component"),
      },
    ],
    hierarchy: {
      goal: loc("Conversation audit trail"),
      idea: loc("Agent transparency"),
      step: loc("Conversation UI"),
    },
    relatedTasks: ["TASK-1010"],
  },
  {
    id: "TASK-1007",
    localizations: loc(
      "Set up Playwright E2E test harness",
      "Configure Playwright for end-to-end testing with Podman container support on Fedora/WSL2.",
    ),
    state: TaskState.Done,
    priority: Priority.Medium,
    projectSlug: "platform-api-v3",
    assignee: ELENA,
    dueDate: "2026-03-08",
    estimate: "3 pts",
    labelIds: ["testing", "devops"],
    subtasks: [
      { id: "st-19", localizations: loc("Write Podman wrapper script"), done: true },
      { id: "st-20", localizations: loc("Add axe-core integration"), done: true },
      { id: "st-21", localizations: loc("Create smoke test suite"), done: true },
    ],
    dependencies: { blockedBy: [], blocks: [] },
    branchRef: "feature/e2e-harness",
    pullRequestRef: "#238",
    activityLog: [
      {
        id: "ev-9",
        kind: "state_change",
        timestamp: "2026-03-08T17:00:00Z",
        actor: "Elena Rossi",
        localizations: loc("Moved from In Review to Done"),
      },
    ],
    hierarchy: {
      goal: loc("Quality infrastructure"),
      idea: loc("Automated testing"),
      step: loc("E2E setup"),
    },
    relatedTasks: [],
  },
  {
    id: "TASK-1008",
    localizations: loc(
      "Implement governance audit logging",
      "Record all policy evaluations, hook executions, and tool access decisions to an immutable audit log.",
    ),
    state: TaskState.Draft,
    priority: Priority.High,
    projectSlug: "platform-api-v3",
    assignee: JAMES,
    dueDate: "2026-04-01",
    estimate: "8 pts",
    labelIds: ["backend", "governance"],
    subtasks: [],
    dependencies: { blockedBy: ["TASK-1004"], blocks: [] },
    branchRef: undefined,
    pullRequestRef: undefined,
    activityLog: [],
    hierarchy: {
      goal: loc("Multi-agent orchestration"),
      idea: loc("Governance layer"),
      step: loc("Audit logging"),
    },
    relatedTasks: ["TASK-1004"],
  },
  {
    id: "TASK-1009",
    localizations: loc(
      "Build real-time dashboard widgets",
      "Create dashboard components that consume SSE events and render live KPI updates, agent status, and activity feed.",
    ),
    state: TaskState.Paused,
    priority: Priority.Medium,
    projectSlug: "mobile-app-v2",
    assignee: PRIYA,
    dueDate: "2026-03-28",
    estimate: "5 pts",
    labelIds: ["frontend", "dashboard"],
    subtasks: [
      { id: "st-22", localizations: loc("KPI card with live update"), done: true },
      { id: "st-23", localizations: loc("Agent status indicator"), done: false },
      { id: "st-24", localizations: loc("Activity feed auto-scroll"), done: false },
    ],
    dependencies: { blockedBy: ["TASK-1005"], blocks: [] },
    branchRef: "feature/live-dashboard",
    pullRequestRef: undefined,
    activityLog: [
      {
        id: "ev-10",
        kind: "state_change",
        timestamp: "2026-03-11T15:00:00Z",
        actor: "Priya Sharma",
        localizations: loc("Paused — waiting for SSE endpoint"),
      },
    ],
    hierarchy: {
      goal: loc("Real-time visibility"),
      idea: loc("Live dashboard"),
      step: loc("Dashboard widgets"),
    },
    relatedTasks: ["TASK-1005"],
  },
  {
    id: "TASK-1010",
    localizations: loc(
      "Add slash command parser",
      "Implement a parser for slash commands in the conversation input (/run, /approve, /reject, /escalate) with auto-complete.",
    ),
    state: TaskState.Draft,
    priority: Priority.Low,
    projectSlug: "mobile-app-v2",
    assignee: PRIYA,
    dueDate: "2026-04-05",
    estimate: "3 pts",
    labelIds: ["frontend", "parser"],
    subtasks: [],
    dependencies: { blockedBy: ["TASK-1006"], blocks: [] },
    branchRef: undefined,
    pullRequestRef: undefined,
    activityLog: [],
    hierarchy: {
      goal: loc("Conversation audit trail"),
      idea: loc("Agent transparency"),
      step: loc("Command interface"),
    },
    relatedTasks: ["TASK-1006"],
  },
  {
    id: "TASK-1011",
    localizations: loc(
      "Configure tenant isolation boundaries",
      "Set up namespace-level isolation ensuring agent backends, tools, and hooks are scoped to tenant boundaries.",
    ),
    state: TaskState.InProgress,
    priority: Priority.Critical,
    projectSlug: "data-pipeline-upgrade",
    assignee: TOMAS,
    dueDate: "2026-03-14",
    estimate: "8 pts",
    labelIds: ["devops", "security"],
    subtasks: [
      { id: "st-25", localizations: loc("Define namespace schema"), done: true },
      { id: "st-26", localizations: loc("Implement scope middleware"), done: true },
      { id: "st-27", localizations: loc("Add cross-tenant guard tests"), done: false },
    ],
    dependencies: { blockedBy: [], blocks: ["TASK-1012"] },
    branchRef: "feature/tenant-isolation",
    pullRequestRef: "#260",
    activityLog: [
      {
        id: "ev-11",
        kind: "agent_action",
        timestamp: "2026-03-12T10:30:00Z",
        actor: "claude_code_sdk",
        localizations: loc("Generated namespace isolation middleware"),
      },
    ],
    hierarchy: {
      goal: loc("Production readiness"),
      idea: loc("Multi-tenancy"),
      step: loc("Isolation boundaries"),
    },
    relatedTasks: ["TASK-1012"],
  },
  {
    id: "TASK-1012",
    localizations: loc(
      "Write tenant onboarding automation",
      "Automate tenant provisioning: create namespace, seed default hooks/policies, register initial agent backend.",
    ),
    state: TaskState.Draft,
    priority: Priority.Medium,
    projectSlug: "data-pipeline-upgrade",
    assignee: TOMAS,
    dueDate: "2026-04-10",
    estimate: "5 pts",
    labelIds: ["devops", "automation"],
    subtasks: [],
    dependencies: { blockedBy: ["TASK-1011"], blocks: [] },
    branchRef: undefined,
    pullRequestRef: undefined,
    activityLog: [],
    hierarchy: {
      goal: loc("Production readiness"),
      idea: loc("Multi-tenancy"),
      step: loc("Onboarding flow"),
    },
    relatedTasks: ["TASK-1011"],
  },
  {
    id: "TASK-1013",
    localizations: loc(
      "Implement Kanban board drag-and-drop",
      "Add accessible drag-and-drop to the Kanban board with keyboard support (select, Enter, arrow, Enter).",
    ),
    state: TaskState.InProgress,
    priority: Priority.Medium,
    projectSlug: "mobile-app-v2",
    assignee: PRIYA,
    dueDate: "2026-03-24",
    estimate: "5 pts",
    labelIds: ["frontend", "a11y"],
    subtasks: [
      { id: "st-28", localizations: loc("Drag handle component"), done: true },
      { id: "st-29", localizations: loc("Drop zone highlighting"), done: false },
      { id: "st-30", localizations: loc("Keyboard navigation path"), done: false },
    ],
    dependencies: { blockedBy: [], blocks: [] },
    branchRef: "feature/kanban-dnd",
    pullRequestRef: undefined,
    activityLog: [
      {
        id: "ev-12",
        kind: "comment",
        timestamp: "2026-03-11T14:00:00Z",
        actor: "Ava Chen",
        localizations: loc("Ensure WCAG 2.1.1 keyboard-only path is complete"),
      },
    ],
    hierarchy: {
      goal: loc("Project management"),
      idea: loc("Visual workflow"),
      step: loc("Kanban interactions"),
    },
    relatedTasks: [],
  },
  {
    id: "TASK-1014",
    localizations: loc(
      "Add monitoring dashboard for agent health",
      "Build the system monitoring page showing agent backend health checks, response latency P95, and error rates.",
    ),
    state: TaskState.Abandoned,
    priority: Priority.Low,
    projectSlug: "data-pipeline-upgrade",
    assignee: ELENA,
    dueDate: "2026-03-12",
    estimate: "3 pts",
    labelIds: ["frontend", "monitoring"],
    subtasks: [],
    dependencies: { blockedBy: [], blocks: [] },
    branchRef: undefined,
    pullRequestRef: undefined,
    activityLog: [
      {
        id: "ev-13",
        kind: "state_change",
        timestamp: "2026-03-12T09:00:00Z",
        actor: "Elena Rossi",
        localizations: loc("Abandoned — superseded by TASK-1009"),
      },
    ],
    hierarchy: {
      goal: loc("Real-time visibility"),
      idea: loc("System monitoring"),
      step: loc("Health dashboard"),
    },
    relatedTasks: ["TASK-1009"],
  },
  {
    id: "TASK-1015",
    localizations: loc(
      "Design settings page layout",
      "Create the application settings page with sections for appearance, authentication, integrations, and workspace config.",
    ),
    state: TaskState.Done,
    priority: Priority.Low,
    projectSlug: "mobile-app-v2",
    assignee: PRIYA,
    dueDate: "2026-03-10",
    estimate: "2 pts",
    labelIds: ["frontend", "settings"],
    subtasks: [
      { id: "st-31", localizations: loc("Appearance section"), done: true },
      { id: "st-32", localizations: loc("Authentication section"), done: true },
      { id: "st-33", localizations: loc("Integrations section"), done: true },
    ],
    dependencies: { blockedBy: [], blocks: [] },
    branchRef: "feature/settings-layout",
    pullRequestRef: "#242",
    activityLog: [
      {
        id: "ev-14",
        kind: "state_change",
        timestamp: "2026-03-10T16:00:00Z",
        actor: "Priya Sharma",
        localizations: loc("Moved from In Review to Done"),
      },
    ],
    hierarchy: {
      goal: loc("User experience"),
      idea: loc("Configurable workspace"),
      step: loc("Settings UI"),
    },
    relatedTasks: [],
  },
  {
    id: "TASK-1016",
    localizations: loc(
      "Integrate Codex CLI agent backend",
      "Add OpenAI Codex CLI as a second agent backend option alongside Claude Code SDK.",
    ),
    state: TaskState.InReview,
    priority: Priority.Medium,
    projectSlug: "platform-api-v3",
    assignee: MARCUS,
    dueDate: "2026-03-17",
    estimate: "5 pts",
    labelIds: ["backend", "agent"],
    subtasks: [
      { id: "st-34", localizations: loc("Implement Codex adapter"), done: true },
      { id: "st-35", localizations: loc("Map tool schemas to Codex format"), done: true },
      { id: "st-36", localizations: loc("Add health check endpoint"), done: true },
    ],
    dependencies: { blockedBy: [], blocks: [] },
    branchRef: "feature/codex-backend",
    pullRequestRef: "#258",
    activityLog: [
      {
        id: "ev-15",
        kind: "state_change",
        timestamp: "2026-03-13T09:00:00Z",
        actor: "Marcus Webb",
        localizations: loc("Moved from In Progress to In Review"),
      },
    ],
    hierarchy: {
      goal: loc("Multi-agent orchestration"),
      idea: loc("Pluggable agent backends"),
      step: loc("Codex integration"),
    },
    relatedTasks: ["TASK-1001"],
  },
];

/** Look up a task by its ID. Returns undefined if not found. */
export function findTask(id: string): Task | undefined {
  return TASKS.find((t) => t.id === id);
}
