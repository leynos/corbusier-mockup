/** @file Tests for the ToolCallCard component. */

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, fireEvent, screen } from "@testing-library/react";

import { ToolCallCard } from "../src/app/features/conversations/components/tool-call-card";
import type { Message } from "../src/data/conversations";
import { renderWithRouter } from "./utils/render-with-router";

type ToolCallMessage = Message & {
  readonly role: "tool";
  readonly toolCall: NonNullable<Message["toolCall"]>;
};

const TOOL_MSG: ToolCallMessage = {
  id: "msg-tool",
  role: "tool",
  content: "Executed bash command.",
  timestamp: "2026-03-10T09:02:00Z",
  toolCall: {
    callId: "tc-001",
    toolName: "bash_execute",
    status: "succeeded",
    durationMs: 340,
    input: 'find src/ -name "*pool*"',
    output: "src/database/poolManager.js",
  },
};

describe("ToolCallCard", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the tool name and status badge", async () => {
    renderWithRouter(<ToolCallCard message={TOOL_MSG} locale="en-GB" />);

    expect(await screen.findByText("bash_execute")).toBeTruthy();
    expect(screen.getByText("Succeeded")).toBeTruthy();
  });

  it("displays call ID and duration", async () => {
    renderWithRouter(<ToolCallCard message={TOOL_MSG} locale="en-GB" />);

    expect(await screen.findByText("tc-001")).toBeTruthy();
    expect(screen.getByText("340ms")).toBeTruthy();
  });

  it("starts collapsed with a Show details button", async () => {
    renderWithRouter(<ToolCallCard message={TOOL_MSG} locale="en-GB" />);

    const button = await screen.findByRole("button", { name: /show details/i });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByText("src/database/poolManager.js")).toBeNull();
  });

  it("expands to show input and output on click", async () => {
    renderWithRouter(<ToolCallCard message={TOOL_MSG} locale="en-GB" />);

    const button = await screen.findByRole("button", { name: /show details/i });
    fireEvent.click(button);

    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(await screen.findByText('find src/ -name "*pool*"')).toBeTruthy();
    expect(screen.getByText("src/database/poolManager.js")).toBeTruthy();
  });

  it("collapses again on second click", async () => {
    renderWithRouter(<ToolCallCard message={TOOL_MSG} locale="en-GB" />);

    const button = await screen.findByRole("button", { name: /show details/i });
    fireEvent.click(button);
    fireEvent.click(button);

    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByText("src/database/poolManager.js")).toBeNull();
  });
});
