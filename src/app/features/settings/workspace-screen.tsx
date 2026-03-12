/** @file Placeholder for the Workspace settings screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function WorkspaceScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-workspace-settings", { defaultValue: "Workspace" })}
      subtitle={t("page-workspace-settings-sub", {
        defaultValue: "Workspace name, defaults, and team preferences.",
      })}
    />
  );
}
