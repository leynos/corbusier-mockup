/** @file Personnel list screen — user directory with role, tasks, and last active. */

import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { PERSONNEL, type Personnel, personnelRoleDescriptors } from "../../../data/personnel";
import { type Column, DataTable } from "../../components/data-table";
import { pickLocalization } from "../../domain/entities/localization";
import { formatTimelineTimestamp } from "../../utils/date-formatting";
import { RegistryList } from "./components/registry-list";

export function PersonnelScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const navigate = useNavigate();

  const columns = [
    {
      key: "localizations",
      header: t("personnel-col-name", { defaultValue: "Name" }),
      render: (_v, row) => {
        const loc = pickLocalization(row.localizations, locale);
        return <span className="font-semibold text-base-content">{loc.name}</span>;
      },
    },
    {
      key: "role",
      header: t("personnel-col-role", { defaultValue: "Role" }),
      render: (_v, row) => {
        const roleLoc = pickLocalization(personnelRoleDescriptors[row.role].localizations, locale);
        return (
          <span className="inline-flex items-center rounded-full bg-base-300/40 px-2.5 py-0.5 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wide text-base-content/70">
            {roleLoc.name}
          </span>
        );
      },
    },
    {
      key: "assignedTaskCount",
      header: t("personnel-col-tasks", { defaultValue: "Tasks" }),
      className: "text-right tabular-nums",
    },
    {
      key: "lastActive",
      header: t("personnel-col-last-active", { defaultValue: "Last Active" }),
      render: (_v, row) => (
        <time
          dateTime={row.lastActive}
          className="whitespace-nowrap font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60"
        >
          {formatTimelineTimestamp(row.lastActive, locale)}
        </time>
      ),
    },
  ] satisfies readonly Column<Personnel, keyof Personnel & string>[];

  return (
    <RegistryList
      heading={t("page-personnel", { defaultValue: "Personnel" })}
      subtitle={t("page-personnel-sub", {
        defaultValue: "Manage team members and access roles.",
      })}
    >
      <DataTable
        columns={columns}
        data={PERSONNEL}
        rowKey={(r) => r.id}
        onRowClick={(r) => navigate({ to: "/system/personnel/$id", params: { id: r.id } })}
        label={t("personnel-table-label", { defaultValue: "Personnel directory" })}
      />
    </RegistryList>
  );
}
