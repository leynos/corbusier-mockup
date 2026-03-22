/** @file Command palette overlay with search, keyboard navigation, and category groups. */

import * as Dialog from "@radix-ui/react-dialog";
import {
  IconArrowRight,
  IconCommand,
  IconFolder,
  IconMessage,
  IconSearch,
  IconSubtask,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { type JSX, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { pickLocalization } from "../../domain/entities/localization";
import {
  kindLabels,
  type PaletteItem,
  type PaletteItemKind,
  paletteItems,
} from "./command-palette-items";
import { useCommandPalette } from "./command-palette-provider";

/* ── Icon map ──────────────────────────────────────────────────────── */

const kindIcons: Record<PaletteItemKind, typeof IconSubtask> = {
  task: IconSubtask,
  conversation: IconMessage,
  command: IconCommand,
  project: IconFolder,
};

/* ── Component ─────────────────────────────────────────────────────── */

export function CommandPalette(): JSX.Element {
  const { isOpen, close } = useCommandPalette();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  /* ── Filtering ─────────────────────────────────────────────────── */

  const filtered = useMemo(() => {
    if (!query.trim()) return paletteItems;
    const q = query.toLowerCase();
    return paletteItems.filter((item) => {
      const loc = pickLocalization(item.localizations, i18n.language);
      return loc.name.toLowerCase().includes(q) || (item.meta?.toLowerCase().includes(q) ?? false);
    });
  }, [query, i18n.language]);

  /* Group filtered items by kind, preserving declaration order */
  const groups = useMemo(() => {
    const orderedKinds: PaletteItemKind[] = ["task", "conversation", "command", "project"];
    const map = new Map<PaletteItemKind, PaletteItem[]>();
    for (const item of filtered) {
      const arr = map.get(item.kind) ?? [];
      arr.push(item);
      map.set(item.kind, arr);
    }
    return orderedKinds
      .filter((k) => map.has(k))
      .map((k) => ({ kind: k, items: map.get(k) ?? [] }));
  }, [filtered]);

  /* ── Navigation ────────────────────────────────────────────────── */

  const selectItem = useCallback(
    (item: PaletteItem) => {
      close();
      setQuery("");
      setActiveIndex(0);
      void navigate({ to: item.route });
    },
    [close, navigate],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[activeIndex];
        if (item) selectItem(item);
      }
    },
    [filtered, activeIndex, selectItem],
  );

  /* Reset state when opening */
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        close();
        setQuery("");
        setActiveIndex(0);
      }
    },
    [close],
  );

  /* ── Flat-index tracker for keyboard navigation across groups ─── */
  let flatIndex = -1;

  const activeItem = filtered[activeIndex];
  const activeDescendant = activeItem ? `palette-item-${activeItem.id}` : undefined;

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
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-base-300 px-4 py-3">
            <IconSearch
              size={18}
              stroke={1.5}
              className="text-base-content/60"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent text-[length:var(--font-size-sm)] text-base-content placeholder:text-base-content/60 focus:outline-none"
              placeholder={t("palette-placeholder", {
                defaultValue: "Search tasks, conversations, commands…",
              })}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              aria-label={t("palette-input-label", { defaultValue: "Search commands" })}
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-results"
              aria-activedescendant={activeDescendant}
            />
          </div>

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
                    const isActive = idx === activeIndex;
                    const Icon = kindIcons[item.kind];
                    const loc = pickLocalization(item.localizations, i18n.language);
                    return (
                      <div
                        key={item.id}
                        id={`palette-item-${item.id}`}
                        role="option"
                        tabIndex={-1}
                        aria-selected={isActive}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[length:var(--font-size-sm)] ${
                          isActive
                            ? "bg-primary text-primary-content"
                            : "text-base-content hover:bg-base-200"
                        }`}
                        onClick={() => selectItem(item)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            selectItem(item);
                          }
                        }}
                        onMouseEnter={() => setActiveIndex(idx)}
                      >
                        <Icon size={16} stroke={1.5} aria-hidden="true" />
                        <span className="flex-1 truncate">{loc.name}</span>
                        {item.meta ? (
                          <span
                            className={`font-[family-name:var(--font-mono)] text-[length:var(--font-size-xs)] ${isActive ? "text-primary-content" : "text-base-content/60"}`}
                          >
                            {item.meta}
                          </span>
                        ) : null}
                        {isActive ? (
                          <IconArrowRight size={14} stroke={1.5} aria-hidden="true" />
                        ) : null}
                      </div>
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

          {/* Footer hints */}
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
