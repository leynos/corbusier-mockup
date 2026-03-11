/** @file Placeholder for the Appearance settings screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function AppearanceScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-appearance", { defaultValue: "Appearance" })}
      subtitle={t("page-appearance-sub", {
        defaultValue: "Theme, display density, and visual preferences.",
      })}
    />
  );
}
