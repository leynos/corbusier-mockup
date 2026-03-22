/** @file Route definitions for the SYSTEM zone. */

import { createRoute, lazyRouteComponent, notFound } from "@tanstack/react-router";

import { findAgentBackendById, parseAgentBackendId } from "../../data/agents";
import { findHookById, parseHookId } from "../../data/hooks";
import { findMcpServerById, parseMcpServerId } from "../../data/mcp-servers";
import { findPersonnelById, parsePersonnelId } from "../../data/personnel";

import { rootRoute } from "./root-route";

/* ── Detail-route loader factory ─────────────────────────────────── */

/**
 * Create a TanStack Router `loader` that parses a route id param, validates it,
 * fetches the matching entity, and throws `notFound()` for any failure.
 *
 * The `const TKey` modifier preserves the literal key type so that
 * `routeApi.useLoaderData()` resolves to `{ [key]: TEntity }` exactly.
 */
function makeDetailLoader<TId, TEntity, const TKey extends string>(
  parse: (raw: string) => TId | undefined,
  find: (id: TId) => TEntity | undefined,
  key: TKey,
): (ctx: { params: { id: string } }) => Record<TKey, TEntity> {
  return ({ params }) => {
    const id = parse(params.id);
    if (id === undefined) throw notFound();
    const entity = find(id);
    if (entity === undefined) throw notFound();
    return { [key]: entity } as Record<TKey, TEntity>;
  };
}

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
  loader: makeDetailLoader(parsePersonnelId, findPersonnelById, "personnel"),
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
  loader: makeDetailLoader(parseAgentBackendId, findAgentBackendById, "agent"),
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
  loader: makeDetailLoader(parseMcpServerId, findMcpServerById, "server"),
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
  loader: makeDetailLoader(parseHookId, findHookById, "hook"),
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
