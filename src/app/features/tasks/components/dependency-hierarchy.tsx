/** @file Dependency hierarchy — Goal → Idea → Step → Task breadcrumb. */

import { IconChevronRight } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { Task } from "../../../../data/tasks";

interface DependencyHierarchyProps {
  readonly task: Task;
}

interface BreadcrumbItem {
  readonly label: string;
  readonly value: string;
}

export function DependencyHierarchy({ task }: DependencyHierarchyProps): JSX.Element | null {
  const { t } = useTranslation();
  const taskId = task.id.toLowerCase();
  const items: BreadcrumbItem[] = [];

  if (task.parentGoal !== undefined) {
    items.push({
      label: t("task-hierarchy-goal", { defaultValue: "Goal" }),
      value: t(`${taskId}-goal`, { defaultValue: task.parentGoal }),
    });
  }
  if (task.parentIdea !== undefined) {
    items.push({
      label: t("task-hierarchy-idea", { defaultValue: "Idea" }),
      value: t(`${taskId}-idea`, { defaultValue: task.parentIdea }),
    });
  }
  if (task.parentStep !== undefined) {
    items.push({
      label: t("task-hierarchy-step", { defaultValue: "Step" }),
      value: t(`${taskId}-step`, { defaultValue: task.parentStep }),
    });
  }
  items.push({
    label: t("task-hierarchy-task", { defaultValue: "Task" }),
    value: t(`${taskId}-title`, { defaultValue: task.title }),
  });

  if (items.length <= 1) return null;

  return (
    <nav
      aria-label={t("task-hierarchy-label", { defaultValue: "Task hierarchy" })}
      className="flex flex-wrap items-center gap-1"
    >
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
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
