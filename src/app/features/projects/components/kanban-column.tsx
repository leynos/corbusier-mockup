/** @file KanbanColumn renders one task-state lane for the project board.
 *
 * Invariants:
 * - The Add New placeholder is rendered for every KanbanColumn, but it remains
 *   disabled when task creation is not allowed.
 * - TaskCard links must keep the `/projects/:projectId/tasks/:taskId` route
 *   contract so task details stay addressable from the board.
 * - The header task count reflects only the visible tasks passed to
 *   KanbanColumn.
 *
 * @see src/app/features/projects/kanban-screen.tsx for column layout and copy.
 * @see src/data/projects.ts for project and task grouping data consumed by
 *   TaskCard and KanbanColumn.
 */

import { IconPlus } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { JSX } from "react";

import type { ProjectSlug } from "../../../../data/registries/project-descriptors";
import type { Task } from "../../../../data/tasks";
import { TaskCard } from "../../../components/task-card";

interface KanbanColumnProps {
  readonly label: string;
  readonly tasks: readonly Task[];
  readonly accentClassName: string;
  readonly slug: ProjectSlug;
  readonly addNewLabel: string;
}

export function KanbanColumn({
  label,
  tasks,
  accentClassName,
  slug,
  addNewLabel,
}: KanbanColumnProps): JSX.Element {
  return (
    <section className="flex min-w-[16rem] flex-1 flex-col" aria-label={label}>
      {/* Column header */}
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${accentClassName}`} aria-hidden="true" />
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-bold uppercase tracking-wide text-base-content">
          {label}
        </h2>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-base-300/50 px-1.5 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] font-bold text-base-content/60">
          {tasks.length}
        </span>
      </div>

      {/* Card list */}
      <ul className="flex flex-1 flex-col gap-3" aria-label={label}>
        {tasks.map((task) => (
          <li key={task.id} className="list-none">
            <Link to="/projects/$slug/tasks/$id" params={{ slug, id: task.id }} className="block">
              <TaskCard task={task} />
            </Link>
          </li>
        ))}
      </ul>

      {/* Add New placeholder */}
      <button
        type="button"
        disabled
        className="mt-3 flex w-full cursor-not-allowed items-center justify-center gap-1 rounded border-2 border-dashed border-base-300 px-3 py-2 text-[length:var(--font-size-sm)] text-base-content/40 opacity-70"
        aria-label={`${addNewLabel} — ${label}`}
      >
        <IconPlus size={14} stroke={1.5} aria-hidden="true" />
        {addNewLabel}
      </button>
    </section>
  );
}
