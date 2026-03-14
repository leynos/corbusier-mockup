/** @file List view screen — dense table of all project tasks.
 *
 * Renders the ProjectHeader with view switcher tabs, followed by a
 * table showing all tasks with sortable column headers (visual only),
 * status, priority, assignee, and due date.
 */

import { Navigate, useParams } from "@tanstack/react-router";
import type { JSX } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { findProject, getTasksForProject } from "../../../data/projects";
import { parseProjectSlug } from "../../../data/registries/project-descriptors";
import { TASKS } from "../../../data/tasks";
import { PriorityTag } from "../../components/priority-tag";
import { StatusBadge } from "../../components/status-badge";
import { pickLocalization } from "../../domain/entities/localization";
import { formatShortDate } from "../../utils/date-formatting";
import { ProjectHeader } from "./project-header";

export function useListScreenCopy(): {
  readonly locale: string;
  readonly idLabel: string;
  readonly taskLabel: string;
  readonly statusLabel: string;
  readonly priorityLabel: string;
  readonly assigneeLabel: string;
  readonly dueLabel: string;
} {
  const { t, i18n } = useTranslation();

  return {
    locale: i18n.resolvedLanguage ?? i18n.language,
    idLabel: t("list-col-id", { defaultValue: "ID" }),
    taskLabel: t("list-col-task", { defaultValue: "Task" }),
    statusLabel: t("list-col-status", { defaultValue: "Status" }),
    priorityLabel: t("list-col-priority", { defaultValue: "Priority" }),
    assigneeLabel: t("list-col-assignee", { defaultValue: "Assignee" }),
    dueLabel: t("list-col-due", { defaultValue: "Due" }),
  };
}

export function ListScreen(): JSX.Element {
  const { slug } = useParams({ strict: false });
  const copy = useListScreenCopy();
  const projectSlug = slug ? parseProjectSlug(slug) : undefined;

  const project = projectSlug ? findProject(projectSlug) : undefined;

  const tasks = useMemo(() => {
    if (!projectSlug) return [];
    return getTasksForProject(projectSlug, TASKS);
  }, [projectSlug]);

  if (!projectSlug || !project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div>
      <ProjectHeader slug={projectSlug} />

      <div className="overflow-x-auto">
        <table className="w-full text-[length:var(--font-size-sm)]">
          <thead>
            <tr className="border-b border-base-300 text-left">
              <th className="pb-2 pr-4 font-[family-name:var(--font-display)] font-semibold text-base-content/60">
                {copy.idLabel}
              </th>
              <th className="pb-2 pr-4 font-[family-name:var(--font-display)] font-semibold text-base-content/60">
                {copy.taskLabel}
              </th>
              <th className="pb-2 pr-4 font-[family-name:var(--font-display)] font-semibold text-base-content/60">
                {copy.statusLabel}
              </th>
              <th className="pb-2 pr-4 font-[family-name:var(--font-display)] font-semibold text-base-content/60">
                {copy.priorityLabel}
              </th>
              <th className="pb-2 pr-4 font-[family-name:var(--font-display)] font-semibold text-base-content/60">
                {copy.assigneeLabel}
              </th>
              <th className="pb-2 font-[family-name:var(--font-display)] font-semibold text-base-content/60">
                {copy.dueLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-base-300/50">
                <td className="py-2.5 pr-4 font-[family-name:var(--font-mono)] text-base-content/50">
                  {task.id}
                </td>
                <td className="py-2.5 pr-4 text-base-content">
                  {pickLocalization(task.localizations, copy.locale).name}
                </td>
                <td className="py-2.5 pr-4">
                  <StatusBadge state={task.state} />
                </td>
                <td className="py-2.5 pr-4">
                  <PriorityTag priority={task.priority} />
                </td>
                <td className="py-2.5 pr-4 text-base-content/60">{task.assignee.name}</td>
                <td className="py-2.5 text-base-content/60">
                  <time dateTime={task.dueDate}>{formatShortDate(task.dueDate, copy.locale)}</time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
