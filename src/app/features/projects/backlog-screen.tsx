/** @file Placeholder for the Backlog screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function BacklogScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-backlog", { defaultValue: "Backlog" })}
      subtitle={t("page-backlog-sub", {
        defaultValue: "Unprioritised tasks awaiting triage.",
      })}
    />
  );
}
