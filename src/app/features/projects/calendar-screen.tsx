/** @file Calendar screen — month grid skeleton with task due-date dots.
 *
 * Renders the ProjectHeader with view switcher tabs, followed by a
 * calendar table showing the current month. Days with task due dates
 * display coloured indicator dots and expose the due state to
 * assistive technologies.
 */

import { Navigate, useParams } from "@tanstack/react-router";
import type { JSX } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import * as v from "valibot";

import { findProject, getTasksForProject } from "../../../data/projects";
import { type ProjectSlug, parseProjectSlug } from "../../../data/registries/project-descriptors";
import { TASKS } from "../../../data/tasks";
import { useNow } from "../../hooks/use-now";
import { ProjectHeader } from "./project-landing-screen";

/**
 * Runtime schema for ISO year-month prefixes consumed by the calendar parser.
 *
 * Accepts strings shaped like `YYYY-MM` only. This schema is intentionally
 * narrow because `parseIsoYearMonth` derives calendar state from the validated
 * prefix and falls back when validation fails.
 */
const isoYearMonthSchema = v.pipe(
  v.string(),
  v.regex(/^\d{4}-\d{2}$/u, "Expected ISO year-month in YYYY-MM format"),
);

/**
 * Count due dates for all tasks belonging to one project.
 *
 * @param slug Canonical project slug whose tasks should be counted.
 * @returns Read-only map keyed by ISO `YYYY-MM-DD` due dates where each value
 * is the number of tasks due on that date.
 */
function buildDueDateCounts(slug: ProjectSlug): ReadonlyMap<string, number> {
  const counts = new Map<string, number>();

  for (const task of getTasksForProject(slug, TASKS)) {
    counts.set(task.dueDate, (counts.get(task.dueDate) ?? 0) + 1);
  }

  return counts;
}

/**
 * Resolve the locale's first weekday index.
 *
 * @param locale BCP 47 locale used to read `Intl.Locale.weekInfo`.
 * @returns Weekday index in JavaScript's `Date#getDay()` shape where Sunday is
 * `0`. Falls back to `1` (Monday) when locale metadata is unavailable or
 * throws.
 */
function getFirstDayOfWeek(locale: string): number {
  try {
    const localeInfo = new Intl.Locale(locale) as Intl.Locale & {
      weekInfo?: { readonly firstDay?: number };
    };
    const firstDay = localeInfo.weekInfo?.firstDay ?? 1;
    return firstDay === 7 ? 0 : firstDay;
  } catch {
    return 1;
  }
}

/**
 * Build a padded month-cell array for the calendar table.
 *
 * @param year Full four-digit calendar year.
 * @param month Zero-based month index where January is `0`.
 * @param firstDayOfWeek Weekday index that should appear in the first column.
 * @returns Read-only array whose length is always a multiple of 7. Leading and
 * trailing empty cells are represented as `null`.
 */
function buildCalendarDays(
  year: number,
  month: number,
  firstDayOfWeek: number,
): readonly (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay - firstDayOfWeek + 7) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];

  for (let index = 0; index < offset; index += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

/**
 * Split flat calendar cells into week rows.
 *
 * @param days Flat array produced by `buildCalendarDays`.
 * @returns Read-only array of week rows, each containing exactly 7 entries.
 */
function chunkCalendarDays(
  days: readonly (number | null)[],
): readonly (readonly (number | null)[])[] {
  const weeks: (readonly (number | null)[])[] = [];

  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }

  return weeks;
}

/**
 * Format localized weekday labels using a stable UTC seed.
 *
 * @param locale BCP 47 locale used for weekday formatting.
 * @param firstDayOfWeek Weekday index that should appear first in the result.
 * @returns Read-only array of 7 localized short weekday labels. Formatting is
 * forced to UTC so labels do not drift across time zones.
 */
function buildWeekdayLabels(locale: string, firstDayOfWeek: number): readonly string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
  const sundaySeedMs = Date.UTC(2026, 0, 4);

  return Array.from({ length: 7 }, (_, offset) => {
    const weekdayIndex = (firstDayOfWeek + offset) % 7;
    const date = new Date(sundaySeedMs);
    date.setUTCDate(date.getUTCDate() + weekdayIndex);
    return formatter.format(date);
  });
}

/**
 * Parse an ISO year-month prefix for calendar state.
 *
 * @param isoDate ISO year-month string in `YYYY-MM` format.
 * @param fallback Safe zero-based year/month pair used when validation fails.
 * @returns Object containing a four-digit year and zero-based month index.
 * Invalid input, non-finite numbers, and out-of-range months all return the
 * provided fallback instead of propagating `NaN`.
 */
