/** @file Tests for the command palette overlay. */

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, fireEvent, screen } from "@testing-library/react";
import type { JSX } from "react";

import { CommandPalette } from "../src/app/features/command-palette/command-palette";
import { useCommandPalette } from "../src/app/features/command-palette/command-palette-provider";
import { renderWithRouter } from "./utils/render-with-router";

/** Wrapper that exposes a trigger button to open the palette. */
function OpenPalette(): JSX.Element {
  const { open } = useCommandPalette();
  return (
    <>
      <button type="button" onClick={open}>
        Open palette
      </button>
      <CommandPalette />
    </>
  );
}

describe("CommandPalette", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the search input when opened", async () => {
    renderWithRouter(<OpenPalette />);
    const trigger = await screen.findByRole("button", { name: /open palette/i });
    fireEvent.click(trigger);
    const input = await screen.findByRole("combobox", {
      name: /search commands/i,
    });
    expect(input).toBeTruthy();
  });

  it("filters results when typing a query", async () => {
    renderWithRouter(<OpenPalette />);
    const trigger = await screen.findByRole("button", { name: /open palette/i });
    fireEvent.click(trigger);
    const input = await screen.findByRole("combobox", {
      name: /search commands/i,
    });
    fireEvent.change(input, { target: { value: "settings" } });
    const options = await screen.findAllByRole("option");
    expect(options.length).toBeGreaterThan(0);
  });

  it("closes on Escape key", async () => {
    renderWithRouter(<OpenPalette />);
    const trigger = await screen.findByRole("button", { name: /open palette/i });
    fireEvent.click(trigger);
    const input = await screen.findByRole("combobox", { name: /search commands/i });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("combobox", { name: /search commands/i })).toBeNull();
  });
});
