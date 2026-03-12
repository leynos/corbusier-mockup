/** @file Placeholder for the Kanban board screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function KanbanScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-kanban", { defaultValue: "Kanban Board" })}
      subtitle={t("page-kanban-sub", {
        defaultValue: "Drag-and-drop task cards across workflow columns.",
      })}
    />
  );
}
