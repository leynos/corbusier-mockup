/** @file Status badge for project status (active / inactive / completed). */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { Project } from "../../../../data/projects";

type ProjectStatus = Project["status"];

interface ProjectStatusBadgeProps {
  readonly status: ProjectStatus;
  readonly className?: string;
}

const STYLES: Record<ProjectStatus, { bg: string; text: string }> = {
  active: { bg: "bg-success/15", text: "text-success" },
  inactive: { bg: "bg-base-300/40", text: "text-base-content/50" },
  completed: { bg: "bg-info/15", text: "text-info" },
};

export function ProjectStatusBadge({
  status,
  className = "",
}: ProjectStatusBadgeProps): JSX.Element {
  const { t } = useTranslation();

  const labels: Record<ProjectStatus, string> = {
    active: t("project-status-active", { defaultValue: "Active" }),
    inactive: t("project-status-inactive", { defaultValue: "Inactive" }),
    completed: t("project-status-completed", { defaultValue: "Completed" }),
  };

  const style = STYLES[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wide ${style.bg} ${style.text} ${className}`}
    >
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          status === "active" ? "bg-success" : "border border-current bg-transparent"
        }`}
        aria-hidden="true"
      />
      {labels[status]}
    </span>
  );
}
