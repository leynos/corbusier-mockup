/** @file Placeholder for the Hooks & Policies screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function HooksScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-hooks-policies", { defaultValue: "Hooks & Policies" })}
      subtitle={t("page-hooks-policies-sub", {
        defaultValue: "Automation hooks and governance policies.",
      })}
    />
  );
}
