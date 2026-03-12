/** @file Locale-aware date and time formatters shared by dashboard and task views. */

import { DEFAULT_LOCALE } from "../i18n/supported-locales";

function resolveFormattingLocale(locale: string | undefined): string {
  if (locale) {
    return locale;
  }

  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language;
  }

  return DEFAULT_LOCALE;
}

export function formatShortDate(iso: string, locale?: string): string {
  return new Intl.DateTimeFormat(resolveFormattingLocale(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
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
