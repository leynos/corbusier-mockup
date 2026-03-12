/** @file Dashboard panel showing current agent backend utilization. */

import { IconRobot } from "@tabler/icons-react";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { AGENT_BACKENDS, type AgentBackend, type AgentStatus } from "../../../../data/dashboard";
import { agentStatusDescriptors } from "../../../../data/registries";
import { pickLocalization } from "../../../domain/entities/localization";

const INACTIVE_STYLE = { dot: "bg-base-content/30", text: "text-base-content/60" } as const;

const AGENT_STATUS_STYLE: Record<AgentStatus, { readonly dot: string; readonly text: string }> = {
  active: { dot: "bg-success", text: "text-base-content/80" },
  inactive: INACTIVE_STYLE,
  error: { dot: "bg-error", text: "text-base-content/80" },
};

export function getAgentStatusLabel(status: AgentStatus, locale: string): string {
  switch (status) {
    case "active":
      return pickLocalization(agentStatusDescriptors.active.localizations, locale).name;
    case "inactive":
      return pickLocalization(agentStatusDescriptors.inactive.localizations, locale).name;
    case "error":
      return pickLocalization(agentStatusDescriptors.error.localizations, locale).name;
  }
}

function AgentRow({ agent }: { readonly agent: AgentBackend }): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const style = AGENT_STATUS_STYLE[agent.status];

  return (
    <li className="flex items-center gap-3 py-2">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} aria-hidden="true" />
      <span className="flex-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)] text-base-content">
        {pickLocalization(agent.localizations, locale).name}
      </span>
      <span className={`text-[length:var(--font-size-xs)] font-semibold ${style.text}`}>
        {getAgentStatusLabel(agent.status, locale)}
      </span>
      <span className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60">
        {String(agent.turnCount)} {t("dashboard-agent-turns", { defaultValue: "turns" })}
      </span>
    </li>
  );
}

export function AgentUtilizationPanel(): JSX.Element {
  const { t } = useTranslation();

  return (
    <section
      aria-label={t("dashboard-agent-region", { defaultValue: "Agent utilization" })}
      data-testid="dashboard-agent-region"
      className="card border border-base-300 bg-base-100 shadow-sm"
    >
      <div className="card-body p-5">
        <h2 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
          <IconRobot size={16} stroke={1.5} aria-hidden="true" />
          {t("dashboard-agent-heading", { defaultValue: "Agent Utilization" })}
        </h2>
        <ul className="divide-y divide-base-300/50">
          {AGENT_BACKENDS.map((agent) => (
            <AgentRow key={agent.id} agent={agent} />
          ))}
        </ul>
      </div>
    </section>
  );
}
