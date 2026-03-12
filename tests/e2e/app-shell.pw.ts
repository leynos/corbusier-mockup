/** @file Playwright E2E test for the app shell layout and sidebar navigation. */

import { expect, test } from "@playwright/test";

test.describe("App shell", () => {
  test("sidebar is visible and navigates to My Tasks", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const sidebar = page.getByRole("navigation", { name: /main navigation/i });
    await expect(sidebar).toBeVisible();

    await sidebar.getByRole("link", { name: "My Tasks" }).click();
    await expect(page).toHaveURL(/\/tasks$/);

    await expect(page.getByRole("heading", { name: "My Tasks" })).toBeVisible();
  });
});
