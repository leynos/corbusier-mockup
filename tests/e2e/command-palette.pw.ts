/** @file Playwright E2E tests for the command palette overlay. */

import { expect, test } from "@playwright/test";

test.describe("Command palette", () => {
  test("opens on Ctrl+K, filters results, and closes on Escape", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    /* Open with Ctrl+K */
    await page.keyboard.press("Control+k");

    const input = page.getByRole("combobox", { name: /search commands/i });
    await expect(input).toBeVisible();

    /* Type a query and verify results filter */
    await input.fill("deploy");
    const options = page.getByRole("option");
    await expect(options.first()).toBeVisible();

    /* Close with Escape */
    await page.keyboard.press("Escape");
    await expect(input).not.toBeVisible();
  });
});
