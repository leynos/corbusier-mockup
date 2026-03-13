/** @file Regression tests for dashboard agent status and turn labelling. */

import { describe, expect, it } from "bun:test";
import { getAgentStatusLabel } from "../src/app/features/dashboard/components/agent-utilization-panel";
import i18n from "../src/i18n";

describe("getAgentStatusLabel", () => {
  it("keeps error backends distinct from inactive ones", () => {
    expect(getAgentStatusLabel("active", "en-GB")).toBe("Active");
    expect(getAgentStatusLabel("error", "en-GB")).toBe("Error");
    expect(getAgentStatusLabel("inactive", "en-GB")).toBe("Inactive");
  });

  it("resolves active labels in RTL locales", () => {
    expect(getAgentStatusLabel("active", "ar")).toBe("نشط");
  });
});

describe("dashboard-agent-turn-count", () => {
  it("pluralizes English turn labels by count", async () => {
    await i18n.changeLanguage("en-GB");

    expect(i18n.t("dashboard-agent-turn-count", { count: 1 })).toBe("turn");
    expect(i18n.t("dashboard-agent-turn-count", { count: 2 })).toBe("turns");
  });

  it("provides a localized RTL turn label", async () => {
    const previousLanguage = i18n.resolvedLanguage ?? i18n.language;
    await i18n.changeLanguage("ar");

    try {
      expect(i18n.t("dashboard-agent-turn-count", { count: 3 })).toBe("دورات");
    } finally {
      await i18n.changeLanguage(previousLanguage);
    }
  });
});
