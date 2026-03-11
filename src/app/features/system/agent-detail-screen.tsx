/** @file Placeholder for the Agent Detail screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function AgentDetailScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-agent-detail", { defaultValue: "Agent Detail" })}
      subtitle={t("page-agent-detail-sub", {
        defaultValue: "Configuration and status for this agent backend.",
      })}
    />
  );
}
