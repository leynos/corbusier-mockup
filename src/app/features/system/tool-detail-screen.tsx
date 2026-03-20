/** @file Tool (MCP server) detail screen — controls, tool catalog, health history. */

import { IconArrowLeft } from "@tabler/icons-react";
import { getRouteApi, Link } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { HealthStatus } from "../../../data/dashboard";
import {
  findMcpServerById,
  type McpServer,
  type McpTool,
  mcpServerId,
} from "../../../data/mcp-servers";
import { healthStatusDescriptors } from "../../../data/registries";
import { ChamferCard } from "../../components/chamfer-card";
import { pickLocalization } from "../../domain/entities/localization";
import { formatTimelineTimestamp } from "../../utils/date-formatting";
import { HealthBadge } from "./components/health-badge";

/* ── Route API ────────────────────────────────────────────────────── */

const routeApi = getRouteApi("/system/tools/$id");

/* ── Tool catalog item ────────────────────────────────────────────── */

function ToolCatalogItem({
  tool,
  locale,
}: {
  readonly tool: McpTool;
  readonly locale: string;
}): JSX.Element {
  const loc = pickLocalization(tool.localizations, locale);
  return (
    <li className="space-y-2">
      <p className="font-semibold text-[length:var(--font-size-sm)] text-base-content">
        {tool.name}
      </p>
      {loc.description ? (
        <p className="text-[length:var(--font-size-xs)] text-base-content/60">{loc.description}</p>
      ) : null}
      {/* Input schema in a chamfered code block */}
      <ChamferCard size="sm" fillClassName="fill-base-200" strokeClassName="stroke-base-300">
        <pre className="whitespace-pre-wrap break-words p-3 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)]">
          {tool.inputSchema}
        </pre>
      </ChamferCard>
    </li>
  );
}

function ToolNotFound({
  backToToolsLabel,
  notFoundMessage,
}: {
  readonly backToToolsLabel: string;
  readonly notFoundMessage: string;
}): JSX.Element {
  return (
    <div>
      <Link
        to="/system/tools"
        className="inline-flex items-center gap-1 text-primary hover:underline"
      >
        <IconArrowLeft size={16} stroke={1.5} aria-hidden="true" />
        {backToToolsLabel}
      </Link>
      <p className="mt-4 text-base-content/60">{notFoundMessage}</p>
    </div>
  );
}

function ToolDetailHeader({
  server,
  locale,
  backToToolsLabel,
  healthLabel,
}: {
  readonly server: McpServer;
  readonly locale: string;
  readonly backToToolsLabel: string;
  readonly healthLabel: string;
}): JSX.Element {
  const loc = pickLocalization(server.localizations, locale);
  return (
    <div>
      <Link
        to="/system/tools"
        className="inline-flex items-center gap-1 text-primary hover:underline"
      >
        <IconArrowLeft size={16} stroke={1.5} aria-hidden="true" />
        {backToToolsLabel}
      </Link>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
            {loc.name}
          </h1>
          {loc.description ? <p className="mt-1 text-base-content/70">{loc.description}</p> : null}
        </div>
        <HealthBadge status={server.healthStatus} label={healthLabel} />
      </div>
    </div>
  );
}

