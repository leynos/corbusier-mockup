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
import { parseProjectSlug } from "../../../data/registries/project-descriptors";
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

function useKanbanScreenCopy(): {
  readonly boardLabel: string;
  readonly addNewLabel: string;
  readonly columnLabels: Record<KanbanColumnId, string>;
} {
  const { t } = useTranslation();

  return {
    boardLabel: t("kanban-board-label", { defaultValue: "Kanban board" }),
    addNewLabel: t("kanban-add-new", { defaultValue: "Add New" }),
    columnLabels: {
      todo: t("kanban-column-todo", { defaultValue: "To-Do" }),
      planned: t("kanban-column-planned", { defaultValue: "Planned" }),
      in_progress: t("kanban-column-in-progress", { defaultValue: "In Progress" }),
      in_review: t("kanban-column-in-review", { defaultValue: "In Review" }),
      done: t("kanban-column-done", { defaultValue: "Done" }),
    },
  };
}

function deriveColumns(slug: ReturnType<typeof parseProjectSlug>) {
  if (!slug) {
    return [];
  }

  const { grouped, draftBuckets } = groupTasksByState(slug, TASKS);

  return [
    { id: "todo" as KanbanColumnId, tasks: [...draftBuckets.todo] },
    { id: "planned" as KanbanColumnId, tasks: [...draftBuckets.planned] },
    { id: "in_progress" as KanbanColumnId, tasks: [...grouped[TaskState.InProgress]] },
    { id: "in_review" as KanbanColumnId, tasks: [...grouped[TaskState.InReview]] },
    { id: "done" as KanbanColumnId, tasks: [...grouped[TaskState.Done]] },
  ];
}

export function KanbanScreen(): JSX.Element {
  const { slug } = useParams({ strict: false });
  const projectSlug = slug ? parseProjectSlug(slug) : undefined;
  const copy = useKanbanScreenCopy();

  const project = projectSlug ? findProject(projectSlug) : undefined;
  const columns = useMemo(() => deriveColumns(projectSlug), [projectSlug]);

  if (!projectSlug || !project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div>
      <ProjectHeader slug={projectSlug} />

      <section className="flex gap-4 overflow-x-auto pb-4" aria-label={copy.boardLabel}>
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            label={copy.columnLabels[col.id]}
            tasks={col.tasks}
            accentClassName={COLUMN_ACCENT[col.id]}
            slug={projectSlug}
            addNewLabel={copy.addNewLabel}
          />
        ))}
      </section>
    </div>
  );
}
