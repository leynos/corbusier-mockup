/** @file Adapts dashboard fixture events into the shared timeline component shape.
 *
 * The timeline shows the most recent events first, regardless of the
 * insertion order used by the static fixture array.
 */

import {
  type DashboardEvent,
  type DashboardEventKind,
  RECENT_ACTIVITY,
} from "../../../data/dashboard";
import type { TimelineEntry } from "../../components/activity-timeline";

function mapDashboardEventKind(kind: DashboardEventKind): TimelineEntry["kind"] {
  return kind === "tool_call" || kind === "agent_turn" ? "agent_action" : kind;
}

/**
 * Return recent dashboard events in reverse-chronological order.
 *
 * The `limit` argument is clamped at zero so callers can safely pass
 * derived values without guarding negative cases.
 */
export function getRecentActivityEntries(limit = 10): TimelineEntry[] {
  return [...RECENT_ACTIVITY]
    .sort(
      (left: DashboardEvent, right: DashboardEvent) =>
        Date.parse(right.timestamp) - Date.parse(left.timestamp),
    )
    .slice(0, Math.max(0, limit))
    .map((event: DashboardEvent) => ({
      id: event.id,
      kind: mapDashboardEventKind(event.kind),
      timestamp: event.timestamp,
      actor: event.actor,
      localizations: event.localizations,
    }));
}
