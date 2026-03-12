/** @file Placeholder for the Reports screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function ReportsScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-reports", { defaultValue: "Reports" })}
      subtitle={t("page-reports-sub", {
        defaultValue: "Analytics and performance dashboards.",
      })}
    />
  );
}
