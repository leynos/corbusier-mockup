/** @file Verifies project-scoped task dependency routes enforce the project slug. */

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, screen } from "@testing-library/react";

import { renderWithRouter } from "./utils/render-app-routes";

describe("TaskDepsScreen project scoping", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the dependency view when the project slug matches the task", async () => {
    renderWithRouter("/projects/apollo-guidance/tasks/TASK-1001/dependencies");

    const titles = await screen.findAllByText("Implement Claude Code SDK agent backend");
    expect(titles.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("heading", { name: "Current Task" })).toBeTruthy();
  });

  it("treats a mismatched project slug as not found", async () => {
    renderWithRouter("/projects/manhattan-logistics/tasks/TASK-1001/dependencies");

    expect(await screen.findByText("Task not found")).toBeTruthy();
    expect(screen.getByText("TASK-1001")).toBeTruthy();
  });
});
