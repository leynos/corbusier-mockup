/** @file Placeholder for the Calendar screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function CalendarScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-calendar", { defaultValue: "Calendar" })}
      subtitle={t("page-calendar-sub", {
        defaultValue: "Timeline view of project milestones and deadlines.",
      })}
    />
  );
}
