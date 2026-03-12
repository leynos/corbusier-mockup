/** @file Task Dependencies screen — hierarchical dependency view. */

import {
  IconActivity,
  IconHierarchy2,
  IconListCheck,
  IconNetwork,
  IconUsers,
} from "@tabler/icons-react";
import { getRouteApi } from "@tanstack/react-router";
import type { JSX } from "react";

import { findTask } from "../../../data/tasks";
import { ActivityTimeline } from "../../components/activity-timeline";
import { ProgressBar } from "../../components/progress-bar";
import { StatusBadge } from "../../components/status-badge";
import { DependencyHierarchy } from "../tasks/components/dependency-hierarchy";
import { DependencyPanel } from "../tasks/components/dependency-panel";
import { RelatedTasks } from "../tasks/components/related-tasks";

/* ── Route API ────────────────────────────────────────────────────── */

const routeApi = getRouteApi("/projects/$slug/tasks/$id/dependencies");

/* ── Section wrapper ──────────────────────────────────────────────── */

interface SectionProps {
  readonly icon: typeof IconActivity;
  readonly title: string;
  readonly children: React.ReactNode;
}

function Section({ icon: Icon, title, children }: SectionProps): JSX.Element {
  return (
    <section className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-5">
        <h2 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
          <Icon size={16} stroke={1.5} aria-hidden="true" />
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

/* ── Task focus panel ─────────────────────────────────────────────── */

interface TaskFocusPanelProps {
  readonly task: ReturnType<typeof findTask> & object;
}

function TaskFocusPanel({ task }: TaskFocusPanelProps): JSX.Element {
  const done = task.subtasks.filter((s) => s.done).length;
  const total = task.subtasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <StatusBadge state={task.state} />
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-lg)] font-bold text-base-content">
          {task.title}
        </h2>
      </div>
      <p className="mb-3 text-[length:var(--font-size-sm)] text-base-content/80">
        {task.description}
      </p>
      {total > 0 ? (
        <div>
          <div className="mb-1 flex items-center justify-between text-[length:var(--font-size-xs)] text-base-content/60">
            <span>Subtask progress</span>
            <span className="font-[family-name:var(--font-mono)]">
              {String(done)}/{String(total)}
            </span>
          </div>
          <ProgressBar value={pct} />
        </div>
      ) : null}
      {task.estimate !== undefined ? (
        <p className="mt-2 text-[length:var(--font-size-xs)] text-base-content/60">
          Estimate: <span className="font-semibold text-base-content">{task.estimate}</span>
        </p>
      ) : null}
    </div>
  );
}

/* ── Screen ───────────────────────────────────────────────────────── */

export function TaskDepsScreen(): JSX.Element {
  const { id } = routeApi.useParams();
  const task = findTask(id);

  if (task === undefined) {
    return (
      <div className="py-12 text-center">
        <p className="text-[length:var(--font-size-lg)] font-semibold text-base-content">
          Task not found
        </p>
        <p className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)] text-base-content/60">
          {id}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hierarchy breadcrumb */}
      <DependencyHierarchy task={task} />

      {/* Current task focus */}
      <Section icon={IconHierarchy2} title="Current Task">
        <TaskFocusPanel task={task} />
      </Section>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Dependency graph */}
          <Section icon={IconNetwork} title="Dependencies">
            <DependencyPanel task={task} />
          </Section>

          {/* Activity timeline */}
          <Section icon={IconActivity} title="Activity">
            <ActivityTimeline
              entries={task.activityLog.map((e) => ({
                id: e.id,
                kind: e.kind,
                timestamp: e.timestamp,
                actor: e.actor,
                description: e.description,
              }))}
            />
          </Section>
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-6">
          {/* Subtask summary */}
          {task.subtasks.length > 0 ? (
            <Section icon={IconListCheck} title="Subtasks">
              <ul className="space-y-1">
                {task.subtasks.map((sub) => (
                  <li
                    key={sub.id}
                    className={`text-[length:var(--font-size-sm)] ${sub.done ? "text-base-content/60 line-through" : "text-base-content"}`}
                  >
                    {sub.title}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {/* Related tasks */}
          <Section icon={IconUsers} title="Related Tasks">
            <RelatedTasks taskIds={task.relatedTasks} />
          </Section>
        </div>
      </div>
    </div>
  );
}
