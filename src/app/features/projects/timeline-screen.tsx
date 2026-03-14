/** @file Timeline screen — horizontal bar chart of task durations.
 *
 * Renders the ProjectHeader with view switcher tabs, followed by a
 * Gantt-style bar chart showing each task as a horizontal bar
 * positioned along a date axis.
 */

import { Navigate, useParams } from "@tanstack/react-router";
import type { JSX } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { findProject, getTasksForProject } from "../../../data/projects";
import { parseProjectSlug } from "../../../data/registries/project-descriptors";
import { TASKS } from "../../../data/tasks";
import { pickLocalization } from "../../domain/entities/localization";
import { formatShortDate } from "../../utils/date-formatting";
import { ProjectHeader } from "./project-header";

/** Compute a percentage offset for a date within a range. */
function dateToPercent(date: string, rangeStart: number, rangeSpan: number): number {
  const ms = new Date(date).getTime();
  return Math.max(0, Math.min(100, ((ms - rangeStart) / rangeSpan) * 100));
}

export function TimelineScreen(): JSX.Element {
  const { slug } = useParams({ strict: false });
  const { i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const projectSlug = slug ? parseProjectSlug(slug) : undefined;

  const project = projectSlug ? findProject(projectSlug) : undefined;

  const { tasks, rangeStart, rangeSpan } = useMemo(() => {
    if (!projectSlug || !project) {
      return { tasks: [], rangeStart: 0, rangeSpan: 1 };
    }
    const projectTasks = getTasksForProject(projectSlug, TASKS);
    const start = new Date(project.dateRange.start).getTime();
    const end = new Date(project.dateRange.end).getTime();
    return {
      tasks: projectTasks,
      rangeStart: start,
      rangeSpan: end - start || 1,
    };
  }, [project, projectSlug]);

  if (!projectSlug || !project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div>
      <ProjectHeader slug={projectSlug} />

      <div className="space-y-2">
        {tasks.map((task) => {
          const loc = pickLocalization(task.localizations, locale);
          const left = dateToPercent(task.dueDate, rangeStart, rangeSpan);
          const dueDateLabel = formatShortDate(task.dueDate, locale);
          const taskLabelId = `timeline-task-${task.id}`;
          const taskDueDateId = `timeline-task-due-${task.id}`;

          return (
            <div key={task.id} className="flex items-center gap-3">
              <div className="w-36 shrink-0">
                <span
                  id={taskLabelId}
                  className="block truncate text-[length:var(--font-size-sm)] text-base-content/70"
                >
                  {loc.name}
                </span>
                <time
                  id={taskDueDateId}
                  dateTime={task.dueDate}
                  className="block text-[length:var(--font-size-xs)] text-base-content/50"
                >
                  {dueDateLabel}
                </time>
              </div>
              <div
                role="img"
                className="relative h-6 flex-1 rounded bg-base-300/20"
                aria-labelledby={`${taskLabelId} ${taskDueDateId}`}
              >
                <div
                  className="absolute inset-y-1 w-3 -translate-x-1/2 rounded-full bg-primary/40"
                  style={{ left: `${String(left)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
