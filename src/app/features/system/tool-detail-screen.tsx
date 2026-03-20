/** @file Tool (MCP server) detail screen — controls, tool catalog, health history. */

import { IconArrowLeft } from "@tabler/icons-react";
import { getRouteApi, Link } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { findMcpServerById, type McpTool } from "../../../data/mcp-servers";
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

/* ── Screen ───────────────────────────────────────────────────────── */

export function ToolDetailScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const { id } = routeApi.useParams();
  const server = findMcpServerById(id);

  if (!server) {
    return (
      <div>
        <Link
          to="/system/tools"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <IconArrowLeft size={16} stroke={1.5} aria-hidden="true" />
          {t("back-to-tools", { defaultValue: "Back to Tool Registry" })}
        </Link>
        <p className="mt-4 text-base-content/60">
          {t("tool-not-found", { defaultValue: "MCP server not found." })}
        </p>
      </div>
    );
  }

  const loc = pickLocalization(server.localizations, locale);
  const isRunning = server.lifecycleState === "running";

  return (
    <div>
      <Link
        to="/system/tools"
        className="inline-flex items-center gap-1 text-primary hover:underline"
      >
        <IconArrowLeft size={16} stroke={1.5} aria-hidden="true" />
        {t("back-to-tools", { defaultValue: "Back to Tool Registry" })}
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
            {loc.name}
          </h1>
          {loc.description ? <p className="mt-1 text-base-content/70">{loc.description}</p> : null}
        </div>
        <HealthBadge status={server.healthStatus} />
      </div>

      {/* Metadata grid */}
      <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-base-300 bg-base-100 p-4">
          <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("tool-detail-id", { defaultValue: "Server ID" })}
          </dt>
          <dd className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)]">
            {server.id}
          </dd>
        </div>
        <div className="rounded-lg border border-base-300 bg-base-100 p-4">
          <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("tool-detail-transport", { defaultValue: "Transport" })}
          </dt>
          <dd className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)]">
            {server.transport}
          </dd>
        </div>
        <div className="rounded-lg border border-base-300 bg-base-100 p-4">
          <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("tool-detail-lifecycle", { defaultValue: "Lifecycle" })}
          </dt>
          <dd className="mt-1 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] uppercase">
            {server.lifecycleState}
          </dd>
        </div>
        <div className="rounded-lg border border-base-300 bg-base-100 p-4">
          <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("tool-detail-tools-count", { defaultValue: "Tools" })}
          </dt>
          <dd className="mt-1 tabular-nums text-[length:var(--font-size-sm)]">
            {server.toolCatalog.length}
          </dd>
        </div>
      </dl>

      {/* Start/Stop controls */}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          className={`btn btn-sm ${isRunning ? "btn-error btn-outline" : "btn-success"}`}
          aria-disabled="true"
        >
          {isRunning
            ? t("tool-action-stop", { defaultValue: "Stop" })
            : t("tool-action-start", { defaultValue: "Start" })}
        </button>
      </div>

      {/* Tool catalog */}
      <section
        className="mt-6 card border border-base-300 bg-base-100 shadow-sm"
        aria-label={t("tool-catalog-region", { defaultValue: "Tool catalog" })}
      >
        <div className="card-body p-5">
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("tool-catalog-heading", { defaultValue: "Tool Catalog" })}
          </h2>
          <ul className="space-y-4">
            {server.toolCatalog.map((tool) => (
              <ToolCatalogItem key={tool.name} tool={tool} locale={locale} />
            ))}
          </ul>
        </div>
      </section>

      {/* Health history */}
      <section
        className="mt-6 card border border-base-300 bg-base-100 shadow-sm"
        aria-label={t("tool-health-region", { defaultValue: "Health history" })}
      >
        <div className="card-body p-5">
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("tool-health-heading", { defaultValue: "Health History" })}
          </h2>
          <ol className="space-y-3">
            {server.healthHistory.map((entry) => {
              const entryLoc = pickLocalization(entry.localizations, locale);
              return (
                <li key={`${entry.timestamp}-${entry.status}`} className="flex items-center gap-3">
                  <HealthBadge status={entry.status} />
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
    </div>
  );
}
