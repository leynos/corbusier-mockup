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
import { TASKS } from "../../../data/tasks";
import { pickLocalization } from "../../domain/entities/localization";
import { ProjectHeader } from "./project-landing-screen";

/** Compute a percentage offset for a date within a range. */
function dateToPercent(date: string, rangeStart: number, rangeSpan: number): number {
  const ms = new Date(date).getTime();
  return Math.max(0, Math.min(100, ((ms - rangeStart) / rangeSpan) * 100));
}

export function TimelineScreen(): JSX.Element {
  const { slug } = useParams({ strict: false });
  const { i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;

  const project = slug ? findProject(slug) : undefined;

  const { tasks, rangeStart, rangeSpan } = useMemo(() => {
    if (!slug || !project) {
      return { tasks: [], rangeStart: 0, rangeSpan: 1 };
    }
    const projectTasks = getTasksForProject(slug, TASKS);
    const start = new Date(project.dateRange.start).getTime();
    const end = new Date(project.dateRange.end).getTime();
    return {
      tasks: projectTasks,
      rangeStart: start,
      rangeSpan: end - start || 1,
    };
  }, [slug, project]);

  if (!slug || !project) {
    return <Navigate to="/projects" />;
  }

  return (
    <div>
      <ProjectHeader slug={slug} />

      <div className="space-y-2">
        {tasks.map((task) => {
          const loc = pickLocalization(task.localizations, locale);
          const left = dateToPercent(task.dueDate, rangeStart, rangeSpan);
          const barWidth = Math.max(8, 100 - left);

          return (
            <div key={task.id} className="flex items-center gap-3">
              <span className="w-36 shrink-0 truncate text-[length:var(--font-size-sm)] text-base-content/70">
                {loc.name}
              </span>
              <div className="relative h-6 flex-1 rounded bg-base-300/20">
                <div
                  className="absolute inset-y-0 rounded bg-primary/30"
                  style={{ left: `${String(left)}%`, width: `${String(barWidth)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
