/** @file Placeholder for the Tenant Management screen. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PlaceholderScreen } from "../placeholder-screen";

export function TenantsScreen(): JSX.Element {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      title={t("page-tenant-management", { defaultValue: "Tenant Management" })}
      subtitle={t("page-tenant-management-sub", {
        defaultValue: "Manage tenant configurations and isolation boundaries.",
      })}
    />
  );
}
