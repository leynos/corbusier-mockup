/** @file Project landing screen — route redirect for canonical project views.
 *
 * When accessed at `/projects/:slug` (without a sub-view), the
 * component navigates to the canonical kanban view.
 */

import { Navigate, useParams } from "@tanstack/react-router";
import type { JSX } from "react";

import { findProject } from "../../../data/projects";
import { parseProjectSlug } from "../../../data/registries/project-descriptors";

export function ProjectLandingScreen(): JSX.Element {
  const { slug } = useParams({ strict: false });
  const projectSlug = slug ? parseProjectSlug(slug) : undefined;

  if (!projectSlug) {
    return <Navigate to="/projects" replace />;
  }

  const project = findProject(projectSlug);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  /* Redirect bare /projects/:slug to canonical kanban view. */
  return <Navigate to="/projects/$slug/kanban" params={{ slug: projectSlug }} replace />;
}
