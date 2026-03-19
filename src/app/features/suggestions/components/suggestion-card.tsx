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
import { useTranslation } from "react-i18next";
import { projectDescriptors } from "../../../../data/registries/project-descriptors";
import type { Suggestion } from "../../../../data/suggestions";
import { CATEGORY_TAGS } from "../../../../data/suggestions";
import { ChamferCard } from "../../../components/chamfer-card";
import { pickLocalization } from "../../../domain/entities/localization";
import { ConfidenceBadge } from "./confidence-badge";

interface SuggestionCardProps {
  readonly suggestion: Suggestion;
  readonly locale: string;
  readonly onDismiss: (id: string) => void;
  readonly onAddToBacklog: (id: string) => void;
}

export function SuggestionCard({
  suggestion,
  locale,
  onDismiss,
  onAddToBacklog,
}: SuggestionCardProps): JSX.Element {
  const { t } = useTranslation();
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
          {/* Top row: project badge + category tags + confidence */}
          <div className="flex flex-wrap items-start gap-2">
            <span className="badge badge-outline badge-sm">{projectLoc.name}</span>
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

          {/* Duration + Assignees row */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-[length:var(--font-size-xs)] text-base-content/60">
              {t("suggestion-duration", { defaultValue: "Est." })} {suggestion.estimatedDuration}
            </span>

            {/* Assignee avatar stack */}
            <fieldset
              className="flex -space-x-2 border-none p-0"
              aria-label={t("suggestion-assignees-label", {
                defaultValue: "Suggested assignees",
              })}
            >
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

          {/* Action buttons */}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => onDismiss(suggestion.id)}
            >
              {t("suggestion-dismiss", { defaultValue: "Dismiss" })}
            </button>
            <button
              type="button"
              className="btn btn-sm bg-accent text-accent-content hover:bg-accent/80"
              onClick={() => onAddToBacklog(suggestion.id)}
            >
              {t("suggestion-add-backlog", {
                defaultValue: "Add to Backlog",
              })}
            </button>
          </div>
        </div>
      </ChamferCard>
    </li>
  );
}
