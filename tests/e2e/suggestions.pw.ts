/** @file Playwright E2E tests for the AI Suggestions page. */

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("AI Suggestions", () => {
  test("suggestions page renders heading and summary bar", async ({ page }) => {
    await page.goto("/suggestions");

    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { name: "AI Suggestions" })).toBeVisible();

    const summary = page.getByRole("region", {
      name: /suggestion summary/i,
    });
    await expect(summary).toBeVisible();
    await expect(summary.getByText("Items Analysed")).toBeVisible();
  });

  test("suggestions page shows filter tabs and cards", async ({ page }) => {
    await page.goto("/suggestions");

    const tablist = page.getByRole("tablist", { name: /project filter/i });
    await expect(tablist).toBeVisible();

    const allTab = tablist.getByRole("tab", { name: "All Projects" });
    await expect(allTab).toHaveAttribute("aria-selected", "true");

    /* At least one suggestion card title should be visible. */
    await expect(page.getByText("Add circuit breaker to agent backend calls")).toBeVisible();
  });

  test("dismiss button removes a card", async ({ page }) => {
    await page.goto("/suggestions");

    const cardTitle = page.getByText("Add circuit breaker to agent backend calls");
    await expect(cardTitle).toBeVisible();

    const dismissButton = page.getByRole("button", { name: "Dismiss" }).first();
    await dismissButton.click();

    await expect(cardTitle).not.toBeVisible();
  });

  test("project filter tab narrows displayed suggestions", async ({ page }) => {
    await page.goto("/suggestions");

    const tablist = page.getByRole("tablist", { name: /project filter/i });
    const skunkworksTab = tablist.getByRole("tab", {
      name: "Skunkworks-Alpha",
    });
    await skunkworksTab.click();

    await expect(
      page.getByText("Automate tenant namespace cleanup on deprovisioning"),
    ).toBeVisible();

    await expect(page.getByText("Add circuit breaker to agent backend calls")).not.toBeVisible();
  });

  test("AI Insights panel is visible", async ({ page }) => {
    await page.goto("/suggestions");

    const insights = page.getByRole("region", { name: /ai insights/i });
    await expect(insights).toBeVisible();
    await expect(insights.getByText("Sprint velocity trending downward")).toBeVisible();
  });

  test("suggestions page has no accessibility violations", async ({ page }) => {
    await page.goto("/suggestions");
    await expect(page.getByRole("heading", { name: "AI Suggestions" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