function ToolMetadataGrid({
  server,
  serverIdLabel,
  transportLabel,
  lifecycleLabel,
  toolsCountLabel,
}: {
  readonly server: McpServer;
  readonly serverIdLabel: string;
  readonly transportLabel: string;
  readonly lifecycleLabel: string;
  readonly toolsCountLabel: string;
}): JSX.Element {
  const items = [
    {
      key: "id",
      label: serverIdLabel,
      value: server.id,
      valueClassName: "mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)]",
    },
    {
      key: "transport",
      label: transportLabel,
      value: server.transport,
      valueClassName: "mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)]",
    },
    {
      key: "lifecycle",
      label: lifecycleLabel,
      value: server.lifecycleState,
      valueClassName:
        "mt-1 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] uppercase",
    },
    {
      key: "tools-count",
      label: toolsCountLabel,
      value: server.toolCatalog.length,
      valueClassName: "mt-1 tabular-nums text-[length:var(--font-size-sm)]",
    },
  ] as const;

  return (
    <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.key} className="rounded-lg border border-base-300 bg-base-100 p-4">
          <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {item.label}
          </dt>
          <dd className={item.valueClassName}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ToolControls({
  isRunning,
  startLabel,
  stopLabel,
}: {
  readonly isRunning: boolean;
  readonly startLabel: string;
  readonly stopLabel: string;
}): JSX.Element {
  return (
    <div className="mt-6 flex gap-3">
      <button
        type="button"
        className={`btn btn-sm ${isRunning ? "btn-error btn-outline" : "btn-success"}`}
        disabled
      >
        {isRunning ? stopLabel : startLabel}
      </button>
    </div>
  );
}

function ToolCatalogSection({
  server,
  locale,
  regionLabel,
  headingLabel,
}: {
  readonly server: McpServer;
  readonly locale: string;
  readonly regionLabel: string;
  readonly headingLabel: string;
}): JSX.Element {
  return (
    <section
      className="mt-6 card border border-base-300 bg-base-100 shadow-sm"
      aria-label={regionLabel}
    >
      <div className="card-body p-5">
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
          {headingLabel}
        </h2>
        <ul className="space-y-4">
          {server.toolCatalog.map((tool) => (
            <ToolCatalogItem key={tool.name} tool={tool} locale={locale} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ToolHealthHistorySection({
  server,
  locale,
  regionLabel,
  headingLabel,
  getHealthLabel,
}: {
  readonly server: McpServer;
  readonly locale: string;
  readonly regionLabel: string;
  readonly headingLabel: string;
  readonly getHealthLabel: (status: HealthStatus) => string;
}): JSX.Element {
  return (
    <section
      className="mt-6 card border border-base-300 bg-base-100 shadow-sm"
      aria-label={regionLabel}
    >
      <div className="card-body p-5">
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
          {headingLabel}
        </h2>
        <ol className="space-y-3">
          {server.healthHistory.map((entry) => {
            const entryLoc = pickLocalization(entry.localizations, locale);
            return (
              <li key={`${entry.timestamp}-${entry.status}`} className="flex items-center gap-3">
                <HealthBadge status={entry.status} label={getHealthLabel(entry.status)} />
                <time
                  dateTime={entry.timestamp}
                  className="whitespace-nowrap font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60"
                >
                  {formatTimelineTimestamp(entry.timestamp, locale)}
                </time>
                <span className="text-[length:var(--font-size-sm)] text-base-content/70">
                  {entryLoc.name}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function ToolDetailScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const { id } = routeApi.useParams();
  const backToToolsLabel = t("back-to-tools", { defaultValue: "Back to Tool Registry" });
  const getHealthLabel = (status: HealthStatus): string =>
    pickLocalization(healthStatusDescriptors[status].localizations, locale).name;

  let server: McpServer | undefined;
  try {
    server = findMcpServerById(mcpServerId(id));
  } catch {
    server = undefined;
  }

  if (!server) {
    return (
      <ToolNotFound
        backToToolsLabel={backToToolsLabel}
        notFoundMessage={t("tool-not-found", { defaultValue: "MCP server not found." })}
      />
    );
  }

  return (
    <div>
      <ToolDetailHeader
        server={server}
        locale={locale}
        backToToolsLabel={backToToolsLabel}
        healthLabel={getHealthLabel(server.healthStatus)}
      />
      <ToolMetadataGrid
        server={server}
        serverIdLabel={t("tool-detail-id", { defaultValue: "Server ID" })}
        transportLabel={t("tool-detail-transport", { defaultValue: "Transport" })}
        lifecycleLabel={t("tool-detail-lifecycle", { defaultValue: "Lifecycle" })}
        toolsCountLabel={t("tool-detail-tools-count", { defaultValue: "Tools" })}
      />
      <ToolControls
        isRunning={server.lifecycleState === "running"}
        startLabel={t("tool-action-start", { defaultValue: "Start" })}
        stopLabel={t("tool-action-stop", { defaultValue: "Stop" })}
      />
      <ToolCatalogSection
        server={server}
        locale={locale}
        regionLabel={t("tool-catalog-region", { defaultValue: "Tool catalog" })}
        headingLabel={t("tool-catalog-heading", { defaultValue: "Tool Catalog" })}
      />
      <ToolHealthHistorySection
        server={server}
        locale={locale}
        regionLabel={t("tool-health-region", { defaultValue: "Health history" })}
        headingLabel={t("tool-health-heading", { defaultValue: "Health History" })}
        getHealthLabel={getHealthLabel}
      />
    </div>
  );
}
