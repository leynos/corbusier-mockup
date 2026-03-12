/** @file Placeholder for the List view screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function ListScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-list-view", { defaultValue: "List View" })}
      subtitle={t("page-list-view-sub", {
        defaultValue: "Tabular listing of all tasks in this project.",
      })}
    />
  );
}
