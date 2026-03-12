/** @file Dependency panel — "Blocked By" and "Blocks" sections. */

import type { JSX } from "react";

import { findTask, type Task } from "../../../../data/tasks";
import { StatusBadge } from "../../../components/status-badge";

interface DependencyPanelProps {
  readonly task: Task;
}

function DepCard({ taskId }: { readonly taskId: string }): JSX.Element {
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
        {dep.title}
      </p>
      <p className="mt-0.5 text-[length:var(--font-size-xs)] text-base-content/60">
        {dep.assignee.name}
      </p>
    </div>
  );
}

export function DependencyPanel({ task }: DependencyPanelProps): JSX.Element {
  const { blockedBy, blocks } = task.dependencies;
  const hasAny = blockedBy.length > 0 || blocks.length > 0;

  if (!hasAny) {
    return (
      <p className="text-[length:var(--font-size-sm)] text-base-content/60">No dependencies.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {blockedBy.length > 0 ? (
        <div>
          <h3 className="mb-2 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            Blocked By
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
            Blocks
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
