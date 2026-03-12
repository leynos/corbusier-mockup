/** @file E2E tests for the task detail page. */

import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

test.use({ locale: "en-GB" });

async function gotoEnglishTaskDetail(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.localStorage.setItem("i18nextLng", "en-GB");
  });
  await page.goto("/tasks/TASK-1001");
  await page.waitForLoadState("networkidle");
}

test.describe("Task detail", () => {
  test("renders task header and state machine controls", async ({ page }) => {
    await gotoEnglishTaskDetail(page);

    await expect(
      page.getByRole("heading", { name: /claude code sdk agent backend/i }),
    ).toBeVisible();

    const reviewBtn = page.getByRole("button", { name: /submit for review/i });
    await expect(reviewBtn).toBeVisible();

    const pauseBtn = page.getByRole("button", { name: /pause/i });
    await expect(pauseBtn).toBeVisible();

    const abandonBtn = page.getByRole("button", { name: /abandon/i });
    await expect(abandonBtn).toBeVisible();
  });

  test("renders dependency and subtask sections", async ({ page }) => {
    await gotoEnglishTaskDetail(page);

    const deps = page.getByRole("region", { name: /dependencies/i });
    await expect(deps).toBeVisible();

    const progress = page.getByRole("region", { name: /progress/i });
    await expect(progress).toBeVisible();

    const source = page.getByRole("region", { name: /source control/i });
    await expect(source).toBeVisible();
  });

  test("task detail has no accessibility violations", async ({ page }) => {
    await gotoEnglishTaskDetail(page);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
