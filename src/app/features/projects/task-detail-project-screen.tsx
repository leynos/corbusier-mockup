/** @file Placeholder for the project-scoped Task Detail screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function TaskDetailProjectScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-task-detail-project", { defaultValue: "Task Detail" })}
      subtitle={t("page-task-detail-project-sub", {
        defaultValue: "View and edit this task within its project context.",
      })}
    />
  );
}
