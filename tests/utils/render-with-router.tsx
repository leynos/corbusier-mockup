/** @file Test utility that renders components inside a TanStack Router context. */

import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { type RenderOptions, type RenderResult, render } from "@testing-library/react";
import type { ReactElement } from "react";

import { ThemeProvider } from "../../src/app/providers/theme-provider";

interface RenderWithRouterOptions extends Omit<RenderOptions, "wrapper"> {
  /** Initial URL path, defaults to "/". */
  readonly initialPath?: string;
}

/**
 * Render a React element inside TanStack Router + theme/display providers.
 * The router is configured with a catch-all root route that renders the given
 * element as layout content via Outlet, plus a child index route.
 */
export function renderWithRouter(
  ui: ReactElement,
  { initialPath = "/", ...options }: RenderWithRouterOptions = {},
): RenderResult {
  const rootRoute = createRootRoute({
    component: () => (
      <ThemeProvider>
        {ui}
        <Outlet />
      </ThemeProvider>
    ),
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => null,
  });

  const catchAllRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "$",
    component: () => null,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, catchAllRoute]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  return render(<RouterProvider router={router} />, options);
}
