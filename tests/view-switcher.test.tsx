/** @file Tests for the ViewSwitcher component. */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { cleanup, screen, within } from "@testing-library/react";

import type { ViewTab } from "../src/app/features/projects/components/view-switcher";
import { ViewSwitcher } from "../src/app/features/projects/components/view-switcher";
import { renderWithRouter } from "./utils/render-with-router";

const slug = "apollo-guidance";
const tabsLabel = "Project views";

function createTabs(): readonly ViewTab[] {
  return [
    {
      id: "backlog",
      label: "Backlog",
      to: "/projects/$slug/backlog",
      href: `/projects/${slug}/backlog`,
    },
    {
      id: "kanban",
      label: "Kanban",
      to: "/projects/$slug/kanban",
      href: `/projects/${slug}/kanban`,
    },
    {
      id: "calendar",
      label: "Calendar",
      to: "/projects/$slug/calendar",
      href: `/projects/${slug}/calendar`,
    },
    {
      id: "list",
      label: "List",
      to: "/projects/$slug/list",
      href: `/projects/${slug}/list`,
    },
    {
      id: "timeline",
      label: "Timeline",
      to: "/projects/$slug/timeline",
      href: `/projects/${slug}/timeline`,
    },
  ];
}

describe("ViewSwitcher", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders all five view tabs", async () => {
    renderWithRouter(<ViewSwitcher slug={slug} tabsLabel={tabsLabel} tabs={createTabs()} />);

    const tablist = await screen.findByRole("tablist", { name: /project views/i });
    expect(tablist).toBeTruthy();

    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs.length).toBe(5);
  });

  it("renders correct tab labels", async () => {
    renderWithRouter(<ViewSwitcher slug={slug} tabsLabel={tabsLabel} tabs={createTabs()} />);

    expect(await screen.findByText("Backlog")).toBeTruthy();
    expect(screen.getByText("Kanban")).toBeTruthy();
    expect(screen.getByText("Calendar")).toBeTruthy();
    expect(screen.getByText("List")).toBeTruthy();
    expect(screen.getByText("Timeline")).toBeTruthy();
  });

  it("links tabs to correct project sub-routes", async () => {
    renderWithRouter(<ViewSwitcher slug={slug} tabsLabel={tabsLabel} tabs={createTabs()} />);

    const tablist = await screen.findByRole("tablist", { name: /project views/i });
    const tabs = within(tablist).getAllByRole("tab");

    expect(tabs).toHaveLength(5);
    expect(within(tablist).getByRole("tab", { name: "Backlog" }).getAttribute("href")).toBe(
      `/projects/${slug}/backlog`,
    );
    expect(within(tablist).getByRole("tab", { name: "Kanban" }).getAttribute("href")).toBe(
      `/projects/${slug}/kanban`,
    );
    expect(within(tablist).getByRole("tab", { name: "Calendar" }).getAttribute("href")).toBe(
      `/projects/${slug}/calendar`,
    );
    expect(within(tablist).getByRole("tab", { name: "List" }).getAttribute("href")).toBe(
      `/projects/${slug}/list`,
    );
    expect(within(tablist).getByRole("tab", { name: "Timeline" }).getAttribute("href")).toBe(
      `/projects/${slug}/timeline`,
    );
  });

  it("marks the current sub-route as selected", async () => {
    renderWithRouter(<ViewSwitcher slug={slug} tabsLabel={tabsLabel} tabs={createTabs()} />, {
      initialPath: `/projects/${slug}/backlog`,
    });

    const backlogTab = await screen.findByRole("tab", { name: "Backlog" });
    expect(backlogTab.getAttribute("aria-selected")).toBe("true");
    expect(backlogTab.className).toContain("border-primary");
    expect(backlogTab.className).toContain("text-primary");

    for (const otherTab of screen.getAllByRole("tab")) {
      if (otherTab === backlogTab) {
        continue;
      }
      expect(otherTab.getAttribute("aria-selected")).toBe("false");
    }
  });

  it("leaves all tabs unselected when the current path does not match a view route", async () => {
    renderWithRouter(<ViewSwitcher slug={slug} tabsLabel={tabsLabel} tabs={createTabs()} />, {
      initialPath: `/projects/${slug}/unknown`,
    });

    const tabs = await screen.findAllByRole("tab");
    for (const tab of tabs) {
      expect(tab.getAttribute("aria-selected")).toBe("false");
    }
  });
});
