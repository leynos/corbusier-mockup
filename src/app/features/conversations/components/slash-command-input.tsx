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
import type {
  ChangeEvent,
  FocusEvent,
  JSX,
  KeyboardEvent,
  MutableRefObject,
  RefObject,
} from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
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

/** Options bag for configuring keyboard navigation in the slash command dropdown.
 *
 * All properties are readonly to ensure immutability during navigation handling.
 *
 * @property dropdownActive - Whether the dropdown is currently visible and interactive.
 * @property activeIndex - The zero-based index of the currently highlighted suggestion;
 *   -1 indicates no selection.
 * @property filteredDirectives - The array of directive items matching the current input filter.
 * @property locale - The current locale string for localizing directive names during selection.
 * @property setShowDropdown - Callback to open (true) or close (false) the dropdown.
 * @property setActiveIndex - Callback to update the highlighted suggestion index.
 * @property handleSelect - Callback invoked when a directive is selected, receiving the
 *   localized command name.
 */
interface KeyboardNavigationOptions {
  readonly dropdownActive: boolean;
  readonly activeIndex: number;
  readonly filteredDirectives: (typeof DIRECTIVES)[number][];
  readonly locale: string;
  readonly setShowDropdown: (v: boolean) => void;
  readonly setActiveIndex: (v: number) => void;
  readonly handleSelect: (name: string) => void;
}

/** Predicate to check if a key is an arrow navigation key.
 *
 * @param key - The keyboard event key value.
 * @returns True if the key is ArrowDown or ArrowUp.
 */
const isArrowKey = (key: string): boolean => key === "ArrowDown" || key === "ArrowUp";

/** Computes the next navigation index for arrow key movement.
 *
 * Wraps around the list boundaries: ArrowDown at the end returns 0,
 * ArrowUp at the start returns the last index.
 *
 * @param key - The arrow key pressed ("ArrowDown" or "ArrowUp").
 * @param activeIndex - Current highlighted index.
 * @param length - Total number of items in the list.
 * @returns The new index after applying the navigation direction.
 */
function resolveNavigationIndex(key: string, activeIndex: number, length: number): number {
  if (key === "ArrowDown") {
    return activeIndex < length - 1 ? activeIndex + 1 : 0;
  }
  return activeIndex > 0 ? activeIndex - 1 : length - 1;
}

/** Keyboard navigation hook for the slash command autocomplete dropdown.
 *
 * Handles arrow key navigation to open the dropdown and move through suggestions,
 * Enter to select the highlighted item, and Escape to close the dropdown.
 *
 * @param options - Configuration object containing dropdown state and callbacks.
 *   See {@link KeyboardNavigationOptions} for detailed property descriptions.
 * @returns A keyboard event handler of type `(e: KeyboardEvent<HTMLInputElement>) => void`
 *   to be attached to the input element's `onKeyDown` prop.
 */
function useKeyboardNavigation({
  dropdownActive,
  activeIndex,
  filteredDirectives,
  locale,
  setShowDropdown,
  setActiveIndex,
  handleSelect,
}: KeyboardNavigationOptions): (e: KeyboardEvent<HTMLInputElement>) => void {
  return useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!dropdownActive && isArrowKey(e.key)) {
        e.preventDefault();
        setShowDropdown(true);
        return;
      }
      if (!dropdownActive) return;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowUp": {
          e.preventDefault();
          setActiveIndex(resolveNavigationIndex(e.key, activeIndex, filteredDirectives.length));
          break;
        }
        case "Enter": {
          e.preventDefault();
          const directive = filteredDirectives[activeIndex];
          if (!directive) return;
          handleSelect(pickLocalization(directive.localizations, locale).name);
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
    [
      dropdownActive,
      activeIndex,
      filteredDirectives,
      locale,
      setShowDropdown,
      setActiveIndex,
      handleSelect,
    ],
  );
}

/** Pure predicate to check if focus remains inside a container element.
 *
 * @param next - The focus target node, typically from relatedTarget or activeElement.
 * @param container - The container element to check containment against.
 * @returns True if next is a Node and is contained within the container element.
 */
function isFocusInsideElement(next: Node | null, container: HTMLElement | null): boolean {
  return next instanceof Node && (container?.contains(next) ?? false);
}

/** Options bag for configuring suggestions blur handler.
 *
 * All properties are readonly to ensure immutability during blur handling.
 *
 * @property suggestionsRef - Ref to the suggestions container element.
 * @property inputRef - Ref to the input element.
 * @property setShowDropdown - Callback to open (true) or close (false) the dropdown.
 * @property setActiveIndex - Callback to update the highlighted suggestion index.
 */
