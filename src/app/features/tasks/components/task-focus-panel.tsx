/** @file Task summary panel used to anchor the dependency-focused task view. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { Task } from "../../../../data/tasks";
import { ProgressBar } from "../../../components/progress-bar";
import { StatusBadge } from "../../../components/status-badge";
import { pickLocalization } from "../../../domain/entities/localization";
import { getTaskSubtaskStats } from "../../../utils/task-metrics";

interface TaskFocusPanelProps {
  readonly task: Task;
}

export function TaskFocusPanel({ task }: TaskFocusPanelProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const { done, total, percentage } = getTaskSubtaskStats(task);

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <StatusBadge state={task.state} />
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-lg)] font-bold text-base-content">
          {pickLocalization(task.localizations, locale).name}
        </h2>
      </div>
      <p className="mb-3 text-[length:var(--font-size-sm)] text-base-content/80">
        {pickLocalization(task.localizations, locale).description ?? ""}
      </p>
      {total > 0 ? (
        <div>
          <div className="mb-1 flex items-center justify-between text-[length:var(--font-size-xs)] text-base-content/60">
            <span>{t("task-deps-subtask-progress", { defaultValue: "Subtask progress" })}</span>
            <span className="font-[family-name:var(--font-mono)]">
              {String(done)}/{String(total)}
            </span>
          </div>
          <ProgressBar value={percentage} />
        </div>
      ) : null}
      {task.estimate !== undefined ? (
        <p className="mt-2 text-[length:var(--font-size-xs)] text-base-content/60">
          {t("task-deps-estimate-label", { defaultValue: "Estimate:" })}{" "}
          <span className="font-semibold text-base-content">{task.estimate}</span>
        </p>
      ) : null}
    </div>
  );
}
