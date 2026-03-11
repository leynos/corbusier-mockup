/** @file Placeholder for the Dashboard screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function DashboardScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-dashboard", { defaultValue: "Dashboard" })}
      subtitle={t("page-dashboard-sub", {
        defaultValue: "Overview of your workspace.",
      })}
    />
  );
}
