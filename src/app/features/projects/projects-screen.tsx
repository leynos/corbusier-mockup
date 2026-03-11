/** @file Placeholder for the Projects listing screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function ProjectsScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-projects", { defaultValue: "Projects" })}
      subtitle={t("page-projects-sub", {
        defaultValue: "All directives and project workspaces.",
      })}
    />
  );
}
