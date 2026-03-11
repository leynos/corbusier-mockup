/** @file Placeholder for the User Detail screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function UserDetailScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-user-detail", { defaultValue: "User Profile" })}
      subtitle={t("page-user-detail-sub", {
        defaultValue: "View and edit user details and permissions.",
      })}
    />
  );
}
