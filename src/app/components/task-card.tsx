/** @file Kanban-style task card with punch-card chamfer.
 *
 * Uses ChamferCard for the chamfered border. Blocked tasks get a
 * reversed chamfer and error stroke to create visible discomfort.
 */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";
import { labelDescriptors } from "../../data/registries";
import type { Task } from "../../data/tasks";
import { pickLocalization } from "../domain/entities/localization";
import { getTaskSubtaskStats } from "../utils/task-metrics";
import { AvatarStack } from "./avatar-stack";
import { CategoryTag } from "./category-tag";
import { ChamferCard } from "./chamfer-card";
import { PriorityTag } from "./priority-tag";
import { ProgressBar } from "./progress-bar";
import { StatusBadge } from "./status-badge";

interface TaskCardProps {
  readonly task: Task;
  readonly className?: string;
}

export function TaskCard({ task, className = "" }: TaskCardProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const isBlocked = task.dependencies.blockedBy.length > 0;
  const reversed = isBlocked;
  const strokeClass = isBlocked ? "stroke-error" : "stroke-base-300";
  const { done, total, percentage } = getTaskSubtaskStats(task);

  return (
    <ChamferCard
      className={`w-full p-4 ${className}`}
      reversed={reversed}
      fillClassName="fill-base-100"
      strokeClassName={strokeClass}
    >
      {/* Header: priority + ID */}
      <div className="mb-2 flex items-center justify-between">
        <PriorityTag priority={task.priority} />
        <span className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/50">
          {task.id}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-1 text-[length:var(--font-size-sm)] font-semibold text-base-content">
        {pickLocalization(task.localizations, locale).name}
      </h3>

      {/* Description (truncated) */}
      <p className="mb-3 line-clamp-2 text-[length:var(--font-size-xs)] text-base-content/60">
        {pickLocalization(task.localizations, locale).description}
      </p>

      {/* Labels */}
      {task.labelIds.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-1">
          {task.labelIds.map((l) => (
            <CategoryTag
              key={l}
              label={pickLocalization(labelDescriptors[l]?.localizations, locale).name}
            />
          ))}
        </div>
      ) : null}

      {/* Progress bar (if subtasks exist) */}
      {total > 0 ? (
        <div className="mb-3">
          <ProgressBar
            value={percentage}
            fillClassName={isBlocked ? "bg-error" : "bg-primary"}
            label={t("task-card-progress", {
              progress: String(percentage),
              defaultValue: `${String(percentage)}% subtasks complete`,
            })}
          />
          <p className="mt-1 text-[length:var(--font-size-xs)] text-base-content/50">
            {t("task-card-subtasks", {
              done: String(done),
              total: String(total),
              defaultValue: `${String(done)}/${String(total)} subtasks`,
            })}
          </p>
        </div>
      ) : null}

      {/* Footer: status + assignee */}
      <div className="flex items-center justify-between">
        <StatusBadge state={task.state} />
        <AvatarStack assignees={[task.assignee]} />
      </div>
    </ChamferCard>
  );
}
