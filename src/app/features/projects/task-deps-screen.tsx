/** @file Placeholder for the Task Dependencies screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function TaskDepsScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-task-deps", { defaultValue: "Task Dependencies" })}
      subtitle={t("page-task-deps-sub", {
        defaultValue: "Dependency graph for this task.",
      })}
    />
  );
}
