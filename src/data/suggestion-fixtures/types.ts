/** @file Type definitions for AI suggestion and insight entities.
 *
 * Branded `TagId` type, `Suggestion` and `AiInsight` interfaces, and
 * their associated union enumerations.
 */

import type { EntityLocalizations } from "../../app/domain/entities/localization";
import type { ProjectSlug } from "../registries/project-descriptors";
import type { Assignee } from "../tasks";

/* -- Tag ID type --------------------------------------------------------- */

export type TagId = string & { readonly brand: "TagId" };

export function tagId(id: string): TagId {
  return id as TagId;
}

/* -- Suggestion ---------------------------------------------------------- */

export type SuggestionPriority = "high" | "medium" | "low";

export interface Suggestion {
  readonly id: string;
  readonly projectSlug: ProjectSlug;
  readonly localizations: EntityLocalizations;
  readonly priority: SuggestionPriority;
  readonly confidence: number;
  readonly categoryTagIds: readonly TagId[];
  readonly dependencyLocalizations: EntityLocalizations;
  readonly estimatedDuration: string;
  readonly suggestedAssignees: readonly Assignee[];
}

/* -- AI insight ---------------------------------------------------------- */

export type InsightSeverity = "info" | "warning" | "critical";

export interface AiInsight {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly severity: InsightSeverity;
}
