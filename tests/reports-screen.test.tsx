/** @file Tests for the Reports screen tab behaviour. */

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, fireEvent, screen } from "@testing-library/react";

import { renderWithRouter } from "./utils/render-app-routes";

describe("ReportsScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("supports roving focus and keyboard activation for report tabs", async () => {
    renderWithRouter("/system/reports");

    const auditTab = await screen.findByRole("tab", { name: "Audit Trail" });
    const performanceTab = screen.getByRole("tab", { name: "Performance" });

    expect(auditTab.getAttribute("tabindex")).toBe("0");
    expect(performanceTab.getAttribute("tabindex")).toBe("-1");

    fireEvent.keyDown(auditTab, { key: "ArrowRight" });
    expect(document.activeElement).toBe(performanceTab);
    expect(performanceTab.getAttribute("aria-selected")).toBe("false");
    expect(performanceTab.getAttribute("tabindex")).toBe("-1");

    fireEvent.keyDown(performanceTab, { key: "Enter" });
    expect(performanceTab.getAttribute("aria-selected")).toBe("true");
    expect(performanceTab.getAttribute("tabindex")).toBe("0");
    expect(auditTab.getAttribute("aria-selected")).toBe("false");
    expect(auditTab.getAttribute("tabindex")).toBe("-1");
  });
});
