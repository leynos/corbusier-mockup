/** @file Type definitions for AI suggestion and insight entities.
 *
 * Branded `TagId` type, `Suggestion` and `AiInsight` interfaces, and
 * their associated union enumerations.
 */

import type { EntityLocalizations } from "../../app/domain/entities/localization";
import type { ProjectSlug } from "../registries/project-descriptors";
import type { Assignee } from "../tasks";
import type { CategoryTagId } from "./category-tags";

/* -- Tag ID type --------------------------------------------------------- */

export type TagId = CategoryTagId & { readonly brand: "TagId" };

export function tagId(id: CategoryTagId): TagId {
  return id as TagId;
}

/* -- Suggestion ---------------------------------------------------------- */

export type SuggestionPriority = "high" | "medium" | "low";

export type SuggestionId = string & { readonly brand: "SuggestionId" };

export function suggestionId(id: string): SuggestionId {
  return id as SuggestionId;
}

export interface Suggestion {
  readonly id: SuggestionId;
  readonly projectSlug: ProjectSlug;
  readonly localizations: EntityLocalizations;
  readonly priority: SuggestionPriority;
  readonly confidence: number;
  readonly categoryTagIds: readonly CategoryTagId[];
  readonly dependencyLocalizations: EntityLocalizations;
  readonly estimatedDuration: string;
  readonly suggestedAssignees: readonly Assignee[];
}

/* -- AI insight ---------------------------------------------------------- */

export type InsightSeverity = "info" | "warning" | "critical";

export type AiInsightId = string & { readonly brand: "AiInsightId" };

export function aiInsightId(id: string): AiInsightId {
  return id as AiInsightId;
}

export interface AiInsight {
  readonly id: AiInsightId;
  readonly localizations: EntityLocalizations;
  readonly severity: InsightSeverity;
}
