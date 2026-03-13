/** @file Locale-aware date and time formatters shared by dashboard and task views.
 *
 * Date-only values such as `YYYY-MM-DD` are treated as local calendar
 * dates so they do not shift backwards in negative-offset time zones.
 * Full timestamps remain absolute instants and are formatted with the
 * platform `Date` parser.
 */

import { DEFAULT_LOCALE } from "../i18n/supported-locales";

const ISO_DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/u;

/**
 * Resolve the locale used for date/time formatting.
 */
function resolveFormattingLocale(locale: string | undefined): string {
  if (locale) {
    return locale;
  }

  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language;
  }

  return DEFAULT_LOCALE;
}

/**
 * Parse a display date, preserving bare ISO calendar dates as local
 * day values.
 */
function parseDateForDisplay(iso: string): Date {
  const match = ISO_DATE_ONLY.exec(iso);
  if (!match) {
    return new Date(iso);
  }

  const yearText = match[1];
  const monthText = match[2];
  const dayText = match[3];
  if (!yearText || !monthText || !dayText) {
    return new Date(iso);
  }

  return new Date(
    Number.parseInt(yearText, 10),
    Number.parseInt(monthText, 10) - 1,
    Number.parseInt(dayText, 10),
  );
}

/**
 * Format a calendar date for task due dates and other date-only UI.
 */
export function formatShortDate(iso: string, locale?: string): string {
  return new Intl.DateTimeFormat(resolveFormattingLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parseDateForDisplay(iso));
}

/**
 * Format a time-of-day from a full timestamp.
 *
 * This intentionally uses the absolute timestamp path instead of
 * `parseDateForDisplay()`, because time-bearing values should respect
 * the instant encoded in the original string.
 */
export function formatShortTime(iso: string, locale?: string): string {
  return new Intl.DateTimeFormat(resolveFormattingLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

/**
 * Format a compact day-plus-time label from a full timestamp.
 *
 * Like `formatShortTime()`, this operates on absolute timestamps
 * rather than local calendar-date shims.
 */
export function formatTimelineTimestamp(iso: string, locale?: string): string {
  return new Intl.DateTimeFormat(resolveFormattingLocale(locale), {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}
