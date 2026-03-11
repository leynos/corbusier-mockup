/** @file Placeholder for the My Tasks screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function TasksScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-my-tasks", { defaultValue: "My Tasks" })}
      subtitle={t("page-my-tasks-sub", {
        defaultValue: "Tasks assigned to you across all projects.",
      })}
    />
  );
}
