/** @file Kanban board screen — five-column task board for a project.
 *
 * Renders the ProjectHeader with view switcher tabs, followed by a
 * horizontal flex layout of five Kanban columns: To-Do, Planned,
 * In Progress, In Review, Done. Tasks are derived from fixture data
 * and sorted into columns by their state machine position.
 */

import { Navigate, useParams } from "@tanstack/react-router";
import type { JSX } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { findProject, groupTasksByState, type KanbanColumnId } from "../../../data/projects";
import { TASKS, TaskState } from "../../../data/tasks";
import { KanbanColumn } from "./components/kanban-column";
import { ProjectHeader } from "./project-landing-screen";

/** Accent colours for each Kanban column header dot. */
const COLUMN_ACCENT: Record<KanbanColumnId, string> = {
  todo: "bg-base-content/30",
  planned: "bg-info",
  in_progress: "bg-warning",
  in_review: "bg-secondary",
  done: "bg-success",
};

/**
 * Whether a draft task counts as "planned" (has subtasks).
 * Must mirror the heuristic in `src/data/projects.ts`.
 */
function isDraftPlanned(task: { readonly subtasks: readonly unknown[] }): boolean {
  return task.subtasks.length > 0;
}

function deriveColumns(slug: string) {
  const { grouped } = groupTasksByState(slug, TASKS);
  const drafts = grouped[TaskState.Draft];

  return [
    { id: "todo" as KanbanColumnId, tasks: drafts.filter((t) => !isDraftPlanned(t)) },
    { id: "planned" as KanbanColumnId, tasks: drafts.filter((t) => isDraftPlanned(t)) },
    { id: "in_progress" as KanbanColumnId, tasks: [...grouped[TaskState.InProgress]] },
    { id: "in_review" as KanbanColumnId, tasks: [...grouped[TaskState.InReview]] },
    { id: "done" as KanbanColumnId, tasks: [...grouped[TaskState.Done]] },
  ];
}

export function KanbanScreen(): JSX.Element {
  const { slug } = useParams({ strict: false });
  const { t } = useTranslation();

  const project = slug ? findProject(slug) : undefined;
  const columns = useMemo(() => (slug ? deriveColumns(slug) : []), [slug]);

  if (!slug || !project) {
    return <Navigate to="/projects" />;
  }

  const columnLabels: Record<KanbanColumnId, string> = {
    todo: t("kanban-column-todo", { defaultValue: "To-Do" }),
    planned: t("kanban-column-planned", { defaultValue: "Planned" }),
    in_progress: t("kanban-column-in-progress", { defaultValue: "In Progress" }),
    in_review: t("kanban-column-in-review", { defaultValue: "In Review" }),
    done: t("kanban-column-done", { defaultValue: "Done" }),
  };

  return (
    <div>
      <ProjectHeader slug={slug} />

      <section
        className="flex gap-4 overflow-x-auto pb-4"
        aria-label={t("kanban-board-label", { defaultValue: "Kanban board" })}
      >
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            label={columnLabels[col.id]}
            tasks={col.tasks}
            accentClassName={COLUMN_ACCENT[col.id]}
            slug={slug}
          />
        ))}
      </section>
    </div>
  );
}
