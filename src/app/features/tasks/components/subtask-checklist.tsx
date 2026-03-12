/** @file Subtask checklist with check/uncheck icons. */

import { IconCircle, IconCircleCheck } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { Subtask } from "../../../../data/tasks";
import { ProgressBar } from "../../../components/progress-bar";
import { pickLocalization } from "../../../domain/entities/localization";

interface SubtaskChecklistProps {
  readonly subtasks: readonly Subtask[];
}

export function SubtaskChecklist({ subtasks }: SubtaskChecklistProps): JSX.Element | null {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  if (subtasks.length === 0) return null;

  const done = subtasks.filter((s) => s.done).length;
  const pct = Math.round((done / subtasks.length) * 100);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold text-base-content">
          {t("task-subtask-heading", { defaultValue: "Subtasks" })}
        </h3>
        <span className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60">
          {String(done)}/{String(subtasks.length)}
        </span>
      </div>
      <ProgressBar value={pct} className="mb-3" />
      <ul className="space-y-1">
        {subtasks.map((sub) => (
          <li key={sub.id} className="flex items-center gap-2 py-1">
            {sub.done ? (
              <IconCircleCheck
                size={18}
                stroke={1.5}
                className="shrink-0 text-success"
                aria-hidden="true"
              />
            ) : (
              <IconCircle
                size={18}
                stroke={1.5}
                className="shrink-0 text-base-content/30"
                aria-hidden="true"
              />
            )}
            <span
              className={`text-[length:var(--font-size-sm)] ${sub.done ? "text-base-content/60 line-through" : "text-base-content"}`}
            >
              {pickLocalization(sub.localizations, locale).name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
