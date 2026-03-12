/** @file Task header — title, state badge, assignee, due date, priority. */

import { IconCalendar } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { projectDescriptors } from "../../../../data/registries";
import type { Task } from "../../../../data/tasks";
import { AvatarStack } from "../../../components/avatar-stack";
import { PriorityTag } from "../../../components/priority-tag";
import { StatusBadge } from "../../../components/status-badge";
import { pickLocalization } from "../../../domain/entities/localization";

interface TaskHeaderProps {
  readonly task: Task;
}

function formatDueDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TaskHeader({ task }: TaskHeaderProps): JSX.Element {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <StatusBadge state={task.state} />
          <PriorityTag priority={task.priority} />
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
          {pickLocalization(task.localizations, locale).name}
        </h1>
        <p className="mt-1 text-[length:var(--font-size-sm)] text-base-content/60">
          {pickLocalization(projectDescriptors[task.projectSlug]?.localizations, locale).name}{" "}
          <span className="font-[family-name:var(--font-mono)]">{task.id}</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <div className="flex items-center gap-1 text-[length:var(--font-size-xs)] text-base-content/60">
          <IconCalendar size={14} stroke={1.5} aria-hidden="true" />
          <time dateTime={task.dueDate}>{formatDueDate(task.dueDate)}</time>
        </div>
        <AvatarStack assignees={[task.assignee]} />
      </div>
    </div>
  );
}
