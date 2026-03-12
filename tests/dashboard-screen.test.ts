import { describe, expect, it } from "bun:test";

import { getChamferDemoLayout } from "../src/app/features/dashboard/dashboard-screen";

describe("dashboard chamfer demo layout", () => {
  it("keeps the standard card on the top-right in left-to-right locales", () => {
    const layout = getChamferDemoLayout(false);

    expect(layout.standard.reversed).toBe(false);
    expect(layout.standard.subtitleKey).toBe("dashboard-demo-card-subtitle-ltr");
    expect(layout.blocked.reversed).toBe(true);
    expect(layout.blocked.subtitleKey).toBe("dashboard-demo-blocked-subtitle-ltr");
  });

  it("flips the standard card to the top-left in right-to-left locales", () => {
    const layout = getChamferDemoLayout(true);

    expect(layout.standard.reversed).toBe(true);
    expect(layout.standard.subtitleKey).toBe("dashboard-demo-card-subtitle-rtl");
    expect(layout.blocked.reversed).toBe(false);
    expect(layout.blocked.subtitleKey).toBe("dashboard-demo-blocked-subtitle-rtl");
  });
});
