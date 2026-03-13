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
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { findTask, parseTaskId, type Task, TaskState } from "../../../data/tasks";
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

interface TaskDetailMainSectionsProps {
  readonly task: Task;
  readonly dependenciesTitle: string;
  readonly progressTitle: string;
  readonly sourceControlTitle: string;
  readonly activityTitle: string;
}

function TaskDetailMainSections({
  task,
  dependenciesTitle,
  progressTitle,
  sourceControlTitle,
  activityTitle,
}: TaskDetailMainSectionsProps): JSX.Element {
  return (
    <div className="space-y-6 lg:col-span-2">
      <SectionCard icon={IconNetwork} title={dependenciesTitle}>
        <DependencyPanel task={task} />
      </SectionCard>

      <SectionCard icon={IconListCheck} title={progressTitle}>
        <SubtaskChecklist subtasks={task.subtasks} />
      </SectionCard>

      <SectionCard icon={IconGitBranch} title={sourceControlTitle}>
        <BranchPrPanel branchRef={task.branchRef} pullRequestRef={task.pullRequestRef} />
      </SectionCard>

      <SectionCard icon={IconActivity} title={activityTitle}>
        <ActivityTimeline
          entries={task.activityLog.map((event) => ({
            id: event.id,
            kind: event.kind,
            timestamp: event.timestamp,
            actor: event.actor,
            localizations: event.localizations,
          }))}
        />
      </SectionCard>
    </div>
  );
}

interface TaskDetailSidebarSectionsProps {
  readonly task: Task;
  readonly description: string;
  readonly detailsTitle: string;
  readonly descriptionTitle: string;
  readonly relatedTitle: string;
}

function TaskDetailSidebarSections({
  task,
  description,
  detailsTitle,
  descriptionTitle,
  relatedTitle,
}: TaskDetailSidebarSectionsProps): JSX.Element {
  return (
    <div className="space-y-6">
      <SectionCard icon={IconTag} title={detailsTitle}>
        <TaskMetadataPanel task={task} />
      </SectionCard>

      <SectionCard icon={IconHierarchy2} title={descriptionTitle}>
        <p className="text-[length:var(--font-size-sm)] text-base-content/80">{description}</p>
      </SectionCard>

      <SectionCard icon={IconUsers} title={relatedTitle}>
        <RelatedTasks taskIds={task.relatedTasks} />
      </SectionCard>
    </div>
  );
}

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

  const activeTask = useMemo(
    () =>
      task === undefined || currentState === task.state ? task : { ...task, state: currentState },
    [currentState, task],
  );
  const description = task ? (pickLocalization(task.localizations, locale).description ?? "") : "";

  if (task === undefined || activeTask === undefined) {
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
        <TaskDetailMainSections
          task={task}
          dependenciesTitle={t("task-section-dependencies", { defaultValue: "Dependencies" })}
          progressTitle={t("task-section-progress", { defaultValue: "Progress" })}
          sourceControlTitle={t("task-section-source-control", {
            defaultValue: "Source Control",
          })}
          activityTitle={t("task-section-activity", { defaultValue: "Activity" })}
        />
        <TaskDetailSidebarSections
          task={task}
          description={description}
          detailsTitle={t("task-section-details", { defaultValue: "Details" })}
          descriptionTitle={t("task-section-description", { defaultValue: "Description" })}
          relatedTitle={t("task-section-related", { defaultValue: "Related Tasks" })}
        />
      </div>
    </div>
  );
}
