/** @file Monitoring fixture data for the operational dashboard.
 *
 * Provides metric panel data, active alerts, and health check
 * endpoints used by the monitoring screen's Grafana-style layout.
 */

import type { EntityLocalizations } from "../app/domain/entities/localization";
import type { HealthStatus } from "./dashboard";
import { loc } from "./localization-helpers";

/* ── Types ────────────────────────────────────────────────────────── */

/** A single data point in a time series (for skeletal chart rendering). */
export interface MetricDataPoint {
  readonly timestamp: string;
  readonly value: number;
}

export interface MonitoringMetric {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly unit: string;
  readonly threshold?: number;
  readonly series: readonly MetricDataPoint[];
}

export type AlertSeverity = "warning" | "critical";

export interface MonitoringAlert {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly severity: AlertSeverity;
  readonly firedAt: string;
  readonly acknowledged: boolean;
}

export interface HealthCheckEndpoint {
  readonly path: string;
  readonly localizations: EntityLocalizations;
  readonly status: HealthStatus;
  readonly lastChecked: string;
  readonly responseTimeMs: number;
}

/* ── Fixture data — Metrics ───────────────────────────────────────── */

export const MONITORING_METRICS: readonly MonitoringMetric[] = [
  {
    id: "http-request-rate",
    localizations: loc("HTTP Request Rate", "Requests per second across all endpoints"),
    unit: "req/s",
    threshold: 500,
    series: [
      { timestamp: "2026-03-12T12:00:00Z", value: 320 },
      { timestamp: "2026-03-12T13:00:00Z", value: 345 },
      { timestamp: "2026-03-12T14:00:00Z", value: 410 },
      { timestamp: "2026-03-12T15:00:00Z", value: 385 },
      { timestamp: "2026-03-12T16:00:00Z", value: 360 },
    ],
  },
  {
    id: "agent-turn-latency",
    localizations: loc("Agent Turn Latency", "P50 / P95 / P99 response times"),
    unit: "ms",
    threshold: 1000,
    series: [
      { timestamp: "2026-03-12T12:00:00Z", value: 420 },
      { timestamp: "2026-03-12T13:00:00Z", value: 480 },
      { timestamp: "2026-03-12T14:00:00Z", value: 520 },
      { timestamp: "2026-03-12T15:00:00Z", value: 460 },
      { timestamp: "2026-03-12T16:00:00Z", value: 440 },
    ],
  },
  {
    id: "tool-exec-throughput",
    localizations: loc("Tool Execution Throughput", "Tool calls completed per minute"),
    unit: "calls/min",
    threshold: 200,
    series: [
      { timestamp: "2026-03-12T12:00:00Z", value: 85 },
      { timestamp: "2026-03-12T13:00:00Z", value: 92 },
      { timestamp: "2026-03-12T14:00:00Z", value: 110 },
      { timestamp: "2026-03-12T15:00:00Z", value: 98 },
      { timestamp: "2026-03-12T16:00:00Z", value: 88 },
    ],
  },
  {
    id: "db-connection-pool",
    localizations: loc("DB Connection Pool", "Active connections / pool limit"),
    unit: "%",
    threshold: 80,
    series: [
      { timestamp: "2026-03-12T12:00:00Z", value: 42 },
      { timestamp: "2026-03-12T13:00:00Z", value: 55 },
      { timestamp: "2026-03-12T14:00:00Z", value: 68 },
      { timestamp: "2026-03-12T15:00:00Z", value: 58 },
      { timestamp: "2026-03-12T16:00:00Z", value: 45 },
    ],
  },
];

/* ── Fixture data — Alerts ────────────────────────────────────────── */

export const MONITORING_ALERTS: readonly MonitoringAlert[] = [
  {
    id: "alert-001",
    localizations: loc(
      "Weaver MCP latency above threshold",
      "P95 latency at 1200ms (threshold: 1000ms)",
    ),
    severity: "warning",
    firedAt: "2026-03-12T15:45:00Z",
    acknowledged: false,
  },
  {
    id: "alert-002",
    localizations: loc("Podbot runtime unreachable", "Connection refused on stdio transport"),
    severity: "critical",
    firedAt: "2026-03-12T08:15:00Z",
    acknowledged: true,
  },
];

/* ── Fixture data — Health checks ─────────────────────────────────── */

export const HEALTH_CHECKS: readonly HealthCheckEndpoint[] = [
  {
    path: "/health/live",
    localizations: loc("Liveness", "Basic process liveness probe"),
    status: "healthy",
    lastChecked: "2026-03-12T16:55:00Z",
    responseTimeMs: 2,
  },
  {
    path: "/health/ready",
    localizations: loc("Readiness", "Dependency connectivity check"),
    status: "degraded",
    lastChecked: "2026-03-12T16:55:00Z",
    responseTimeMs: 145,
  },
  {
    path: "/health/detailed",
    localizations: loc("Detailed", "Full system component health report"),
    status: "degraded",
    lastChecked: "2026-03-12T16:55:00Z",
    responseTimeMs: 320,
  },
];
