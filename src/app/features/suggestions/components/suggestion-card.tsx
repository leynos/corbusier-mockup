/** @file Single AI suggestion card with chamfered container.
 *
 * Displays project badge, category tags, title, rationale text,
 * dependency context, estimated duration, confidence badge, suggested
 * assignee avatars, and Dismiss / Add to Backlog action buttons.
 *
 * The chamfer marks this as a moveable unit of work per the design
 * language.
 */

import type { JSX } from "react";
import { projectDescriptors } from "../../../../data/registries/project-descriptors";
import type { Suggestion } from "../../../../data/suggestions";
import { CATEGORY_TAGS } from "../../../../data/suggestions";
import { ChamferCard } from "../../../components/chamfer-card";
import { pickLocalization } from "../../../domain/entities/localization";
import { ConfidenceBadge } from "./confidence-badge";

export interface SuggestionCardLabels {
  readonly duration: string;
  readonly assigneesAriaLabel: string;
  readonly dismiss: string;
  readonly addToBacklog: string;
}

interface SuggestionCardProps {
  readonly suggestion: Suggestion;
  readonly locale: string;
  readonly labels: SuggestionCardLabels;
  readonly onDismiss: (id: Suggestion["id"]) => void;
  readonly onAddToBacklog: (id: Suggestion["id"]) => void;
}

interface BadgeGroupProps {
  readonly suggestion: Suggestion;
  readonly locale: string;
  readonly projectName: string;
}

function BadgeGroup({ suggestion, locale, projectName }: BadgeGroupProps): JSX.Element {
  return (
    <div className="flex flex-wrap items-start gap-2">
      <span className="badge badge-outline badge-sm">{projectName}</span>
      {suggestion.categoryTagIds.map((tagKey) => {
        const tagLoc = pickLocalization(CATEGORY_TAGS[tagKey], locale);
        return (
          <span key={tagKey} className="badge badge-ghost badge-sm">
            {tagLoc.name}
          </span>
        );
      })}
      <div className="ms-auto">
        <ConfidenceBadge value={suggestion.confidence} />
      </div>
    </div>
  );
}

interface DurationAssigneesProps {
  readonly suggestion: Suggestion;
  readonly labels: SuggestionCardLabels;
}

function DurationAssignees({ suggestion, labels }: DurationAssigneesProps): JSX.Element {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <span className="text-[length:var(--font-size-xs)] text-base-content/60">
        {labels.duration} {suggestion.estimatedDuration}
      </span>

      <fieldset className="flex -space-x-2 border-none p-0" aria-label={labels.assigneesAriaLabel}>
        {suggestion.suggestedAssignees.map((a, index) => (
          <span
            key={`${a.name}-${String(index)}`}
            role="img"
            className="inline-flex size-7 items-center justify-center rounded-full bg-primary text-[length:var(--font-size-xs)] font-semibold text-primary-content ring-2 ring-base-100"
            title={a.name}
            aria-label={a.name}
          >
            {a.initials}
          </span>
        ))}
      </fieldset>
    </div>
  );
}

interface SuggestionActionsProps {
  readonly suggestionId: Suggestion["id"];
  readonly labels: SuggestionCardLabels;
  readonly onDismiss: (id: Suggestion["id"]) => void;
  readonly onAddToBacklog: (id: Suggestion["id"]) => void;
}

function SuggestionActions({
  suggestionId,
  labels,
  onDismiss,
  onAddToBacklog,
}: SuggestionActionsProps): JSX.Element {
  return (
    <div className="mt-3 flex gap-2">
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => onDismiss(suggestionId)}
      >
        {labels.dismiss}
      </button>
      <button
        type="button"
        className="btn btn-sm bg-accent text-accent-content hover:bg-accent/80"
        onClick={() => onAddToBacklog(suggestionId)}
      >
        {labels.addToBacklog}
      </button>
    </div>
  );
}

export function SuggestionCard({
  suggestion,
  locale,
  labels,
  onDismiss,
  onAddToBacklog,
}: SuggestionCardProps): JSX.Element {
  const loc = pickLocalization(suggestion.localizations, locale);
  const depLoc = pickLocalization(suggestion.dependencyLocalizations, locale);
  const projectLoc = pickLocalization(
    projectDescriptors[suggestion.projectSlug].localizations,
    locale,
  );

  return (
    <li>
      <ChamferCard size="md" fillClassName="fill-base-100" strokeClassName="stroke-base-300">
        <div className="p-4">
          <BadgeGroup suggestion={suggestion} locale={locale} projectName={projectLoc.name} />

          {/* Title */}
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--font-size-lg)] font-bold text-base-content">
            {loc.name}
          </h3>

          {/* Rationale */}
          {loc.description ? (
            <p className="mt-1 text-[length:var(--font-size-sm)] text-base-content/70">
              {loc.description}
            </p>
          ) : null}

          {/* Dependency context */}
          {depLoc.name ? (
            <p className="mt-2 text-[length:var(--font-size-xs)] text-base-content/60">
              {depLoc.name}
            </p>
          ) : null}

          <DurationAssignees suggestion={suggestion} labels={labels} />
          <SuggestionActions
            suggestionId={suggestion.id}
            labels={labels}
            onDismiss={onDismiss}
            onAddToBacklog={onAddToBacklog}
          />
        </div>
      </ChamferCard>
    </li>
  );
}
