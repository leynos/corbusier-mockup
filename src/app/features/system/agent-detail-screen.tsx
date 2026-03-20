/** @file Agent backend detail screen — status, capabilities, and controls. */

import { IconArrowLeft } from "@tabler/icons-react";
import { getRouteApi, Link } from "@tanstack/react-router";
import type { TFunction } from "i18next";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import {
  type AgentBackendEntry,
  type AgentBackendStatus,
  type AgentCapabilities,
  findAgentBackendById,
} from "../../../data/agents";
import { agentStatusDescriptors } from "../../../data/registries/agent-status-descriptors";
import { pickLocalization } from "../../domain/entities/localization";
import { formatTimelineTimestamp } from "../../utils/date-formatting";
import { StatusBadge } from "./components/status-badge";

const routeApi = getRouteApi("/system/agents/$id");

function getAgentStatusLabel(status: AgentBackendStatus, locale: string, t: TFunction): string {
  const isActive = status === "active";
  const localizedLabel = pickLocalization(
    isActive
      ? agentStatusDescriptors.active.localizations
      : agentStatusDescriptors.inactive.localizations,
    locale,
  ).name;

  return isActive
    ? t("agent-status-active", { defaultValue: localizedLabel })
    : t("agent-status-inactive", { defaultValue: localizedLabel });
}

function AgentNotFound({ t }: { readonly t: TFunction }): JSX.Element {
  return (
    <div>
      <Link
        to="/system/agents"
        className="inline-flex items-center gap-1 text-primary hover:underline"
      >
        <IconArrowLeft size={16} stroke={1.5} aria-hidden="true" />
        {t("back-to-agents", { defaultValue: "Back to Agent Backends" })}
      </Link>
      <p className="mt-4 text-base-content/60">
        {t("agent-not-found", { defaultValue: "Agent backend not found." })}
      </p>
    </div>
  );
}

function AgentMetadataGrid({
  agent,
  locale,
  t,
}: {
  readonly agent: AgentBackendEntry;
  readonly locale: string;
  readonly t: TFunction;
}): JSX.Element {
  return (
    <>
      <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-base-300 bg-base-100 p-4">
          <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("agent-detail-id", { defaultValue: "Agent ID" })}
          </dt>
          <dd className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)]">
            {agent.id}
          </dd>
        </div>
        <div className="rounded-lg border border-base-300 bg-base-100 p-4">
          <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("agent-detail-vendor", { defaultValue: "Vendor" })}
          </dt>
          <dd className="mt-1 text-[length:var(--font-size-sm)]">{agent.vendor}</dd>
        </div>
        <div className="rounded-lg border border-base-300 bg-base-100 p-4">
          <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("agent-detail-version", { defaultValue: "Version" })}
          </dt>
          <dd className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)]">
            {agent.version}
          </dd>
        </div>
        <div className="rounded-lg border border-base-300 bg-base-100 p-4">
          <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("agent-detail-turns", { defaultValue: "Total Turns" })}
          </dt>
          <dd className="mt-1 tabular-nums text-[length:var(--font-size-sm)]">{agent.turnCount}</dd>
        </div>
      </dl>
      <p className="mt-4 text-[length:var(--font-size-xs)] text-base-content/60">
        {t("agent-detail-last-active", { defaultValue: "Last active:" })}{" "}
        <time dateTime={agent.lastActive} className="font-[family-name:var(--font-mono)]">
          {formatTimelineTimestamp(agent.lastActive, locale)}
        </time>
      </p>
    </>
  );
}

function AgentCapabilitiesCard({
  capabilities,
  t,
}: {
  readonly capabilities: AgentCapabilities;
  readonly t: TFunction;
}): JSX.Element {
  const capabilityLabels: readonly {
    readonly key: string;
    readonly label: string;
    readonly enabled: boolean;
  }[] = [
    {
      key: "streaming",
      label: t("cap-streaming", { defaultValue: "Streaming" }),
      enabled: capabilities.supportsStreaming,
    },
    {
      key: "tools",
      label: t("cap-tools", { defaultValue: "Tool Use" }),
      enabled: capabilities.supportsTools,
    },
    {
      key: "multi-turn",
      label: t("cap-multi-turn", { defaultValue: "Multi-turn" }),
      enabled: capabilities.supportsMultiTurn,
    },
    {
      key: "handoff",
      label: t("cap-handoff", { defaultValue: "Handoff" }),
      enabled: capabilities.supportsHandoff,
    },
  ];

  return (
    <section
      className="mt-6 card border border-base-300 bg-base-100 shadow-sm"
      aria-label={t("agent-capabilities-region", { defaultValue: "Capabilities" })}
    >
      <div className="card-body p-5">
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
          {t("agent-capabilities-heading", { defaultValue: "Capabilities" })}
        </h2>
        <div className="flex flex-wrap gap-3">
          {capabilityLabels.map((cap) => (
            <label
              key={cap.key}
              className="flex items-center gap-2 text-[length:var(--font-size-sm)]"
            >
              <input
                type="checkbox"
                checked={cap.enabled}
                readOnly
                className="checkbox checkbox-sm checkbox-primary"
                aria-label={cap.label}
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
  const agent = findAgentBackendById(id);

  if (!agent) return <AgentNotFound t={t} />;

  const loc = pickLocalization(agent.localizations, locale);
  const isActive = agent.status === "active";
  const statusLabel = getAgentStatusLabel(agent.status, locale, t);

  return (
    <div>
      <Link
        to="/system/agents"
        className="inline-flex items-center gap-1 text-primary hover:underline"
      >
        <IconArrowLeft size={16} stroke={1.5} aria-hidden="true" />
        {t("back-to-agents", { defaultValue: "Back to Agent Backends" })}
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
      <AgentMetadataGrid agent={agent} locale={locale} t={t} />
      <div className="mt-6">
        <button
          type="button"
          className={`btn btn-sm ${isActive ? "btn-error btn-outline" : "btn-success"}`}
          aria-disabled="true"
        >
          {isActive
            ? t("agent-action-deactivate", { defaultValue: "Deactivate" })
            : t("agent-action-activate", { defaultValue: "Activate" })}
        </button>
      </div>
      <AgentCapabilitiesCard capabilities={agent.capabilities} t={t} />
    </div>
  );
}
