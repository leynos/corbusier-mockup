/** @file Task Detail screen — assembles sub-components for a single task. */

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
import { type JSX, useId } from "react";
import { useTranslation } from "react-i18next";

import { findTask } from "../../../data/tasks";
import { ActivityTimeline } from "../../components/activity-timeline";
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

/* ── Section wrapper ──────────────────────────────────────────────── */

interface SectionProps {
  readonly icon: typeof IconActivity;
  readonly title: string;
  readonly children: React.ReactNode;
}

function Section({ icon: Icon, title, children }: SectionProps): JSX.Element {
  const headingId = useId();
  return (
    <section
      className="card border border-base-300 bg-base-100 shadow-sm"
      aria-labelledby={headingId}
    >
      <div className="card-body p-5">
        <h2
          id={headingId}
          className="mb-3 flex items-center gap-2 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60"
        >
          <Icon size={16} stroke={1.5} aria-hidden="true" />
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

/* ── Screen ───────────────────────────────────────────────────────── */

export function TaskDetailScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const { id } = routeApi.useParams();
  const task = findTask(id);

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

  return (
    <div className="space-y-6">
      {/* Hierarchy breadcrumb */}
      <DependencyHierarchy task={task} />

      {/* 1. Task header — loudest */}
      <TaskHeader task={task} />

      {/* 2. State machine controls */}
      <StateMachineControls currentState={task.state} />

      {/* Two-column layout: main content + sidebar metadata */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* 3. Dependencies */}
          <Section
            icon={IconNetwork}
            title={t("task-section-dependencies", { defaultValue: "Dependencies" })}
          >
            <DependencyPanel task={task} />
          </Section>

          {/* 4. Subtasks */}
          <Section
            icon={IconListCheck}
            title={t("task-section-progress", { defaultValue: "Progress" })}
          >
            <SubtaskChecklist subtasks={task.subtasks} />
          </Section>

          {/* 5. Branch & PR */}
          <Section
            icon={IconGitBranch}
            title={t("task-section-source-control", { defaultValue: "Source Control" })}
          >
            <BranchPrPanel branchRef={task.branchRef} pullRequestRef={task.pullRequestRef} />
          </Section>

          {/* 6. Activity timeline */}
          <Section
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
          </Section>
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-6">
          {/* 7. Metadata */}
          <Section icon={IconTag} title={t("task-section-details", { defaultValue: "Details" })}>
            <TaskMetadataPanel task={task} />
          </Section>

          {/* Description */}
          <Section
            icon={IconHierarchy2}
            title={t("task-section-description", { defaultValue: "Description" })}
          >
            <p className="text-[length:var(--font-size-sm)] text-base-content/80">
              {pickLocalization(task.localizations, locale).description ?? ""}
            </p>
          </Section>

          {/* Related tasks */}
          <Section
            icon={IconUsers}
            title={t("task-section-related", { defaultValue: "Related Tasks" })}
          >
            <RelatedTasks taskIds={task.relatedTasks} />
          </Section>
        </div>
      </div>
    </div>
  );
}
