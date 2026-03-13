/** @file Project domain model and fixture data.
 *
 * Defines the Project entity and three fixture projects that align with
 * the sidebar navigation entries. The `groupTasksByState` helper derives
 * Kanban column buckets and count summaries from the task fixture data.
 *
 * Entity strings live in `localizations` maps per the data model-driven
 * card architecture. Fluent retains only UI chrome.
 */

import type { EntityLocalizations } from "../app/domain/entities/localization";
import { loc } from "./localization-helpers";
import type { ProjectSlug } from "./registries/project-descriptors";
import { type Assignee, type Task, type TaskId, TaskState } from "./tasks";

/* ── Kanban column identifiers ────────────────────────────────────── */

export type KanbanColumnId = "todo" | "planned" | "in_progress" | "in_review" | "done";

/* ── Project interface ────────────────────────────────────────────── */

export interface Project {
  readonly slug: ProjectSlug;
  readonly localizations: EntityLocalizations;
  readonly lead: Assignee;
  readonly dateRange: { readonly start: string; readonly end: string };
  readonly status: "active" | "inactive" | "completed";
  readonly team: readonly Assignee[];
}

/* ── Assignees ────────────────────────────────────────────────────── */

const AVA: Assignee = { name: "Ava Chen", initials: "AC", role: "Tech Lead" };
const MARCUS: Assignee = { name: "Marcus Webb", initials: "MW", role: "Backend Eng" };
const PRIYA: Assignee = { name: "Priya Sharma", initials: "PS", role: "Frontend Eng" };
const TOMAS: Assignee = { name: "Tomás Herrera", initials: "TH", role: "DevOps Eng" };
const ELENA: Assignee = { name: "Elena Rossi", initials: "ER", role: "QA Engineer" };
const JAMES: Assignee = { name: "James Okafor", initials: "JO", role: "Platform Eng" };

/* ── Fixture projects ─────────────────────────────────────────────── */

export const PROJECT_FIXTURES: readonly Project[] = [
  {
    slug: "apollo-guidance",
    localizations: loc(
      "Apollo-Guidance",
      "Space navigation system — multi-agent orchestration platform with pluggable backends and governance layer.",
    ),
    lead: AVA,
    dateRange: { start: "2026-02-01", end: "2026-05-30" },
    status: "active",
    team: [AVA, MARCUS, TOMAS, JAMES, ELENA],
  },
  {
    slug: "manhattan-logistics",
    localizations: loc(
      "Manhattan-Logistics",
      "Supply chain orchestration — conversation UI, real-time dashboards, and Kanban workflow tooling.",
    ),
    lead: PRIYA,
    dateRange: { start: "2026-01-15", end: "2026-06-15" },
    status: "active",
    team: [PRIYA, ELENA],
  },
  {
    slug: "skunkworks-alpha",
    localizations: loc(
      "Skunkworks-Alpha",
      "Experimental agent framework — tenant isolation, onboarding automation, and monitoring infrastructure.",
    ),
    lead: TOMAS,
    dateRange: { start: "2026-03-01", end: "2026-08-01" },
    status: "active",
    team: [TOMAS, ELENA],
  },
];

/* ── Helpers ──────────────────────────────────────────────────────── */

/** Find a project by slug. */
export function findProject(slug: ProjectSlug): Project | undefined {
  return PROJECT_FIXTURES.find((p) => p.slug === slug);
}

/** Filter tasks belonging to a given project. */
export function getTasksForProject(
  projectSlug: ProjectSlug,
  tasks: readonly Task[],
): readonly Task[] {
  return tasks.filter((t) => t.projectSlug === projectSlug);
}

/** Empty bucket set for task-state grouping. */
function createEmptyBuckets(): Record<TaskState, Task[]> {
  return {
    [TaskState.Draft]: [],
    [TaskState.InProgress]: [],
    [TaskState.InReview]: [],
    [TaskState.Paused]: [],
    [TaskState.Done]: [],
    [TaskState.Abandoned]: [],
  };
}

export interface KanbanColumnCounts {
  readonly todo: number;
  readonly planned: number;
  readonly in_progress: number;
  readonly in_review: number;
  readonly done: number;
}

export interface DraftTaskBuckets {
  readonly todo: readonly Task[];
  readonly planned: readonly Task[];
}

function createTaskLookup(tasks: readonly Task[]): ReadonlyMap<TaskId, Task> {
  return new Map(tasks.map((task) => [task.id, task]));
}

function isTaskBlocked(task: Task, taskLookup: ReadonlyMap<TaskId, Task>): boolean {
  return task.dependencies.blockedBy.some((dependencyId) => {
    const dependency = taskLookup.get(dependencyId);
    return dependency !== undefined && dependency.state !== TaskState.Done;
  });
}

/**
 * Whether a draft task has been planned.
 *
 * Drafts with subtasks count as planned unless an unfinished dependency
 * still blocks them, in which case they remain in the "To-Do" column.
 */
export function isDraftPlanned(task: Task, taskLookup: ReadonlyMap<TaskId, Task>): boolean {
  return task.subtasks.length > 0 && !isTaskBlocked(task, taskLookup);
}

export function splitDraftTasks(
  drafts: readonly Task[],
  taskLookup: ReadonlyMap<TaskId, Task>,
): DraftTaskBuckets {
  const todo: Task[] = [];
  const planned: Task[] = [];

  for (const task of drafts) {
    if (isDraftPlanned(task, taskLookup)) {
      planned.push(task);
      continue;
    }
    todo.push(task);
  }

  return { todo, planned };
}

/** Derive column counts from grouped task buckets. */
function countByColumn(
  grouped: Record<TaskState, readonly Task[]>,
  draftBuckets: DraftTaskBuckets,
): KanbanColumnCounts {
  const planned = draftBuckets.planned.length;
  const todo = draftBuckets.todo.length;

  return {
    todo,
    planned,
    in_progress: grouped[TaskState.InProgress].length,
    in_review: grouped[TaskState.InReview].length,
    done: grouped[TaskState.Done].length,
  };
}

export interface GroupedTasks {
  readonly grouped: Record<TaskState, readonly Task[]>;
  readonly draftBuckets: DraftTaskBuckets;
  readonly taskCounts: KanbanColumnCounts;
  readonly totalTasks: number;
  readonly blockedCount: number;
  readonly inProgressCount: number;
}

/**
 * Group a project's tasks by state and derive summary counts.
 *
 * `paused` and `abandoned` tasks are included in the grouped buckets
 * and total count but excluded from the Kanban column counts.
 */
export function groupTasksByState(projectSlug: ProjectSlug, tasks: readonly Task[]): GroupedTasks {
  const projectTasks = getTasksForProject(projectSlug, tasks);
  const buckets = createEmptyBuckets();
  const taskLookup = createTaskLookup(projectTasks);

  for (const task of projectTasks) {
    buckets[task.state].push(task);
  }

  const draftBuckets = splitDraftTasks(buckets[TaskState.Draft], taskLookup);
  const blockedCount = projectTasks.filter((task) => isTaskBlocked(task, taskLookup)).length;
  const inProgressCount = buckets[TaskState.InProgress].length;

  return {
    grouped: buckets,
    draftBuckets,
    taskCounts: countByColumn(buckets, draftBuckets),
    totalTasks: projectTasks.length,
    blockedCount,
    inProgressCount,
  };
}
