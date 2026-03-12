/** @file Locale-aware date and time formatters shared by dashboard and task views. */

import { DEFAULT_LOCALE } from "../i18n/supported-locales";

const ISO_DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/u;

function resolveFormattingLocale(locale: string | undefined): string {
  if (locale) {
    return locale;
  }

  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language;
  }

  return DEFAULT_LOCALE;
}

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

export function formatShortDate(iso: string, locale?: string): string {
  return new Intl.DateTimeFormat(resolveFormattingLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parseDateForDisplay(iso));
}

export function formatShortTime(iso: string, locale?: string): string {
  return new Intl.DateTimeFormat(resolveFormattingLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function formatTimelineTimestamp(iso: string, locale?: string): string {
  return new Intl.DateTimeFormat(resolveFormattingLocale(locale), {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}
