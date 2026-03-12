/** @file Placeholder for the Task Detail screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function TaskDetailScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-task-detail", { defaultValue: "Task Detail" })}
      subtitle={t("page-task-detail-sub", {
        defaultValue: "View and edit task details.",
      })}
    />
  );
}
