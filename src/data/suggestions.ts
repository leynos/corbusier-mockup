/** @file AI suggestion and insight re-exports.
 *
 * Thin barrel that re-exports types, tag helpers, and fixture data
 * from `./suggestion-fixtures/`. Consumers import from this file;
 * the heavy locale data lives in per-project fixture modules.
 */

export type {
  AiInsight,
  AiInsightId,
  CategoryTagId,
  InsightSeverity,
  Suggestion,
  SuggestionId,
  SuggestionPriority,
  TagId,
} from "./suggestion-fixtures";
export {
  AI_INSIGHTS,
  aiInsightId,
  CATEGORY_TAGS,
  SUGGESTIONS,
  suggestionId,
  tagId,
} from "./suggestion-fixtures";
