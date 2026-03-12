/** @file Tests for the AppShell layout component. */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { cleanup, screen } from "@testing-library/react";

import { AppShell } from "../src/app/layout/app-shell";
import { renderWithRouter } from "./utils/render-with-router";

describe("AppShell", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the sidebar navigation landmark", async () => {
    renderWithRouter(
      <AppShell>
        <p>Child content</p>
      </AppShell>,
    );

    const nav = await screen.findByRole("navigation", { name: /main navigation/i });
    expect(nav).toBeTruthy();
  });

  it("renders all three zone labels", async () => {
    renderWithRouter(
      <AppShell>
        <p>Child content</p>
      </AppShell>,
    );

    await screen.findByRole("navigation", { name: /main navigation/i });

    expect(screen.getByText("MAINFRAME")).toBeTruthy();
    expect(screen.getByText("PROJECTS")).toBeTruthy();
    expect(screen.getByText("SYSTEM")).toBeTruthy();
  });

  it("renders children in the content area", async () => {
    renderWithRouter(
      <AppShell>
        <p>Hello from child</p>
      </AppShell>,
    );

    const child = await screen.findByText("Hello from child");
    expect(child).toBeTruthy();
  });

  it("renders the header bar", async () => {
    renderWithRouter(
      <AppShell>
        <p>Content</p>
      </AppShell>,
    );

    const searchBtn = await screen.findByRole("button", { name: /search directives/i });
    expect(searchBtn).toBeTruthy();
    expect(screen.getByRole("group", { name: /theme/i })).toBeTruthy();
    expect(screen.getByRole("combobox", { name: /language/i })).toBeTruthy();
  });
});
