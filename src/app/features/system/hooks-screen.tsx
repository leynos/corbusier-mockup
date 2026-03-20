/** @file Hooks and policies list screen — hook definitions with trigger and status. */

import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { HOOKS, type HookDefinition } from "../../../data/hooks";
import { type Column, DataTable } from "../../components/data-table";
import { pickLocalization } from "../../domain/entities/localization";
import { RegistryList } from "./components/registry-list";

/* ── Screen ───────────────────────────────────────────────────────── */

export function HooksScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const navigate = useNavigate();

  const columns: readonly Column<HookDefinition>[] = [
    {
      key: "localizations",
      header: t("hooks-col-name", { defaultValue: "Name" }),
      render: (_v, row) => {
        const loc = pickLocalization(row.localizations, locale);
        return (
          <div className="min-w-0">
            <p className="font-semibold text-base-content">{loc.name}</p>
            {loc.description ? (
              <p className="mt-0.5 truncate text-[length:var(--font-size-xs)] text-base-content/60">
                {loc.description}
              </p>
            ) : null}
          </div>
        );
      },
    },
    {
      key: "triggerType",
      header: t("hooks-col-trigger", { defaultValue: "Trigger" }),
      className: "font-[family-name:var(--font-mono)]",
    },
    {
      key: "priority",
      header: t("hooks-col-priority", { defaultValue: "Priority" }),
      className: "text-right tabular-nums",
    },
    {
      key: "enabled",
      header: t("hooks-col-status", { defaultValue: "Status" }),
      render: (_v, row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wide ${
            row.enabled ? "bg-success/15 text-success" : "bg-base-300/40 text-base-content/50"
          }`}
        >
          {row.enabled
            ? t("hook-enabled", { defaultValue: "Enabled" })
            : t("hook-disabled", { defaultValue: "Disabled" })}
        </span>
      ),
    },
  ];

  return (
    <RegistryList
      heading={t("page-hooks-policies", { defaultValue: "Hooks & Policies" })}
      subtitle={t("page-hooks-policies-sub", {
        defaultValue: "Automation hooks and governance policies.",
      })}
    >
      <DataTable
        columns={columns}
        data={HOOKS}
        rowKey={(r) => r.id}
        onRowClick={(r) => navigate({ to: "/system/hooks/$id", params: { id: r.id } })}
        label={t("hooks-table-label", { defaultValue: "Hook definitions" })}
      />
    </RegistryList>
  );
}
