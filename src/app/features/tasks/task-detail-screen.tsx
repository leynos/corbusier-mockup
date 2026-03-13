/** @file Task Detail screen — assembles subcomponents for a single task. */

import {
  IconActivity,
  IconGitBranch,
  IconHierarchy2,
  IconListCheck,
  IconNetwork,
  IconTag,
  IconUsers,
} from "@tabler/icons-react";
import { getRouteApi } from "@tanstack/react-router";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { findTask, parseTaskId, TaskState } from "../../../data/tasks";
import { ActivityTimeline } from "../../components/activity-timeline";
import { SectionCard } from "../../components/section-card";
import { pickLocalization } from "../../domain/entities/localization";
import { BranchPrPanel } from "./components/branch-pr-panel";
import { DependencyHierarchy } from "./components/dependency-hierarchy";
import { DependencyPanel } from "./components/dependency-panel";
import { RelatedTasks } from "./components/related-tasks";
import { StateMachineControls } from "./components/state-machine-controls";
import { SubtaskChecklist } from "./components/subtask-checklist";
import { TaskHeader } from "./components/task-header";
import { TaskMetadataPanel } from "./components/task-metadata-panel";

/* ── Route API ────────────────────────────────────────────────────── */

const routeApi = getRouteApi("/tasks/$id");

/* ── Screen ───────────────────────────────────────────────────────── */

export function TaskDetailScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const { id } = routeApi.useParams();
  const taskId = parseTaskId(id);
  const task = taskId ? findTask(taskId) : undefined;
  const [currentState, setCurrentState] = useState<TaskState>(task?.state ?? TaskState.Draft);

  useEffect(() => {
    if (task !== undefined) {
      setCurrentState(task.state);
    }
  }, [task]);

  if (task === undefined) {
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

  const activeTask = currentState === task.state ? task : { ...task, state: currentState };

  return (
    <div className="space-y-6">
      {/* Hierarchy breadcrumb */}
      <DependencyHierarchy task={task} />

      {/* 1. Task header — loudest */}
      <TaskHeader task={activeTask} />

      {/* 2. State machine controls */}
      <StateMachineControls currentState={currentState} onTransition={setCurrentState} />

      {/* Two-column layout: main content + sidebar metadata */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* 3. Dependencies */}
          <SectionCard
            icon={IconNetwork}
            title={t("task-section-dependencies", { defaultValue: "Dependencies" })}
          >
            <DependencyPanel task={task} />
          </SectionCard>

          {/* 4. Subtasks */}
          <SectionCard
            icon={IconListCheck}
            title={t("task-section-progress", { defaultValue: "Progress" })}
          >
            <SubtaskChecklist subtasks={task.subtasks} />
          </SectionCard>

          {/* 5. Branch & PR */}
          <SectionCard
            icon={IconGitBranch}
            title={t("task-section-source-control", { defaultValue: "Source Control" })}
          >
            <BranchPrPanel branchRef={task.branchRef} pullRequestRef={task.pullRequestRef} />
          </SectionCard>

          {/* 6. Activity timeline */}
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
          {/* 7. Metadata */}
          <SectionCard
            icon={IconTag}
            title={t("task-section-details", { defaultValue: "Details" })}
          >
            <TaskMetadataPanel task={task} />
          </SectionCard>

          {/* Description */}
          <SectionCard
            icon={IconHierarchy2}
            title={t("task-section-description", { defaultValue: "Description" })}
          >
            <p className="text-[length:var(--font-size-sm)] text-base-content/80">
              {pickLocalization(task.localizations, locale).description ?? ""}
            </p>
          </SectionCard>

          {/* Related tasks */}
          <SectionCard
            icon={IconUsers}
            title={t("task-section-related", { defaultValue: "Related Tasks" })}
          >
            <RelatedTasks taskIds={task.relatedTasks} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
