/** @file Placeholder for the Project Landing screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function ProjectLandingScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-project-landing", { defaultValue: "Project Overview" })}
      subtitle={t("page-project-landing-sub", {
        defaultValue: "Summary and quick actions for this project.",
      })}
    />
  );
}
