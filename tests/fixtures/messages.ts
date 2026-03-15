/** @file Shared message fixture builders for conversation component tests. */

import type { Message, MessageRole, ToolCallInfo } from "../../src/data/conversations";

type BuildMessageOverrides = {
  readonly agentBackend?: string;
  readonly content?: string;
  readonly id?: string;
  readonly role?: MessageRole;
  readonly timestamp?: string;
  readonly toolCall?: ToolCallInfo;
};

/**
 * Build a message fixture with stable defaults for conversation component tests.
 *
 * @param overrides Optional fields to replace on the default message.
 * @returns One message fixture suitable for rendering tests.
 */
export function buildMessage(overrides: BuildMessageOverrides = {}): Message {
  const baseMessage: Message = {
    id: "msg-default",
    role: "user",
    content: "Default message content.",
    timestamp: "2026-03-10T09:00:00Z",
  };

  return {
    ...baseMessage,
    ...overrides,
  };
}
