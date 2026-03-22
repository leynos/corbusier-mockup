/** @file Tests for branded system fixture ID constructors. */

import { describe, expect, it } from "bun:test";

import { agentBackendId } from "../src/data/agents";
import { hookId } from "../src/data/hooks";
import { mcpServerId } from "../src/data/mcp-servers";
import { personnelId } from "../src/data/personnel";

describe("system fixture ID constructors", () => {
  it("accepts valid branded ID formats", () => {
    expect(agentBackendId("AGT-001")).toBe("AGT-001");
    expect(hookId("HK-001")).toBe("HK-001");
    expect(mcpServerId("MCP-001")).toBe("MCP-001");
    expect(personnelId("USR-1001")).toBe("USR-1001");
  });

  it("rejects invalid branded ID formats", () => {
    expect(() => agentBackendId("agt-001")).toThrow();
    expect(() => hookId("HOOK-001")).toThrow();
    expect(() => mcpServerId("server-001")).toThrow();
    expect(() => personnelId("1001")).toThrow();
  });
});
