/** @file Tests for the Personnel list screen. */

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, screen } from "@testing-library/react";

import { renderWithRouter } from "./utils/render-app-routes";

describe("PersonnelScreen", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the page heading", async () => {
    renderWithRouter("/system/personnel");

    expect(await screen.findByRole("heading", { name: "Personnel" })).toBeTruthy();
  });

  it("renders the subtitle", async () => {
    renderWithRouter("/system/personnel");

    expect(await screen.findByText("Manage team members and access roles.")).toBeTruthy();
  });

  it("renders the personnel data table", async () => {
    renderWithRouter("/system/personnel");

    const table = await screen.findByRole("table", {
      name: /personnel directory/i,
    });
    expect(table).toBeTruthy();
  });

  it("displays personnel names from fixture data", async () => {
    renderWithRouter("/system/personnel");

    expect(await screen.findByText("Ava Chen")).toBeTruthy();
    expect(screen.getByText("Marcus Webb")).toBeTruthy();
    expect(screen.getByText("Priya Sharma")).toBeTruthy();
  });

  it("displays role badges", async () => {
    renderWithRouter("/system/personnel");

    expect(await screen.findByText("Team Lead")).toBeTruthy();
    expect(screen.getByText("Admin")).toBeTruthy();
  });

  it("renders column headers", async () => {
    renderWithRouter("/system/personnel");

    expect(await screen.findByText("Name")).toBeTruthy();
    expect(screen.getByText("Role")).toBeTruthy();
    expect(screen.getByText("Tasks")).toBeTruthy();
    expect(screen.getByText("Last Active")).toBeTruthy();
  });
});
