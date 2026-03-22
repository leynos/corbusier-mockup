/** @file Assembled route tree for TanStack Router, importing segments by zone. */

import { authRoutes } from "./auth-routes";
import { mainframeRoutes } from "./mainframe-routes";
import { projectRoutes } from "./project-routes";
import { rootRoute } from "./root-route";
import { settingsRoutes } from "./settings-routes";
import { systemRoutes } from "./system-routes";

export const routeTree = rootRoute.addChildren([
  ...mainframeRoutes,
  ...projectRoutes,
  ...systemRoutes,
  ...settingsRoutes,
  ...authRoutes,
]);
