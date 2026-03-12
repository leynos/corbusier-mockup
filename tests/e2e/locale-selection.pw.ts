/** @file Playwright E2E coverage for browser-locale driven i18n. */

import { expect, type Page, test } from "@playwright/test";

async function readChamferPoints(page: Page): Promise<string[]> {
  return await page.locator(".chamfer-card__frame polygon").evaluateAll((polygons) => {
    return polygons
      .map((polygon) => polygon.getAttribute("points"))
      .filter((points): points is string => points !== null);
  });
}

test.describe("Browser locale selection", () => {
  test("uses the Playwright locale for Arabic and flips chamfers for rtl", async ({
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

    const chamferPoints = await readChamferPoints(page);
    expect(chamferPoints[0]?.startsWith("16.5,0.5")).toBe(true);
    expect(chamferPoints[1]?.startsWith("0.5,0.5")).toBe(true);

    await context.close();
  });

  test("uses the Playwright locale for Japanese and keeps ltr chamfers", async ({
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

    const chamferPoints = await readChamferPoints(page);
    expect(chamferPoints[0]?.startsWith("0.5,0.5")).toBe(true);
    expect(chamferPoints[1]?.startsWith("16.5,0.5")).toBe(true);

    await context.close();
  });
});
