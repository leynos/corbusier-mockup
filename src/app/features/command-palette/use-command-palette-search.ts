/** @file Custom hook encapsulating command palette search, filtering, and keyboard navigation. */

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { pickLocalization } from "../../domain/entities/localization";
import type { PaletteItem, PaletteItemKind } from "./command-palette-items";
import { paletteItems } from "./command-palette-items";
import { useCommandPalette } from "./command-palette-provider";
import { useCommandPaletteActions } from "./use-command-palette-actions";

/* ── Module-scope pure helpers ─────────────────────────────────────── */

/**
 * Filters palette items by matching the localised name or meta field against a
 * case-insensitive query string.
 *
 * @param items - Full list of palette items to filter.
 * @param query - The raw search string entered by the user.
 * @param language - BCP-47 locale tag used to pick the correct localisation.
 * @returns A readonly array of items whose name or meta includes the query.
 */
function filterPaletteItems(
  items: readonly PaletteItem[],
  query: string,
  language: string,
): readonly PaletteItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;
  return items.filter((item) => {
    const loc = pickLocalization(item.localizations, language);
    return (
      loc.name.toLowerCase().includes(normalized) ||
      (item.meta?.toLowerCase().includes(normalized) ?? false)
    );
  });
}

/**
 * Groups a flat list of palette items by their `kind`, preserving the
 * canonical display order: task → conversation → command → project.
 *
 * @param items - Flat readonly array of palette items to group.
 * @returns A readonly array of `{ kind, items }` group descriptors, omitting
 *   any kind that has no matching items.
 */
function groupPaletteItems(
  items: readonly PaletteItem[],
): readonly { readonly kind: PaletteItemKind; readonly items: readonly PaletteItem[] }[] {
  const orderedKinds: readonly PaletteItemKind[] = ["task", "conversation", "command", "project"];
  const map = new Map<PaletteItemKind, PaletteItem[]>();
  for (const item of items) {
    const arr = map.get(item.kind);
    if (arr) {
      arr.push(item);
    } else {
      map.set(item.kind, [item]);
    }
  }
  return orderedKinds.filter((k) => map.has(k)).map((k) => ({ kind: k, items: map.get(k) ?? [] }));
}

/* ── Hook ──────────────────────────────────────────────────────────── */

/**
 * A palette item wrapped with its display-order index for keyboard navigation.
 *
 * The index is assigned monotonically during the flattening of grouped items
 * and is used to resolve the active item and compute `aria-activedescendant`.
 *
 * @property item - The underlying palette item data.
 * @property index - The zero-based position in the flattened display order.
 */
interface IndexedPaletteItem {
  readonly item: PaletteItem;
  readonly index: number;
}

/**
 * A group of indexed palette items sharing the same kind/category.
 *
 * Used to render sectioned results in the command palette while preserving
 * the flat indices required for keyboard navigation accessibility.
 *
 * @property kind - The category discriminator (task, conversation, command, project).
 * @property items - The indexed items belonging to this group, in display order.
 */
interface IndexedPaletteGroup {
  readonly kind: PaletteItemKind;
  readonly items: readonly IndexedPaletteItem[];
}

/**
 * Shape returned by {@link useCommandPaletteSearch}.
 *
 * Consumers receive both the raw `filtered` list (for count/ARIA purposes) and
 * the pre-indexed `indexedGroups` tree (for rendering), as well as all
 * interaction callbacks.
 */
interface CommandPaletteSearchResult {
  readonly isOpen: boolean;
  readonly query: string;
  readonly activeIndex: number;
  readonly filtered: readonly PaletteItem[];
  readonly indexedGroups: readonly IndexedPaletteGroup[];
  readonly activeDescendant: string | undefined;
  readonly selectItem: (item: PaletteItem) => void;
  readonly handleKeyDown: (e: React.KeyboardEvent) => void;
  readonly handleOpenChange: (open: boolean) => void;
  readonly handleQueryChange: (value: string) => void;
  readonly setActiveIndex: (index: number) => void;
}

/**
 * Encapsulates all state and callbacks required by the command palette overlay.
 *
 * Manages open/close state (delegated to `CommandPaletteProvider`), query
 * text, active keyboard index, filtered item list, and pre-indexed grouped
 * items with stable flat indices for ARIA active-descendant tracking.
 *
 * @returns A {@link CommandPaletteSearchResult} containing state values and
 *   interaction handlers ready for the palette component to consume.
 */
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

  /* ── Flattened display-ordered items (single source of truth) ───── */

  const flattenedIndexedItems = useMemo<readonly IndexedPaletteItem[]>(() => {
    let idx = 0;
    return groupPaletteItems(filtered).flatMap((group) =>
      group.items.map((item) => ({ item, index: idx++ })),
    );
  }, [filtered]);

  const indexedGroups = useMemo<readonly IndexedPaletteGroup[]>(() => {
    const groups: { kind: PaletteItemKind; items: IndexedPaletteItem[] }[] = [];
    let currentGroup: { kind: PaletteItemKind; items: IndexedPaletteItem[] } | undefined;
    for (const indexed of flattenedIndexedItems) {
      const kind = indexed.item.kind;
      if (!currentGroup || currentGroup.kind !== kind) {
        currentGroup = { kind, items: [] };
        groups.push(currentGroup);
      }
      currentGroup.items.push(indexed);
    }
    return groups;
  }, [flattenedIndexedItems]);

  const flattenedItems = useMemo<readonly PaletteItem[]>(
    () => flattenedIndexedItems.map(({ item }) => item),
    [flattenedIndexedItems],
  );

  /* ── Internal reset ────────────────────────────────────────────── */

  const reset = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
  }, []);

  /* ── Actions ───────────────────────────────────────────────────── */

  const { selectItem, handleKeyDown, handleOpenChange } = useCommandPaletteActions({
    filtered: flattenedItems,
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

  const activeItem = flattenedItems[activeIndex];
  const activeDescendant = activeItem ? `palette-item-${activeItem.id}` : undefined;

  return {
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
  };
}
