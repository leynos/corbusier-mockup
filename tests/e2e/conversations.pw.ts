/** @file Playwright E2E tests for the Conversations zone. */

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Conversations", () => {
  test("conversation list shows entries and navigates to detail", async ({ page }) => {
    await page.goto("/projects/apollo-guidance/conversations");

    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { name: "Conversations" })).toBeVisible();

    const list = page.getByRole("list", { name: /conversation list/i });
    await expect(list).toBeVisible();

    const items = list.getByRole("listitem");
    await expect(items).toHaveCount(2);

    await list.getByRole("link").first().click();
    await expect(page).toHaveURL(/\/projects\/apollo-guidance\/conversations\/conv-/);
  });

  test("conversation detail renders messages and agent status", async ({ page }) => {
    await page.goto("/projects/apollo-guidance/conversations/conv-1");

    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { name: "pgBouncer migration" })).toBeVisible();

    const status = page.getByRole("status");
    await expect(status).toBeVisible();
    await expect(status.getByText("claude_code_sdk")).toBeVisible();

    const timeline = page.getByRole("region", { name: /conversation timeline/i });
    await expect(timeline).toBeVisible();

    const log = timeline.getByRole("log");
    const items = log.getByRole("listitem");
    await expect(items.first()).toBeVisible();
  });

  test("tool call card expands to show details", async ({ page }) => {
    await page.goto("/projects/apollo-guidance/conversations/conv-1");

    const timeline = page.getByRole("region", { name: /conversation timeline/i });
    await expect(timeline).toBeVisible();

    const expandButton = timeline.getByRole("button", { name: /show details/i }).first();
    await expect(expandButton).toBeVisible();
    await expect(expandButton).toHaveAttribute("aria-expanded", "false");

    await expandButton.click();

    /* After click the label changes to "Hide details". */
    const collapseButton = timeline.getByRole("button", { name: /hide details/i }).first();
    await expect(collapseButton).toHaveAttribute("aria-expanded", "true");

    await expect(timeline.getByText("Input", { exact: true })).toBeVisible();
    await expect(timeline.getByText("Output", { exact: true })).toBeVisible();
  });

  test("conversation list has no accessibility violations", async ({ page }) => {
    await page.goto("/projects/apollo-guidance/conversations");
    await expect(page.getByRole("heading", { name: "Conversations" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("conversation detail has no accessibility violations", async ({ page }) => {
    await page.goto("/projects/apollo-guidance/conversations/conv-1");
    await expect(page.getByRole("heading", { name: "pgBouncer migration" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe("Directives", () => {
  test("directives page shows directive cards", async ({ page }) => {
    await page.goto("/projects/apollo-guidance/directives");

    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { name: "Directives" })).toBeVisible();

    const list = page.getByRole("list", { name: /directive list/i });
    await expect(list).toBeVisible();

    const items = list.getByRole("listitem");
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("directive card expand shows example expansions", async ({ page }) => {
    await page.goto("/projects/apollo-guidance/directives");

    const list = page.getByRole("list", { name: /directive list/i });
    await expect(list).toBeVisible();

    const expandButton = list.getByRole("button", { name: /show examples/i }).first();
    await expect(expandButton).toBeVisible();
    await expect(expandButton).toHaveAttribute("aria-expanded", "false");

    await expandButton.click();

    /* After click the label changes to "Hide examples". */
    const collapseButton = list.getByRole("button", { name: /hide examples/i }).first();
    await expect(collapseButton).toHaveAttribute("aria-expanded", "true");
  });

  test("directives page has no accessibility violations", async ({ page }) => {
    await page.goto("/projects/apollo-guidance/directives");
    await expect(page.getByRole("heading", { name: "Directives" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
