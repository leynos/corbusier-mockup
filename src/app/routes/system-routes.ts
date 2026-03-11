/** @file Route definitions for the SYSTEM zone. */

import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { rootRoute } from "./root-route";

export const personnelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system/personnel",
  component: lazyRouteComponent(
    () => import("../features/system/personnel-screen"),
    "PersonnelScreen",
  ),
});

export const userDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system/personnel/$id",
  component: lazyRouteComponent(
    () => import("../features/system/user-detail-screen"),
    "UserDetailScreen",
  ),
});

export const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system/reports",
  component: lazyRouteComponent(() => import("../features/system/reports-screen"), "ReportsScreen"),
});

export const agentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system/agents",
  component: lazyRouteComponent(() => import("../features/system/agents-screen"), "AgentsScreen"),
});

export const agentDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system/agents/$id",
  component: lazyRouteComponent(
    () => import("../features/system/agent-detail-screen"),
    "AgentDetailScreen",
  ),
});

export const toolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system/tools",
  component: lazyRouteComponent(() => import("../features/system/tools-screen"), "ToolsScreen"),
});

export const toolDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system/tools/$id",
  component: lazyRouteComponent(
    () => import("../features/system/tool-detail-screen"),
    "ToolDetailScreen",
  ),
});

export const hooksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system/hooks",
  component: lazyRouteComponent(() => import("../features/system/hooks-screen"), "HooksScreen"),
});

export const hookDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system/hooks/$id",
  component: lazyRouteComponent(
    () => import("../features/system/hook-detail-screen"),
    "HookDetailScreen",
  ),
});

export const monitoringRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system/monitoring",
  component: lazyRouteComponent(
    () => import("../features/system/monitoring-screen"),
    "MonitoringScreen",
  ),
});

export const tenantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system/tenants",
  component: lazyRouteComponent(() => import("../features/system/tenants-screen"), "TenantsScreen"),
});

export const systemRoutes = [
  personnelRoute,
  userDetailRoute,
  reportsRoute,
  agentsRoute,
  agentDetailRoute,
  toolsRoute,
  toolDetailRoute,
  hooksRoute,
  hookDetailRoute,
  monitoringRoute,
  tenantsRoute,
];
