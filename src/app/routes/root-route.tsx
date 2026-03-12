/** @file Root TanStack Router route hosting the app shell and SPA outlet. */

import { createRootRoute, Outlet } from "@tanstack/react-router";
import type { JSX } from "react";

import { AppShell } from "../layout/app-shell";

export const rootRoute = createRootRoute({
  component: function RootRoute(): JSX.Element {
    return (
      <AppShell>
        <Outlet />
      </AppShell>
    );
  },
});
