/** @file Vertical activity timeline with coloured dots. */

import type { JSX } from "react";

import type { ActivityEventKind } from "../../data/tasks";

export interface TimelineEntry {
  readonly id: string;
  readonly kind: ActivityEventKind;
  readonly timestamp: string;
  readonly actor: string;
  readonly description: string;
}

/* Dot colour follows design language:
   teal for structural (branch, PR), terracotta for state changes,
   olive for completions, base for comments/agent. */
const DOT_COLOUR: Record<ActivityEventKind, string> = {
  state_change: "bg-warning",
  subtask_completed: "bg-success",
  comment: "bg-base-content/40",
  agent_action: "bg-info",
  branch_associated: "bg-primary",
  pr_opened: "bg-primary",
};

interface ActivityTimelineProps {
  readonly entries: readonly TimelineEntry[];
  readonly className?: string;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function ActivityTimeline({ entries, className = "" }: ActivityTimelineProps): JSX.Element {
  return (
    <ol className={`relative space-y-4 ${className}`} aria-label="Activity timeline">
      {entries.map((entry, i) => (
        <li key={entry.id} className="flex gap-3">
          {/* Dot + vertical line */}
          <div className="flex flex-col items-center">
            <span
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${DOT_COLOUR[entry.kind]}`}
              aria-hidden="true"
            />
            {i < entries.length - 1 ? (
              <span className="w-px flex-1 bg-base-300" aria-hidden="true" />
            ) : null}
          </div>
          {/* Content */}
          <div className="pb-4">
            <p className="text-[length:var(--font-size-sm)] text-base-content">
              <span className="font-semibold">{entry.actor}</span> {entry.description}
            </p>
            <time
              dateTime={entry.timestamp}
              className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60"
            >
              {formatTimestamp(entry.timestamp)}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}