interface SuggestionsBlurOptions {
  readonly suggestionsRef: RefObject<HTMLElement | null>;
  readonly inputRef: RefObject<HTMLInputElement | null>;
  readonly setShowDropdown: (show: boolean) => void;
  readonly setActiveIndex: (index: number) => void;
}

/** Hook to handle blur events on the suggestions dropdown.
 *
 * Closes the dropdown when focus moves outside both the suggestions container
 * and the input field.
 *
 * @param options - Configuration object containing refs and callbacks.
 *   See {@link SuggestionsBlurOptions} for detailed property descriptions.
 * @returns A blur event handler of type `(e: FocusEvent<HTMLElement>) => void`
 *   to be attached to the suggestions container's `onBlurCapture` prop.
 */
function useSuggestionsBlurHandler({
  suggestionsRef,
  inputRef,
  setShowDropdown,
  setActiveIndex,
}: SuggestionsBlurOptions): (e: FocusEvent<HTMLElement>) => void {
  return useCallback(
    (e: FocusEvent<HTMLElement>) => {
      const next = e.relatedTarget as Node | null;
      if (isFocusInsideElement(next, suggestionsRef.current) || next === inputRef.current) return;
      setShowDropdown(false);
      setActiveIndex(-1);
    },
    [suggestionsRef, inputRef, setShowDropdown, setActiveIndex],
  );
}

/** Options bag for configuring input blur handler.
 *
 * All properties are readonly to ensure immutability during blur handling.
 *
 * @property suggestionsRef - Ref to the suggestions container element.
 * @property scheduleBlur - Callback to schedule a delayed blur action.
 * @property setShowDropdown - Callback to open (true) or close (false) the dropdown.
 * @property setActiveIndex - Callback to update the highlighted suggestion index.
 */
interface InputBlurOptions {
  readonly suggestionsRef: RefObject<HTMLElement | null>;
  readonly scheduleBlur: (cb: () => void) => void;
  readonly setShowDropdown: (show: boolean) => void;
  readonly setActiveIndex: (index: number) => void;
}

/** Hook to handle blur events on the input element.
 *
 * Schedules dropdown closure when focus moves outside the suggestions container.
 * Uses the isFocusInsideElement predicate to determine if focus remains within
 * the interactive region.
 *
 * @param options - Configuration object containing refs and callbacks.
 *   See {@link InputBlurOptions} for detailed property descriptions.
 * @returns A blur event handler of type `(e: FocusEvent<HTMLInputElement>) => void`
 *   to be attached to the input element's `onBlur` prop.
 */
function useInputBlurHandler({
  suggestionsRef,
  scheduleBlur,
  setShowDropdown,
  setActiveIndex,
}: InputBlurOptions): (e: FocusEvent<HTMLInputElement>) => void {
  return useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      const related = e.relatedTarget as HTMLElement | null;
      const activeEl = related ?? (document.activeElement as HTMLElement | null);
      if (!isFocusInsideElement(activeEl, suggestionsRef.current)) {
        scheduleBlur(() => {
          setShowDropdown(false);
          setActiveIndex(-1);
        });
      }
    },
    [suggestionsRef, scheduleBlur, setShowDropdown, setActiveIndex],
  );
}

/** Hook to manage auto-scrolling the active option into view during keyboard navigation.
 *
 * Creates and maintains a Map of option element refs, and automatically scrolls
 * the active option into view when keyboard navigation changes the selection.
 *
 * @param activeIndex - Index of the currently highlighted suggestion.
 * @param dropdownActive - Whether the dropdown is currently visible.
 * @returns A mutable ref object containing a Map of option indices to their DOM elements.
 */
function useActiveOptionScroll(
  activeIndex: number,
  dropdownActive: boolean,
): MutableRefObject<Map<number, HTMLButtonElement>> {
  const optionRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  useEffect(() => {
    if (!dropdownActive || activeIndex < 0) return;
    optionRefs.current.get(activeIndex)?.scrollIntoView({ block: "nearest" });
  }, [dropdownActive, activeIndex]);

  return optionRefs;
}

/** Props for the suggestions dropdown component.
 *
 * @property listId - The ID for the listbox container element.
 * @property baseId - The base ID used to generate unique option IDs.
 * @property suggestionsRef - Ref to the suggestions container element.
 * @property filteredDirectives - Array of directive items matching the current filter.
 * @property locale - Current locale for localizing directive names.
 * @property activeIndex - Index of the currently highlighted suggestion.
 * @property label - Accessible label for the suggestions section.
 * @property onBlurCapture - Blur handler for the suggestions container.
 * @property onSelect - Callback invoked when a directive is selected.
 * @property cancelBlur - Callback to cancel any pending blur timeout.
 */
