/** @file Task metadata panel — assignee, due date, priority, estimate, labels. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { labelDescriptors } from "../../../../data/registries";
import type { Task } from "../../../../data/tasks";
import { CategoryTag } from "../../../components/category-tag";
import { PriorityTag } from "../../../components/priority-tag";
import { pickLocalization } from "../../../domain/entities/localization";

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
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <dl className="divide-y divide-base-300/50">
      <MetaRow label={t("task-meta-assignee", { defaultValue: "Assignee" })}>
        <span className="font-semibold">{task.assignee.name}</span>
        <span className="ml-1 text-[length:var(--font-size-xs)] text-base-content/60">
          {task.assignee.role}
        </span>
      </MetaRow>
      <MetaRow label={t("task-meta-due", { defaultValue: "Due" })}>
        <time dateTime={task.dueDate}>{formatDueDate(task.dueDate)}</time>
      </MetaRow>
      <MetaRow label={t("task-meta-priority", { defaultValue: "Priority" })}>
        <PriorityTag priority={task.priority} />
      </MetaRow>
      {task.estimate !== undefined ? (
        <MetaRow label={t("task-meta-estimate", { defaultValue: "Estimate" })}>
          {task.estimate}
        </MetaRow>
      ) : null}
      {task.labelIds.length > 0 ? (
        <MetaRow label={t("task-meta-labels", { defaultValue: "Labels" })}>
          <div className="flex flex-wrap justify-end gap-1">
            {task.labelIds.map((l) => (
              <CategoryTag
                key={l}
                label={pickLocalization(labelDescriptors[l]?.localizations, locale).name}
              />
            ))}
          </div>
        </MetaRow>
      ) : null}
    </dl>
  );
}
