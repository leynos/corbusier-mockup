/** @file Slash command input with autocomplete dropdown (visual mockup).
 *
 * Typing `/` shows a static dropdown of available commands from the
 * directives fixture data. This is a visual mockup only — no actual
 * command processing occurs.
 */

import { IconTerminal } from "@tabler/icons-react";
import type { JSX } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { DIRECTIVES } from "../../../../data/directives";
import { pickLocalization } from "../../../domain/entities/localization";

function useBlurTimeout(delay: number) {
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (ref.current) clearTimeout(ref.current);
    };
  }, []);

  const cancel = useCallback(() => {
    if (ref.current) {
      clearTimeout(ref.current);
      ref.current = null;
    }
  }, []);

  const schedule = useCallback(
    (cb: () => void) => {
      if (ref.current) clearTimeout(ref.current);
      ref.current = setTimeout(() => {
        cb();
        ref.current = null;
      }, delay);
    },
    [delay],
  );

  return { cancel, schedule };
}

function filterDirectives(value: string, locale: string): (typeof DIRECTIVES)[number][] {
  if (!value.startsWith("/")) return [];
  return DIRECTIVES.filter((d) => {
    const name = pickLocalization(d.localizations, locale).name;
    return value === "/" || name.startsWith(value);
  });
}

export function SlashCommandInput(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const [value, setValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { cancel: cancelBlur, schedule: scheduleBlur } = useBlurTimeout(150);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    setShowDropdown(v.startsWith("/"));
  }, []);

  const handleBlur = useCallback(() => {
    scheduleBlur(() => setShowDropdown(false));
  }, [scheduleBlur]);

  const handleSelect = useCallback(
    (commandName: string) => {
      cancelBlur();
      setValue(`${commandName} `);
      setShowDropdown(false);
      inputRef.current?.focus();
    },
    [cancelBlur],
  );

  const filteredDirectives = filterDirectives(value, locale);
  const dropdownActive = showDropdown && filteredDirectives.length > 0;

  return (
    <div className="relative border-t border-base-300 bg-base-200/60 px-4 py-3">
      <label htmlFor="slash-command-input" className="sr-only">
        {t("slash-input-label", { defaultValue: "Command input" })}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 start-0 flex items-center ps-3" aria-hidden="true">
          <IconTerminal size={16} className="text-base-content/40" />
        </span>
        <input
          ref={inputRef}
          id="slash-command-input"
          type="text"
          role="combobox"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t("slash-input-placeholder", {
            defaultValue: "Type / for commands…",
          })}
          className="w-full rounded-lg border border-base-300 bg-base-100 py-2.5 pe-4 ps-9 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)] text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          autoComplete="off"
          aria-haspopup="listbox"
          aria-controls={dropdownActive ? "slash-command-list" : undefined}
          aria-expanded={dropdownActive}
          aria-autocomplete="list"
        />
      </div>

      {dropdownActive ? (
        <section
          aria-label={t("slash-input-suggestions-label", {
            defaultValue: "Available commands",
          })}
          className="absolute inset-x-4 bottom-full mb-1 max-h-60 overflow-y-auto rounded-lg border border-base-300 bg-base-100 py-1 shadow-lg"
        >
          <div id="slash-command-list" role="listbox" className="space-y-1 px-1">
            {filteredDirectives.map((d) => {
              const loc = pickLocalization(d.localizations, locale);
              return (
                <button
                  key={d.id}
                  type="button"
                  role="option"
                  aria-selected={false}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-start hover:bg-base-200"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(loc.name)}
                >
                  <span className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)] font-semibold text-primary">
                    {loc.name}
                  </span>
                  <span className="text-[length:var(--font-size-xs)] text-base-content/60">
                    {loc.description}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
