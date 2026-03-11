/** @file Tests for the Sidebar navigation component. */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { cleanup, screen, within } from "@testing-library/react";

import { Sidebar } from "../src/app/layout/sidebar";
import { renderWithRouter } from "./utils/render-with-router";

describe("Sidebar", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders all three zone labels", async () => {
    renderWithRouter(<Sidebar />);

    await screen.findByRole("navigation", { name: /main navigation/i });

    expect(screen.getByText("MAINFRAME")).toBeTruthy();
    expect(screen.getByText("PROJECTS")).toBeTruthy();
    expect(screen.getByText("SYSTEM")).toBeTruthy();
  });

  it("renders mainframe navigation items", async () => {
    renderWithRouter(<Sidebar />);

    const nav = await screen.findByRole("navigation", { name: /main navigation/i });

    expect(within(nav).getByText("Dashboard")).toBeTruthy();
    expect(within(nav).getByText("My Tasks")).toBeTruthy();
    expect(within(nav).getByText("AI Suggestions")).toBeTruthy();
  });

  it("renders fixture project names", async () => {
    renderWithRouter(<Sidebar />);

    const nav = await screen.findByRole("navigation", { name: /main navigation/i });

    expect(within(nav).getByText("Apollo-Guidance")).toBeTruthy();
    expect(within(nav).getByText("Manhattan-Logistics")).toBeTruthy();
    expect(within(nav).getByText("Skunkworks-Alpha")).toBeTruthy();
  });

  it("renders system navigation items", async () => {
    renderWithRouter(<Sidebar />);

    const nav = await screen.findByRole("navigation", { name: /main navigation/i });

    expect(within(nav).getByText("Personnel")).toBeTruthy();
    expect(within(nav).getByText("Reports")).toBeTruthy();
    expect(within(nav).getByText("Agent Backends")).toBeTruthy();
    expect(within(nav).getByText("Tool Registry")).toBeTruthy();
    expect(within(nav).getByText("Hooks & Policies")).toBeTruthy();
    expect(within(nav).getByText("Monitoring")).toBeTruthy();
    expect(within(nav).getByText("Tenant Management")).toBeTruthy();
  });

  it("renders bottom-pinned settings and feedback items", async () => {
    renderWithRouter(<Sidebar />);

    const nav = await screen.findByRole("navigation", { name: /main navigation/i });

    expect(within(nav).getByText("Settings")).toBeTruthy();
    expect(within(nav).getByText("Feedback")).toBeTruthy();
  });

  it("applies active styling to Dashboard when at root path", async () => {
    renderWithRouter(<Sidebar />, { initialPath: "/" });

    const nav = await screen.findByRole("navigation", { name: /main navigation/i });
    const dashboardLink = within(nav).getByText("Dashboard").closest("a");

    expect(dashboardLink).toBeTruthy();
    expect(dashboardLink?.className).toContain("text-primary");
    expect(dashboardLink?.className).toContain("font-semibold");
  });

  it("applies active styling to My Tasks when at /tasks path", async () => {
    renderWithRouter(<Sidebar />, { initialPath: "/tasks" });

    const nav = await screen.findByRole("navigation", { name: /main navigation/i });
    const tasksLink = within(nav).getByText("My Tasks").closest("a");

    expect(tasksLink).toBeTruthy();
    expect(tasksLink?.className).toContain("text-primary");
    expect(tasksLink?.className).toContain("font-semibold");
  });
});
