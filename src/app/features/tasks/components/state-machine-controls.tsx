/** @file State machine transition buttons — only valid next states shown. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { TaskState, validTransitions } from "../../../../data/tasks";

interface StateMachineControlsProps {
  readonly currentState: TaskState;
}

const ACTION_KEYS: Record<TaskState, string> = {
  [TaskState.Draft]: "task-action-draft",
  [TaskState.InProgress]: "task-action-start",
  [TaskState.InReview]: "task-action-submit-review",
  [TaskState.Paused]: "task-action-pause",
  [TaskState.Done]: "task-action-mark-done",
  [TaskState.Abandoned]: "task-action-abandon",
};

const ACTION_DEFAULTS: Record<TaskState, string> = {
  [TaskState.Draft]: "Draft",
  [TaskState.InProgress]: "Start",
  [TaskState.InReview]: "Submit for Review",
  [TaskState.Paused]: "Pause",
  [TaskState.Done]: "Mark Done",
  [TaskState.Abandoned]: "Abandon",
};

const STATE_STYLE: Record<TaskState, string> = {
  [TaskState.Draft]: "btn-ghost",
  [TaskState.InProgress]: "btn-primary",
  [TaskState.InReview]: "btn-info",
  [TaskState.Paused]: "btn-warning btn-outline",
  [TaskState.Done]: "btn-success",
  [TaskState.Abandoned]: "btn-ghost text-base-content/60",
};

export function StateMachineControls({ currentState }: StateMachineControlsProps): JSX.Element {
  const { t } = useTranslation();
  const transitions = validTransitions(currentState);

  if (transitions.length === 0) {
    return (
      <p className="text-[length:var(--font-size-sm)] text-base-content/60">
        {t("task-action-none", { defaultValue: "No transitions available from this state." })}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {transitions.map((target) => {
        const label = t(ACTION_KEYS[target], { defaultValue: ACTION_DEFAULTS[target] });
        return (
          <button
            key={target}
            type="button"
            className={`btn btn-sm ${STATE_STYLE[target]}`}
            aria-label={t("task-action-transition", {
              target: label,
              defaultValue: `Transition to ${label}`,
            })}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
