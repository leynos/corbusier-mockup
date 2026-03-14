/** @file Tests for the MessageBubble component. */

import { afterEach, describe, expect, it } from "bun:test";
import { cleanup, screen } from "@testing-library/react";

import { MessageBubble } from "../src/app/features/conversations/components/message-bubble";
import type { Message } from "../src/data/conversations";
import { renderWithRouter } from "./utils/render-with-router";

const USER_MSG: Message = {
  id: "msg-u",
  role: "user",
  content: "Migrate the pool configuration.",
  timestamp: "2026-03-10T09:01:00Z",
};

const ASSISTANT_MSG: Message = {
  id: "msg-a",
  role: "assistant",
  content: "I will analyse the existing pool.",
  timestamp: "2026-03-10T09:02:00Z",
  agentBackend: "claude_code_sdk",
};

const SYSTEM_MSG: Message = {
  id: "msg-s",
  role: "system",
  content: "Task execution initiated.",
  timestamp: "2026-03-10T09:00:00Z",
};

describe("MessageBubble", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders user message with User role label", async () => {
    renderWithRouter(<MessageBubble message={USER_MSG} locale="en-GB" />);

    expect(await screen.findByText("User")).toBeTruthy();
    expect(screen.getByText("Migrate the pool configuration.")).toBeTruthy();
  });

  it("renders assistant message with Agent role label", async () => {
    renderWithRouter(<MessageBubble message={ASSISTANT_MSG} locale="en-GB" />);

    expect(await screen.findByText("Agent")).toBeTruthy();
    expect(screen.getByText("I will analyse the existing pool.")).toBeTruthy();
  });

  it("shows agent backend on assistant messages", async () => {
    renderWithRouter(<MessageBubble message={ASSISTANT_MSG} locale="en-GB" />);

    expect(await screen.findByText("claude_code_sdk")).toBeTruthy();
  });

  it("renders system message content inline", async () => {
    renderWithRouter(<MessageBubble message={SYSTEM_MSG} locale="en-GB" />);

    expect(await screen.findByText("Task execution initiated.")).toBeTruthy();
  });

  it("renders a formatted timestamp", async () => {
    renderWithRouter(<MessageBubble message={USER_MSG} locale="en-GB" />);

    await screen.findByText("User");
    /* The formatted timestamp contains digits from the date and time. */
    expect(screen.getByText(/\d{1,2}.*\d{2}:\d{2}/u)).toBeTruthy();
  });
});
