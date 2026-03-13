/** @file Shared task/subtask progress helpers for task-facing UI components. */

import type { Subtask, Task } from "../../data/tasks";

export interface SubtaskStats {
  readonly done: number;
  readonly total: number;
  readonly percentage: number;
}

export function getSubtaskStats(subtasks: readonly Pick<Subtask, "done">[]): SubtaskStats {
  const total = subtasks.length;
  const done = subtasks.filter((subtask) => subtask.done).length;
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);

  return { done, total, percentage };
}

export function getTaskSubtaskStats(task: Pick<Task, "subtasks">): SubtaskStats {
  return getSubtaskStats(task.subtasks);
}
