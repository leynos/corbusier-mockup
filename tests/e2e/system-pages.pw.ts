/** @file Playwright E2E tests for system administration pages. */

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("System Pages", () => {
  /* ── Personnel ─────────────────────────────────────────────────── */

  test("personnel page renders table with users", async ({ page }) => {
    await page.goto("/system/personnel");

    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { name: "Personnel" })).toBeVisible();

    const table = page.getByRole("table", { name: /personnel directory/i });
    await expect(table).toBeVisible();

    await expect(page.getByText("Ava Chen")).toBeVisible();
    await expect(page.getByText("Kenji Tanaka")).toBeVisible();
  });

  test("clicking a user row navigates to user detail", async ({ page }) => {
    await page.goto("/system/personnel");

    await page
      .getByRole("button", { name: /Ava Chen/ })
      .first()
      .click();

    await expect(page.getByRole("heading", { name: "Ava Chen" })).toBeVisible();
    await expect(page.getByText("Activity History")).toBeVisible();
  });

  test("personnel page has no accessibility violations", async ({ page }) => {
    await page.goto("/system/personnel");
    await expect(page.getByRole("heading", { name: "Personnel" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  /* ── Agent Backends ────────────────────────────────────────────── */

  test("agents page renders table with backends", async ({ page }) => {
    await page.goto("/system/agents");

    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { name: "Agent Backends" })).toBeVisible();

    const table = page.getByRole("table", { name: /agent backends registry/i });
    await expect(table).toBeVisible();

    await expect(page.getByText("Claude Code SDK")).toBeVisible();
  });

  test("clicking an agent row navigates to agent detail", async ({ page }) => {
    await page.goto("/system/agents");

    await page
      .getByRole("button", { name: /Claude Code SDK/ })
      .first()
      .click();

    await expect(page.getByRole("heading", { name: "Claude Code SDK" })).toBeVisible();
    await expect(page.getByText("Capabilities")).toBeVisible();
  });

  test("agents page has no accessibility violations", async ({ page }) => {
    await page.goto("/system/agents");
    await expect(page.getByRole("heading", { name: "Agent Backends" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  /* ── Tool Registry ─────────────────────────────────────────────── */

  test("tools page renders table with MCP servers", async ({ page }) => {
    await page.goto("/system/tools");

    await expect(page.getByRole("heading", { name: "Tool Registry" })).toBeVisible();
    await expect(page.getByText("workspace_tools")).toBeVisible();

    await page
      .getByRole("button", { name: /workspace_tools/ })
      .first()
      .click();

    await expect(page.getByRole("heading", { name: "workspace_tools" })).toBeVisible();
    await expect(page).toHaveURL(/\/system\/tools\/MCP-001$/);
  });

  /* ── Hooks & Policies ──────────────────────────────────────────── */

  test("hooks page renders table with hook definitions", async ({ page }) => {
    await page.goto("/system/hooks");

    await expect(page.getByRole("heading", { name: "Hooks & Policies" })).toBeVisible();
    await expect(page.getByText("Pre-commit lint gate")).toBeVisible();

    await page
      .getByRole("button", { name: /Pre-commit lint gate/ })
      .first()
      .click();

    await expect(page).toHaveURL(/\/system\/hooks\/HK-001$/);
    await expect(page.getByRole("heading", { name: "Configuration" })).toBeVisible();
  });

  /* ── Reports ───────────────────────────────────────────────────── */

  test("reports page renders with audit trail tab", async ({ page }) => {
    await page.goto("/system/reports");

    await expect(page.getByRole("heading", { name: "Reports" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Audit Trail" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Performance" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Compliance" })).toBeVisible();
  });

  /* ── Monitoring ────────────────────────────────────────────────── */

  test("monitoring page renders metric panels and alerts", async ({ page }) => {
    await page.goto("/system/monitoring");

    await expect(page.getByRole("heading", { name: "Monitoring" })).toBeVisible();
    await expect(page.getByText("HTTP Request Rate")).toBeVisible();
    await expect(page.getByText("Active Alerts")).toBeVisible();
  });

  test("monitoring page has no accessibility violations", async ({ page }) => {
    await page.goto("/system/monitoring");
    await expect(page.getByRole("heading", { name: "Monitoring" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  /* ── Tenant Management ─────────────────────────────────────────── */

  test("tenants page renders tenant details", async ({ page }) => {
    await page.goto("/system/tenants");

    await expect(page.getByRole("heading", { name: "Tenant Management" })).toBeVisible();
    await expect(page.getByText("Corbusier Operations")).toBeVisible();
    await expect(page.getByText("corbusier-ops")).toBeVisible();
  });
});
