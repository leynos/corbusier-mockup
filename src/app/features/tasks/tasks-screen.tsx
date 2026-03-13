/** @file My Tasks screen — filterable task queue. */

import { IconCalendar, IconFilter, IconFilterOff } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { JSX } from "react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  PROJECT_SLUGS,
  priorityDescriptors,
  projectDescriptors,
  taskStateDescriptors,
} from "../../../data/registries";
import type { ProjectSlug } from "../../../data/registries/project-descriptors";
import { Priority, TASKS, type Task, TaskState } from "../../../data/tasks";
import { AvatarStack } from "../../components/avatar-stack";
import { PriorityTag } from "../../components/priority-tag";
import { StatusBadge } from "../../components/status-badge";
import { pickLocalization } from "../../domain/entities/localization";
import { formatShortDate } from "../../utils/date-formatting";

/* ── Filter types ─────────────────────────────────────────────────── */

type StateFilter = TaskState | "all";
type PriorityFilter = Priority | "all";
type ProjectFilter = ProjectSlug | "all";

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
      aria-pressed={selected}
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

interface FilterOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

interface FilterGroupProps<T extends string> {
  readonly label: string;
  readonly icon?: JSX.Element;
  readonly value: T;
  readonly onChange: (value: T) => void;
  readonly options: readonly FilterOption<T>[];
}

function FilterGroup<T extends string>({
  label,
  icon,
  value,
  onChange,
  options,
}: FilterGroupProps<T>): JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1 text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
        {icon}
        {label}
      </span>
      {options.map((option) => (
        <FilterChip
          key={option.value}
          label={option.label}
          value={option.value}
          selected={value === option.value}
          onSelect={onChange}
        />
      ))}
    </div>
  );
}

interface TaskFilters {
  readonly stateFilter: StateFilter;
  readonly priorityFilter: PriorityFilter;
  readonly projectFilter: ProjectFilter;
}

function taskMatchesFilters(task: Task, filters: TaskFilters): boolean {
  if (filters.stateFilter !== "all" && task.state !== filters.stateFilter) return false;
  if (filters.priorityFilter !== "all" && task.priority !== filters.priorityFilter) return false;
  if (filters.projectFilter !== "all" && task.projectSlug !== filters.projectFilter) return false;
  return true;
}

function buildStateOptions(locale: string, allLabel: string): readonly FilterOption<StateFilter>[] {
  return [
    { value: "all", label: allLabel },
    ...Object.values(TaskState).map((state) => ({
      value: state,
      label: pickLocalization(taskStateDescriptors[state].localizations, locale).name,
    })),
  ];
}

function buildPriorityOptions(
  locale: string,
  allLabel: string,
): readonly FilterOption<PriorityFilter>[] {
  return [
    { value: "all", label: allLabel },
    ...Object.values(Priority).map((priority) => ({
      value: priority,
      label: pickLocalization(priorityDescriptors[priority].localizations, locale).name,
    })),
  ];
}

function buildProjectOptions(
  locale: string,
  allLabel: string,
): readonly FilterOption<ProjectFilter>[] {
  return [
    { value: "all", label: allLabel },
    ...PROJECT_SLUGS.map((slug) => ({
      value: slug,
      label: pickLocalization(projectDescriptors[slug].localizations, locale).name,
    })),
  ];
}

function TaskRow({ task }: { readonly task: Task }): JSX.Element {
  const { i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;

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
          {pickLocalization(task.localizations, locale).name}
        </p>
        <p className="mt-0.5 text-[length:var(--font-size-xs)] text-base-content/60">
          {pickLocalization(projectDescriptors[task.projectSlug].localizations, locale).name}{" "}
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
        <time dateTime={task.dueDate}>{formatShortDate(task.dueDate, locale)}</time>
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
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;

  const [stateFilter, setStateFilter] = useState<StateFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>("all");
  const filters: TaskFilters = { stateFilter, priorityFilter, projectFilter };

  const hasFilters = stateFilter !== "all" || priorityFilter !== "all" || projectFilter !== "all";
  const filtered = TASKS.filter((task) => taskMatchesFilters(task, filters));

  const resetFilters = (): void => {
    setStateFilter("all");
    setPriorityFilter("all");
    setProjectFilter("all");
  };

  const allLabel = t("task-filter-all", { defaultValue: "All" });
  const stateOptions = useMemo(() => buildStateOptions(locale, allLabel), [allLabel, locale]);
  const priorityOptions = useMemo(() => buildPriorityOptions(locale, allLabel), [allLabel, locale]);
  const projectOptions = useMemo(() => buildProjectOptions(locale, allLabel), [allLabel, locale]);

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
          <FilterGroup
            label={t("task-filter-state", { defaultValue: "State" })}
            icon={<IconFilter size={14} stroke={1.5} aria-hidden="true" />}
            value={stateFilter}
            onChange={setStateFilter}
            options={stateOptions}
          />
          <FilterGroup
            label={t("task-filter-priority", { defaultValue: "Priority" })}
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={priorityOptions}
          />
          <FilterGroup
            label={t("task-filter-project", { defaultValue: "Project" })}
            value={projectFilter}
            onChange={setProjectFilter}
            options={projectOptions}
          />

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
                shown: filtered.length,
                total: TASKS.length,
                defaultValue: "Showing {{shown}} of {{total}} tasks",
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
