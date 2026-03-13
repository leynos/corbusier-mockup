/**
 * @file Render task-state transition controls for the task detail surface.
 *
 * Purpose:
 * Render the valid task-state actions for the current task state.
 *
 * Responsibilities:
 * Derive the valid next-state actions from `validTransitions`, localize
 * the rendered labels and ARIA text, and pass plain strings and target
 * states into the presentational button view.
 *
 * Usage:
 * Render `StateMachineControls` with a current `TaskState` and an
 * `onTransition` handler that applies the chosen target state.
 *
 * Invariants:
 * Show only target states returned by `validTransitions` for the current
 * state.
 *
 * Related:
 * Task state definitions and transition rules live in
 * `src/data/tasks.ts`.
 */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { TaskState, validTransitions } from "../../../../data/tasks";

/** Props accepted by {`@link` StateMachineControls}. */
export interface StateMachineControlsProps {
  readonly currentState: TaskState;
  readonly onTransition: (target: TaskState) => void;
}

/** Describes a single rendered transition button. */
interface TransitionAction {
  readonly target: TaskState;
  readonly label: string;
  readonly ariaLabel: string;
  readonly className: string;
}

/** Props for the pure-presentational transition-button view. */
interface StateMachineControlsViewProps {
  readonly actions: readonly TransitionAction[];
  readonly emptyMessage: string;
  readonly onTransition: (target: TaskState) => void;
}

/** Translation keys for reachable task-state actions. */
const ACTION_KEYS: Partial<Record<TaskState, string>> = {
  [TaskState.InProgress]: "task-action-start",
  [TaskState.InReview]: "task-action-submit-review",
  [TaskState.Paused]: "task-action-pause",
  [TaskState.Done]: "task-action-mark-done",
  [TaskState.Abandoned]: "task-action-abandon",
};

/** Default English labels paired with `ACTION_KEYS`. */
const ACTION_DEFAULTS: Partial<Record<TaskState, string>> = {
  [TaskState.InProgress]: "Start",
  [TaskState.InReview]: "Submit for Review",
  [TaskState.Paused]: "Pause",
  [TaskState.Done]: "Mark Done",
  [TaskState.Abandoned]: "Abandon",
};

/** DaisyUI button classes used for each target state. */
const STATE_STYLE: Record<TaskState, string> = {
  [TaskState.Draft]: "btn-ghost",
  [TaskState.InProgress]: "btn-primary",
  [TaskState.InReview]: "btn-info",
  [TaskState.Paused]: "btn-warning btn-outline",
  [TaskState.Done]: "btn-success",
  [TaskState.Abandoned]: "btn-ghost text-base-content/60",
};

/**
 * Resolve translated transition labels for the current state.
 */
function useStateMachineControlsModel(currentState: TaskState): {
  readonly actions: readonly TransitionAction[];
  readonly emptyMessage: string;
} {
  const { t } = useTranslation();
  const transitions = validTransitions(currentState);
  const actions = transitions.map((target) => {
    const label = t(ACTION_KEYS[target] ?? `task-action-${target}`, {
      defaultValue: ACTION_DEFAULTS[target] ?? target,
    });

    return {
      target,
      label,
      ariaLabel: t("task-action-transition", {
        target: label,
        defaultValue: `Transition to ${label}`,
      }),
      className: `btn btn-sm ${STATE_STYLE[target]}`,
    };
  });

  return {
    actions,
    emptyMessage: t("task-action-none", {
      defaultValue: "No transitions available from this state.",
    }),
  };
}

/**
 * Presentational view for the translated transition actions.
 */
function StateMachineControlsView({
  actions,
  emptyMessage,
  onTransition,
}: StateMachineControlsViewProps): JSX.Element {
  if (actions.length === 0) {
    return <p className="text-[length:var(--font-size-sm)] text-base-content/60">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action.target}
          type="button"
          className={action.className}
          aria-label={action.ariaLabel}
          onClick={() => onTransition(action.target)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Translate and render the task-state transition controls.
 */
export function StateMachineControls({
  currentState,
  onTransition,
}: StateMachineControlsProps): JSX.Element {
  const { actions, emptyMessage } = useStateMachineControlsModel(currentState);

  return (
    <StateMachineControlsView
      actions={actions}
      emptyMessage={emptyMessage}
      onTransition={onTransition}
    />
  );
}
