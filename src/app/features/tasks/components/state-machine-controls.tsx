/** @file State machine transition buttons — only valid next states shown. */

import type { JSX } from "react";

import { TaskState, validTransitions } from "../../../../data/tasks";

interface StateMachineControlsProps {
  readonly currentState: TaskState;
}

const STATE_LABELS: Record<TaskState, string> = {
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
  const transitions = validTransitions(currentState);

  if (transitions.length === 0) {
    return (
      <p className="text-[length:var(--font-size-sm)] text-base-content/60">
        No transitions available from this state.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {transitions.map((target) => (
        <button
          key={target}
          type="button"
          className={`btn btn-sm ${STATE_STYLE[target]}`}
          aria-label={`Transition to ${STATE_LABELS[target]}`}
        >
          {STATE_LABELS[target]}
        </button>
      ))}
    </div>
  );
}
