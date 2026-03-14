/** @file Tests for the ConversationsScreen component. */

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, screen } from "@testing-library/react";

import { renderWithRouter } from "./utils/render-app-routes";

describe("ConversationsScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the page heading", async () => {
    renderWithRouter("/projects/apollo-guidance/conversations");

    expect(await screen.findByRole("heading", { name: "Conversations" })).toBeTruthy();
  });

  it("renders a list of conversations for the project", async () => {
    renderWithRouter("/projects/apollo-guidance/conversations");

    const list = await screen.findByRole("list", {
      name: /conversation list/i,
    });
    expect(list).toBeTruthy();

    const items = screen.getAllByRole("listitem");
    expect(items.length).toBeGreaterThanOrEqual(2);
  });

  it("displays conversation titles from fixture data", async () => {
    renderWithRouter("/projects/apollo-guidance/conversations");

    expect(await screen.findByText("pgBouncer migration")).toBeTruthy();
    expect(await screen.findByText("Authentication audit")).toBeTruthy();
  });

  it("shows task IDs for each conversation", async () => {
    renderWithRouter("/projects/apollo-guidance/conversations");

    expect(await screen.findByText("TASK-1001")).toBeTruthy();
    expect(await screen.findByText("TASK-1004")).toBeTruthy();
  });

  it("renders count-aware message labels", async () => {
    renderWithRouter("/projects/apollo-guidance/conversations");

    const countLabels = await screen.findAllByText("10 messages");
    expect(countLabels.length).toBeGreaterThanOrEqual(1);
  });

  it("shows status badges", async () => {
    renderWithRouter("/projects/apollo-guidance/conversations");

    expect(await screen.findByText("Idle")).toBeTruthy();
    expect(await screen.findByText("Active")).toBeTruthy();
  });

  it("renders navigation links to conversation detail", async () => {
    renderWithRouter("/projects/apollo-guidance/conversations");

    const links = await screen.findAllByRole("link");
    const convLinks = links.filter(
      (link) =>
        link.getAttribute("href")?.includes("/projects/apollo-guidance/conversations/conv-") ??
        false,
    );
    expect(convLinks.length).toBeGreaterThanOrEqual(2);
  });
});
