/** @file Placeholder for the AI Suggestions screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function SuggestionsScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-ai-suggestions", { defaultValue: "AI Suggestions" })}
      subtitle={t("page-ai-suggestions-sub", {
        defaultValue: "Intelligent recommendations from your agent backends.",
      })}
    />
  );
}
