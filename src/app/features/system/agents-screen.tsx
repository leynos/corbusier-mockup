/** @file Placeholder for the Agent Backends screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function AgentsScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-agent-backends", { defaultValue: "Agent Backends" })}
      subtitle={t("page-agent-backends-sub", {
        defaultValue: "Registered AI agent configurations and endpoints.",
      })}
    />
  );
}
