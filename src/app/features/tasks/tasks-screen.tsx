/** @file My Tasks screen — filterable task queue. */

import { IconCalendar, IconFilter, IconFilterOff } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { JSX } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Priority, TASKS, type Task, TaskState } from "../../../data/tasks";
import { AvatarStack } from "../../components/avatar-stack";
import { PriorityTag } from "../../components/priority-tag";
import { StatusBadge } from "../../components/status-badge";

/* ── Filter types ─────────────────────────────────────────────────── */

type StateFilter = TaskState | "all";
type PriorityFilter = Priority | "all";
type ProjectFilter = string | "all";

/* ── Unique project names ─────────────────────────────────────────── */

const PROJECTS: readonly string[] = [...new Set(TASKS.map((t) => t.project))];

/* ── Unique project slugs (for key derivation) ────────────────────── */

const PROJECT_SLUGS = new Map(TASKS.map((t) => [t.project, t.projectSlug]));

/* ── Filter chip ──────────────────────────────────────────────────── */

interface FilterChipProps<T extends string> {
  readonly label: string;
  readonly value: T;
  readonly selected: boolean;
  readonly onSelect: (value: T) => void;
}

function FilterChip<T extends string>({
  label,
  value,
  selected,
  onSelect,
}: FilterChipProps<T>): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`rounded-full px-3 py-1 text-[length:var(--font-size-xs)] font-semibold transition-colors ${
        selected
          ? "bg-primary text-primary-content"
          : "bg-base-200 text-base-content/80 hover:bg-base-300"
      }`}
    >
      {label}
    </button>
  );
}

/* ── State / priority default labels ─────────────────────────────── */

const STATE_DEFAULTS: Record<TaskState, string> = {
  [TaskState.Draft]: "Draft",
  [TaskState.InProgress]: "In Progress",
  [TaskState.InReview]: "In Review",
  [TaskState.Paused]: "Paused",
  [TaskState.Done]: "Done",
  [TaskState.Abandoned]: "Abandoned",
};

const PRIORITY_DEFAULTS: Record<Priority, string> = {
  [Priority.Critical]: "Critical",
  [Priority.High]: "High",
  [Priority.Medium]: "Medium",
  [Priority.Low]: "Low",
};

/* ── Task row ─────────────────────────────────────────────────────── */

function formatDueDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function TaskRow({ task }: { readonly task: Task }): JSX.Element {
  const { t } = useTranslation();
  const taskId = task.id.toLowerCase();

  return (
    <Link
      to="/tasks/$id"
      params={{ id: task.id }}
      className="flex flex-col gap-2 border-b border-base-300/50 px-4 py-3 transition-colors hover:bg-base-200/50 sm:flex-row sm:items-center sm:gap-4"
    >
      {/* Status badge */}
      <div className="w-28 shrink-0">
        <StatusBadge state={task.state} />
      </div>

      {/* Title + project + ID */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold text-base-content">
          {t(`${taskId}-title`, { defaultValue: task.title })}
        </p>
        <p className="mt-0.5 text-[length:var(--font-size-xs)] text-base-content/60">
          {t(`project-${task.projectSlug}`, { defaultValue: task.project })}{" "}
          <span className="font-[family-name:var(--font-mono)]">{task.id}</span>
        </p>
      </div>

      {/* Priority */}
      <div className="shrink-0">
        <PriorityTag priority={task.priority} />
      </div>

      {/* Due date */}
      <div className="flex shrink-0 items-center gap-1 text-[length:var(--font-size-xs)] text-base-content/60">
        <IconCalendar size={14} stroke={1.5} aria-hidden="true" />
        <time dateTime={task.dueDate}>{formatDueDate(task.dueDate)}</time>
      </div>

      {/* Assignee */}
      <div className="shrink-0">
        <AvatarStack assignees={[task.assignee]} />
      </div>
    </Link>
  );
}

/* ── Tasks screen ─────────────────────────────────────────────────── */

export function TasksScreen(): JSX.Element {
  const { t } = useTranslation();

  const [stateFilter, setStateFilter] = useState<StateFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>("all");

  const hasFilters = stateFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all";

  const filtered = TASKS.filter((task) => {
    if (stateFilter !== "all" && task.state !== stateFilter) return false;
    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
    if (projectFilter !== "all" && task.project !== projectFilter) return false;
    return true;
  });

  const resetFilters = (): void => {
    setStateFilter("all");
    setPriorityFilter("all");
    setProjectFilter("all");
  };

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {t("page-my-tasks", { defaultValue: "My Tasks" })}
      </h1>

      {/* Filter bar */}
      <section
        aria-label={t("task-filter-region", { defaultValue: "Task filters" })}
        className="card mb-6 border border-base-300 bg-base-100 shadow-sm"
      >
        <div className="card-body gap-3 p-4">
          {/* State filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              <IconFilter size={14} stroke={1.5} aria-hidden="true" />
              {t("task-filter-state", { defaultValue: "State" })}
            </span>
            <FilterChip
              label={t("task-filter-all", { defaultValue: "All" })}
              value="all"
              selected={stateFilter === "all"}
              onSelect={setStateFilter}
            />
            {Object.values(TaskState).map((s) => (
              <FilterChip
                key={s}
                label={t(`task-state-${s.replace(/_/g, "-")}`, {
                  defaultValue: STATE_DEFAULTS[s],
                })}
                value={s}
                selected={stateFilter === s}
                onSelect={setStateFilter}
              />
            ))}
          </div>

          {/* Priority filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {t("task-filter-priority", { defaultValue: "Priority" })}
            </span>
            <FilterChip
              label={t("task-filter-all", { defaultValue: "All" })}
              value="all"
              selected={priorityFilter === "all"}
              onSelect={setPriorityFilter}
            />
            {Object.values(Priority).map((p) => (
              <FilterChip
                key={p}
                label={t(`task-priority-${p}`, { defaultValue: PRIORITY_DEFAULTS[p] })}
                value={p}
                selected={priorityFilter === p}
                onSelect={setPriorityFilter}
              />
            ))}
          </div>

          {/* Project filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {t("task-filter-project", { defaultValue: "Project" })}
            </span>
            <FilterChip
              label={t("task-filter-all", { defaultValue: "All" })}
              value="all"
              selected={projectFilter === "all"}
              onSelect={setProjectFilter}
            />
            {PROJECTS.map((p) => (
              <FilterChip
                key={p}
                label={t(`project-${PROJECT_SLUGS.get(p) ?? p}`, { defaultValue: p })}
                value={p}
                selected={projectFilter === p}
                onSelect={setProjectFilter}
              />
            ))}
          </div>

          {/* Reset */}
          {hasFilters ? (
            <div>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-[length:var(--font-size-xs)] font-semibold text-primary hover:text-primary/80"
              >
                <IconFilterOff size={14} stroke={1.5} aria-hidden="true" />
                {t("task-filter-reset", { defaultValue: "Reset filters" })}
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {/* Task list */}
      <section
        aria-label={t("task-list-region", { defaultValue: "Task list" })}
        className="card border border-base-300 bg-base-100 shadow-sm"
      >
        <div className="card-body p-0">
          {/* Summary header */}
          <div className="border-b border-base-300 px-4 py-3">
            <p className="text-[length:var(--font-size-sm)] text-base-content/60">
              {t("task-list-summary", {
                shown: String(filtered.length),
                total: String(TASKS.length),
                defaultValue: `Showing ${String(filtered.length)} of ${String(TASKS.length)} tasks`,
              })}
            </p>
          </div>

          {/* Rows */}
          {filtered.length > 0 ? (
            <ul>
              {filtered.map((task) => (
                <li key={task.id}>
                  <TaskRow task={task} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-12 text-center">
              <p className="text-[length:var(--font-size-sm)] text-base-content/60">
                {t("task-list-empty", { defaultValue: "No tasks match the current filters." })}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
