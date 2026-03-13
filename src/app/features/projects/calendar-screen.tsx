/** @file Calendar screen — month grid skeleton with task due-date dots.
 *
 * Renders the ProjectHeader with view switcher tabs, followed by a
 * calendar grid showing the current month. Days with task due dates
 * display coloured indicator dots.
 */

import { Navigate, useParams } from "@tanstack/react-router";
import type { JSX } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { findProject, getTasksForProject } from "../../../data/projects";
import { TASKS } from "../../../data/tasks";
import { ProjectHeader } from "./project-landing-screen";

/** Build a Set of ISO date strings (YYYY-MM-DD) for task due dates. */
function buildDueDateSet(slug: string): Set<string> {
  const tasks = getTasksForProject(slug, TASKS);
  return new Set(tasks.map((t) => t.dueDate));
}

/** Generate the calendar grid cells for a given month. */
function buildCalendarDays(year: number, month: number): readonly (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }
  return cells;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function CalendarScreen(): JSX.Element {
  const { slug } = useParams({ strict: false });
  const { t } = useTranslation();

  const project = slug ? findProject(slug) : undefined;
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const dueDates = useMemo(() => (slug ? buildDueDateSet(slug) : new Set<string>()), [slug]);
  const days = useMemo(() => buildCalendarDays(year, month), [year, month]);

  if (!slug || !project) {
    return <Navigate to="/projects" />;
  }

  const monthLabel = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(
    new Date(year, month),
  );

  return (
    <div>
      <ProjectHeader slug={slug} />

      <h2 className="mb-4 font-[family-name:var(--font-display)] text-[length:var(--font-size-lg)] font-bold text-base-content">
        {monthLabel}
      </h2>

      <section
        className="grid grid-cols-7 gap-px"
        aria-label={t("calendar-grid-label", { defaultValue: "Calendar" })}
      >
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="pb-2 text-center font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase text-base-content/60"
            aria-hidden="true"
          >
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          const iso =
            day !== null
              ? `${String(year)}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              : "";
          const hasTasks = day !== null && dueDates.has(iso);
          const isToday = day === now.getDate();

          return (
            <div
              key={`cell-${String(idx)}`}
              className={`flex h-14 flex-col items-center justify-start rounded pt-1.5 text-[length:var(--font-size-sm)] ${
                isToday ? "bg-primary/10 font-bold text-primary" : "text-base-content/70"
              } ${day === null ? "" : "border border-base-300/30"}`}
            >
              {day !== null ? (
                <>
                  <span>{day}</span>
                  {hasTasks ? (
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  ) : null}
                </>
              ) : null}
            </div>
          );
        })}
      </section>
    </div>
  );
}
