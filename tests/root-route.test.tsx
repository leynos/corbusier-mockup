/** @file Verifies the root route selects the correct shell for each display mode. */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createMemoryHistory, createRouter } from "@tanstack/react-router";
import { cleanup, screen } from "@testing-library/react";

import { AppRoutes } from "../src/app/routes/app-routes";
import { routeTree } from "../src/app/routes/route-tree";
import { renderWithProviders } from "./utils/render-with-providers";

const DISPLAY_MODE_STORAGE_KEY = "corbusier-mockup.displayMode";

function renderAppAtRoot() {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return renderWithProviders(<AppRoutes routerInstance={router} />);
}

describe("rootRoute shell selection", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("renders the mobile shell when full-browser mode is active", async () => {
    window.localStorage.setItem(DISPLAY_MODE_STORAGE_KEY, "full-browser");

    renderAppAtRoot();

    await screen.findByText("Dashboard");

    expect(screen.getByRole("button", { name: /controls/i })).toBeTruthy();
    expect(screen.queryByRole("navigation", { name: /main navigation/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /search directives/i })).toBeNull();
  });

  it("renders the desktop shell when hosted mode is active", async () => {
    window.localStorage.setItem(DISPLAY_MODE_STORAGE_KEY, "hosted");

    renderAppAtRoot();

    await screen.findByRole("navigation", { name: /main navigation/i });

    expect(screen.queryByRole("button", { name: /controls/i })).toBeNull();
    expect(screen.getByRole("button", { name: /search directives/i })).toBeTruthy();
  });
});
