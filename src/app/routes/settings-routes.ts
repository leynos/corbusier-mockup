/** @file Route definitions for the SETTINGS zone. */

import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { rootRoute } from "./root-route";

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: lazyRouteComponent(
    () => import("../features/settings/settings-screen"),
    "SettingsScreen",
  ),
});

export const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings/auth",
  component: lazyRouteComponent(() => import("../features/settings/auth-screen"), "AuthScreen"),
});

export const workspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings/workspace",
  component: lazyRouteComponent(
    () => import("../features/settings/workspace-screen"),
    "WorkspaceScreen",
  ),
});

export const integrationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings/integrations",
  component: lazyRouteComponent(
    () => import("../features/settings/integrations-screen"),
    "IntegrationsScreen",
  ),
});

export const appearanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings/appearance",
  component: lazyRouteComponent(
    () => import("../features/settings/appearance-screen"),
    "AppearanceScreen",
  ),
});

export const settingsRoutes = [
  settingsRoute,
  authRoute,
  workspaceRoute,
  integrationsRoute,
  appearanceRoute,
];
