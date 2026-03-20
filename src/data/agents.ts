/** @file Agent backend fixture data for the system administration pages.
 *
 * Each agent backend has entity-owned localised strings, vendor info,
 * version, active/inactive status, and capability flags.
 */

import type { EntityLocalizations } from "../app/domain/entities/localization";
import { loc } from "./localization-helpers";

/* ── Types ────────────────────────────────────────────────────────── */

export type AgentBackendStatus = "active" | "inactive";

export type AgentBackendId = `AGT-${number}`;

export function agentBackendId(raw: string): AgentBackendId {
  return raw as AgentBackendId;
}

export interface AgentCapabilities {
  readonly supportsStreaming: boolean;
  readonly supportsTools: boolean;
  readonly supportsMultiTurn: boolean;
  readonly supportsHandoff: boolean;
}

export interface AgentBackendEntry {
  readonly id: AgentBackendId;
  readonly localizations: EntityLocalizations;
  readonly vendor: string;
  readonly version: string;
  readonly status: AgentBackendStatus;
  readonly capabilities: AgentCapabilities;
  readonly turnCount: number;
  readonly lastActive: string;
}

/* ── Fixture data ─────────────────────────────────────────────────── */

export const AGENT_BACKENDS: readonly AgentBackendEntry[] = [
  {
    id: agentBackendId("AGT-001"),
    localizations: loc(
      "Claude Code SDK",
      "Anthropic's agent SDK with full tool-use and multi-turn conversation support.",
    ),
    vendor: "Anthropic",
    version: "4.1.0",
    status: "active",
    capabilities: {
      supportsStreaming: true,
      supportsTools: true,
      supportsMultiTurn: true,
      supportsHandoff: true,
    },
    turnCount: 142,
    lastActive: "2026-03-12T16:15:00Z",
  },
  {
    id: agentBackendId("AGT-002"),
    localizations: loc("Codex CLI", "OpenAI Codex command-line agent for code generation tasks."),
    vendor: "OpenAI",
    version: "0.9.3",
    status: "active",
    capabilities: {
      supportsStreaming: true,
      supportsTools: true,
      supportsMultiTurn: true,
      supportsHandoff: false,
    },
    turnCount: 87,
    lastActive: "2026-03-12T15:30:00Z",
  },
  {
    id: agentBackendId("AGT-003"),
    localizations: loc(
      "Custom Backend",
      "In-house agent backend for specialised domain tasks. Currently offline.",
    ),
    vendor: "Internal",
    version: "0.2.1",
    status: "inactive",
    capabilities: {
      supportsStreaming: false,
      supportsTools: true,
      supportsMultiTurn: false,
      supportsHandoff: false,
    },
    turnCount: 0,
    lastActive: "2026-03-08T10:00:00Z",
  },
];

/* ── Lookup helpers ───────────────────────────────────────────────── */

export function findAgentBackendById(id: string): AgentBackendEntry | undefined {
  return AGENT_BACKENDS.find((a) => a.id === id);
}
