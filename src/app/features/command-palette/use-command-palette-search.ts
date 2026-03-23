/** @file Custom hook encapsulating command palette search, filtering, and keyboard navigation. */

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { pickLocalization } from "../../domain/entities/localization";
import { type PaletteItem, type PaletteItemKind, paletteItems } from "./command-palette-items";
import { useCommandPalette } from "./command-palette-provider";
import { useCommandPaletteActions } from "./use-command-palette-actions";

/* ── Module-scope pure helpers ─────────────────────────────────────── */

function filterPaletteItems(
  items: readonly PaletteItem[],
  query: string,
  language: string,
): readonly PaletteItem[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter((item) => {
    const loc = pickLocalization(item.localizations, language);
    return loc.name.toLowerCase().includes(q) || (item.meta?.toLowerCase().includes(q) ?? false);
  });
}

function groupPaletteItems(
  items: readonly PaletteItem[],
): readonly { readonly kind: PaletteItemKind; readonly items: PaletteItem[] }[] {
  const orderedKinds: PaletteItemKind[] = ["task", "conversation", "command", "project"];
  const map = new Map<PaletteItemKind, PaletteItem[]>();
  for (const item of items) {
    const arr = map.get(item.kind) ?? [];
    arr.push(item);
    map.set(item.kind, arr);
  }
  return orderedKinds.filter((k) => map.has(k)).map((k) => ({ kind: k, items: map.get(k) ?? [] }));
}

/* ── Hook ──────────────────────────────────────────────────────────── */

interface CommandPaletteSearchResult {
  readonly isOpen: boolean;
  readonly query: string;
  readonly activeIndex: number;
  readonly filtered: readonly PaletteItem[];
  readonly groups: readonly { readonly kind: PaletteItemKind; readonly items: PaletteItem[] }[];
  readonly activeDescendant: string | undefined;
  readonly selectItem: (item: PaletteItem) => void;
  readonly handleKeyDown: (e: React.KeyboardEvent) => void;
  readonly handleOpenChange: (open: boolean) => void;
  readonly handleQueryChange: (value: string) => void;
  readonly setActiveIndex: (index: number) => void;
}

export function useCommandPaletteSearch(): CommandPaletteSearchResult {
  const { isOpen, close } = useCommandPalette();
  const { i18n } = useTranslation();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  /* ── Filtering ─────────────────────────────────────────────────── */

  const filtered = useMemo(
    () => filterPaletteItems(paletteItems, query, i18n.language),
    [query, i18n.language],
  );

  const groups = useMemo(() => groupPaletteItems(filtered), [filtered]);

  /* ── Internal reset ────────────────────────────────────────────── */

  const reset = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
  }, []);

  /* ── Actions ───────────────────────────────────────────────────── */

  const { selectItem, handleKeyDown, handleOpenChange } = useCommandPaletteActions({
    filtered,
    activeIndex,
    setActiveIndex,
    close,
    reset,
  });

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setActiveIndex(0);
  }, []);

  /* ── Derived ───────────────────────────────────────────────────── */

  const activeItem = filtered[activeIndex];
  const activeDescendant = activeItem ? `palette-item-${activeItem.id}` : undefined;

  return {
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
  };
}
