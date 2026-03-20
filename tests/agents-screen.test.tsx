/** @file Tests for the Agent Backends list screen. */

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, screen } from "@testing-library/react";

import { renderWithRouter } from "./utils/render-app-routes";

describe("AgentsScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the page heading", async () => {
    renderWithRouter("/system/agents");

    expect(await screen.findByRole("heading", { name: "Agent Backends" })).toBeTruthy();
  });

  it("renders the agents data table", async () => {
    renderWithRouter("/system/agents");

    const table = await screen.findByRole("table", {
      name: /agent backends registry/i,
    });
    expect(table).toBeTruthy();
  });

  it("displays agent backend names from fixture data", async () => {
    renderWithRouter("/system/agents");

    expect(await screen.findByText("Claude Code SDK")).toBeTruthy();
    expect(screen.getByText("Codex CLI")).toBeTruthy();
    expect(screen.getByText("Custom Backend")).toBeTruthy();
  });

  it("displays vendor information", async () => {
    renderWithRouter("/system/agents");

    expect(await screen.findByText("Anthropic")).toBeTruthy();
    expect(screen.getByText("OpenAI")).toBeTruthy();
    expect(screen.getByText("Internal")).toBeTruthy();
  });

  it("displays status badges", async () => {
    renderWithRouter("/system/agents");

    const activeBadges = await screen.findAllByText("Active");
    expect(activeBadges.length).toBeGreaterThanOrEqual(2);

    expect(screen.getByText("Inactive")).toBeTruthy();
  });

  it("renders column headers", async () => {
    renderWithRouter("/system/agents");

    expect(await screen.findByText("Name")).toBeTruthy();
    expect(screen.getByText("Vendor")).toBeTruthy();
    expect(screen.getByText("Version")).toBeTruthy();
    expect(screen.getByText("Status")).toBeTruthy();
  });
});
