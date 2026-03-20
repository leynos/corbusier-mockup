/** @file Tenant management screen — read-only tenant details card. */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { TENANT } from "../../../data/tenant";
import { pickLocalization } from "../../domain/entities/localization";
import { formatShortDate } from "../../utils/date-formatting";
import { RegistryList } from "./components/registry-list";

export function TenantsScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const loc = pickLocalization(TENANT.localizations, locale);

  return (
    <RegistryList
      heading={t("page-tenant-management", { defaultValue: "Tenant Management" })}
      subtitle={t("page-tenant-management-sub", {
        defaultValue: "Manage tenant configurations and isolation boundaries.",
      })}
    >
      <div className="rounded-lg border border-base-300 bg-base-100 p-6">
        {/* Tenant header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xl)] font-bold text-base-content">
              {loc.name}
            </h2>
            {loc.description ? (
              <p className="mt-1 text-base-content/70">{loc.description}</p>
            ) : null}
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wide ${
              TENANT.status === "active" ? "bg-success/15 text-success" : "bg-error/15 text-error"
            }`}
          >
            {TENANT.status === "active"
              ? t("tenant-status-active", { defaultValue: "Active" })
              : t("tenant-status-suspended", { defaultValue: "Suspended" })}
          </span>
        </div>

        {/* Metadata grid */}
        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {t("tenant-id", { defaultValue: "Tenant ID" })}
            </dt>
            <dd className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)]">
              {TENANT.id}
            </dd>
          </div>
          <div>
            <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {t("tenant-slug", { defaultValue: "Slug" })}
            </dt>
            <dd className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)]">
              {TENANT.slug}
            </dd>
          </div>
          <div>
            <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {t("tenant-plan", { defaultValue: "Plan" })}
            </dt>
            <dd className="mt-1 text-[length:var(--font-size-sm)]">{TENANT.plan}</dd>
          </div>
          <div>
            <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {t("tenant-owner", { defaultValue: "Owner" })}
            </dt>
            <dd className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)]">
              {TENANT.ownerUserId}
            </dd>
          </div>
          <div>
            <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {t("tenant-created", { defaultValue: "Created" })}
            </dt>
            <dd className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)]">
              <time dateTime={TENANT.createdAt}>{formatShortDate(TENANT.createdAt, locale)}</time>
            </dd>
          </div>
          <div>
            <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {t("tenant-members", { defaultValue: "Members" })}
            </dt>
            <dd className="mt-1 tabular-nums text-[length:var(--font-size-sm)]">
              {TENANT.memberCount}
            </dd>
          </div>
        </dl>
      </div>
    </RegistryList>
  );
}
