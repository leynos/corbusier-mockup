/** @file Kanban-style task card with punch-card chamfer.
 *
 * Uses ChamferCard for the chamfered border. Blocked tasks get a
 * reversed chamfer and error stroke to create visible discomfort.
 */

import type { JSX } from "react";

import type { Task } from "../../data/tasks";
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

function subtaskProgress(task: Task): number {
  if (task.subtasks.length === 0) return 0;
  const done = task.subtasks.filter((s) => s.done).length;
  return Math.round((done / task.subtasks.length) * 100);
}

export function TaskCard({ task, className = "" }: TaskCardProps): JSX.Element {
  const isBlocked = task.dependencies.blockedBy.length > 0;
  const reversed = isBlocked;
  const strokeClass = isBlocked ? "stroke-error" : "stroke-base-300";
  const progress = subtaskProgress(task);

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
        {task.title}
      </h3>

      {/* Description (truncated) */}
      <p className="mb-3 line-clamp-2 text-[length:var(--font-size-xs)] text-base-content/60">
        {task.description}
      </p>

      {/* Labels */}
      {task.labels.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-1">
          {task.labels.map((l) => (
            <CategoryTag key={l} label={l} />
          ))}
        </div>
      ) : null}

      {/* Progress bar (if subtasks exist) */}
      {task.subtasks.length > 0 ? (
        <div className="mb-3">
          <ProgressBar
            value={progress}
            fillClassName={isBlocked ? "bg-error" : "bg-primary"}
            label={`${String(progress)}% subtasks complete`}
          />
          <p className="mt-1 text-[length:var(--font-size-xs)] text-base-content/50">
            {task.subtasks.filter((s) => s.done).length}/{task.subtasks.length} subtasks
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
