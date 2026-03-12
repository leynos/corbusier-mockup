/** @file Header-resident controls for theme and language preferences. */

import { type ChangeEvent, type JSX, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "../i18n/supported-locales";
import { appLogger, reportError } from "../observability/logger";
import { useTheme } from "../providers/theme-provider";

const toolbarButtonClass =
  "rounded-md px-3 py-1.5 text-[length:var(--font-size-sm)] font-semibold transition-colors duration-[var(--transition-fast)]";

function joinThemeButtonClass(isActive: boolean): string {
  return isActive
    ? `${toolbarButtonClass} bg-base-100 text-base-content shadow-sm`
    : `${toolbarButtonClass} text-base-content/60 hover:text-base-content`;
}

function LanguageSelect(): JSX.Element {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState(
    () => i18n.resolvedLanguage ?? i18n.language ?? DEFAULT_LOCALE,
  );
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const handleLanguageChanged = (nextLanguage: string): void => {
      setLanguage(nextLanguage);
    };

    i18n.on("languageChanged", handleLanguageChanged);
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n]);

  const onLanguageChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const nextLanguage = event.target.value;
    if (nextLanguage === language || isSwitching) {
      return;
    }

    const previousLanguage = language;
    setIsSwitching(true);
    setLanguage(nextLanguage);

    i18n
      .changeLanguage(nextLanguage)
      .catch((error: unknown) => {
        const context = { nextLanguage, previousLanguage };
        appLogger.error("Failed to change language", context, error);
        reportError(error, { ...context, scope: "header-controls.language-change" });
        setLanguage(previousLanguage);
      })
      .finally(() => {
        setIsSwitching(false);
      });
  };

  const label = t("controls-language-label", { defaultValue: "Language" });

  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">{label}</span>
      <select
        className="select select-sm min-w-28 border-base-300 bg-base-100 text-[length:var(--font-size-sm)] font-semibold text-base-content"
        value={language}
        aria-label={label}
        aria-busy={isSwitching}
        disabled={isSwitching}
        onChange={onLanguageChange}
      >
        {SUPPORTED_LOCALES.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.nativeLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function ThemeButtons(): JSX.Element {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const dayTheme = "corbusier-mockup-day";
  const nightTheme = "corbusier-mockup-night";
  const themeGroupLabel = t("controls-theme-group-label", { defaultValue: "Theme" });
  const dayLabel = t("controls-theme-day-option-label", { defaultValue: "Day" });
  const nightLabel = t("controls-theme-night-option-label", { defaultValue: "Night" });

  return (
    <fieldset className="inline-flex items-center rounded-lg border border-base-300 bg-base-200/70 p-0.5">
      <legend className="sr-only">{themeGroupLabel}</legend>
      <button
        type="button"
        className={joinThemeButtonClass(theme === dayTheme)}
        aria-pressed={theme === dayTheme}
        onClick={() => setTheme(dayTheme)}
      >
        {dayLabel}
      </button>
      <button
        type="button"
        className={joinThemeButtonClass(theme === nightTheme)}
        aria-pressed={theme === nightTheme}
        onClick={() => setTheme(nightTheme)}
      >
        {nightLabel}
      </button>
    </fieldset>
  );
}

export function HeaderControls(): JSX.Element {
  return (
    <div className="flex items-center gap-3">
      <ThemeButtons />
      <LanguageSelect />
    </div>
  );
}
