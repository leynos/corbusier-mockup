/** @file Project card for the project list grid.
 *
 * Displays project name, description, lead, team avatars, date range,
 * status badge, and task count summary. Wraps content in a ChamferCard.
 */

import { IconCalendar } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { GroupedTasks, Project } from "../../../../data/projects";
import { AvatarStack } from "../../../components/avatar-stack";
import { ChamferCard } from "../../../components/chamfer-card";
import { pickLocalization } from "../../../domain/entities/localization";
import { formatShortDate } from "../../../utils/date-formatting";
import { ProjectStatusBadge } from "./project-status-badge";

interface ProjectCardProps {
  readonly project: Project;
  readonly taskSummary: GroupedTasks;
}

export function ProjectCard({ project, taskSummary }: ProjectCardProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const loc = pickLocalization(project.localizations, locale);

  return (
    <Link
      to="/projects/$slug/kanban"
      params={{ slug: project.slug }}
      className="block transition-transform hover:scale-[1.01]"
    >
      <ChamferCard
        className="h-full p-5"
        fillClassName="fill-base-100"
        strokeClassName="stroke-base-300"
      >
        {/* Header: name + status */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-lg)] font-bold text-base-content">
            {loc.name}
          </h2>
          <ProjectStatusBadge status={project.status} />
        </div>

        {/* Description */}
        <p className="mb-3 line-clamp-2 text-[length:var(--font-size-sm)] text-base-content/60">
          {loc.description}
        </p>

        {/* Lead */}
        <p className="mb-1 text-[length:var(--font-size-xs)] text-base-content/60">
          {t("project-card-lead", { defaultValue: "Lead:" })}{" "}
          <span className="font-semibold text-base-content">{project.lead.name}</span>
        </p>

        {/* Date range */}
        <div className="mb-3 flex items-center gap-1 text-[length:var(--font-size-xs)] text-base-content/60">
          <IconCalendar size={14} stroke={1.5} aria-hidden="true" />
          <time dateTime={project.dateRange.start}>
            {formatShortDate(project.dateRange.start, locale)}
          </time>
          <span aria-hidden="true">{"\u2013"}</span>
          <time dateTime={project.dateRange.end}>
            {formatShortDate(project.dateRange.end, locale)}
          </time>
        </div>

        {/* Task summary */}
        <p className="mb-3 text-[length:var(--font-size-xs)] text-base-content/60">
          {t("project-card-task-summary", {
            total: String(taskSummary.totalTasks),
            inProgress: String(taskSummary.inProgressCount),
            blocked: String(taskSummary.blockedCount),
            defaultValue: `${String(taskSummary.totalTasks)} tasks · ${String(taskSummary.inProgressCount)} in progress · ${String(taskSummary.blockedCount)} blocked`,
          })}
        </p>

        {/* Footer: team avatars */}
        <div className="flex items-center justify-end">
          <AvatarStack assignees={[...project.team]} max={4} />
        </div>
      </ChamferCard>
    </Link>
  );
}
