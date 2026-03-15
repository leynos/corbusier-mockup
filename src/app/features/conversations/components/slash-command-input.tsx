/** @file SlashCommandInput component — slash command input with autocomplete dropdown.
 *
 * Provides a visual mockup of a slash command autocomplete UI. Typing `/` shows
 * a static dropdown of available commands sourced from the directives fixture.
 *
 * @invariants
 * - No command side effects; only reads from directives fixture data.
 * - Autocomplete is static and purely presentational — no actual command execution.
 * - Dropdown closes on blur unless focus moves to a suggestion button.
 * - Implements full WAI-ARIA combobox pattern with keyboard navigation.
 *
 * @see {@link ../../../../data/directives} — directives fixture module
 * @see {@link ../} — parent conversations feature module
 */

import { IconTerminal } from "@tabler/icons-react";
import type { ChangeEvent, FocusEvent, JSX, KeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { DIRECTIVES } from "../../../../data/directives";
import { pickLocalization } from "../../../domain/entities/localization";

/** Manages a cancellable blur timeout for delayed dropdown dismissal.
 *
 * @param delay - Timeout duration in milliseconds.
 * @returns An object with `cancel` to clear the timeout and `schedule` to queue a callback.
 */
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

/** Filters slash directives based on input value and locale.
 *
 * @param value - Current input value; returns empty if not starting with `/`.
 * @param locale - Current locale for localizing directive names.
 * @returns Array of matching directive items, or all directives if value is just `/`.
 */
function filterDirectives(value: string, locale: string): (typeof DIRECTIVES)[number][] {
  if (!value.startsWith("/")) return [];
  return DIRECTIVES.filter((d) => {
    const name = pickLocalization(d.localizations, locale).name;
    return value === "/" || name.startsWith(value);
  });
}

/** Slash command input with autocomplete dropdown (visual mockup).
 *
 * Renders a text input that shows a dropdown of available slash commands
 * when the user types `/`. Selection populates the input and closes the dropdown.
 * Implements WAI-ARIA combobox pattern with full keyboard navigation.
 *
 * @returns The rendered combobox component with dropdown suggestions.
 */
export function SlashCommandInput(): JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const [value, setValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLElement>(null);
  const { cancel: cancelBlur, schedule: scheduleBlur } = useBlurTimeout(150);

  const filteredDirectives = filterDirectives(value, locale);
  const dropdownActive = showDropdown && filteredDirectives.length > 0;

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    setShowDropdown(v.startsWith("/"));
    setActiveIndex(-1);
  }, []);

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      const related = e.relatedTarget as HTMLElement | null;
      const activeEl = related ?? (document.activeElement as HTMLElement | null);
      const isInsideSuggestions = suggestionsRef.current?.contains(activeEl) ?? false;
      if (!isInsideSuggestions) {
        scheduleBlur(() => setShowDropdown(false));
      }
    },
    [scheduleBlur],
  );

  const handleSelect = useCallback(
    (commandName: string) => {
      cancelBlur();
      setValue(`${commandName} `);
      setShowDropdown(false);
      setActiveIndex(-1);
      inputRef.current?.focus();
    },
    [cancelBlur],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!dropdownActive) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          setShowDropdown(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          const nextIndex = activeIndex < filteredDirectives.length - 1 ? activeIndex + 1 : 0;
          setActiveIndex(nextIndex);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          const prevIndex = activeIndex > 0 ? activeIndex - 1 : filteredDirectives.length - 1;
          setActiveIndex(prevIndex);
          break;
        }
        case "Enter": {
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < filteredDirectives.length) {
            const directive = filteredDirectives[activeIndex];
            if (directive) {
              const loc = pickLocalization(directive.localizations, locale);
              handleSelect(loc.name);
            }
          }
          break;
        }
        case "Escape": {
          e.preventDefault();
          setShowDropdown(false);
          setActiveIndex(-1);
          break;
        }
      }
    },
    [dropdownActive, activeIndex, filteredDirectives, locale, handleSelect],
  );

  const activeDescendantId = activeIndex >= 0 ? `slash-command-option-${activeIndex}` : undefined;

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
          onKeyDown={handleKeyDown}
          placeholder={t("slash-input-placeholder", {
            defaultValue: "Type / for commands…",
          })}
          className="w-full rounded-lg border border-base-300 bg-base-100 py-2.5 pe-4 ps-9 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)] text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          autoComplete="off"
          aria-haspopup="listbox"
          aria-controls={dropdownActive ? "slash-command-list" : undefined}
          aria-expanded={dropdownActive}
          aria-autocomplete="list"
          aria-activedescendant={activeDescendantId}
        />
      </div>

      {dropdownActive ? (
        <section
          ref={suggestionsRef}
          aria-label={t("slash-input-suggestions-label", {
            defaultValue: "Available commands",
          })}
          className="absolute inset-x-4 bottom-full mb-1 max-h-60 overflow-y-auto rounded-lg border border-base-300 bg-base-100 py-1 shadow-lg"
        >
          <div id="slash-command-list" role="listbox" className="space-y-1 px-1">
            {filteredDirectives.map((d, index) => {
              const loc = pickLocalization(d.localizations, locale);
              const isActive = index === activeIndex;
              return (
                <button
                  key={d.id}
                  id={`slash-command-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={isActive}
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
