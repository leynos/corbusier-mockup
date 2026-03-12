/** @file Placeholder for the Conversations listing screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function ConversationsScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-conversations", { defaultValue: "Conversations" })}
      subtitle={t("page-conversations-sub", {
        defaultValue: "Agent conversation threads for this project.",
      })}
    />
  );
}
