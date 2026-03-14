/** @file Test helper that renders the full app router at an initial path. */

import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import type { RenderResult } from "@testing-library/react";

import { AppRoutes } from "../../src/app/routes/app-routes";
import { routeTree } from "../../src/app/routes/route-tree";
import { renderWithProviders } from "./render-with-providers";

/**
 * Render the full application route tree at one initial path.
 *
 * @param initialPath Route to seed into the memory history.
 * @returns Testing Library render result for the mounted application shell.
 */
export function renderWithRouter(initialPath: string): RenderResult {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  return renderWithProviders(<AppRoutes routerInstance={router} />);
}
