/** @file Custom hook encapsulating command palette search, filtering, and keyboard navigation. */

import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { pickLocalization } from "../../domain/entities/localization";
import { type PaletteItem, type PaletteItemKind, paletteItems } from "./command-palette-items";
import { useCommandPalette } from "./command-palette-provider";

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
  const navigate = useNavigate();

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

  /* ── Internal reset ────────────────────────────────────────────── */

  const reset = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
  }, []);

  /* ── Actions ───────────────────────────────────────────────────── */

  const selectItem = useCallback(
    (item: PaletteItem) => {
      close();
      reset();
      void navigate({ to: item.route });
    },
    [close, reset, navigate],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const actions: Partial<Record<string, () => void>> = {
        ArrowDown: () => setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1)),
        ArrowUp: () => setActiveIndex((prev) => Math.max(prev - 1, 0)),
        Enter: () => {
          const item = filtered[activeIndex];
          if (item) selectItem(item);
        },
      };
      const action = actions[e.key];
      if (action) {
        e.preventDefault();
        action();
      }
    },
    [filtered, activeIndex, selectItem],
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        close();
        reset();
      }
    },
    [close, reset],
  );

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