function parseIsoYearMonth(
  isoDate: string,
  fallback: { readonly year: number; readonly month: number },
): { readonly year: number; readonly month: number } {
  const result = v.safeParse(isoYearMonthSchema, isoDate);
  if (!result.success) {
    return fallback;
  }

  const [yearPart = "", monthPart = ""] = result.output.split("-");
  const year = Number.parseInt(yearPart, 10);
  const startMonth = Number.parseInt(monthPart, 10);

  if (!Number.isFinite(year) || !Number.isInteger(year)) {
    return fallback;
  }
  if (!Number.isFinite(startMonth) || !Number.isInteger(startMonth)) {
    return fallback;
  }
  if (startMonth < 1 || startMonth > 12) {
    return fallback;
  }

  return { year, month: startMonth - 1 };
}

export function CalendarScreen(): JSX.Element {
  const { slug } = useParams({ strict: false });
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const projectSlug = slug ? parseProjectSlug(slug) : undefined;

  const project = projectSlug ? findProject(projectSlug) : undefined;
  const now = useNow();
  const currentYearMonth = { year: now.getFullYear(), month: now.getMonth() };
  const projectStart = project
    ? parseIsoYearMonth(project.dateRange.start.slice(0, 7), currentYearMonth)
    : currentYearMonth;
  const { year, month } = projectStart;
  const firstDayOfWeek = useMemo(() => getFirstDayOfWeek(locale), [locale]);

  const dueDateCounts = useMemo(
    () => (projectSlug ? buildDueDateCounts(projectSlug) : new Map<string, number>()),
    [projectSlug],
  );
  const weekdayLabels = useMemo(
    () => buildWeekdayLabels(locale, firstDayOfWeek),
    [firstDayOfWeek, locale],
  );
  const weeks = useMemo(
    () => chunkCalendarDays(buildCalendarDays(year, month, firstDayOfWeek)),
    [firstDayOfWeek, month, year],
  );
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(
        new Date(Date.UTC(year, month)),
      ),
    [locale, month, year],
  );
  const fullDateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [locale],
  );

  if (!projectSlug || !project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div>
      <ProjectHeader slug={projectSlug} />

      <h2 className="mb-4 font-[family-name:var(--font-display)] text-[length:var(--font-size-lg)] font-bold text-base-content">
        {monthLabel}
      </h2>

      <div className="overflow-x-auto">
        <table
          className="w-full table-fixed border-separate border-spacing-px"
          aria-label={t("calendar-grid-label", { defaultValue: "Calendar" })}
        >
          <caption className="sr-only">{monthLabel}</caption>
          <thead>
            <tr>
              {weekdayLabels.map((label) => (
                <th
                  key={label}
                  scope="col"
                  className="pb-2 text-center font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase text-base-content/60"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={`week-${String(weekIndex)}`}>
                {week.map((day, dayIndex) => {
                  if (day === null) {
                    return (
                      <td
                        key={`empty-${String(weekIndex)}-${String(dayIndex)}`}
                        className="h-14 rounded bg-base-200/30"
                      />
                    );
                  }

                  const isoDate = `${String(year)}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const dueCount = dueDateCounts.get(isoDate) ?? 0;
                  const fullDate = new Date(year, month, day);
                  const isToday =
                    year === now.getFullYear() && month === now.getMonth() && day === now.getDate();
                  const accessibleDate = fullDateFormatter.format(fullDate);
                  const baseAriaLabel =
                    dueCount > 0
                      ? t("calendar-day-with-tasks", {
                          date: accessibleDate,
                          count: dueCount,
                          defaultValue: `${accessibleDate} — ${String(dueCount)} task due`,
                        })
                      : t("calendar-day-no-tasks", {
                          date: accessibleDate,
                          defaultValue: `${accessibleDate} — no tasks due`,
                        });
                  const ariaLabel = isToday ? `${baseAriaLabel} — today` : baseAriaLabel;

                  return (
                    <td
                      key={isoDate}
                      aria-label={ariaLabel}
                      className={`h-14 rounded border border-base-300/30 align-top ${
                        isToday ? "bg-primary/10 text-primary" : "text-base-content/70"
                      }`}
                    >
                      <div className="flex h-full flex-col items-center justify-start pt-1.5 text-[length:var(--font-size-sm)]">
                        <time dateTime={isoDate} aria-current={isToday ? "date" : undefined}>
                          {day}
                        </time>
                        {dueCount > 0 ? (
                          <span
                            className="mt-1 h-1.5 w-1.5 rounded-full bg-primary"
                            aria-hidden="true"
                          />
                        ) : null}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
