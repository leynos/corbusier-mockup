/** @file Agent backends list screen — registry of AI agent configurations. */

import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { AGENT_BACKENDS, type AgentBackendEntry } from "../../../data/agents";
import { agentStatusDescriptors } from "../../../data/registries/agent-status-descriptors";
import { type Column, DataTable } from "../../components/data-table";
import { pickLocalization } from "../../domain/entities/localization";
import { formatTimelineTimestamp } from "../../utils/date-formatting";
import { RegistryList } from "./components/registry-list";
import { StatusBadge } from "./components/status-badge";

/* ── Status badge ─────────────────────────────────────────────────── */

function AgentStatusBadge({
  status,
  activeLabel,
  inactiveLabel,
}: {
  readonly status: AgentBackendEntry["status"];
  readonly activeLabel: string;
  readonly inactiveLabel: string;
}): JSX.Element {
  return (
    <StatusBadge
      label={status === "active" ? activeLabel : inactiveLabel}
      tone={status === "active" ? "success" : "neutral"}
    />
  );
}

/* ── Screen ───────────────────────────────────────────────────────── */

export function AgentsScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const navigate = useNavigate();
  const activeLabel = t("agent-status-active", {
    defaultValue: pickLocalization(agentStatusDescriptors.active.localizations, locale).name,
  });
  const inactiveLabel = t("agent-status-inactive", {
    defaultValue: pickLocalization(agentStatusDescriptors.inactive.localizations, locale).name,
  });

  const columns = [
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
      render: (_v, row) => (
        <AgentStatusBadge
          status={row.status}
          activeLabel={activeLabel}
          inactiveLabel={inactiveLabel}
        />
      ),
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
  ] satisfies readonly Column<AgentBackendEntry, keyof AgentBackendEntry & string>[];

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
