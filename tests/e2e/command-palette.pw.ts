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

  test("keyboard shortcuts and navigation work end-to-end", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const input = page.getByRole("combobox", { name: /search commands/i });

    /* Open with Ctrl+K and search for the "Open Settings" command */
    await page.keyboard.press("Control+k");
    await expect(input).toBeVisible();

    /* Type to filter — "settings" uniquely matches the "Open Settings" command */
    await input.fill("settings");

    /* Wait for the filtered result to render before pressing Enter */
    await page.getByRole("option", { name: /open settings/i }).waitFor();

    /* Press Enter to navigate to /settings */
    await page.keyboard.press("Enter");

    /* Palette closes after selection */
    await expect(input).not.toBeVisible();

    /* Navigation occurred */
    await expect(page).toHaveURL("/settings");

    /* Meta+K also opens the palette (re-test from a different page) */
    await page.keyboard.press("Meta+k");
    await expect(input).toBeVisible();

    /* ArrowDown moves focus, Enter selects and closes */
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(input).not.toBeVisible();
  });
});
