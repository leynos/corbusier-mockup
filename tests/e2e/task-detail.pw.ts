/** @file E2E tests for the task detail page. */

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Task detail", () => {
  test("renders task header and state machine controls", async ({ page }) => {
    /* Navigate to a known in-progress task */
    await page.goto("/tasks/TASK-1001");
    await page.waitForLoadState("networkidle");

    /* Task title should be visible */
    await expect(
      page.getByRole("heading", { name: /claude code sdk agent backend/i }),
    ).toBeVisible();

    /* State machine controls — in_progress has three transitions */
    const reviewBtn = page.getByRole("button", { name: /submit for review/i });
    await expect(reviewBtn).toBeVisible();

    const pauseBtn = page.getByRole("button", { name: /pause/i });
    await expect(pauseBtn).toBeVisible();

    const abandonBtn = page.getByRole("button", { name: /abandon/i });
    await expect(abandonBtn).toBeVisible();
  });

  test("renders dependency and subtask sections", async ({ page }) => {
    await page.goto("/tasks/TASK-1001");
    await page.waitForLoadState("networkidle");

    /* Dependencies section */
    const deps = page.getByRole("region", { name: /dependencies/i });
    await expect(deps).toBeVisible();

    /* Progress section */
    const progress = page.getByRole("region", { name: /progress/i });
    await expect(progress).toBeVisible();

    /* Source control section */
    const source = page.getByRole("region", { name: /source control/i });
    await expect(source).toBeVisible();
  });

  test("task detail has no accessibility violations", async ({ page }) => {
    await page.goto("/tasks/TASK-1001");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
