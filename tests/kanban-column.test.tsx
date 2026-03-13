/** @file Tests for the KanbanColumn component. */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { cleanup, screen } from "@testing-library/react";

import { KanbanColumn } from "../src/app/features/projects/components/kanban-column";
import { getTasksForProject } from "../src/data/projects";
import { TASKS, TaskState } from "../src/data/tasks";
import { renderWithRouter } from "./utils/render-with-router";

const slug = "apollo-guidance";
const inProgressTasks = getTasksForProject(slug, TASKS).filter(
  (t) => t.state === TaskState.InProgress,
);

describe("KanbanColumn", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the column label as a heading", async () => {
    renderWithRouter(
      <KanbanColumn
        label="In Progress"
        tasks={[...inProgressTasks]}
        accentClassName="bg-warning"
        slug={slug}
        addNewLabel="Add New"
      />,
    );

    expect(await screen.findByRole("heading", { name: "In Progress" })).toBeTruthy();
  });

  it("shows the correct task count", async () => {
    renderWithRouter(
      <KanbanColumn
        label="In Progress"
        tasks={[...inProgressTasks]}
        accentClassName="bg-warning"
        slug={slug}
        addNewLabel="Add New"
      />,
    );

    expect(await screen.findByText(String(inProgressTasks.length))).toBeTruthy();
  });

  it("renders a task card for each task", async () => {
    renderWithRouter(
      <KanbanColumn
        label="In Progress"
        tasks={[...inProgressTasks]}
        accentClassName="bg-warning"
        slug={slug}
        addNewLabel="Add New"
      />,
    );

    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBe(inProgressTasks.length);
  });

  it("renders the Add New button", async () => {
    renderWithRouter(
      <KanbanColumn
        label="In Progress"
        tasks={[...inProgressTasks]}
        accentClassName="bg-warning"
        slug={slug}
        addNewLabel="Add New"
      />,
    );

    const addNewButton = await screen.findByRole("button", { name: "Add New — In Progress" });
    expect(addNewButton.getAttribute("type")).toBe("button");
    expect(addNewButton.hasAttribute("disabled")).toBe(true);
  });

  it("renders correctly when there are no tasks", async () => {
    renderWithRouter(
      <KanbanColumn
        label="Done"
        tasks={[]}
        accentClassName="bg-success"
        slug={slug}
        addNewLabel="Add New"
      />,
    );

    expect(await screen.findByText("0")).toBeTruthy();
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(await screen.findByRole("button", { name: "Add New — Done" })).toBeTruthy();
  });
});
