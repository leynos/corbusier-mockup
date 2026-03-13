/** @file Tests the task-detail state transition control wiring. */

import { describe, expect, it, mock } from "bun:test";
import { fireEvent, screen } from "@testing-library/react";
import { StateMachineControls } from "../src/app/features/tasks/components/state-machine-controls";
import { TaskState } from "../src/data/tasks";
import { renderWithProviders } from "./utils/render-with-providers";

describe("StateMachineControls", () => {
  it("invokes the transition callback for a selected target state", () => {
    const onTransition = mock();

    renderWithProviders(
      <StateMachineControls currentState={TaskState.InProgress} onTransition={onTransition} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Transition to Submit for Review" }));

    expect(onTransition).toHaveBeenCalledWith(TaskState.InReview);
  });
});
