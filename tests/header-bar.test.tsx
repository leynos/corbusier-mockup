/** @file Tests for header-bar controls and interactions. */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HeaderBar } from "../src/app/layout/header-bar";
import { renderWithProviders } from "./utils/render-with-providers";

describe("HeaderBar", () => {
  beforeEach(() => {
    cleanup();
    document.documentElement.removeAttribute("data-theme");
    document.body.removeAttribute("data-theme");
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    document.documentElement.removeAttribute("data-theme");
    document.body.removeAttribute("data-theme");
    window.localStorage.clear();
  });

  it("renders theme and language controls in the top tool band", () => {
    renderWithProviders(<HeaderBar />);

    expect(screen.getByRole("group", { name: /theme/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Day" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Night" })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: /language/i })).toBeTruthy();
  });

  it("switches themes from the toolbar buttons", async () => {
    const user = userEvent.setup();
    renderWithProviders(<HeaderBar />);

    await user.click(screen.getByRole("button", { name: "Day" }));

    expect(document.documentElement.getAttribute("data-theme")).toBe("corbusier-mockup-day");
    expect(screen.getByRole("button", { name: "Day" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "Night" }).getAttribute("aria-pressed")).toBe(
      "false",
    );
  });

  it("keeps the language select enabled even when one locale is shipped", () => {
    renderWithProviders(<HeaderBar />);

    const select = screen.getByRole("combobox", { name: /language/i });
    expect(select.getAttribute("disabled")).toBeNull();
    expect((select as HTMLSelectElement).value).toBe("en-GB");
  });
});
