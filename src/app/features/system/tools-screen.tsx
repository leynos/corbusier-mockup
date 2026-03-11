/** @file Placeholder for the Tool Registry screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function ToolsScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-tool-registry", { defaultValue: "Tool Registry" })}
      subtitle={t("page-tool-registry-sub", {
        defaultValue: "Available tools and their access policies.",
      })}
    />
  );
}
