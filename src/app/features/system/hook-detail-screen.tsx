/** @file Placeholder for the Hook Detail screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function HookDetailScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-hook-detail", { defaultValue: "Hook Detail" })}
      subtitle={t("page-hook-detail-sub", {
        defaultValue: "Configuration and trigger rules for this hook.",
      })}
    />
  );
}
