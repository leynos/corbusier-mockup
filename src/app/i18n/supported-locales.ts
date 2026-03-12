/** @file Shared locale metadata consumed by the i18n runtime and UI controls. */

export type TextDirection = "ltr" | "rtl";

export type SupportedLocale = {
  /** BCP-47 code used by i18next and Fluent when loading .ftl bundles. */
  code: string;
  /** Human-friendly label surfaced in selectors; include region when helpful. */
  label: string;
  /** Native spellings improve recognition when the UI is not yet translated. */
  nativeLabel: string;
  /** Optional text direction override when the language is RTL. */
  direction?: TextDirection;
};

const dedupeSupportedLocales = (
  locales: readonly SupportedLocale[],
): Readonly<[SupportedLocale, ...SupportedLocale[]]> => {
  const seen = new Set<string>();
  const deduped = locales.filter((locale) => {
    const key = locale.code.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  if (deduped.length === 0) {
    throw new Error("SUPPORTED_LOCALES must include at least one locale");
  }

  return deduped as unknown as Readonly<[SupportedLocale, ...SupportedLocale[]]>;
};

const RAW_SUPPORTED_LOCALES = [
  { code: "en-GB", label: "English (UK)", nativeLabel: "English (UK)" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", direction: "rtl" },
  { code: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "zh-CN", label: "Chinese (Simplified)", nativeLabel: "简体中文" },
] as const satisfies readonly SupportedLocale[];

export const SUPPORTED_LOCALES = dedupeSupportedLocales(RAW_SUPPORTED_LOCALES);

export const DEFAULT_LOCALE = SUPPORTED_LOCALES[0].code;
export const DETECTION_ORDER = ["querystring", "localStorage", "navigator"] as const;

const LOCALE_MAP: Record<string, SupportedLocale> = SUPPORTED_LOCALES.reduce(
  (map, locale) => {
    const fullCode = locale.code.toLowerCase();
    map[fullCode] = locale;
    const [languagePart] = fullCode.split("-");
    const languageKey = languagePart ?? fullCode;
    if (!map[languageKey]) {
      map[languageKey] = locale;
    }
    return map;
  },
  {} as Record<string, SupportedLocale>,
);

const defaultLocaleMetadata = (() => {
  const locale = LOCALE_MAP[DEFAULT_LOCALE.toLowerCase()];
  if (!locale) {
    throw new Error(`DEFAULT_LOCALE '${DEFAULT_LOCALE}' is not present in SUPPORTED_LOCALES`);
  }
  return locale;
})();

export const getLocaleMetadata = (code: string | undefined): SupportedLocale => {
  if (!code) {
    return defaultLocaleMetadata;
  }

  const lookupKey = code.toLowerCase();
  const [languagePart] = lookupKey.split("-");
  return (
    LOCALE_MAP[lookupKey] ??
    (languagePart ? LOCALE_MAP[languagePart] : undefined) ??
    defaultLocaleMetadata
  );
};

export const getLocaleDirection = (code: string | undefined): TextDirection => {
  return getLocaleMetadata(code).direction ?? "ltr";
};

export const isRtlLocale = (code: string | undefined): boolean => {
  return getLocaleDirection(code) === "rtl";
};
