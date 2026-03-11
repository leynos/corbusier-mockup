/** @file Root TanStack Router route hosting the app shell and SPA outlet. */

import { createRootRoute, Outlet } from "@tanstack/react-router";
import type { JSX, ReactNode } from "react";

import { AppShell } from "../layout/app-shell";
import { GlobalControls } from "../layout/global-controls";
import { MobileShell } from "../layout/mobile-shell";
import { useDisplayMode } from "../providers/display-mode-provider";

function RootShell({ children }: { children: ReactNode }): JSX.Element {
  const { isFullBrowser } = useDisplayMode();

  if (isFullBrowser) {
    return <MobileShell>{children}</MobileShell>;
  }

  return <AppShell>{children}</AppShell>;
}

export const rootRoute = createRootRoute({
  component: function RootRoute(): JSX.Element {
    return (
      <RootShell>
        <Outlet />
        <GlobalControls />
      </RootShell>
    );
  },
});
