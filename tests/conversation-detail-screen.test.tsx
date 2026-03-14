/** @file Tests for project-scoped conversation detail routing. */

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, screen } from "@testing-library/react";

import { renderWithRouter } from "./utils/render-app-routes";

describe("ConversationDetailScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the requested conversation when the project slug matches", async () => {
    renderWithRouter("/projects/apollo-guidance/conversations/conv-1");

    expect(await screen.findByRole("heading", { name: "pgBouncer migration" })).toBeTruthy();
    expect(screen.getByText("TASK-1001")).toBeTruthy();
  });

  it("shows not found when the conversation belongs to another project", async () => {
    renderWithRouter("/projects/apollo-guidance/conversations/conv-3");

    expect(await screen.findByText("Conversation not found")).toBeTruthy();
    expect(screen.getByText("conv-3")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "CI/CD pipeline setup" })).toBeNull();
  });
});
