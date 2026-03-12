/** @file Placeholder for the Authentication settings screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function AuthScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-auth-settings", { defaultValue: "Authentication" })}
      subtitle={t("page-auth-settings-sub", {
        defaultValue: "Login methods, tokens, and session policies.",
      })}
    />
  );
}
