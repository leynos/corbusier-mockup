/** @file Route definitions for the MAINFRAME zone: Dashboard, Tasks, Suggestions. */

import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { rootRoute } from "./root-route";

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyRouteComponent(
    () => import("../features/dashboard/dashboard-screen"),
    "DashboardScreen",
  ),
});

export const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tasks",
  component: lazyRouteComponent(() => import("../features/tasks/tasks-screen"), "TasksScreen"),
});

export const taskDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tasks/$id",
  component: lazyRouteComponent(
    () => import("../features/tasks/task-detail-screen"),
    "TaskDetailScreen",
  ),
});

export const suggestionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/suggestions",
  component: lazyRouteComponent(
    () => import("../features/suggestions/suggestions-screen"),
    "SuggestionsScreen",
  ),
});

export const mainframeRoutes = [dashboardRoute, tasksRoute, taskDetailRoute, suggestionsRoute];
