/** @file Placeholder for the Personnel screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function PersonnelScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-personnel", { defaultValue: "Personnel" })}
      subtitle={t("page-personnel-sub", {
        defaultValue: "Manage team members and access roles.",
      })}
    />
  );
}
