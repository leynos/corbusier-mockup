/** @file Route definitions for the SYSTEM zone. */

import { createRoute, lazyRouteComponent, notFound } from "@tanstack/react-router";

import { findAgentBackendById, parseAgentBackendId } from "../../data/agents";
import { findHookById, parseHookId } from "../../data/hooks";
import { findMcpServerById, parseMcpServerId } from "../../data/mcp-servers";
import { findPersonnelById, parsePersonnelId } from "../../data/personnel";

import { rootRoute } from "./root-route";

export const personnelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system/personnel",
  component: lazyRouteComponent(
    () => import("../features/system/personnel-screen"),
    "PersonnelScreen",
  ),
});

export const personnelDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/system/personnel/$id",
  loader: ({ params }) => {
    const personnelId = parsePersonnelId(params.id);
    if (personnelId === undefined) {
      throw notFound();
    }

    const personnel = findPersonnelById(personnelId);
    if (personnel === undefined) {
      throw notFound();
    }

    return { personnel };
  },
  component: lazyRouteComponent(
    () => import("../features/system/personnel-detail-screen"),
    "PersonnelDetailScreen",
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
  loader: ({ params }) => {
    const agentBackendId = parseAgentBackendId(params.id);
    if (agentBackendId === undefined) {
      throw notFound();
    }

    const agent = findAgentBackendById(agentBackendId);
    if (agent === undefined) {
      throw notFound();
    }

    return { agent };
  },
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
  loader: ({ params }) => {
    const serverId = parseMcpServerId(params.id);
    if (serverId === undefined) {
      throw notFound();
    }

    const server = findMcpServerById(serverId);
    if (server === undefined) {
      throw notFound();
    }

    return { server };
  },
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
  loader: ({ params }) => {
    const hookId = parseHookId(params.id);
    if (hookId === undefined) {
      throw notFound();
    }

    const hook = findHookById(hookId);
    if (hook === undefined) {
      throw notFound();
    }

    return { hook };
  },
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
  personnelDetailRoute,
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
