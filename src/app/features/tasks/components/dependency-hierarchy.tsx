/** @file Dependency hierarchy — Goal → Idea → Step → Task breadcrumb. */

import { IconChevronRight } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { Task } from "../../../../data/tasks";
import { pickLocalization } from "../../../domain/entities/localization";

interface DependencyHierarchyProps {
  readonly task: Task;
}

interface BreadcrumbItem {
  readonly id: "goal" | "idea" | "step" | "task";
  readonly label: string;
  readonly value: string;
}

export function DependencyHierarchy({ task }: DependencyHierarchyProps): JSX.Element | null {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const items: BreadcrumbItem[] = [];

  if (task.hierarchy.goal !== undefined) {
    items.push({
      id: "goal",
      label: t("task-hierarchy-goal", { defaultValue: "Goal" }),
      value: pickLocalization(task.hierarchy.goal, locale).name,
    });
  }
  if (task.hierarchy.idea !== undefined) {
    items.push({
      id: "idea",
      label: t("task-hierarchy-idea", { defaultValue: "Idea" }),
      value: pickLocalization(task.hierarchy.idea, locale).name,
    });
  }
  if (task.hierarchy.step !== undefined) {
    items.push({
      id: "step",
      label: t("task-hierarchy-step", { defaultValue: "Step" }),
      value: pickLocalization(task.hierarchy.step, locale).name,
    });
  }
  items.push({
    id: "task",
    label: t("task-hierarchy-task", { defaultValue: "Task" }),
    value: pickLocalization(task.localizations, locale).name,
  });

  if (items.length <= 1) return null;

  return (
    <nav
      aria-label={t("task-hierarchy-label", { defaultValue: "Task hierarchy" })}
      className="flex flex-wrap items-center gap-1"
    >
      {items.map((item, i) => (
        <span key={item.id} className="flex items-center gap-1">
          {i > 0 ? (
            <IconChevronRight
              size={14}
              stroke={1.5}
              className="text-base-content/40"
              aria-hidden="true"
            />
          ) : null}
          <span className="text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {item.label}
          </span>
          <span className="text-[length:var(--font-size-xs)] text-base-content/80">
            {item.value}
          </span>
        </span>
      ))}
    </nav>
  );
}
