/** @file Tests for the ProjectCard component. */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { cleanup, screen } from "@testing-library/react";

import { ProjectCard } from "../src/app/features/projects/components/project-card";
import { groupTasksByState, PROJECT_FIXTURES } from "../src/data/projects";
import { TASKS } from "../src/data/tasks";
import { renderWithRouter } from "./utils/render-with-router";

// biome-ignore lint/style/noNonNullAssertion: test fixture is known to exist
const project = PROJECT_FIXTURES[0]!;
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
    expect(link.getAttribute("href")).toContain("apollo-guidance");
  });

  it("renders task summary counts", async () => {
    renderWithRouter(<ProjectCard project={project} taskSummary={taskSummary} />);

    const text = await screen.findByText(/tasks/i);
    expect(text).toBeTruthy();
  });
});
