/** @file Agent backends list screen — registry of AI agent configurations. */

import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { AGENT_BACKENDS, type AgentBackendEntry } from "../../../data/agents";
import { type Column, DataTable } from "../../components/data-table";
import { pickLocalization } from "../../domain/entities/localization";
import { formatTimelineTimestamp } from "../../utils/date-formatting";
import { RegistryList } from "./components/registry-list";

/* ── Status badge ─────────────────────────────────────────────────── */

function AgentStatusBadge({ status }: { readonly status: string }): JSX.Element {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wide ${
        isActive ? "bg-success/15 text-success" : "bg-base-300/40 text-base-content/50"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

/* ── Screen ───────────────────────────────────────────────────────── */

export function AgentsScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const navigate = useNavigate();

  const columns: readonly Column<AgentBackendEntry>[] = [
    {
      key: "localizations",
      header: t("agents-col-name", { defaultValue: "Name" }),
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
      key: "vendor",
      header: t("agents-col-vendor", { defaultValue: "Vendor" }),
    },
    {
      key: "version",
      header: t("agents-col-version", { defaultValue: "Version" }),
      className: "font-[family-name:var(--font-mono)]",
    },
    {
      key: "status",
      header: t("agents-col-status", { defaultValue: "Status" }),
      render: (_v, row) => <AgentStatusBadge status={row.status} />,
    },
    {
      key: "turnCount",
      header: t("agents-col-turns", { defaultValue: "Turns" }),
      className: "text-right tabular-nums",
    },
    {
      key: "lastActive",
      header: t("agents-col-last-active", { defaultValue: "Last Active" }),
      render: (_v, row) => (
        <time
          dateTime={row.lastActive}
          className="whitespace-nowrap font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60"
        >
          {formatTimelineTimestamp(row.lastActive, locale)}
        </time>
      ),
    },
  ];

  return (
    <RegistryList
      heading={t("page-agent-backends", { defaultValue: "Agent Backends" })}
      subtitle={t("page-agent-backends-sub", {
        defaultValue: "Registered AI agent configurations and endpoints.",
      })}
    >
      <DataTable
        columns={columns}
        data={AGENT_BACKENDS}
        rowKey={(r) => r.id}
        onRowClick={(r) => navigate({ to: "/system/agents/$id", params: { id: r.id } })}
        label={t("agents-table-label", { defaultValue: "Agent backends registry" })}
      />
    </RegistryList>
  );
}
