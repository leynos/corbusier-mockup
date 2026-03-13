/** @file Tests for the ViewSwitcher component. */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { cleanup, screen, within } from "@testing-library/react";

import { ViewSwitcher } from "../src/app/features/projects/components/view-switcher";
import { renderWithRouter } from "./utils/render-with-router";

const slug = "apollo-guidance";

describe("ViewSwitcher", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders all five view tabs", async () => {
    renderWithRouter(<ViewSwitcher slug={slug} />);

    const tablist = await screen.findByRole("tablist", { name: /project views/i });
    expect(tablist).toBeTruthy();

    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs.length).toBe(5);
  });

  it("renders correct tab labels", async () => {
    renderWithRouter(<ViewSwitcher slug={slug} />);

    expect(await screen.findByText("Backlog")).toBeTruthy();
    expect(screen.getByText("Kanban")).toBeTruthy();
    expect(screen.getByText("Calendar")).toBeTruthy();
    expect(screen.getByText("List")).toBeTruthy();
    expect(screen.getByText("Timeline")).toBeTruthy();
  });

  it("links tabs to correct project sub-routes", async () => {
    renderWithRouter(<ViewSwitcher slug={slug} />);

    const kanbanTab = await screen.findByText("Kanban");
    const link = kanbanTab.closest("a");
    expect(link?.getAttribute("href")).toContain(`/projects/${slug}/kanban`);
  });
});
