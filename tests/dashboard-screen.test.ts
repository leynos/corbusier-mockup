/** @file Smoke tests for the dashboard fixture data wiring. */

import { describe, expect, it } from "bun:test";

import { AGENT_BACKENDS, KPI_METRICS, RECENT_ACTIVITY, SYSTEM_HEALTH } from "../src/data/dashboard";

describe("dashboard fixture data", () => {
  it("provides four KPI metrics", () => {
    expect(KPI_METRICS).toHaveLength(4);
    for (const m of KPI_METRICS) {
      expect(m.value).toBeTruthy();
      expect(m.localizations).toBeTruthy();
    }
  });

  it("provides a system health status", () => {
    expect(["healthy", "degraded", "critical"]).toContain(SYSTEM_HEALTH.overall);
    expect(SYSTEM_HEALTH.components.length).toBeGreaterThan(0);
  });

  it("provides recent activity events", () => {
    expect(RECENT_ACTIVITY.length).toBeGreaterThanOrEqual(10);
  });

  it("provides agent backends", () => {
    expect(AGENT_BACKENDS.length).toBeGreaterThan(0);
    const active = AGENT_BACKENDS.filter((a) => a.status === "active");
    expect(active.length).toBeGreaterThan(0);
  });
});