interface SuggestionsDropdownProps {
  readonly listId: string;
  readonly baseId: string;
  readonly suggestionsRef: RefObject<HTMLElement | null>;
  readonly optionRefs: MutableRefObject<Map<number, HTMLButtonElement>>;
  readonly filteredDirectives: ReturnType<typeof filterDirectives>;
  readonly locale: string;
  readonly activeIndex: number;
  readonly label: string;
  readonly onBlurCapture: (e: FocusEvent<HTMLElement>) => void;
  readonly onSelect: (name: string) => void;
  readonly cancelBlur: () => void;
}

/** Suggestions dropdown component for slash command autocomplete.
 *
 * Renders the dropdown panel containing available command options with
 * proper ARIA attributes for accessibility.
 *
 * @param props - Component properties as defined in {@link SuggestionsDropdownProps}.
 * @returns The rendered suggestions dropdown section.
 */
function SuggestionsDropdown({
  listId,
  baseId,
  suggestionsRef,
  filteredDirectives,
  locale,
  activeIndex,
  label,
  optionRefs,
  onBlurCapture,
  onSelect,
  cancelBlur,
}: SuggestionsDropdownProps): JSX.Element {
  return (
    <section
      ref={suggestionsRef}
      aria-label={label}
      className="absolute inset-x-4 bottom-full mb-1 max-h-60 overflow-y-auto rounded-lg border border-base-300 bg-base-100 py-1 shadow-lg"
      onBlurCapture={onBlurCapture}
    >
      <div id={listId} role="listbox" className="space-y-1 px-1">
        {filteredDirectives.map((d, index) => {
          const loc = pickLocalization(d.localizations, locale);
          const isActive = index === activeIndex;
          return (
            <button
              key={d.id}
              ref={(el) => {
                if (el) {
                  optionRefs.current?.set(index, el);
                } else {
                  optionRefs.current?.delete(index);
                }
              }}
              id={`${baseId}-option-${index}`}
              type="button"
              role="option"
              aria-selected={isActive}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-start hover:bg-base-200 ${isActive ? "bg-base-200" : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                cancelBlur();
              }}
              onClick={() => onSelect(loc.name)}
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
  );
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
  const baseId = useId();
  const [value, setValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLElement>(null);
  const { cancel: cancelBlur, schedule: scheduleBlur } = useBlurTimeout(150);
  const filteredDirectives = filterDirectives(value, locale);
  const dropdownActive = showDropdown && filteredDirectives.length > 0;
  const optionRefs = useActiveOptionScroll(activeIndex, dropdownActive);
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    setShowDropdown(v.startsWith("/"));
    setActiveIndex(-1);
  }, []);
  const handleBlur = useInputBlurHandler({
    suggestionsRef,
    scheduleBlur,
    setShowDropdown,
    setActiveIndex,
  });
  const handleFocus = useCallback(() => {
    cancelBlur();
  }, [cancelBlur]);
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
  const handleSuggestionsBlur = useSuggestionsBlurHandler({
    suggestionsRef,
    inputRef,
    setShowDropdown,
    setActiveIndex,
  });

  const handleKeyDown = useKeyboardNavigation({
    dropdownActive,
    activeIndex,
    filteredDirectives,
    locale,
    setShowDropdown,
    setActiveIndex,
    handleSelect,
  });
  const inputId = `${baseId}-input`;
  const listId = `${baseId}-list`;
  const activeDescendantId = activeIndex >= 0 ? `${baseId}-option-${activeIndex}` : undefined;
  return (
    <div className="relative border-t border-base-300 bg-base-200/60 px-4 py-3">
      <label htmlFor={inputId} className="sr-only">
        {t("slash-input-label", { defaultValue: "Command input" })}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 start-0 flex items-center ps-3" aria-hidden="true">
          <IconTerminal size={16} className="text-base-content/40" />
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={t("slash-input-placeholder", {
            defaultValue: "Type / for commands…",
          })}
          className="w-full rounded-lg border border-base-300 bg-base-100 py-2.5 pe-4 ps-9 font-[family-name:var(--font-mono)] text-[length:var(--font-size-sm)] text-base-content placeholder:text-base-content/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          autoComplete="off"
          aria-haspopup="listbox"
          aria-controls={dropdownActive ? listId : undefined}
          aria-expanded={dropdownActive}
          aria-autocomplete="list"
          aria-activedescendant={activeDescendantId}
        />
      </div>
      {dropdownActive ? (
        <SuggestionsDropdown
          listId={listId}
          baseId={baseId}
          suggestionsRef={suggestionsRef}
          filteredDirectives={filteredDirectives}
          locale={locale}
          activeIndex={activeIndex}
          label={t("slash-input-suggestions-label", {
            defaultValue: "Available commands",
          })}
          optionRefs={optionRefs}
          onBlurCapture={handleSuggestionsBlur}
          onSelect={handleSelect}
          cancelBlur={cancelBlur}
        />
      ) : null}
    </div>
  );
}
