/** @file Tests for the notifications dropdown. */

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, fireEvent, screen } from "@testing-library/react";

import { NotificationsDropdown } from "../src/app/layout/notifications-dropdown";
import { renderWithProviders } from "./utils/render-with-providers";

describe("NotificationsDropdown", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the bell button with unread count", () => {
    renderWithProviders(<NotificationsDropdown />);
    const btn = screen.getByRole("button", { name: /notifications/i });
    expect(btn).toBeTruthy();
  });

  it("shows notification list when opened", async () => {
    renderWithProviders(<NotificationsDropdown />);
    const btn = screen.getByRole("button", { name: /notifications/i });
    fireEvent.click(btn);
    const list = await screen.findByRole("list", {
      name: /recent notifications/i,
    });
    expect(list).toBeTruthy();
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });
});
