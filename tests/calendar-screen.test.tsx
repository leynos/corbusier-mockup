/** @file Verifies the calendar screen defaults to the project's start month. */

import { afterEach, describe, expect, it } from "bun:test";
import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { cleanup, screen } from "@testing-library/react";

import { AppRoutes } from "../src/app/routes/app-routes";
import { routeTree } from "../src/app/routes/route-tree";
import { renderWithProviders } from "./utils/render-with-providers";

function renderCalendarScreen(initialPath: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  return renderWithProviders(<AppRoutes routerInstance={router} />);
}

describe("CalendarScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("defaults the visible month to the project's start date", async () => {
    renderCalendarScreen("/projects/apollo-guidance/calendar");

    expect(await screen.findByRole("heading", { level: 2, name: "February 2026" })).toBeTruthy();
  });
});
