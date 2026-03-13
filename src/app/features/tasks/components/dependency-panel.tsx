/**
 * @file Render task dependency sections for the task detail screen.
 *
 * Purpose:
 * Render the "Blocked By" and "Blocks" sections for a task's
 * dependencies.
 *
 * Responsibilities:
 * Receive a `Task` value, display the dependency lists for both
 * directions, and handle the empty state when no dependencies exist.
 *
 * Usage:
 * Import `DependencyPanel` and pass a `Task` object through the `task`
 * prop.
 *
 * Invariants:
 * Render each dependency section only when the corresponding dependency
 * list is non-empty, and do not mutate the provided `Task`.
 *
 * Related:
 * The task data model is defined by `Task` in `src/data/tasks.ts`.
 */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { findTask, type Task, type TaskId } from "../../../../data/tasks";
import { StatusBadge } from "../../../components/status-badge";
import { pickLocalization } from "../../../domain/entities/localization";

interface DependencyPanelProps {
  readonly task: Task;
}

function DepCard({ taskId }: { readonly taskId: TaskId }): JSX.Element {
  const { i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const dep = findTask(taskId);
  if (dep === undefined) {
    return (
      <div className="rounded border border-base-300 px-3 py-2">
        <span className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60">
          {taskId}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded border border-base-300 px-3 py-2">
      <div className="flex items-center gap-2">
        <StatusBadge state={dep.state} />
        <span className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60">
          {dep.id}
        </span>
      </div>
      <p className="mt-1 text-[length:var(--font-size-sm)] font-semibold text-base-content">
        {pickLocalization(dep.localizations, locale).name}
      </p>
      <p className="mt-0.5 text-[length:var(--font-size-xs)] text-base-content/60">
        {dep.assignee.name}
      </p>
    </div>
  );
}

export function DependencyPanel({ task }: DependencyPanelProps): JSX.Element {
  const { t } = useTranslation();
  const { blockedBy, blocks } = task.dependencies;
  const hasAny = blockedBy.length > 0 || blocks.length > 0;

  if (!hasAny) {
    return (
      <p className="text-[length:var(--font-size-sm)] text-base-content/60">
        {t("task-deps-none", { defaultValue: "No dependencies." })}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {blockedBy.length > 0 ? (
        <div>
          <h3 className="mb-2 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("task-deps-blocked-by", { defaultValue: "Blocked By" })}
          </h3>
          <div className="space-y-2">
            {blockedBy.map((id) => (
              <DepCard key={id} taskId={id} />
            ))}
          </div>
        </div>
      ) : null}
      {blocks.length > 0 ? (
        <div>
          <h3 className="mb-2 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("task-deps-blocks", { defaultValue: "Blocks" })}
          </h3>
          <div className="space-y-2">
            {blocks.map((id) => (
              <DepCard key={id} taskId={id} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
