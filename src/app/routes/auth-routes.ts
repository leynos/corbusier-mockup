/** @file Route definitions for authentication pages (rendered outside the app shell). */

import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { rootRoute } from "./root-route";

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: lazyRouteComponent(() => import("../features/auth/sign-in-screen"), "SignInScreen"),
});

export const authRoutes = [signInRoute];
