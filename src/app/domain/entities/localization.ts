/** @file Shared localisation primitives for entity-owned strings.
 *
 * Every entity carries its own localised display strings via an
 * `EntityLocalizations` map. Components call `pickLocalization` to
 * resolve the best locale match at render time.
 *
 * Fallback chain: exact locale match → `en-GB` → first available key.
 */

/* ── Locale codes ─────────────────────────────────────────────────── */

export type LocaleCode = "en-GB" | "ar" | "de" | "es" | "hi" | "ja" | "zh-CN";

/* ── Localised string primitives ──────────────────────────────────── */

export type LocalizedStringSet = {
  readonly name: string;
  readonly description?: string;
  readonly shortLabel?: string;
};

export type EntityLocalizations = Partial<Record<LocaleCode, LocalizedStringSet>>;

export type LocalizedAltText = Partial<Record<LocaleCode, string>>;

export type ImageAsset = {
  readonly url: string;
  readonly alt: LocalizedAltText;
};

/* ── Fallback resolution ──────────────────────────────────────────── */

const EMPTY: LocalizedStringSet = { name: "" };

/**
 * Resolve the best-matching `LocalizedStringSet` for a given locale.
 *
 * Fallback chain: exact match → `en-GB` → first available key.
 * Returns `{ name: "" }` when the map is empty or undefined.
 */
export function pickLocalization(
  localizations: EntityLocalizations | undefined,
  locale: string,
): LocalizedStringSet {
  if (localizations === undefined) return EMPTY;

  const exact = localizations[locale as LocaleCode];
  if (exact !== undefined) return exact;

  const enGb = localizations["en-GB"];
  if (enGb !== undefined) return enGb;

  const keys = Object.keys(localizations) as LocaleCode[];
  const first = keys[0] as LocaleCode | undefined;
  if (first === undefined) return EMPTY;

  return localizations[first] ?? EMPTY;
}
