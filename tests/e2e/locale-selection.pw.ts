/** @file Playwright E2E coverage for browser-locale driven i18n. */

import { expect, test } from "@playwright/test";

test.describe("Browser locale selection", () => {
  test("uses the Playwright locale for Arabic and sets rtl direction", async ({
    baseURL,
    browser,
  }) => {
    if (!baseURL) {
      throw new Error("Playwright baseURL is required for locale-selection.pw.ts");
    }

    const context = await browser.newContext({ locale: "ar-SA" });
    const page = await context.newPage();

    await page.goto(baseURL);
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { name: "لوحة المعلومات" })).toBeVisible();

    await context.close();
  });

  test("uses the Playwright locale for Japanese and keeps ltr direction", async ({
    baseURL,
    browser,
  }) => {
    if (!baseURL) {
      throw new Error("Playwright baseURL is required for locale-selection.pw.ts");
    }

    const context = await browser.newContext({ locale: "ja-JP" });
    const page = await context.newPage();

    await page.goto(baseURL);
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).toHaveAttribute("lang", "ja");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("heading", { name: "ダッシュボード" })).toBeVisible();

    await context.close();
  });
});
