/** @file Hook detail screen — trigger config, predicate, action chain, execution log. */

import { IconArrowLeft } from "@tabler/icons-react";
import { getRouteApi, Link } from "@tanstack/react-router";
import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import { type ExecutionOutcome, findHookById } from "../../../data/hooks";
import { pickLocalization } from "../../domain/entities/localization";
import { formatTimelineTimestamp } from "../../utils/date-formatting";

/* ── Route API ────────────────────────────────────────────────────── */

const routeApi = getRouteApi("/system/hooks/$id");

/* ── Outcome badge ────────────────────────────────────────────────── */

const OUTCOME_STYLE: Record<ExecutionOutcome, string> = {
  pass: "bg-success/15 text-success",
  fail: "bg-error/15 text-error",
  skip: "bg-base-300/40 text-base-content/50",
};

function OutcomeBadge({ outcome }: { readonly outcome: ExecutionOutcome }): JSX.Element {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wide ${OUTCOME_STYLE[outcome]}`}
    >
      {outcome}
    </span>
  );
}

/* ── Screen ───────────────────────────────────────────────────────── */

export function HookDetailScreen(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const { id } = routeApi.useParams();
  const hook = findHookById(id);

  if (!hook) {
    return (
      <div>
        <Link
          to="/system/hooks"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          <IconArrowLeft size={16} stroke={1.5} aria-hidden="true" />
          {t("back-to-hooks", { defaultValue: "Back to Hooks & Policies" })}
        </Link>
        <p className="mt-4 text-base-content/60">
          {t("hook-not-found", { defaultValue: "Hook not found." })}
        </p>
      </div>
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
        {t("back-to-hooks", { defaultValue: "Back to Hooks & Policies" })}
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
            {loc.name}
          </h1>
          {loc.description ? <p className="mt-1 text-base-content/70">{loc.description}</p> : null}
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wide ${
            hook.enabled ? "bg-success/15 text-success" : "bg-base-300/40 text-base-content/50"
          }`}
        >
          {hook.enabled
            ? t("hook-enabled", { defaultValue: "Enabled" })
            : t("hook-disabled", { defaultValue: "Disabled" })}
        </span>
      </div>

      {/* Configuration editor (read-only) */}
      <section
        className="mt-6 card border border-base-300 bg-base-100 shadow-sm"
        aria-label={t("hook-config-region", { defaultValue: "Hook configuration" })}
      >
        <div className="card-body p-5">
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("hook-config-heading", { defaultValue: "Configuration" })}
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
                {t("hook-trigger-type", { defaultValue: "Trigger Type" })}
              </dt>
              <dd className="mt-1 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)]">
                {hook.triggerType}
              </dd>
            </div>
            <div>
              <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
                {t("hook-predicate", { defaultValue: "Predicate" })}
              </dt>
              <dd className="mt-1 rounded-lg bg-base-200 p-3 font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)]">
                <pre className="whitespace-pre-wrap break-words">{hook.predicate}</pre>
              </dd>
            </div>
            <div>
              <dt className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
                {t("hook-actions", { defaultValue: "Action Chain" })}
              </dt>
              <dd className="mt-1">
                <ol className="flex flex-wrap gap-2">
                  {hook.actions.map((action, i) => (
                    <li
                      key={action}
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
                {t("hook-priority", { defaultValue: "Priority" })}
              </dt>
              <dd className="mt-1 tabular-nums text-[length:var(--font-size-sm)]">
                {hook.priority}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Execution log */}
      <section
        className="mt-6 card border border-base-300 bg-base-100 shadow-sm"
        aria-label={t("hook-exec-region", { defaultValue: "Execution log" })}
      >
        <div className="card-body p-5">
          <h2 className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60">
            {t("hook-exec-heading", { defaultValue: "Execution Log" })}
          </h2>
          {hook.executionLog.length > 0 ? (
            <div className="overflow-x-auto">
              <table
                className="table table-zebra w-full"
                aria-label={t("hook-exec-table-label", { defaultValue: "Hook execution log" })}
              >
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                    >
                      {t("hook-exec-col-time", { defaultValue: "Time" })}
                    </th>
                    <th
                      scope="col"
                      className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                    >
                      {t("hook-exec-col-outcome", { defaultValue: "Outcome" })}
                    </th>
                    <th
                      scope="col"
                      className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                    >
                      {t("hook-exec-col-detail", { defaultValue: "Detail" })}
                    </th>
                    <th
                      scope="col"
                      className="text-right font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                    >
                      {t("hook-exec-col-duration", { defaultValue: "Duration" })}
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
                          <OutcomeBadge outcome={entry.outcome} />
                        </td>
                        <td className="text-[length:var(--font-size-sm)]">{entryLoc.name}</td>
                        <td className="text-right font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] tabular-nums text-base-content/60">
                          {t("unit-ms", { defaultValue: "{{value}}ms", value: entry.durationMs })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-base-content/60">
              {t("hook-exec-empty", { defaultValue: "No executions recorded." })}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
