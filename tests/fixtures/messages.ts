/** @file Shared message fixture builders for conversation component tests. */

import type { Message, MessageRole, ToolCallInfo } from "../../src/data/conversations";

type BuildMessageOverrides<TRole extends MessageRole = MessageRole> = {
  readonly agentBackend?: string;
  readonly content?: string;
  readonly id?: string;
  readonly role?: TRole;
  readonly timestamp?: string;
  readonly toolCall?: ToolCallInfo;
};

/**
 * Build a message fixture with stable defaults for conversation component tests.
 *
 * @param overrides Optional fields to replace on the default message.
 * @returns One message fixture suitable for rendering tests.
 */
export function buildMessage<TRole extends MessageRole = MessageRole>(
  overrides: BuildMessageOverrides<TRole> = {},
): Message & { readonly role: TRole extends MessageRole ? TRole : MessageRole } {
  const baseMessage: Message = {
    id: "msg-default",
    role: "user",
    content: "Default message content.",
    timestamp: "2026-03-10T09:00:00Z",
  };

  return {
    ...baseMessage,
    ...overrides,
  } as Message & { readonly role: TRole extends MessageRole ? TRole : MessageRole };
}
