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

  it("renders project filter buttons", async () => {
    renderWithRouter("/suggestions");

    const filterGroup = await screen.findByRole("group", {
      name: /project filter/i,
    });
    expect(filterGroup).toBeTruthy();

    const allButton = within(filterGroup).getByRole("button", { name: "All Projects" });
    expect(allButton).toBeTruthy();
    expect(allButton.getAttribute("aria-pressed")).toBe("true");
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

  async function clickFirstCardActionAndExpectRemoval(buttonName: string): Promise<void> {
    renderWithRouter("/suggestions");
    const user = userEvent.setup();

    const title = await screen.findByText("Add circuit breaker to agent backend calls");
    expect(title).toBeTruthy();

    const buttons = await screen.findAllByRole("button", {
      name: buttonName,
    });
    const first = buttons[0];
    if (!first) throw new Error(`No "${buttonName}" button found`);
    await user.click(first);

    expect(screen.queryByText("Add circuit breaker to agent backend calls")).toBeNull();
  }

  it("dismisses a card when Dismiss is clicked", async () => {
    await clickFirstCardActionAndExpectRemoval("Dismiss");
  });

  it("removes a card when Add to Backlog is clicked", async () => {
    await clickFirstCardActionAndExpectRemoval("Add to Backlog");
  });

  it("filters suggestions by project when a filter button is clicked", async () => {
    renderWithRouter("/suggestions");
    const user = userEvent.setup();

    const filterGroup = await screen.findByRole("group", {
      name: /project filter/i,
    });

    /* Click the Skunkworks-Alpha project button. */
    const projectButton = within(filterGroup).getByRole("button", {
      name: "Skunkworks-Alpha",
    });
    await user.click(projectButton);
    expect(projectButton.getAttribute("aria-pressed")).toBe("true");

    /* The Skunkworks-Alpha suggestion should still be present. */
    expect(
      await screen.findByText("Automate tenant namespace cleanup on deprovisioning"),
    ).toBeTruthy();

    /* An Apollo-Guidance suggestion should be gone. */
    expect(screen.queryByText("Add circuit breaker to agent backend calls")).toBeNull();
  });
});
