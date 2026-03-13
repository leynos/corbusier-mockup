/** @file Event kind descriptor registry. */

import type { EntityLocalizations } from "../../app/domain/entities/localization";
import type { ActivityEventKind } from "../tasks";

export interface EventKindDescriptor {
  readonly id: ActivityEventKind;
  readonly localizations: EntityLocalizations;
}

export const eventKindDescriptors: Record<string, EventKindDescriptor> = {
  state_change: {
    id: "state_change" as ActivityEventKind,
    localizations: { "en-GB": { name: "State change" } },
  },
  subtask_completed: {
    id: "subtask_completed" as ActivityEventKind,
    localizations: { "en-GB": { name: "Subtask completed" } },
  },
  comment: {
    id: "comment" as ActivityEventKind,
    localizations: { "en-GB": { name: "Comment" } },
  },
  agent_action: {
    id: "agent_action" as ActivityEventKind,
    localizations: { "en-GB": { name: "Agent action" } },
  },
  branch_associated: {
    id: "branch_associated" as ActivityEventKind,
    localizations: { "en-GB": { name: "Branch associated" } },
  },
  pr_opened: {
    id: "pr_opened" as ActivityEventKind,
    localizations: { "en-GB": { name: "PR opened" } },
  },
};
