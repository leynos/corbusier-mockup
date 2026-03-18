/** @file Tests for the AI Suggestions screen. */

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithRouter } from "./utils/render-app-routes";

describe("SuggestionsScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the page heading", async () => {
    renderWithRouter("/suggestions");

    expect(await screen.findByRole("heading", { name: "AI Suggestions" })).toBeTruthy();
  });

  it("renders the summary bar with four metric tiles", async () => {
    renderWithRouter("/suggestions");

    const region = await screen.findByRole("region", {
      name: /suggestion summary/i,
    });
    expect(region).toBeTruthy();

    expect(within(region).getByText("Items Analysed")).toBeTruthy();
    expect(within(region).getByText("Tasks Suggested")).toBeTruthy();
    expect(within(region).getByText("Avg. Confidence")).toBeTruthy();
    expect(within(region).getByText("Last Updated")).toBeTruthy();
  });

  it("renders project filter tabs", async () => {
    renderWithRouter("/suggestions");

    const tablist = await screen.findByRole("tablist", {
      name: /project filter/i,
    });
    expect(tablist).toBeTruthy();

    const allTab = within(tablist).getByRole("tab", { name: "All Projects" });
    expect(allTab).toBeTruthy();
    expect(allTab.getAttribute("aria-selected")).toBe("true");
  });

  it("renders high-priority suggestion cards", async () => {
    renderWithRouter("/suggestions");

    const heading = await screen.findByText("Add circuit breaker to agent backend calls");
    expect(heading).toBeTruthy();
  });

  it("renders confidence badges as accessible images", async () => {
    renderWithRouter("/suggestions");

    const badges = await screen.findAllByRole("img", {
      name: /\d+% confidence/,
    });
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the AI Insights panel", async () => {
    renderWithRouter("/suggestions");

    const region = await screen.findByRole("region", {
      name: /ai insights/i,
    });
    expect(region).toBeTruthy();

    expect(within(region).getByText("Sprint velocity trending downward")).toBeTruthy();
  });

  it("dismisses a card when Dismiss is clicked", async () => {
    renderWithRouter("/suggestions");
    const user = userEvent.setup();

    const title = await screen.findByText("Add circuit breaker to agent backend calls");
    expect(title).toBeTruthy();

    const dismissButtons = await screen.findAllByRole("button", {
      name: "Dismiss",
    });
    const firstDismiss = dismissButtons[0];
    if (!firstDismiss) throw new Error("No Dismiss button found");
    await user.click(firstDismiss);

    expect(screen.queryByText("Add circuit breaker to agent backend calls")).toBeNull();
  });

  it("removes a card when Add to Backlog is clicked", async () => {
    renderWithRouter("/suggestions");
    const user = userEvent.setup();

    const title = await screen.findByText("Add circuit breaker to agent backend calls");
    expect(title).toBeTruthy();

    const addButtons = await screen.findAllByRole("button", {
      name: "Add to Backlog",
    });
    const firstAdd = addButtons[0];
    if (!firstAdd) throw new Error("No Add to Backlog button found");
    await user.click(firstAdd);

    expect(screen.queryByText("Add circuit breaker to agent backend calls")).toBeNull();
  });

  it("filters suggestions by project when a tab is clicked", async () => {
    renderWithRouter("/suggestions");
    const user = userEvent.setup();

    const tablist = await screen.findByRole("tablist", {
      name: /project filter/i,
    });

    /* Click the Skunkworks-Alpha project tab. */
    const projectTab = within(tablist).getByRole("tab", {
      name: "Skunkworks-Alpha",
    });
    await user.click(projectTab);

    /* The Skunkworks-Alpha suggestion should still be present. */
    expect(
      await screen.findByText("Automate tenant namespace cleanup on deprovisioning"),
    ).toBeTruthy();

    /* An Apollo-Guidance suggestion should be gone. */
    expect(screen.queryByText("Add circuit breaker to agent backend calls")).toBeNull();
  });
});
