/** @file Task metadata panel — assignee, due date, priority, estimate, labels. */

import type { JSX } from "react";

import type { Task } from "../../../../data/tasks";
import { CategoryTag } from "../../../components/category-tag";
import { PriorityTag } from "../../../components/priority-tag";

interface TaskMetadataPanelProps {
  readonly task: Task;
}

function formatDueDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface MetaRowProps {
  readonly label: string;
  readonly children: React.ReactNode;
}

function MetaRow({ label, children }: MetaRowProps): JSX.Element {
  return (
    <div className="flex items-baseline justify-between gap-2 py-1.5">
      <dt className="text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
        {label}
      </dt>
      <dd className="text-right text-[length:var(--font-size-sm)] text-base-content">{children}</dd>
    </div>
  );
}

export function TaskMetadataPanel({ task }: TaskMetadataPanelProps): JSX.Element {
  return (
    <dl className="divide-y divide-base-300/50">
      <MetaRow label="Assignee">
        <span className="font-semibold">{task.assignee.name}</span>
        <span className="ml-1 text-[length:var(--font-size-xs)] text-base-content/60">
          {task.assignee.role}
        </span>
      </MetaRow>
      <MetaRow label="Due">
        <time dateTime={task.dueDate}>{formatDueDate(task.dueDate)}</time>
      </MetaRow>
      <MetaRow label="Priority">
        <PriorityTag priority={task.priority} />
      </MetaRow>
      {task.estimate !== undefined ? <MetaRow label="Estimate">{task.estimate}</MetaRow> : null}
      {task.labels.length > 0 ? (
        <MetaRow label="Labels">
          <div className="flex flex-wrap justify-end gap-1">
            {task.labels.map((l) => (
              <CategoryTag key={l} label={l} />
            ))}
          </div>
        </MetaRow>
      ) : null}
    </dl>
  );
}
