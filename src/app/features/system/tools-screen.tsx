/** @file Tool registry list screen — MCP servers with health and lifecycle. */

import { useNavigate } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { MCP_SERVERS, type McpLifecycleState, type McpServer } from "../../../data/mcp-servers";
import { type Column, DataTable } from "../../components/data-table";
import { pickLocalization } from "../../domain/entities/localization";
import { HealthBadge } from "./components/health-badge";
import { RegistryList } from "./components/registry-list";
import { StatusBadge, type StatusBadgeTone } from "./components/status-badge";

/* ── Lifecycle badge ──────────────────────────────────────────────── */

const LIFECYCLE_STYLE: Record<McpLifecycleState, StatusBadgeTone> = {
  running: "success",
  registered: "info",
  stopped: "neutral",
};

function LifecycleBadge({ state }: { readonly state: McpLifecycleState }): JSX.Element {
  const { t } = useTranslation();
  return (
    <StatusBadge
      label={t(`tool-lifecycle-${state}`, { defaultValue: state })}
      tone={LIFECYCLE_STYLE[state]}
    />
  );
}

/* ── Screen ───────────────────────────────────────────────────────── */

export function ToolsScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const navigate = useNavigate();

  const columns: readonly Column<McpServer>[] = [
    {
      key: "localizations",
      header: t("tools-col-name", { defaultValue: "Name" }),
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
      key: "transport",
      header: t("tools-col-transport", { defaultValue: "Transport" }),
      className: "font-[family-name:var(--font-mono)]",
    },
    {
      key: "lifecycleState",
      header: t("tools-col-lifecycle", { defaultValue: "Lifecycle" }),
      render: (_v, row) => <LifecycleBadge state={row.lifecycleState} />,
    },
    {
      key: "healthStatus",
      header: t("tools-col-health", { defaultValue: "Health" }),
      render: (_v, row) => <HealthBadge status={row.healthStatus} />,
    },
    {
      key: "toolCatalog",
      header: t("tools-col-tool-count", { defaultValue: "Tools" }),
      className: "text-right tabular-nums",
      render: (_v, row) => String(row.toolCatalog.length),
    },
  ];

  return (
    <RegistryList
      heading={t("page-tool-registry", { defaultValue: "Tool Registry" })}
      subtitle={t("page-tool-registry-sub", {
        defaultValue: "Available tools and their access policies.",
      })}
    >
      <DataTable
        columns={columns}
        data={MCP_SERVERS}
        rowKey={(r) => r.id}
        onRowClick={(r) => navigate({ to: "/system/tools/$id", params: { id: r.id } })}
        label={t("tools-table-label", { defaultValue: "MCP server registry" })}
      />
    </RegistryList>
  );
}
