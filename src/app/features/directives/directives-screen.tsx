/** @file Placeholder for the Directives screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function DirectivesScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-directives", { defaultValue: "Directives" })}
      subtitle={t("page-directives-sub", {
        defaultValue: "Standing instructions and policies for this project.",
      })}
    />
  );
}
