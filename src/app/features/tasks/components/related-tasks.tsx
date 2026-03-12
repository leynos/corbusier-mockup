/** @file Related tasks — sibling task cards from the same step. */

import { Link } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { findTask } from "../../../../data/tasks";
import { StatusBadge } from "../../../components/status-badge";
import { pickLocalization } from "../../../domain/entities/localization";

interface RelatedTasksProps {
  readonly taskIds: readonly string[];
}

export function RelatedTasks({ taskIds }: RelatedTasksProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;

  if (taskIds.length === 0) {
    return (
      <p className="text-[length:var(--font-size-sm)] text-base-content/60">
        {t("task-related-none", { defaultValue: "No related tasks." })}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {taskIds.map((id) => {
        const related = findTask(id);
        if (related === undefined) return null;

        return (
          <Link
            key={id}
            to="/tasks/$id"
            params={{ id }}
            className="rounded border border-base-300 px-3 py-2 transition-colors hover:bg-base-200/50"
          >
            <div className="flex items-center gap-2">
              <StatusBadge state={related.state} />
              <span className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60">
                {related.id}
              </span>
            </div>
            <p className="mt-1 text-[length:var(--font-size-sm)] font-semibold text-base-content">
              {pickLocalization(related.localizations, locale).name}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
