/** @file Placeholder for the Tool Detail screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function ToolDetailScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-tool-detail", { defaultValue: "Tool Detail" })}
      subtitle={t("page-tool-detail-sub", {
        defaultValue: "Configuration and usage details for this tool.",
      })}
    />
  );
}
