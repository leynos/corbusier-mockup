/** @file Verifies the root route always renders the desktop application shell. */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { cleanup, screen } from "@testing-library/react";

import { AppRoutes } from "../src/app/routes/app-routes";
import { routeTree } from "../src/app/routes/route-tree";
import { renderWithProviders } from "./utils/render-with-providers";

function renderAppAtRoot() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return renderWithProviders(<AppRoutes routerInstance={router} />);
}

describe("rootRoute shell", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the desktop shell and toolbar controls", async () => {
    renderAppAtRoot();

    await screen.findByRole("navigation", { name: /main navigation/i });

    expect(screen.getByRole("button", { name: /search directives/i })).toBeTruthy();
    expect(screen.getByRole("group", { name: /theme/i })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: /language/i })).toBeTruthy();
  });
});
