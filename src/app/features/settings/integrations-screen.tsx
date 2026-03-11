/** @file Placeholder for the Integrations settings screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function IntegrationsScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-integrations", { defaultValue: "Integrations" })}
      subtitle={t("page-integrations-sub", {
        defaultValue: "Third-party service connections and API keys.",
      })}
    />
  );
}
