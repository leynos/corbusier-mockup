/** @file Verifies project-scoped task dependency routes enforce the project slug. */

import { afterEach, describe, expect, it } from "bun:test";
import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { cleanup, screen } from "@testing-library/react";

import { AppRoutes } from "../src/app/routes/app-routes";
import { routeTree } from "../src/app/routes/route-tree";
import { renderWithProviders } from "./utils/render-with-providers";

function renderTaskDepsScreen(initialPath: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  return renderWithProviders(<AppRoutes routerInstance={router} />);
}

describe("TaskDepsScreen project scoping", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the dependency view when the project slug matches the task", async () => {
    renderTaskDepsScreen("/projects/platform-api-v3/tasks/TASK-1001/dependencies");

    const titles = await screen.findAllByText("Implement Claude Code SDK agent backend");
    expect(titles.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("heading", { name: "Current Task" })).toBeTruthy();
  });

  it("treats a mismatched project slug as not found", async () => {
    renderTaskDepsScreen("/projects/mobile-app-v2/tasks/TASK-1001/dependencies");

    expect(await screen.findByText("Task not found")).toBeTruthy();
    expect(screen.getByText("TASK-1001")).toBeTruthy();
  });
});
