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

import { findProject, getTasksForProject } from "../../../data/projects";
import { type ProjectSlug, parseProjectSlug } from "../../../data/registries/project-descriptors";
import { TASKS } from "../../../data/tasks";
import { ProjectHeader } from "./project-landing-screen";

function buildDueDateCounts(slug: ProjectSlug): ReadonlyMap<string, number> {
  const counts = new Map<string, number>();

  for (const task of getTasksForProject(slug, TASKS)) {
    counts.set(task.dueDate, (counts.get(task.dueDate) ?? 0) + 1);
  }

  return counts;
}

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

function chunkCalendarDays(
  days: readonly (number | null)[],
): readonly (readonly (number | null)[])[] {
  const weeks: (readonly (number | null)[])[] = [];

  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }

  return weeks;
}

function buildWeekdayLabels(locale: string, firstDayOfWeek: number): readonly string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const sunday = new Date(Date.UTC(2026, 0, 4));

  return Array.from({ length: 7 }, (_, offset) => {
    const weekdayIndex = (firstDayOfWeek + offset) % 7;
    const date = new Date(sunday);
    date.setUTCDate(sunday.getUTCDate() + weekdayIndex);
    return formatter.format(date);
  });
}

export function CalendarScreen(): JSX.Element {
  const { slug } = useParams({ strict: false });
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const projectSlug = slug ? parseProjectSlug(slug) : undefined;

  const project = projectSlug ? findProject(projectSlug) : undefined;
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
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

  if (!projectSlug || !project) {
    return <Navigate to="/projects" replace />;
  }

  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    new Date(year, month),
  );
  const fullDateFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
                  const isToday = day === now.getDate();
                  const accessibleDate = fullDateFormatter.format(fullDate);
                  const ariaLabel =
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
