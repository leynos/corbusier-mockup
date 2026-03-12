/** @file E2E tests for the dashboard page. */

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Dashboard", () => {
  test("renders KPI cards and activity feed", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    /* System health panel */
    const health = page.getByRole("region", { name: "System health" });
    await expect(health).toBeVisible();

    /* KPI cards */
    const metrics = page.getByRole("region", { name: "Key metrics" });
    await expect(metrics).toBeVisible();
    /* Should contain at least 4 cards */
    await expect(metrics.locator(".card")).toHaveCount(4);

    /* Activity feed */
    const activity = page.getByRole("region", { name: "Recent activity" });
    await expect(activity).toBeVisible();

    /* Agent utilization */
    const agents = page.getByRole("region", { name: "Agent utilization" });
    await expect(agents).toBeVisible();
  });

  test("dashboard has no accessibility violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
