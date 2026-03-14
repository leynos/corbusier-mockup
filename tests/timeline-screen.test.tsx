/** @file Verifies timeline rows expose visible and accessible due dates. */

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, screen } from "@testing-library/react";

import { renderWithRouter } from "./utils/render-app-routes";

describe("TimelineScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders each task with its due date and accessible track labelling", async () => {
    renderWithRouter("/projects/apollo-guidance/timeline");

    expect(await screen.findByText("Implement Claude Code SDK agent backend")).toBeTruthy();
    expect(screen.getByText("18 Mar 2026")).toBeTruthy();
    expect(
      screen.getByRole("img", {
        name: /Implement Claude Code SDK agent backend.*18 Mar 2026/i,
      }),
    ).toBeTruthy();
  });
});
