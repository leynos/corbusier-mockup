/** @file Command palette overlay with search, keyboard navigation, and category groups. */

import * as Dialog from "@radix-ui/react-dialog";
import { IconSearch } from "@tabler/icons-react";
import { type JSX, type RefObject, useRef } from "react";
import { useTranslation } from "react-i18next";

import { kindLabels } from "./command-palette-items";
import { PaletteResultItem } from "./palette-result-item";
import { useCommandPaletteSearch } from "./use-command-palette-search";

export function CommandPalette(): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isOpen,
    query,
    activeIndex,
    filtered,
    groups,
    activeDescendant,
    selectItem,
    handleKeyDown,
    handleOpenChange,
    handleQueryChange,
    setActiveIndex,
  } = useCommandPaletteSearch();

  const { t } = useTranslation();

  /* ── Flat-index tracker for keyboard navigation across groups ─── */
  let flatIndex = -1;

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          className="fixed inset-x-4 top-[15vh] z-50 mx-auto max-w-lg rounded-xl border border-base-300 bg-base-100 shadow-xl sm:inset-x-auto"
          aria-label={t("palette-label", { defaultValue: "Command palette" })}
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
          />

          {/* Results — divs used instead of ul/li to satisfy Biome a11y rules */}
          <div
            id="palette-results"
            role="listbox"
            className="max-h-72 overflow-y-auto p-2"
            aria-label={t("palette-results-label", { defaultValue: "Search results" })}
          >
            {groups.map((group) => (
              <div key={group.kind} role="presentation">
                <span className="block px-3 pb-1 pt-2 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
                  {t(kindLabels[group.kind])}
                </span>
                <div>
                  {group.items.map((item) => {
                    flatIndex += 1;
                    const idx = flatIndex;
                    return (
                      <PaletteResultItem
                        key={item.id}
                        item={item}
                        isActive={idx === activeIndex}
                        onSelect={selectItem}
                        onMouseEnter={() => setActiveIndex(idx)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            {filtered.length === 0 ? (
              <div
                role="option"
                tabIndex={-1}
                aria-selected={false}
                className="px-3 py-4 text-center text-[length:var(--font-size-sm)] text-base-content/60"
              >
                {t("palette-no-results", { defaultValue: "No results found." })}
              </div>
            ) : null}
          </div>

          <PaletteFooterHints />
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
}

function PaletteSearchInput({
  inputRef,
  query,
  activeDescendant,
  onQueryChange,
}: PaletteSearchInputProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3 border-b border-base-300 px-4 py-3">
      <IconSearch size={18} stroke={1.5} className="text-base-content/60" aria-hidden="true" />
      <input
        ref={inputRef}
        type="text"
        className="flex-1 bg-transparent text-[length:var(--font-size-sm)] text-base-content placeholder:text-base-content/60 focus:outline-none"
        placeholder={t("palette-placeholder", {
          defaultValue: "Search tasks, conversations, commands…",
        })}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label={t("palette-input-label", { defaultValue: "Search commands" })}
        role="combobox"
        aria-expanded="true"
        aria-controls="palette-results"
        aria-activedescendant={activeDescendant}
      />
    </div>
  );
}

/* ── Footer hints ──────────────────────────────────────────────────── */

function PaletteFooterHints(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 border-t border-base-300 px-4 py-2 text-[length:var(--font-size-xs)] text-base-content/60">
      <span className="flex items-center gap-1">
        <kbd className="rounded border border-base-300 px-1 font-[family-name:var(--font-mono)]">
          ↑↓
        </kbd>
        {t("palette-hint-navigate", { defaultValue: "Navigate" })}
      </span>
      <span className="flex items-center gap-1">
        <kbd className="rounded border border-base-300 px-1 font-[family-name:var(--font-mono)]">
          ↵
        </kbd>
        {t("palette-hint-open", { defaultValue: "Open" })}
      </span>
      <span className="flex items-center gap-1">
        <kbd className="rounded border border-base-300 px-1 font-[family-name:var(--font-mono)]">
          {t("palette-kbd-esc", { defaultValue: "esc" })}
        </kbd>
        {t("palette-hint-close", { defaultValue: "Close" })}
      </span>
    </div>
  );
}
