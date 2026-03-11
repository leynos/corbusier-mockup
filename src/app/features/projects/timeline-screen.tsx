/** @file Placeholder for the Timeline screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function TimelineScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-timeline", { defaultValue: "Timeline" })}
      subtitle={t("page-timeline-sub", {
        defaultValue: "Gantt-style view of task durations and dependencies.",
      })}
    />
  );
}
