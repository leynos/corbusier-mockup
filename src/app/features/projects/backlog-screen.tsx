/** @file Backlog screen — table of unscheduled tasks for a project.
 *
 * Renders the ProjectHeader with view switcher tabs, followed by a
 * simple table listing all draft tasks with their priority, title,
 * assignee, and due date.
 */

import { Navigate, useParams } from "@tanstack/react-router";
import type { JSX } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { findProject, getTasksForProject } from "../../../data/projects";
import { TASKS, TaskState } from "../../../data/tasks";
import { PriorityTag } from "../../components/priority-tag";
import { pickLocalization } from "../../domain/entities/localization";
import { formatShortDate } from "../../utils/date-formatting";
import { ProjectHeader } from "./project-landing-screen";

export function BacklogScreen(): JSX.Element {
  const { slug } = useParams({ strict: false });
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;

  const project = slug ? findProject(slug) : undefined;

  const draftTasks = useMemo(() => {
    if (!slug) return [];
    return getTasksForProject(slug, TASKS).filter((task) => task.state === TaskState.Draft);
  }, [slug]);

  if (!slug || !project) {
    return <Navigate to="/projects" />;
  }

  return (
    <div>
      <ProjectHeader slug={slug} />

      <div className="overflow-x-auto">
        <table className="w-full text-[length:var(--font-size-sm)]">
          <thead>
            <tr className="border-b border-base-300 text-left">
              <th className="pb-2 pr-4 font-[family-name:var(--font-display)] font-semibold text-base-content/60">
                {t("backlog-col-priority", { defaultValue: "Priority" })}
              </th>
              <th className="pb-2 pr-4 font-[family-name:var(--font-display)] font-semibold text-base-content/60">
                {t("backlog-col-task", { defaultValue: "Task" })}
              </th>
              <th className="pb-2 pr-4 font-[family-name:var(--font-display)] font-semibold text-base-content/60">
                {t("backlog-col-assignee", { defaultValue: "Assignee" })}
              </th>
              <th className="pb-2 font-[family-name:var(--font-display)] font-semibold text-base-content/60">
                {t("backlog-col-due", { defaultValue: "Due" })}
              </th>
            </tr>
          </thead>
          <tbody>
            {draftTasks.map((task) => (
              <tr key={task.id} className="border-b border-base-300/50">
                <td className="py-2.5 pr-4">
                  <PriorityTag priority={task.priority} />
                </td>
                <td className="py-2.5 pr-4 text-base-content">
                  {pickLocalization(task.localizations, locale).name}
                </td>
                <td className="py-2.5 pr-4 text-base-content/60">{task.assignee.name}</td>
                <td className="py-2.5 text-base-content/60">
                  <time dateTime={task.dueDate}>{formatShortDate(task.dueDate, locale)}</time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
