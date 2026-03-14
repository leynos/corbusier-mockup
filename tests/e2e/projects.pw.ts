/** @file Playwright E2E tests for the Projects zone. */

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Projects", () => {
  test("project list shows project cards and navigates to kanban", async ({ page }) => {
    await page.goto("/projects");

    const main = page.getByRole("main");
    await expect(main.getByRole("heading", { name: "Projects" })).toBeVisible();

    const projectList = page.getByRole("list", { name: /project list/i });
    await expect(projectList).toBeVisible();

    const cards = projectList.getByRole("listitem");
    await expect(cards).toHaveCount(3);

    await projectList.getByRole("link", { name: /apollo-guidance/i }).click();
    await expect(page).toHaveURL(/\/projects\/apollo-guidance\/kanban$/);
  });

  test("kanban board renders five columns with headings", async ({ page }) => {
    await page.goto("/projects/apollo-guidance/kanban");

    const board = page.getByRole("region", { name: /kanban board/i });
    await expect(board).toBeVisible();

    await expect(board.getByRole("heading", { name: "To-Do" })).toBeVisible();
    await expect(board.getByRole("heading", { name: "Planned" })).toBeVisible();
    await expect(board.getByRole("heading", { name: "In Progress" })).toBeVisible();
    await expect(board.getByRole("heading", { name: "In Review" })).toBeVisible();
    await expect(board.getByRole("heading", { name: "Done" })).toBeVisible();
  });

  test("view switcher tabs navigate between sub-views", async ({ page }) => {
    await page.goto("/projects/apollo-guidance/kanban");

    const tabs = page.getByRole("tablist", { name: /project views/i });
    await expect(tabs).toBeVisible();

    await tabs.getByRole("tab", { name: "Backlog" }).click();
    await expect(page).toHaveURL(/\/projects\/apollo-guidance\/backlog$/);

    await tabs.getByRole("tab", { name: "List" }).click();
    await expect(page).toHaveURL(/\/projects\/apollo-guidance\/list$/);
  });

  test("project list has no accessibility violations", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("main").getByRole("heading", { name: "Projects" })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("kanban board has no accessibility violations", async ({ page }) => {
    await page.goto("/projects/apollo-guidance/kanban");
    await expect(page.getByRole("region", { name: /kanban board/i })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
