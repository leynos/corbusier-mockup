/** @file Command palette overlay with search, keyboard navigation, and category groups. */

import * as Dialog from "@radix-ui/react-dialog";
import { IconSearch } from "@tabler/icons-react";
import { type JSX, type RefObject, useRef } from "react";
import { useTranslation } from "react-i18next";

import { kindLabels } from "./command-palette-items";
import { PaletteResultItem } from "./palette-result-item";
import { useCommandPaletteSearch } from "./use-command-palette-search";

/**
 * Full-screen command palette overlay.
 *
 * Renders a Radix Dialog containing a search input, grouped result items, a
 * no-results live region, and keyboard-hint footer. Open/close state and all
 * interaction callbacks are delegated to {@link useCommandPaletteSearch}.
 *
 * Accessibility: the Dialog content carries `aria-label` (not `aria-labelledby`)
 * so the label is read on focus entry even though no visible heading is rendered.
 */
export function CommandPalette(): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isOpen,
    query,
    activeIndex,
    filtered,
    indexedGroups,
    activeDescendant,
    selectItem,
    handleKeyDown,
    handleOpenChange,
    handleQueryChange,
    setActiveIndex,
  } = useCommandPaletteSearch();

  const { t } = useTranslation();

  /* ── Resolved translations (lifted from child components) ──────────── */

  const searchPlaceholder = t("palette-placeholder", {
    defaultValue: "Search tasks, conversations, commands…",
  });
  const searchInputLabel = t("palette-input-label", { defaultValue: "Search commands" });
  const paletteLabel = t("palette-label", { defaultValue: "Command palette" });
  const resultsLabel = t("palette-results-label", { defaultValue: "Search results" });
  const noResultsText = t("palette-no-results", { defaultValue: "No results found." });

  /* Footer hint translations */
  const hintNavigate = t("palette-hint-navigate", { defaultValue: "Navigate" });
  const hintOpen = t("palette-hint-open", { defaultValue: "Open" });
  const hintClose = t("palette-hint-close", { defaultValue: "Close" });
  const kbdEsc = t("palette-kbd-esc", { defaultValue: "esc" });

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          className="fixed inset-x-4 top-[15vh] z-50 mx-auto max-w-lg rounded-xl border border-base-300 bg-base-100 shadow-xl sm:inset-x-auto"
          aria-label={paletteLabel}
          onKeyDown={handleKeyDown}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
        >
          <PaletteSearchInput
            inputRef={inputRef}
            query={query}
            activeDescendant={activeDescendant}
            onQueryChange={handleQueryChange}
            placeholder={searchPlaceholder}
            ariaLabel={searchInputLabel}
          />

          {/* Results — divs used instead of ul/li to satisfy Biome a11y rules */}
          <div
            id="palette-results"
            role="listbox"
            className="max-h-72 overflow-y-auto p-2"
            aria-label={resultsLabel}
          >
            {indexedGroups.map((group) => {
              const headingId = `palette-group-${group.kind}`;
              return (
                // biome-ignore lint/a11y/useSemanticElements: group role required inside listbox; fieldset is not permitted as a listbox child per ARIA spec
                <div key={group.kind} role="group" aria-labelledby={headingId}>
                  <span
                    id={headingId}
                    className="block px-3 pb-1 pt-2 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60"
                  >
                    {t(kindLabels[group.kind])}
                  </span>
                  <div>
                    {group.items.map(({ item, index }) => (
                      <PaletteResultItem
                        key={item.id}
                        item={item}
                        isActive={index === activeIndex}
                        onSelect={selectItem}
                        onMouseEnter={() => setActiveIndex(index)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 ? (
            // biome-ignore lint/a11y/useSemanticElements: <output> is form-associated and inappropriate for a live-region no-results notice
            <div
              role="status"
              className="px-3 py-4 text-center text-[length:var(--font-size-sm)] text-base-content/60"
            >
              {noResultsText}
            </div>
          ) : null}

          <PaletteFooterHints
            hintNavigate={hintNavigate}
            hintOpen={hintOpen}
            hintClose={hintClose}
            kbdEsc={kbdEsc}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ── Search input ──────────────────────────────────────────────────── */

interface PaletteSearchInputProps {
  readonly inputRef: RefObject<HTMLInputElement | null>;
  readonly query: string;
  readonly activeDescendant: string | undefined;
  readonly onQueryChange: (value: string) => void;
  readonly placeholder: string;
  readonly ariaLabel: string;
}

/**
 * Search input row at the top of the command palette.
 *
 * Renders a magnifier icon and a `role="combobox"` text input wired to the
 * result listbox via `aria-controls` and `aria-activedescendant`. The ref
 * is used by the parent to steal focus on Dialog open.
 */
function PaletteSearchInput({
  inputRef,
  query,
  activeDescendant,
  onQueryChange,
  placeholder,
  ariaLabel,
}: PaletteSearchInputProps): JSX.Element {
  return (
    <div className="flex items-center gap-3 border-b border-base-300 px-4 py-3">
      <IconSearch size={18} stroke={1.5} className="text-base-content/60" aria-hidden="true" />
      <input
        ref={inputRef}
        type="text"
        className="flex-1 bg-transparent text-[length:var(--font-size-sm)] text-base-content placeholder:text-base-content/60 focus:outline-none"
        placeholder={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label={ariaLabel}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded="true"
        aria-controls="palette-results"
        aria-activedescendant={activeDescendant}
      />
    </div>
  );
}

/* ── Footer hints ──────────────────────────────────────────────────── */

interface PaletteFooterHintsProps {
  readonly hintNavigate: string;
  readonly hintOpen: string;
  readonly hintClose: string;
  readonly kbdEsc: string;
}

/** Keyboard-shortcut hint bar rendered at the bottom of the command palette. */
function PaletteFooterHints({
  hintNavigate,
  hintOpen,
  hintClose,
  kbdEsc,
}: PaletteFooterHintsProps): JSX.Element {
  return (
    <div className="flex items-center gap-4 border-t border-base-300 px-4 py-2 text-[length:var(--font-size-xs)] text-base-content/60">
      <span className="flex items-center gap-1">
        <kbd className="rounded border border-base-300 px-1 font-[family-name:var(--font-mono)]">
          ↑↓
        </kbd>
        {hintNavigate}
      </span>
      <span className="flex items-center gap-1">
        <kbd className="rounded border border-base-300 px-1 font-[family-name:var(--font-mono)]">
          ↵
        </kbd>
        {hintOpen}
      </span>
      <span className="flex items-center gap-1">
        <kbd className="rounded border border-base-300 px-1 font-[family-name:var(--font-mono)]">
          {kbdEsc}
        </kbd>
        {hintClose}
      </span>
    </div>
  );
}
