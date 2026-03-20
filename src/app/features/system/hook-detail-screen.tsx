/** @file Hook detail screen — trigger config, predicate, action chain, execution log. */

import { IconArrowLeft } from "@tabler/icons-react";
import { getRouteApi, Link } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { type ExecutionOutcome, findHookById, type HookDefinition } from "../../../data/hooks";
import { pickLocalization } from "../../domain/entities/localization";
import { formatTimelineTimestamp } from "../../utils/date-formatting";
import { StatusBadge } from "./components/status-badge";

/* ── Route API ────────────────────────────────────────────────────── */

const routeApi = getRouteApi("/system/hooks/$id");

/* ── Outcome badge ────────────────────────────────────────────────── */

const OUTCOME_STYLE: Record<ExecutionOutcome, string> = {
  pass: "bg-success/15 text-success",
  fail: "bg-error/15 text-error",
  skip: "bg-base-300/40 text-base-content/50",
};

function OutcomeBadge({
  outcome,
  label,
}: {
  readonly outcome: ExecutionOutcome;
  readonly label?: string;
}): JSX.Element {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wide ${OUTCOME_STYLE[outcome]}`}
    >
      {label ?? outcome}
    </span>
  );
}

function HookNotFound({
  backToHooksLabel,
  notFoundMessage,
}: {
  readonly backToHooksLabel: string;
  readonly notFoundMessage: string;
}): JSX.Element {
  return (
    <div>
      <Link
        to="/system/hooks"
        className="inline-flex items-center gap-1 text-primary hover:underline"
      >
        <IconArrowLeft size={16} stroke={1.5} aria-hidden="true" />
        {backToHooksLabel}
      </Link>
      <p className="mt-4 text-base-content/60">{notFoundMessage}</p>
    </div>
  );
}

function HookDetailHeader({
  hook,
  loc,
  enabledLabel,
  disabledLabel,
}: {
  readonly hook: HookDefinition;
  readonly loc: { readonly name: string; readonly description?: string };
  readonly enabledLabel: string;
  readonly disabledLabel: string;
}): JSX.Element {
  return (
    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
          {loc.name}
        </h1>
        {loc.description ? <p className="mt-1 text-base-content/70">{loc.description}</p> : null}
      </div>
      <StatusBadge
        label={hook.enabled ? enabledLabel : disabledLabel}
        tone={hook.enabled ? "success" : "neutral"}
        size="regular"
      />
    </div>
  );
}

function HookConfigSection({
  hook,
  regionLabel,
  headingLabel,
  triggerTypeLabel,
  predicateLabel,
  actionsLabel,
  priorityLabel,
}: {
  readonly hook: HookDefinition;
  readonly regionLabel: string;
  readonly headingLabel: string;
  readonly triggerTypeLabel: string;
  readonly predicateLabel: string;
  readonly actionsLabel: string;
  readonly priorityLabel: string;
}): JSX.Element {
  const actionOccurrences = new Map<string, number>();
  const actionItems = hook.actions.map((action) => {
    const occurrence = (actionOccurrences.get(action) ?? 0) + 1;
    actionOccurrences.set(action, occurrence);
    return { action, occurrence };
  });

  return (
    <section
      className="mt-6 card border border-base-300 bg-base-100 shadow-sm"
      aria-label={regionLabel}
    >
      <div className="card-body p-5">
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
          {headingLabel}
        </h2>
        <dl className="space-y-3">
          <div>
            <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {triggerTypeLabel}
            </dt>
            <dd className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)]">
              {hook.triggerType}
            </dd>
          </div>
          <div>
            <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {predicateLabel}
            </dt>
            <dd className="mt-1 rounded-lg bg-base-200 p-3 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)]">
              <pre className="whitespace-pre-wrap break-words">{hook.predicate}</pre>
            </dd>
          </div>
          <div>
            <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {actionsLabel}
            </dt>
            <dd className="mt-1">
              <ol className="flex flex-wrap gap-2">
                {actionItems.map(({ action, occurrence }, i) => (
                  <li
                    key={`${action}-${occurrence}`}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-primary"
                  >
                    <span className="tabular-nums text-primary/60">{i + 1}.</span>
                    {action}
                  </li>
                ))}
              </ol>
            </dd>
          </div>
          <div>
            <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {priorityLabel}
            </dt>
            <dd className="mt-1 tabular-nums text-[length:var(--font-size-sm)]">{hook.priority}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function HookExecutionLog({
  hook,
  locale,
  regionLabel,
  headingLabel,
  tableLabel,
  timeLabel,
  outcomeLabel,
  detailLabel,
  durationLabel,
  emptyLabel,
  outcomeLabels,
  formatDuration,
}: {
  readonly hook: HookDefinition;
  readonly locale: string;
  readonly regionLabel: string;
  readonly headingLabel: string;
  readonly tableLabel: string;
  readonly timeLabel: string;
  readonly outcomeLabel: string;
  readonly detailLabel: string;
  readonly durationLabel: string;
  readonly emptyLabel: string;
  readonly outcomeLabels: Record<ExecutionOutcome, string>;
  readonly formatDuration: (value: number) => string;
}): JSX.Element {
  return (
    <section
      className="mt-6 card border border-base-300 bg-base-100 shadow-sm"
      aria-label={regionLabel}
    >
      <div className="card-body p-5">
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
          {headingLabel}
        </h2>
        {hook.executionLog.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full" aria-label={tableLabel}>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                  >
                    {timeLabel}
                  </th>
                  <th
                    scope="col"
                    className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                  >
                    {outcomeLabel}
                  </th>
                  <th
                    scope="col"
                    className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                  >
                    {detailLabel}
                  </th>
                  <th
                    scope="col"
                    className="text-right font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                  >
                    {durationLabel}
                  </th>
                </tr>
              </thead>
              <tbody>
                {hook.executionLog.map((entry) => {
                  const entryLoc = pickLocalization(entry.localizations, locale);
                  return (
                    <tr key={entry.id} className="min-h-9 hover:bg-base-200/40">
                      <td className="whitespace-nowrap font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] text-base-content/60">
                        <time dateTime={entry.timestamp}>
                          {formatTimelineTimestamp(entry.timestamp, locale)}
                        </time>
                      </td>
                      <td>
                        <OutcomeBadge
                          outcome={entry.outcome}
                          label={outcomeLabels[entry.outcome]}
                        />
                      </td>
                      <td className="text-[length:var(--font-size-sm)]">{entryLoc.name}</td>
                      <td className="text-right font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] tabular-nums text-base-content/60">
                        {formatDuration(entry.durationMs)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-base-content/60">{emptyLabel}</p>
        )}
      </div>
    </section>
  );
}

export function HookDetailScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const { id } = routeApi.useParams();
  const hook = findHookById(id);
  const backToHooksLabel = t("back-to-hooks", { defaultValue: "Back to Hooks & Policies" });
  const outcomeLabels: Record<ExecutionOutcome, string> = {
    pass: t("outcome-pass", { defaultValue: "Pass" }),
    fail: t("outcome-fail", { defaultValue: "Fail" }),
    skip: t("outcome-skip", { defaultValue: "Skip" }),
  };

  if (!hook) {
    return (
      <HookNotFound
        backToHooksLabel={backToHooksLabel}
        notFoundMessage={t("hook-not-found", { defaultValue: "Hook not found." })}
      />
    );
  }

  const loc = pickLocalization(hook.localizations, locale);

  return (
    <div>
      <Link
        to="/system/hooks"
        className="inline-flex items-center gap-1 text-primary hover:underline"
      >
        <IconArrowLeft size={16} stroke={1.5} aria-hidden="true" />
        {backToHooksLabel}
      </Link>
      <HookDetailHeader
        hook={hook}
        loc={loc}
        enabledLabel={t("hook-enabled", { defaultValue: "Enabled" })}
        disabledLabel={t("hook-disabled", { defaultValue: "Disabled" })}
      />
      <HookConfigSection
        hook={hook}
        regionLabel={t("hook-config-region", { defaultValue: "Hook configuration" })}
        headingLabel={t("hook-config-heading", { defaultValue: "Configuration" })}
        triggerTypeLabel={t("hook-trigger-type", { defaultValue: "Trigger Type" })}
        predicateLabel={t("hook-predicate", { defaultValue: "Predicate" })}
        actionsLabel={t("hook-actions", { defaultValue: "Action Chain" })}
        priorityLabel={t("hook-priority", { defaultValue: "Priority" })}
      />
      <HookExecutionLog
        hook={hook}
        locale={locale}
        regionLabel={t("hook-exec-region", { defaultValue: "Execution log" })}
        headingLabel={t("hook-exec-heading", { defaultValue: "Execution Log" })}
        tableLabel={t("hook-exec-table-label", { defaultValue: "Hook execution log" })}
        timeLabel={t("hook-exec-col-time", { defaultValue: "Time" })}
        outcomeLabel={t("hook-exec-col-outcome", { defaultValue: "Outcome" })}
        detailLabel={t("hook-exec-col-detail", { defaultValue: "Detail" })}
        durationLabel={t("hook-exec-col-duration", { defaultValue: "Duration" })}
        emptyLabel={t("hook-exec-empty", { defaultValue: "No executions recorded." })}
        outcomeLabels={outcomeLabels}
        formatDuration={(value) => t("unit-ms", { defaultValue: "{{value}}ms", value })}
      />
    </div>
  );
}
