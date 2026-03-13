/** @file Single Kanban column rendering a header and task card list.
 *
 * Each column has a coloured header with task count badge, a scrollable
 * list of TaskCard components, and an "Add New" placeholder button at
 * the bottom.
 */

import { IconPlus } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { Task } from "../../../../data/tasks";
import { TaskCard } from "../../../components/task-card";

interface KanbanColumnProps {
  readonly label: string;
  readonly tasks: readonly Task[];
  readonly accentClassName: string;
  readonly slug: string;
}

export function KanbanColumn({
  label,
  tasks,
  accentClassName,
  slug,
}: KanbanColumnProps): JSX.Element {
  const { t } = useTranslation();

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
        className="mt-3 flex w-full items-center justify-center gap-1 rounded border-2 border-dashed border-base-300 px-3 py-2 text-[length:var(--font-size-sm)] text-base-content/40 hover:border-primary/40 hover:text-primary/60"
        aria-label={`${t("kanban-add-new", { defaultValue: "Add New" })} — ${label}`}
      >
        <IconPlus size={14} stroke={1.5} aria-hidden="true" />
        {t("kanban-add-new", { defaultValue: "Add New" })}
      </button>
    </section>
  );
}
