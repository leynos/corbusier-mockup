/** @file Personnel detail screen — profile with metadata and activity history. */

import { IconArrowLeft } from "@tabler/icons-react";
import { getRouteApi, Link } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import {
  findPersonnelById,
  type PersonnelActivityEntry,
  type PersonnelEventKind,
  parsePersonnelId,
  personnelRoleDescriptors,
} from "../../../data/personnel";
import type { ActivityEventKind } from "../../../data/tasks";
import { ActivityTimeline, type TimelineEntry } from "../../components/activity-timeline";
import { pickLocalization } from "../../domain/entities/localization";
import { formatTimelineTimestamp } from "../../utils/date-formatting";

/* ── Route API ────────────────────────────────────────────────────── */

const routeApi = getRouteApi("/system/personnel/$id");

/* ── Activity adapter ─────────────────────────────────────────────── */

const EVENT_KIND_MAP: Record<PersonnelEventKind, ActivityEventKind> = {
  login: "agent_action",
  role_change: "state_change",
  task_completed: "subtask_completed",
  comment: "comment",
  review_approved: "pr_opened",
};

/**
 * Convert personnel activity entries into the shared timeline view model.
 *
 * @param entries - Read-only personnel activity entries to adapt.
 * @param actorName - Display name used as the actor on every timeline item.
 * @returns Timeline entries carrying id, kind, timestamp, actor, and localizations.
 */
function toTimelineEntries(
  entries: readonly PersonnelActivityEntry[],
  actorName: string,
): TimelineEntry[] {
  return entries.map((e) => ({
    id: e.id,
    kind: EVENT_KIND_MAP[e.kind],
    timestamp: e.timestamp,
    actor: actorName,
    localizations: e.localizations,
  }));
}

/**
 * Render the shared back link used by the personnel detail route.
 *
 * @param label - Localised link label for the personnel index route.
 * @returns A `JSX.Element` linking back to the personnel list.
 */
function BackToPersonnelLink({ label }: { readonly label: string }): JSX.Element {
  return (
    <Link
      to="/system/personnel"
      className="inline-flex items-center gap-1 text-primary hover:underline"
    >
      <IconArrowLeft size={16} stroke={1.5} aria-hidden="true" />
      {label}
    </Link>
  );
}

/* ── Screen ───────────────────────────────────────────────────────── */

/**
 * Render the personnel detail route with metadata and activity history.
 *
 * @returns A `JSX.Element` for the personnel detail screen.
 */
export function PersonnelDetailScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const numberFormatter = new Intl.NumberFormat(locale);
  const { id } = routeApi.useParams();
  const personnelId = parsePersonnelId(id);
  const personnel = personnelId ? findPersonnelById(personnelId) : undefined;
  const backToPersonnelLabel = t("back-to-personnel", { defaultValue: "Back to Personnel" });

  if (!personnel) {
    return (
      <div>
        <BackToPersonnelLink label={backToPersonnelLabel} />
        <p className="mt-4 text-base-content/60">
          {t("personnel-not-found", { defaultValue: "Personnel not found." })}
        </p>
      </div>
    );
  }

  const loc = pickLocalization(personnel.localizations, locale);
  const roleLoc = pickLocalization(personnelRoleDescriptors[personnel.role].localizations, locale);
  const timelineEntries = toTimelineEntries(personnel.activityHistory, loc.name);

  return (
    <div>
      <BackToPersonnelLink label={backToPersonnelLabel} />

      {/* Header */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
            {loc.name}
          </h1>
          {loc.description ? <p className="mt-1 text-base-content/70">{loc.description}</p> : null}
        </div>
        <span className="inline-flex items-center rounded-full bg-base-300/40 px-3 py-1 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wide text-base-content/70">
          {roleLoc.name}
        </span>
      </div>

      {/* Metadata */}
      <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-base-300 bg-base-100 p-4">
          <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("personnel-detail-id", { defaultValue: "Personnel ID" })}
          </dt>
          <dd className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)]">
            {personnel.id}
          </dd>
        </div>
        <div className="rounded-lg border border-base-300 bg-base-100 p-4">
          <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("personnel-detail-tasks", { defaultValue: "Assigned Tasks" })}
          </dt>
          <dd className="mt-1 tabular-nums text-[length:var(--font-size-sm)]">
            {numberFormatter.format(personnel.assignedTaskCount)}
          </dd>
        </div>
        <div className="rounded-lg border border-base-300 bg-base-100 p-4">
          <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("personnel-detail-last-active", { defaultValue: "Last Active" })}
          </dt>
          <dd className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)]">
            <time dateTime={personnel.lastActive}>
              {formatTimelineTimestamp(personnel.lastActive, locale)}
            </time>
          </dd>
        </div>
      </dl>

      {/* Activity history */}
      <section
        className="mt-6 card border border-base-300 bg-base-100 shadow-sm"
        aria-label={t("personnel-activity-region", { defaultValue: "Activity history" })}
      >
        <div className="card-body p-5">
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("personnel-activity-heading", { defaultValue: "Personnel Activity History" })}
          </h2>
          {timelineEntries.length > 0 ? (
            <ActivityTimeline entries={timelineEntries} />
          ) : (
            <p className="text-base-content/60">
              {t("personnel-activity-empty", { defaultValue: "No activity recorded." })}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
