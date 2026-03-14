/** @file Verifies the root route always renders the desktop application shell. */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { cleanup, screen } from "@testing-library/react";

import { renderWithRouter } from "./utils/render-app-routes";

describe("rootRoute shell", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the desktop shell and toolbar controls", async () => {
    renderWithRouter("/");

    await screen.findByRole("navigation", { name: /main navigation/i });

    expect(screen.getByRole("button", { name: /search directives/i })).toBeTruthy();
    expect(screen.getByRole("group", { name: /theme/i })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: /language/i })).toBeTruthy();
  });
});
