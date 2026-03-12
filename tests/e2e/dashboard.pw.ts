/** @file E2E tests for the dashboard page. */

import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

test.use({ locale: "en-GB" });

async function gotoEnglishDashboard(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.localStorage.setItem("i18nextLng", "en-GB");
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
}

test.describe("Dashboard", () => {
  test("renders KPI cards and activity feed", async ({ page }) => {
    await gotoEnglishDashboard(page);

    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    // biome-ignore lint: ACCESSIBILITY: the dashboard regions are locale-dependent, so this E2E check uses stable hooks after pinning English.
    const health = page.getByTestId("dashboard-health-region");
    await expect(health).toBeVisible();

    // biome-ignore lint: ACCESSIBILITY: KPI region copy is translated, but this smoke test needs a locale-stable container selector.
    const metrics = page.getByTestId("dashboard-kpi-region");
    await expect(metrics).toBeVisible();
    // biome-ignore lint: ACCESSIBILITY: KPI cards do not expose a unique accessible role/name combination, so the count assertion uses an explicit test hook.
    await expect(metrics.getByTestId("kpi-card")).toHaveCount(4);

    // biome-ignore lint: ACCESSIBILITY: the recent-activity landmark label is localised, so this assertion uses a stable hook.
    const activity = page.getByTestId("dashboard-activity-region");
    await expect(activity).toBeVisible();

    // biome-ignore lint: ACCESSIBILITY: the agent-utilization landmark label is localised, so this assertion uses a stable hook.
    const agents = page.getByTestId("dashboard-agent-region");
    await expect(agents).toBeVisible();
  });

  test("dashboard has no accessibility violations", async ({ page }) => {
    await gotoEnglishDashboard(page);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
