/** @file Verifies the calendar screen renders the project's full month span. */

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, screen } from "@testing-library/react";

import { renderWithRouter } from "./utils/render-app-routes";

describe("CalendarScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders month sections across the project's full date range", async () => {
    renderWithRouter("/projects/apollo-guidance/calendar");

    expect(await screen.findByRole("heading", { level: 2, name: "February 2026" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "May 2026" })).toBeTruthy();
  });
});
