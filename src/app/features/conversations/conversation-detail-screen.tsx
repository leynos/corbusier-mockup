/** @file Placeholder for the Conversation Detail screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function ConversationDetailScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-conversation-detail", { defaultValue: "Conversation" })}
      subtitle={t("page-conversation-detail-sub", {
        defaultValue: "View the full agent conversation thread.",
      })}
    />
  );
}
