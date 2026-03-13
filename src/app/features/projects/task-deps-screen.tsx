/** @file Task Dependencies screen — hierarchical dependency view. */

import {
  IconActivity,
  IconHierarchy2,
  IconLink,
  IconListCheck,
  IconNetwork,
} from "@tabler/icons-react";
import { getRouteApi } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { Task } from "../../../data/tasks";
import { ActivityTimeline } from "../../components/activity-timeline";
import { SectionCard } from "../../components/section-card";
import { pickLocalization } from "../../domain/entities/localization";
import { DependencyHierarchy } from "../tasks/components/dependency-hierarchy";
import { DependencyPanel } from "../tasks/components/dependency-panel";
import { RelatedTasks } from "../tasks/components/related-tasks";
import { TaskFocusPanel } from "../tasks/components/task-focus-panel";

/* ── Route API ────────────────────────────────────────────────────── */

const routeApi = getRouteApi("/projects/$slug/tasks/$id/dependencies");

/* ── Screen ───────────────────────────────────────────────────────── */

export function TaskDepsScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const task = routeApi.useLoaderData() as Task;

  return (
    <div className="space-y-6">
      {/* Hierarchy breadcrumb */}
      <DependencyHierarchy task={task} />

      {/* Current task focus */}
      <SectionCard
        icon={IconHierarchy2}
        title={t("task-section-current", { defaultValue: "Current Task" })}
      >
        <TaskFocusPanel task={task} />
      </SectionCard>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Dependency graph */}
          <SectionCard
            icon={IconNetwork}
            title={t("task-section-dependencies", { defaultValue: "Dependencies" })}
          >
            <DependencyPanel task={task} />
          </SectionCard>

          {/* Activity timeline */}
          <SectionCard
            icon={IconActivity}
            title={t("task-section-activity", { defaultValue: "Activity" })}
          >
            <ActivityTimeline
              entries={task.activityLog.map((e) => ({
                id: e.id,
                kind: e.kind,
                timestamp: e.timestamp,
                actor: e.actor,
                localizations: e.localizations,
              }))}
            />
          </SectionCard>
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-6">
          {/* Subtask summary */}
          {task.subtasks.length > 0 ? (
            <SectionCard
              icon={IconListCheck}
              title={t("task-section-subtasks", { defaultValue: "Subtasks" })}
            >
              <ul className="space-y-1">
                {task.subtasks.map((sub) => (
                  <li
                    key={sub.id}
                    className={`text-[length:var(--font-size-sm)] ${sub.done ? "text-base-content/60 line-through" : "text-base-content"}`}
                  >
                    {pickLocalization(sub.localizations, locale).name}
                  </li>
                ))}
              </ul>
            </SectionCard>
          ) : null}

          {/* Related tasks */}
          <SectionCard
            icon={IconLink}
            title={t("task-section-related", { defaultValue: "Related Tasks" })}
          >
            <RelatedTasks taskIds={task.relatedTasks} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export function TaskDepsNotFound(): JSX.Element {
  const { t } = useTranslation();
  const { id } = routeApi.useParams();

  return (
    <div className="py-12 text-center">
      <p className="text-[length:var(--font-size-lg)] font-semibold text-base-content">
        {t("task-not-found", { defaultValue: "Task not found" })}
      </p>
      <p className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)] text-base-content/60">
        {id}
      </p>
    </div>
  );
}
