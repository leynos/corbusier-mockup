/** @file Adapts dashboard fixture events into the shared timeline component shape. */

import { type DashboardEventKind, RECENT_ACTIVITY } from "../../../data/dashboard";
import type { TimelineEntry } from "../../components/activity-timeline";

function mapDashboardEventKind(kind: DashboardEventKind): TimelineEntry["kind"] {
  return kind === "tool_call" || kind === "agent_turn" ? "agent_action" : kind;
}

export function getRecentActivityEntries(limit = 10): TimelineEntry[] {
  return RECENT_ACTIVITY.slice(0, limit).map((event) => ({
    id: event.id,
    kind: mapDashboardEventKind(event.kind),
    timestamp: event.timestamp,
    actor: event.actor,
    localizations: event.localizations,
  }));
}
