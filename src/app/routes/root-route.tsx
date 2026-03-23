/** @file Root TanStack Router route hosting the app shell and SPA outlet.
 *
 * The sign-in page renders outside the shell; all other routes get the
 * sidebar + header wrapper.
 */

import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";
import type { JSX } from "react";

import { AppShell } from "../layout/app-shell";

/** Routes that render without the app shell (sidebar + header). */
const SHELL_EXCLUDED_PATHS = ["/sign-in"] as const;

export const rootRoute = createRootRoute({
  component: function RootRoute(): JSX.Element {
    const pathname = useRouterState({
      select: (s) => s.location.pathname,
    });

    const excludeShell = SHELL_EXCLUDED_PATHS.some((p) => pathname.startsWith(p));

    if (excludeShell) {
      return <Outlet />;
    }

    return (
      <AppShell>
        <Outlet />
      </AppShell>
    );
  },
});
