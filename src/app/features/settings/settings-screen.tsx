/** @file Placeholder for the Settings screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function SettingsScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-settings", { defaultValue: "Settings" })}
      subtitle={t("page-settings-sub", {
        defaultValue: "Application preferences and account configuration.",
      })}
    />
  );
}
