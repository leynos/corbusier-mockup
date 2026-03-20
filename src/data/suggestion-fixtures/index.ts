/** @file Barrel re-exports for the AI suggestions data module.
 *
 * Assembles the unified `SUGGESTIONS` array from per-project
 * modules and re-exports types, category tags, and insights.
 */

import { APOLLO_GUIDANCE_SUGGESTIONS } from "./apollo-guidance";
import { MANHATTAN_LOGISTICS_SUGGESTIONS } from "./manhattan-logistics";
import { SKUNKWORKS_ALPHA_SUGGESTIONS } from "./skunkworks-alpha";
import type { Suggestion } from "./types";

export type { CategoryTagId } from "./category-tags";
export { CATEGORY_TAGS } from "./category-tags";
export { AI_INSIGHTS } from "./insights";
export type {
  AiInsight,
  AiInsightId,
  InsightSeverity,
  Suggestion,
  SuggestionId,
  SuggestionPriority,
  TagId,
} from "./types";
export { aiInsightId, suggestionId, tagId } from "./types";

export const SUGGESTIONS: readonly Suggestion[] = [
  ...APOLLO_GUIDANCE_SUGGESTIONS,
  ...MANHATTAN_LOGISTICS_SUGGESTIONS,
  ...SKUNKWORKS_ALPHA_SUGGESTIONS,
];
