/** @file Regression tests for dashboard agent status labelling. */

import { describe, expect, it } from "bun:test";

import { getAgentStatusLabel } from "../src/app/features/dashboard/components/agent-utilization-panel";

describe("getAgentStatusLabel", () => {
  it("keeps error backends distinct from inactive ones", () => {
    expect(getAgentStatusLabel("error", "en-GB")).toBe("Error");
    expect(getAgentStatusLabel("inactive", "en-GB")).toBe("Inactive");
  });
});
