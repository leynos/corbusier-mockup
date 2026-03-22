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
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("sign-in page has no accessibility violations", async ({ page }) => {
  await page.goto("/sign-in");
  await page.waitForLoadState("networkidle");

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("command palette has no accessibility violations", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.keyboard.press("Control+k");
  await page.getByRole("combobox", { name: /search commands/i }).waitFor();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
