/** @file Route definitions for the PROJECTS zone and project sub-views. */

import { createRoute, lazyRouteComponent, notFound } from "@tanstack/react-router";

import { PROJECT_SLUGS } from "../../data/registries";
import { findProjectTask, parseTaskId } from "../../data/tasks";
import { rootRoute } from "./root-route";

export const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects",
  component: lazyRouteComponent(
    () => import("../features/projects/projects-screen"),
    "ProjectsScreen",
  ),
});

export const projectLandingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$slug",
  component: lazyRouteComponent(
    () => import("../features/projects/project-landing-screen"),
    "ProjectLandingScreen",
  ),
});

export const kanbanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$slug/kanban",
  component: lazyRouteComponent(() => import("../features/projects/kanban-screen"), "KanbanScreen"),
});

export const backlogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$slug/backlog",
  component: lazyRouteComponent(
    () => import("../features/projects/backlog-screen"),
    "BacklogScreen",
  ),
});

export const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$slug/calendar",
  component: lazyRouteComponent(
    () => import("../features/projects/calendar-screen"),
    "CalendarScreen",
  ),
});

export const listRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$slug/list",
  component: lazyRouteComponent(() => import("../features/projects/list-screen"), "ListScreen"),
});

export const timelineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$slug/timeline",
  component: lazyRouteComponent(
    () => import("../features/projects/timeline-screen"),
    "TimelineScreen",
  ),
});

export const projectTaskDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$slug/tasks/$id",
  component: lazyRouteComponent(
    () => import("../features/projects/task-detail-project-screen"),
    "TaskDetailProjectScreen",
  ),
});

export const taskDepsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$slug/tasks/$id/dependencies",
  loader: ({ params }) => {
    const projectSlug = PROJECT_SLUGS.find((slug) => slug === params.slug);
    if (projectSlug === undefined) {
      throw notFound();
    }

    const taskId = parseTaskId(params.id);
    if (taskId === undefined) {
      throw notFound();
    }

    const task = findProjectTask(projectSlug, taskId);
    if (task === undefined) {
      throw notFound();
    }

    return task;
  },
  component: lazyRouteComponent(
    () => import("../features/projects/task-deps-screen"),
    "TaskDepsScreen",
  ),
  notFoundComponent: lazyRouteComponent(
    () => import("../features/projects/task-deps-screen"),
    "TaskDepsNotFound",
  ),
});

export const conversationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$slug/conversations",
  component: lazyRouteComponent(
    () => import("../features/conversations/conversations-screen"),
    "ConversationsScreen",
  ),
});

export const conversationDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$slug/conversations/$id",
  component: lazyRouteComponent(
    () => import("../features/conversations/conversation-detail-screen"),
    "ConversationDetailScreen",
  ),
});

export const directivesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/projects/$slug/directives",
  component: lazyRouteComponent(
    () => import("../features/directives/directives-screen"),
    "DirectivesScreen",
  ),
});

export const projectRoutes = [
  projectsRoute,
  projectLandingRoute,
  kanbanRoute,
  backlogRoute,
  calendarRoute,
  listRoute,
  timelineRoute,
  projectTaskDetailRoute,
  taskDepsRoute,
  conversationsRoute,
  conversationDetailRoute,
  directivesRoute,
];
