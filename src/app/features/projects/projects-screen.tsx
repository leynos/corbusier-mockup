/** @file Project list screen — card grid of all projects.
 *
 * Displays project cards with name, lead, date range, status badge,
 * team avatar stack, and task count summary. Clicking a card
 * navigates to /projects/:slug/kanban.
 */

import type { JSX } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { groupTasksByState, PROJECT_FIXTURES } from "../../../data/projects";
import { TASKS } from "../../../data/tasks";
import { ProjectCard } from "./components/project-card";

function useProjectsScreenCopy(): {
  readonly heading: string;
  readonly subheading: string;
  readonly projectListLabel: string;
} {
  const { t } = useTranslation();

  return {
    heading: t("page-projects", { defaultValue: "Projects" }),
    subheading: t("page-projects-sub", {
      defaultValue: "All directives and project workspaces.",
    }),
    projectListLabel: t("project-list-region", { defaultValue: "Project list" }),
  };
}

export function ProjectsScreen(): JSX.Element {
  const copy = useProjectsScreenCopy();
  const projectSummaries = useMemo(
    () =>
      PROJECT_FIXTURES.map((p) => ({ project: p, taskSummary: groupTasksByState(p.slug, TASKS) })),
    [],
  );

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {copy.heading}
      </h1>
      <p className="mb-6 text-base-content/70">{copy.subheading}</p>

      <ul
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        aria-label={copy.projectListLabel}
      >
        {projectSummaries.map(({ project, taskSummary }) => (
          <li key={project.slug} className="list-none">
            <ProjectCard project={project} taskSummary={taskSummary} />
          </li>
        ))}
      </ul>
    </div>
  );
}
