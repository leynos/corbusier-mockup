/** @file Dependency hierarchy — Goal → Idea → Step → Task breadcrumb. */

import { IconChevronRight } from "@tabler/icons-react";
import type { JSX } from "react";

import type { Task } from "../../../../data/tasks";

interface DependencyHierarchyProps {
  readonly task: Task;
}

interface BreadcrumbItem {
  readonly label: string;
  readonly value: string;
}

export function DependencyHierarchy({ task }: DependencyHierarchyProps): JSX.Element | null {
  const items: BreadcrumbItem[] = [];

  if (task.parentGoal !== undefined) {
    items.push({ label: "Goal", value: task.parentGoal });
  }
  if (task.parentIdea !== undefined) {
    items.push({ label: "Idea", value: task.parentIdea });
  }
  if (task.parentStep !== undefined) {
    items.push({ label: "Step", value: task.parentStep });
  }
  items.push({ label: "Task", value: task.title });

  if (items.length <= 1) return null;

  return (
    <nav aria-label="Task hierarchy" className="flex flex-wrap items-center gap-1">
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
