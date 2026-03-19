/** @file AI Suggestions screen.
 *
 * Renders a summary bar (four metrics), project filter tabs,
 * suggestion cards grouped by priority (high, medium, low), and an
 * AI Insights panel with bullet observations.
 *
 * Dismiss and Add to Backlog actions remove cards from the local
 * list (React state only, no persistence).
 */

import type { JSX } from "react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ProjectSlug } from "../../../data/registries/project-descriptors";
import { projectDescriptors } from "../../../data/registries/project-descriptors";
import {
  AI_INSIGHTS,
  SUGGESTIONS,
  type Suggestion,
  type SuggestionPriority,
} from "../../../data/suggestions";
import { pickLocalization } from "../../domain/entities/localization";
import { InsightsPanel } from "./components/insights-panel";
import { SuggestionCard } from "./components/suggestion-card";
import { SummaryBar } from "./components/summary-bar";

/* -- Helpers ------------------------------------------------------------- */

const PRIORITY_ORDER: readonly SuggestionPriority[] = ["high", "medium", "low"];

function averageConfidence(items: readonly Suggestion[]): number {
  if (items.length === 0) return 0;
  const sum = items.reduce((acc, s) => acc + s.confidence, 0);
  return sum / items.length;
}

function uniqueProjects(items: readonly Suggestion[]): readonly ProjectSlug[] {
  const seen = new Set<ProjectSlug>();
  for (const s of items) seen.add(s.projectSlug);
  return [...seen];
}

/* -- Priority section labels --------------------------------------------- */

function usePriorityLabel(
  priority: SuggestionPriority,
  t: (key: string, opts: { defaultValue: string }) => string,
): string {
  switch (priority) {
    case "high":
      return t("suggestion-priority-high", { defaultValue: "High Priority" });
    case "medium":
      return t("suggestion-priority-medium", { defaultValue: "Medium Priority" });
    case "low":
      return t("suggestion-priority-low", { defaultValue: "Low Priority" });
  }
}

/* -- Component ----------------------------------------------------------- */

export function SuggestionsScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;

  const [dismissedIds, setDismissedIds] = useState<ReadonlySet<string>>(new Set());
  const [activeProject, setActiveProject] = useState<ProjectSlug | "all">("all");

  const visibleSuggestions = useMemo(() => {
    return SUGGESTIONS.filter((s) => {
      if (dismissedIds.has(s.id)) return false;
      if (activeProject !== "all" && s.projectSlug !== activeProject) {
        return false;
      }
      return true;
    });
  }, [dismissedIds, activeProject]);

  const projects = useMemo(() => uniqueProjects(SUGGESTIONS), []);

  const handleDismiss = (id: string): void => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  const handleAddToBacklog = (id: string): void => {
    setDismissedIds((prev) => new Set([...prev, id]));
  };

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {t("page-ai-suggestions", { defaultValue: "AI Suggestions" })}
      </h1>
      <p className="mt-1 text-base-content/70">
        {t("page-ai-suggestions-sub", {
          defaultValue: "Intelligent recommendations from your agent backends.",
        })}
      </p>

      {/* Summary bar */}
      <div className="mt-4">
        <SummaryBar
          analysedCount={SUGGESTIONS.length * 12}
          suggestedCount={visibleSuggestions.length}
          averageConfidence={averageConfidence(visibleSuggestions)}
          lastUpdated={new Intl.DateTimeFormat(locale, {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(2026, 2, 18))}
        />
      </div>

      {/* Project filter tabs */}
      <div
        className="mt-4"
        role="tablist"
        aria-label={t("suggestion-filter-tabs", {
          defaultValue: "Project filter",
        })}
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeProject === "all"}
          className={`btn btn-sm me-2 ${activeProject === "all" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setActiveProject("all")}
        >
          {t("suggestion-filter-all", { defaultValue: "All Projects" })}
        </button>
        {projects.map((slug) => {
          const pLoc = pickLocalization(projectDescriptors[slug].localizations, locale);
          return (
            <button
              key={slug}
              type="button"
              role="tab"
              aria-selected={activeProject === slug}
              className={`btn btn-sm me-2 ${activeProject === slug ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setActiveProject(slug)}
            >
              {pLoc.name}
            </button>
          );
        })}
      </div>

      {/* Main content: suggestions + insights */}
      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        {/* Suggestion groups */}
        <div className="flex-1 space-y-6">
          {PRIORITY_ORDER.map((priority) => {
            const items = visibleSuggestions.filter((s) => s.priority === priority);
            if (items.length === 0) return null;
            return (
              <PriorityGroup
                key={priority}
                priority={priority}
                suggestions={items}
                locale={locale}
                onDismiss={handleDismiss}
                onAddToBacklog={handleAddToBacklog}
              />
            );
          })}

          {visibleSuggestions.length === 0 ? (
            <p className="py-8 text-center text-base-content/60">
              {t("suggestion-empty", {
                defaultValue: "No suggestions to display.",
              })}
            </p>
          ) : null}
        </div>

        {/* AI Insights panel */}
        <div className="w-full lg:w-80">
          <InsightsPanel insights={AI_INSIGHTS} locale={locale} />
        </div>
      </div>
    </div>
  );
}

/* -- Priority group ------------------------------------------------------ */

interface PriorityGroupProps {
  readonly priority: SuggestionPriority;
  readonly suggestions: readonly Suggestion[];
  readonly locale: string;
  readonly onDismiss: (id: string) => void;
  readonly onAddToBacklog: (id: string) => void;
}

function PriorityGroup({
  priority,
  suggestions,
  locale,
  onDismiss,
  onAddToBacklog,
}: PriorityGroupProps): JSX.Element {
  const { t } = useTranslation();
  const label = usePriorityLabel(priority, t);

  return (
    <section aria-label={label}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-wider text-base-content/60">
        {label}
      </h2>
      <ol className="mt-2 space-y-3" aria-label={label}>
        {suggestions.map((s) => (
          <SuggestionCard
            key={s.id}
            suggestion={s}
            locale={locale}
            onDismiss={onDismiss}
            onAddToBacklog={onAddToBacklog}
          />
        ))}
      </ol>
    </section>
  );
}
