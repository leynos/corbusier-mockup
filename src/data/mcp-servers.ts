/** @file MCP server fixture data for the tool registry pages.
 *
 * Each server has entity-owned localised strings, transport type,
 * lifecycle state, health status, a tool catalog, and health history.
 */

import * as v from "valibot";
import type { EntityLocalizations } from "../app/domain/entities/localization";
import type { HealthStatus } from "./dashboard";
import { loc } from "./localization-helpers";

/* ── Types ────────────────────────────────────────────────────────── */

export type McpLifecycleState = "registered" | "running" | "stopped";

export type McpServerId = `MCP-${number}`;

const mcpServerIdSchema = v.pipe(
  v.string(),
  v.regex(/^MCP-\d+$/, "MCP server IDs must match MCP-{number}."),
);

export function mcpServerId(raw: string): McpServerId {
  return v.parse(mcpServerIdSchema, raw) as McpServerId;
}

export function parseMcpServerId(raw: string): McpServerId | undefined {
  const result = v.safeParse(mcpServerIdSchema, raw);
  return result.success ? (result.output as McpServerId) : undefined;
}

export interface McpTool {
  readonly name: string;
  readonly localizations: EntityLocalizations;
  readonly inputSchema: string;
}

export interface HealthHistoryEntry {
  readonly timestamp: string;
  readonly status: HealthStatus;
  readonly localizations: EntityLocalizations;
}

export interface McpServer {
  readonly id: McpServerId;
  readonly localizations: EntityLocalizations;
  readonly transport: string;
  readonly lifecycleState: McpLifecycleState;
  readonly healthStatus: HealthStatus;
  readonly toolCatalog: readonly McpTool[];
  readonly healthHistory: readonly HealthHistoryEntry[];
}

/* ── Fixture data ─────────────────────────────────────────────────── */

export const MCP_SERVERS: readonly McpServer[] = [
  {
    id: mcpServerId("MCP-001"),
    localizations: loc(
      "workspace_tools",
      "Primary workspace tool server providing file operations, search, and shell access.",
    ),
    transport: "stdio",
    lifecycleState: "running",
    healthStatus: "healthy",
    toolCatalog: [
      {
        name: "file_read",
        localizations: loc("File Read", "Read contents of a file at a given path."),
        inputSchema: '{ "path": "string" }',
      },
      {
        name: "file_write",
        localizations: loc("File Write", "Write content to a file at a given path."),
        inputSchema: '{ "path": "string", "content": "string" }',
      },
      {
        name: "shell_exec",
        localizations: loc("Shell Execute", "Execute a shell command and return output."),
        inputSchema: '{ "command": "string", "timeout_ms?": "number" }',
      },
      {
        name: "glob_search",
        localizations: loc("Glob Search", "Find files matching a glob pattern."),
        inputSchema: '{ "pattern": "string", "path?": "string" }',
      },
    ],
    healthHistory: [
      {
        timestamp: "2026-03-12T16:00:00Z",
        status: "healthy",
        localizations: loc("All checks passed"),
      },
      {
        timestamp: "2026-03-12T12:00:00Z",
        status: "healthy",
        localizations: loc("All checks passed"),
      },
      {
        timestamp: "2026-03-12T08:00:00Z",
        status: "healthy",
        localizations: loc("All checks passed"),
      },
    ],
  },
  {
    id: mcpServerId("MCP-002"),
    localizations: loc(
      "weaver_mcp",
      "Weaver orchestration server for cross-agent coordination and handoff management.",
    ),
    transport: "sse",
    lifecycleState: "running",
    healthStatus: "degraded",
    toolCatalog: [
      {
        name: "handoff_initiate",
        localizations: loc("Handoff Initiate", "Initiate an agent handoff to a target backend."),
        inputSchema: '{ "from_agent": "string", "to_agent": "string", "context": "string" }',
      },
      {
        name: "orchestrate_pipeline",
        localizations: loc("Orchestrate Pipeline", "Run a multi-step agent pipeline."),
        inputSchema: '{ "steps": "Step[]", "timeout_ms?": "number" }',
      },
    ],
    healthHistory: [
      {
        timestamp: "2026-03-12T16:00:00Z",
        status: "degraded",
        localizations: loc("Latency above threshold"),
      },
      {
        timestamp: "2026-03-12T12:00:00Z",
        status: "healthy",
        localizations: loc("All checks passed"),
      },
      {
        timestamp: "2026-03-12T08:00:00Z",
        status: "healthy",
        localizations: loc("All checks passed"),
      },
    ],
  },
  {
    id: mcpServerId("MCP-003"),
    localizations: loc(
      "podbot_runtime",
      "Container runtime server for isolated task execution environments.",
    ),
    transport: "stdio",
    lifecycleState: "stopped",
    healthStatus: "critical",
    toolCatalog: [
      {
        name: "container_run",
        localizations: loc("Container Run", "Spin up an ephemeral container for task execution."),
        inputSchema:
          '{ "image": "string", "command": "string[]", "env?": "Record<string, string>" }',
      },
      {
        name: "container_stop",
        localizations: loc("Container Stop", "Stop a running container by ID."),
        inputSchema: '{ "container_id": "string" }',
      },
      {
        name: "container_logs",
        localizations: loc("Container Logs", "Stream logs from a container."),
        inputSchema: '{ "container_id": "string", "tail?": "number" }',
      },
    ],
    healthHistory: [
      {
        timestamp: "2026-03-12T16:00:00Z",
        status: "critical",
        localizations: loc("Connection refused"),
      },
      {
        timestamp: "2026-03-12T12:00:00Z",
        status: "critical",
        localizations: loc("Connection refused"),
      },
      {
        timestamp: "2026-03-12T08:00:00Z",
        status: "healthy",
        localizations: loc("All checks passed"),
      },
    ],
  },
];

/* ── Lookup helpers ───────────────────────────────────────────────── */

export function findMcpServerById(id: McpServerId): McpServer | undefined {
  return MCP_SERVERS.find((s) => s.id === id);
}
