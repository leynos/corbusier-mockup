/** @file Tests for the ProjectCard component. */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { cleanup, screen } from "@testing-library/react";

import { ProjectCard } from "../src/app/features/projects/components/project-card";
import { groupTasksByState, PROJECT_FIXTURES } from "../src/data/projects";
import { TASKS } from "../src/data/tasks";
import { renderWithRouter } from "./utils/render-with-router";

function getFixtureProject() {
  const project = PROJECT_FIXTURES[0];
  if (!project) {
    throw new Error("Expected at least one project fixture for ProjectCard tests");
  }
  return project;
}

const project = getFixtureProject();
const taskSummary = groupTasksByState(project.slug, TASKS);

describe("ProjectCard", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the project name", async () => {
    renderWithRouter(<ProjectCard project={project} taskSummary={taskSummary} />);

    expect(await screen.findByText("Apollo-Guidance")).toBeTruthy();
  });

  it("renders the project status badge", async () => {
    renderWithRouter(<ProjectCard project={project} taskSummary={taskSummary} />);

    expect(await screen.findByText("Active")).toBeTruthy();
  });

  it("renders the lead name", async () => {
    renderWithRouter(<ProjectCard project={project} taskSummary={taskSummary} />);

    expect(await screen.findByText("Ava Chen")).toBeTruthy();
  });

  it("links to the kanban view", async () => {
    renderWithRouter(<ProjectCard project={project} taskSummary={taskSummary} />);

    const link = await screen.findByRole("link");
    expect(link.getAttribute("href")).toBe("/projects/apollo-guidance/kanban");
  });

  it("renders task summary counts", async () => {
    renderWithRouter(<ProjectCard project={project} taskSummary={taskSummary} />);

    const text = await screen.findByText(
      new RegExp(
        `${String(taskSummary.totalTasks)}.*tasks.*${String(taskSummary.inProgressCount)}.*in progress.*${String(taskSummary.blockedCount)}.*blocked`,
        "i",
      ),
    );

    expect(text.textContent).toContain(String(taskSummary.totalTasks));
    expect(text.textContent).toContain(String(taskSummary.inProgressCount));
    expect(text.textContent).toContain(String(taskSummary.blockedCount));
  });
});
