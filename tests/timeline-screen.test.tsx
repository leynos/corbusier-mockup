/** @file Verifies timeline rows expose visible and accessible due dates. */

import { afterEach, describe, expect, it } from "bun:test";
import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { cleanup, screen } from "@testing-library/react";

import { AppRoutes } from "../src/app/routes/app-routes";
import { routeTree } from "../src/app/routes/route-tree";
import { renderWithProviders } from "./utils/render-with-providers";

function renderTimelineScreen(initialPath: string) {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  return renderWithProviders(<AppRoutes routerInstance={router} />);
}

describe("TimelineScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders each task with its due date and accessible track labelling", async () => {
    renderTimelineScreen("/projects/apollo-guidance/timeline");

    expect(await screen.findByText("Implement Claude Code SDK agent backend")).toBeTruthy();
    expect(screen.getByText("18 Mar 2026")).toBeTruthy();
    expect(
      screen.getByRole("img", {
        name: /Implement Claude Code SDK agent backend.*18 Mar 2026/i,
      }),
    ).toBeTruthy();
  });
});
