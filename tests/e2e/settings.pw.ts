/** @file Playwright E2E and axe tests for settings pages and sign-in. */

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const settingsPaths = [
  "/settings",
  "/settings/auth",
  "/settings/workspace",
  "/settings/integrations",
  "/settings/appearance",
];

for (const path of settingsPaths) {
  test(`${path} has no accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await page.getByRole("banner").waitFor();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("sign-in page has no accessibility violations", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByRole("heading", { level: 1 }).waitFor();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("command palette has no accessibility violations", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("banner").waitFor();

  await page.keyboard.press("Control+k");
  await page.getByRole("combobox", { name: /search commands/i }).waitFor();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("command palette supports keyboard shortcuts and keyboard navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("banner").waitFor();

  /* Open via Control+K and verify accessibility */
  await page.keyboard.press("Control+k");
  const paletteInput = page.getByRole("combobox", { name: /search commands/i });
  await paletteInput.waitFor();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);

  /* Close and reopen via Meta+K */
  await page.keyboard.press("Escape");
  await expect(paletteInput).toBeHidden();
  await page.keyboard.press("Meta+k");
  await paletteInput.waitFor();

  /* Narrow to a single known item, then navigate with keyboard */
  await paletteInput.fill("TASK-1001");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(paletteInput).toBeHidden();
  await expect(page).toHaveURL(/\/tasks\/TASK-1001/);
});
