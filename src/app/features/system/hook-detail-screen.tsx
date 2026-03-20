/** @file Hook detail screen — trigger config, predicate, action chain, execution log. */

import { IconArrowLeft } from "@tabler/icons-react";
import { getRouteApi, Link } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import {
  type ExecutionOutcome,
  findHookById,
  type HookDefinition,
  hookId,
} from "../../../data/hooks";
import { type LocalizedStringSet, pickLocalization } from "../../domain/entities/localization";
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

interface HookConfigLabels {
  readonly region: string;
  readonly heading: string;
  readonly triggerType: string;
  readonly predicate: string;
  readonly actions: string;
  readonly priority: string;
}

interface HookExecutionLogLabels {
  readonly region: string;
  readonly heading: string;
  readonly table: string;
  readonly time: string;
  readonly outcome: string;
  readonly detail: string;
  readonly duration: string;
  readonly empty: string;
}

function OutcomeBadge({
  outcome,
  label,
}: {
  readonly outcome: ExecutionOutcome;
  readonly label: string;
}): JSX.Element {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wide ${OUTCOME_STYLE[outcome]}`}
    >
      {label}
    </span>
  );
}

function HookNotFound({
  heading,
  backToHooksLabel,
  notFoundMessage,
}: {
  readonly heading: string;
  readonly backToHooksLabel: string;
  readonly notFoundMessage: string;
}): JSX.Element {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {heading}
      </h1>
      <Link
        to="/system/hooks"
        className="mt-4 inline-flex items-center gap-1 text-primary hover:underline"
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
  readonly loc: LocalizedStringSet;
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
  configLabels,
}: {
  readonly hook: HookDefinition;
  readonly configLabels: HookConfigLabels;
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
      aria-label={configLabels.region}
    >
      <div className="card-body p-5">
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
          {configLabels.heading}
        </h2>
        <dl className="space-y-3">
          <div>
            <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {configLabels.triggerType}
            </dt>
            <dd className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)]">
              {hook.triggerType}
            </dd>
          </div>
          <div>
            <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {configLabels.predicate}
            </dt>
            <dd className="mt-1 rounded-lg bg-base-200 p-3 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)]">
              <pre className="whitespace-pre-wrap break-words">{hook.predicate}</pre>
            </dd>
          </div>
          <div>
            <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
              {configLabels.actions}
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
              {configLabels.priority}
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
  executionLogLabels,
  outcomeLabels,
  formatDuration,
}: {
  readonly hook: HookDefinition;
  readonly locale: string;
  readonly executionLogLabels: HookExecutionLogLabels;
  readonly outcomeLabels: Record<ExecutionOutcome, string>;
  readonly formatDuration: (value: number) => string;
}): JSX.Element {
  return (
    <section
      className="mt-6 card border border-base-300 bg-base-100 shadow-sm"
      aria-label={executionLogLabels.region}
    >
      <div className="card-body p-5">
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
          {executionLogLabels.heading}
        </h2>
        {hook.executionLog.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full" aria-label={executionLogLabels.table}>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                  >
                    {executionLogLabels.time}
                  </th>
                  <th
                    scope="col"
                    className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                  >
                    {executionLogLabels.outcome}
                  </th>
                  <th
                    scope="col"
                    className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                  >
                    {executionLogLabels.detail}
                  </th>
                  <th
                    scope="col"
                    className="text-right font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                  >
                    {executionLogLabels.duration}
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
          <p className="text-base-content/60">{executionLogLabels.empty}</p>
        )}
      </div>
    </section>
  );
}

export function HookDetailScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const { id } = routeApi.useParams();
  const validatedHookId = (() => {
    try {
      return hookId(id);
    } catch {
      return undefined;
    }
  })();
  const hook = validatedHookId ? findHookById(validatedHookId) : undefined;
  const backToHooksLabel = t("back-to-hooks", { defaultValue: "Back to Hooks & Policies" });
  const outcomeLabels: Record<ExecutionOutcome, string> = {
    pass: t("outcome-pass", { defaultValue: "Pass" }),
    fail: t("outcome-fail", { defaultValue: "Fail" }),
    skip: t("outcome-skip", { defaultValue: "Skip" }),
  };

  if (!hook) {
    return (
      <HookNotFound
        heading={t("page-hooks-policies", { defaultValue: "Hooks & Policies" })}
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
        configLabels={{
          region: t("hook-config-region", { defaultValue: "Hook configuration" }),
          heading: t("hook-config-heading", { defaultValue: "Configuration" }),
          triggerType: t("hook-trigger-type", { defaultValue: "Trigger Type" }),
          predicate: t("hook-predicate", { defaultValue: "Predicate" }),
          actions: t("hook-actions", { defaultValue: "Action Chain" }),
          priority: t("hook-priority", { defaultValue: "Priority" }),
        }}
      />
      <HookExecutionLog
        hook={hook}
        locale={locale}
        executionLogLabels={{
          region: t("hook-exec-region", { defaultValue: "Execution log" }),
          heading: t("hook-exec-heading", { defaultValue: "Execution Log" }),
          table: t("hook-exec-table-label", { defaultValue: "Hook execution log" }),
          time: t("hook-exec-col-time", { defaultValue: "Time" }),
          outcome: t("hook-exec-col-outcome", { defaultValue: "Outcome" }),
          detail: t("hook-exec-col-detail", { defaultValue: "Detail" }),
          duration: t("hook-exec-col-duration", { defaultValue: "Duration" }),
          empty: t("hook-exec-empty", { defaultValue: "No executions recorded." }),
        }}
        outcomeLabels={outcomeLabels}
        formatDuration={(value) => t("unit-ms", { defaultValue: "{{value}}ms", value })}
      />
    </div>
  );
}
