/** @file Agent backend detail screen — status, capabilities, and controls. */

import { IconArrowLeft } from "@tabler/icons-react";
import { getRouteApi, Link } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import {
  type AgentBackendEntry,
  type AgentBackendStatus,
  findAgentBackendById,
  parseAgentBackendId,
} from "../../../data/agents";
import { agentStatusDescriptors } from "../../../data/registries/agent-status-descriptors";
import { pickLocalization } from "../../domain/entities/localization";
import { formatTimelineTimestamp } from "../../utils/date-formatting";
import { StatusBadge } from "./components/status-badge";

const routeApi = getRouteApi("/system/agents/$id");

/** Labels for the read-only agent metadata grid cards and timestamp line. */
interface AgentMetadataLabels {
  readonly agentId: string;
  readonly vendor: string;
  readonly version: string;
  readonly totalTurns: string;
  readonly lastActive: string;
}

/** Display-ready label state for one capability toggle row. */
interface AgentCapabilityLabel {
  readonly key: string;
  readonly label: string;
  readonly enabled: boolean;
}

/** Labels and capability toggle data for the capabilities card. */
interface AgentCapabilitiesLabels {
  readonly region: string;
  readonly heading: string;
  readonly capabilities: readonly AgentCapabilityLabel[];
}

function assertNever(value: never): never {
  throw new Error(`Unhandled agent backend status: ${String(value)}`);
}

/**
 * Resolve the translated badge label for an agent backend status.
 *
 * @param status - Backend status value from fixture data.
 * @param locale - Active locale used to choose descriptor localizations.
 * @param translate - Screen-owned translation function for the final label.
 * @returns The localized status label for the badge.
 */
function getAgentStatusLabel(
  status: AgentBackendStatus,
  locale: string,
  translate: (key: string, options: { defaultValue: string }) => string,
): string {
  switch (status) {
    case "active": {
      const localizedLabel = pickLocalization(
        agentStatusDescriptors.active.localizations,
        locale,
      ).name;
      return translate("agent-status-active", { defaultValue: localizedLabel });
    }
    case "inactive": {
      const localizedLabel = pickLocalization(
        agentStatusDescriptors.inactive.localizations,
        locale,
      ).name;
      return translate("agent-status-inactive", { defaultValue: localizedLabel });
    }
    default:
      return assertNever(status);
  }
}

/**
 * @internal Render the not-found fallback for an unknown agent backend id.
 *
 * Props: the back-link label and the fallback message body.
 */
function AgentNotFound({
  backLabel,
  notFoundMessage,
}: {
  readonly backLabel: string;
  readonly notFoundMessage: string;
}): JSX.Element {
  return (
    <div>
      <Link
        to="/system/agents"
        className="inline-flex items-center gap-1 text-primary hover:underline"
      >
        <IconArrowLeft size={16} stroke={1.5} aria-hidden="true" />
        {backLabel}
      </Link>
      <p className="mt-4 text-base-content/60">{notFoundMessage}</p>
    </div>
  );
}

/**
 * @internal Render read-only metadata cards and the last-active timestamp.
 *
 * Props: the agent entry, active locale, and translated metadata labels.
 */
function AgentMetadataGrid({
  agent,
  locale,
  labels,
}: {
  readonly agent: AgentBackendEntry;
  readonly locale: string;
  readonly labels: AgentMetadataLabels;
}): JSX.Element {
  return (
    <>
      <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-base-300 bg-base-100 p-4">
          <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {labels.agentId}
          </dt>
          <dd className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)]">
            {agent.id}
          </dd>
        </div>
        <div className="rounded-lg border border-base-300 bg-base-100 p-4">
          <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {labels.vendor}
          </dt>
          <dd className="mt-1 text-[length:var(--font-size-sm)]">{agent.vendor}</dd>
        </div>
        <div className="rounded-lg border border-base-300 bg-base-100 p-4">
          <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {labels.version}
          </dt>
          <dd className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)]">
            {agent.version}
          </dd>
        </div>
        <div className="rounded-lg border border-base-300 bg-base-100 p-4">
          <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {labels.totalTurns}
          </dt>
          <dd className="mt-1 tabular-nums text-[length:var(--font-size-sm)]">{agent.turnCount}</dd>
        </div>
      </dl>
      <p className="mt-4 text-[length:var(--font-size-xs)] text-base-content/60">
        {labels.lastActive}{" "}
        <time dateTime={agent.lastActive} className="font-[family-name:var(--font-mono)]">
          {formatTimelineTimestamp(agent.lastActive, locale)}
        </time>
      </p>
    </>
  );
}

