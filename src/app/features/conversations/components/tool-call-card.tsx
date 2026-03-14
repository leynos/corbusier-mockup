/** @file Expandable tool execution card with chamfered container.
 *
 * Shows call_id, tool_name, status badge, and execution duration.
 * Click to expand full input/output JSON in a `<pre><code>` block
 * on code surface background.
 */

import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import type { JSX } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { Message, ToolCallInfo, ToolCallStatus } from "../../../../data/conversations";
import { ChamferCard } from "../../../components/chamfer-card";
import { formatTimelineTimestamp } from "../../../utils/date-formatting";

/* ── Status styling ────────────────────────────────────────────────── */

const STATUS_STYLE: Record<ToolCallStatus, { readonly bg: string; readonly text: string }> = {
  succeeded: { bg: "bg-success/15", text: "text-success" },
  failed: { bg: "bg-error/15", text: "text-error" },
  pending: { bg: "bg-warning/15", text: "text-warning" },
};

const STATUS_LABEL_KEYS: Record<ToolCallStatus, string> = {
  succeeded: "tool-status-succeeded",
  failed: "tool-status-failed",
  pending: "tool-status-pending",
};

const STATUS_LABEL_DEFAULTS: Record<ToolCallStatus, string> = {
  succeeded: "Succeeded",
  failed: "Failed",
  pending: "Pending",
};

/* ── Component ─────────────────────────────────────────────────────── */

type ToolCallMessage = Message & {
  readonly role: "tool";
  readonly toolCall: ToolCallInfo;
};

interface ToolCallCardProps {
  readonly message: ToolCallMessage;
  readonly locale: string;
}

export function ToolCallCard({ message, locale }: ToolCallCardProps): JSX.Element {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const tc = message.toolCall;

  const statusStyle = STATUS_STYLE[tc.status];
  const statusLabel = t(STATUS_LABEL_KEYS[tc.status], {
    defaultValue: STATUS_LABEL_DEFAULTS[tc.status],
  });

  return (
    <li>
      <ChamferCard
        size="md"
        fillClassName="fill-base-100"
        strokeClassName="stroke-base-300"
        className="overflow-hidden"
      >
        <div className="p-4">
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)] font-semibold text-base-content">
                {tc.toolName}
              </span>
              <span
                className={`inline-block rounded px-2 py-0.5 text-[length:var(--font-size-xs)] font-semibold ${statusStyle.bg} ${statusStyle.text}`}
              >
                {statusLabel}
              </span>
            </div>
            <time
              dateTime={message.timestamp}
              className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60"
            >
              {formatTimelineTimestamp(message.timestamp, locale)}
            </time>
          </div>

          {/* Metadata row */}
          <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[length:var(--font-size-xs)] text-base-content/60">
            <div className="flex items-center gap-1">
              <dt className="font-semibold">{t("tool-call-id", { defaultValue: "Call ID" })}:</dt>
              <dd className="font-[family-name:var(--font-mono)]">{tc.callId}</dd>
            </div>
            <div className="flex items-center gap-1">
              <dt className="font-semibold">
                {t("tool-call-duration", { defaultValue: "Duration" })}:
              </dt>
              <dd className="font-[family-name:var(--font-mono)]">{`${tc.durationMs}ms`}</dd>
            </div>
          </dl>

          {/* Expand toggle */}
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-1 text-[length:var(--font-size-xs)] font-semibold text-primary hover:text-primary/80"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-controls={`tool-detail-${tc.callId}`}
          >
            {expanded ? (
              <IconChevronUp size={14} aria-hidden="true" />
            ) : (
              <IconChevronDown size={14} aria-hidden="true" />
            )}
            {expanded
              ? t("tool-call-hide", { defaultValue: "Hide details" })
              : t("tool-call-show", { defaultValue: "Show details" })}
          </button>
        </div>

        {/* Expandable detail */}
        {expanded ? (
          <div
            id={`tool-detail-${tc.callId}`}
            className="border-t border-base-300 bg-base-300/30 p-4"
          >
            <p className="mb-1 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-base-content/60">
              {t("tool-call-input", { defaultValue: "Input" })}
            </p>
            <pre className="whitespace-pre-wrap break-words rounded bg-base-300/40 p-3 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content">
              <code>{tc.input}</code>
            </pre>

            <p className="mb-1 mt-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-base-content/60">
              {t("tool-call-output", { defaultValue: "Output" })}
            </p>
            <pre className="whitespace-pre-wrap break-words rounded bg-base-300/40 p-3 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content">
              <code>{tc.output}</code>
            </pre>
          </div>
        ) : null}
      </ChamferCard>
    </li>
  );
}
