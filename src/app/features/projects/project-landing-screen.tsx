/** @file Project landing screen — header, view switcher, and redirect.
 *
 * When accessed at `/projects/:slug` (without a sub-view), the
 * component navigates to the canonical kanban view. Otherwise it
 * renders the project header and tab bar above the matched sub-view.
 */

import { IconCalendar } from "@tabler/icons-react";
import { Navigate, useParams } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { findProject } from "../../../data/projects";
import { type ProjectSlug, parseProjectSlug } from "../../../data/registries/project-descriptors";
import { AvatarStack } from "../../components/avatar-stack";
import { pickLocalization } from "../../domain/entities/localization";
import { formatShortDate } from "../../utils/date-formatting";
import { ProjectStatusBadge } from "./components/project-status-badge";
import { useProjectViewTabs, ViewSwitcher } from "./components/view-switcher";

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

/**
 * Shared project header rendered by each sub-view screen.
 * Sub-views import and render this at the top of their layout.
 */
export function ProjectHeader({ slug }: { readonly slug: ProjectSlug }): JSX.Element | null {
  const { i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const viewTabs = useProjectViewTabs(slug);
  const project = findProject(slug);
  if (!project) return null;

  const loc = pickLocalization(project.localizations, locale);

  return (
    <div className="mb-6">
      {/* Project name + status */}
      <div className="mb-2 flex items-start justify-between gap-4">
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
          {loc.name}
        </h1>
        <ProjectStatusBadge status={project.status} />
      </div>

      {/* Lead + date range + team */}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-[length:var(--font-size-sm)] text-base-content/60">
        <span>
          {project.lead.name} · {project.lead.role}
        </span>
        <span className="flex items-center gap-1">
          <IconCalendar size={14} stroke={1.5} aria-hidden="true" />
          <time dateTime={project.dateRange.start}>
            {formatShortDate(project.dateRange.start, locale)}
          </time>
          <span aria-hidden="true">{"\u2013"}</span>
          <time dateTime={project.dateRange.end}>
            {formatShortDate(project.dateRange.end, locale)}
          </time>
        </span>
        <AvatarStack assignees={[...project.team]} max={5} />
      </div>

      {/* View switcher tabs */}
      <ViewSwitcher slug={project.slug} tabsLabel={viewTabs.tabsLabel} tabs={viewTabs.tabs} />
    </div>
  );
}