/**
 * @internal Render the read-only capability checklist for an agent backend.
 *
 * Props: translated region metadata and display-ready capability labels.
 */
function AgentCapabilitiesCard({
  labels,
}: {
  readonly labels: AgentCapabilitiesLabels;
}): JSX.Element {
  return (
    <section
      className="mt-6 card border border-base-300 bg-base-100 shadow-sm"
      aria-label={labels.region}
    >
      <div className="card-body p-5">
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
          {labels.heading}
        </h2>
        <div className="flex flex-wrap gap-3">
          {labels.capabilities.map((cap) => (
            <label
              key={cap.key}
              className="flex items-center gap-2 text-[length:var(--font-size-sm)]"
            >
              <input
                type="checkbox"
                checked={cap.enabled}
                disabled
                className="checkbox checkbox-sm checkbox-primary"
              />
              <span className={cap.enabled ? "text-base-content" : "text-base-content/50"}>
                {cap.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AgentDetailScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const { id } = routeApi.useParams();
  const agentId = parseAgentBackendId(id);
  const backLabel = t("back-to-agents", { defaultValue: "Back to Agent Backends" });
  const notFoundMessage = t("agent-not-found", { defaultValue: "Agent backend not found." });

  if (!agentId) return <AgentNotFound backLabel={backLabel} notFoundMessage={notFoundMessage} />;

  const agent = findAgentBackendById(agentId);

  if (!agent) return <AgentNotFound backLabel={backLabel} notFoundMessage={notFoundMessage} />;

  const loc = pickLocalization(agent.localizations, locale);
  const isActive = agent.status === "active";
  const statusLabel = getAgentStatusLabel(agent.status, locale, t);
  const metadataLabels: AgentMetadataLabels = {
    agentId: t("agent-detail-id", { defaultValue: "Agent ID" }),
    vendor: t("agent-detail-vendor", { defaultValue: "Vendor" }),
    version: t("agent-detail-version", { defaultValue: "Version" }),
    totalTurns: t("agent-detail-turns", { defaultValue: "Total Turns" }),
    lastActive: t("agent-detail-last-active", { defaultValue: "Last active:" }),
  };
  const capabilityLabels: AgentCapabilitiesLabels = {
    region: t("agent-capabilities-region", { defaultValue: "Capabilities" }),
    heading: t("agent-capabilities-heading", { defaultValue: "Capabilities" }),
    capabilities: [
      {
        key: "streaming",
        label: t("cap-streaming", { defaultValue: "Streaming" }),
        enabled: agent.capabilities.supportsStreaming,
      },
      {
        key: "tools",
        label: t("cap-tools", { defaultValue: "Tool Use" }),
        enabled: agent.capabilities.supportsTools,
      },
      {
        key: "multi-turn",
        label: t("cap-multi-turn", { defaultValue: "Multi-turn" }),
        enabled: agent.capabilities.supportsMultiTurn,
      },
      {
        key: "handoff",
        label: t("cap-handoff", { defaultValue: "Handoff" }),
        enabled: agent.capabilities.supportsHandoff,
      },
    ],
  };

  return (
    <div>
      <Link
        to="/system/agents"
        className="inline-flex items-center gap-1 text-primary hover:underline"
      >
        <IconArrowLeft size={16} stroke={1.5} aria-hidden="true" />
        {backLabel}
      </Link>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
            {loc.name}
          </h1>
          {loc.description ? <p className="mt-1 text-base-content/70">{loc.description}</p> : null}
        </div>
        <StatusBadge label={statusLabel} tone={isActive ? "success" : "neutral"} size="regular" />
      </div>
      <AgentMetadataGrid agent={agent} locale={locale} labels={metadataLabels} />
      <div className="mt-6">
        <button
          type="button"
          className={`btn btn-sm ${isActive ? "btn-error btn-outline" : "btn-success"}`}
          disabled
        >
          {isActive
            ? t("agent-action-deactivate", { defaultValue: "Deactivate" })
            : t("agent-action-activate", { defaultValue: "Activate" })}
        </button>
      </div>
      <AgentCapabilitiesCard labels={capabilityLabels} />
    </div>
  );
}
