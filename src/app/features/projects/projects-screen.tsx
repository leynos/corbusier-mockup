/** @file Project list screen — card grid of all projects.
 *
 * Displays project cards with name, lead, date range, status badge,
 * team avatar stack, and task count summary. Clicking a card
 * navigates to /projects/:slug/kanban.
 */

import type { JSX } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  type GroupedTasks,
  groupTasksByState,
  PROJECT_FIXTURES,
  type Project,
} from "../../../data/projects";
import { TASKS } from "../../../data/tasks";
import { ProjectCard } from "./components/project-card";

interface ProjectsScreenProps {
  readonly heading: string;
  readonly subheading: string;
  readonly projectListLabel: string;
  readonly projectSummaries: ReadonlyArray<{
    readonly project: Project;
    readonly taskSummary: GroupedTasks;
  }>;
}

function useProjectsScreenLogic(): ProjectsScreenProps {
  const { t } = useTranslation();
  const projectSummaries = useMemo(
    () =>
      PROJECT_FIXTURES.map((project) => ({
        project,
        taskSummary: groupTasksByState(project.slug, TASKS),
      })),
    [],
  );

  return {
    heading: t("page-projects", { defaultValue: "Projects" }),
    subheading: t("page-projects-sub", {
      defaultValue: "All directives and project workspaces.",
    }),
    projectListLabel: t("project-list-region", { defaultValue: "Project list" }),
    projectSummaries,
  };
}

function ProjectsScreenView({
  heading,
  subheading,
  projectListLabel,
  projectSummaries,
}: ProjectsScreenProps): JSX.Element {
  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {heading}
      </h1>
      <p className="mb-6 text-base-content/70">{subheading}</p>

      <ul
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        aria-label={projectListLabel}
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

export function ProjectsScreen(): JSX.Element {
  const props = useProjectsScreenLogic();

  return <ProjectsScreenView {...props} />;
}
