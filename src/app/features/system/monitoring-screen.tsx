/** @file Placeholder for the Monitoring screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function MonitoringScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-monitoring", { defaultValue: "Monitoring" })}
      subtitle={t("page-monitoring-sub", {
        defaultValue: "System health, logs, and performance metrics.",
      })}
    />
  );
}
