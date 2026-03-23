/** @file Action callbacks for the command palette (keyboard, selection, open/close). */

import { useNavigate } from "@tanstack/react-router";
import type React from "react";
import { useCallback } from "react";

import type { PaletteItem } from "./command-palette-items";

interface UseCommandPaletteActionsInput {
  readonly filtered: readonly PaletteItem[];
  readonly activeIndex: number;
  readonly setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  readonly close: () => void;
  readonly reset: () => void;
}

interface UseCommandPaletteActionsResult {
  readonly selectItem: (item: PaletteItem) => void;
  readonly handleKeyDown: (e: React.KeyboardEvent) => void;
  readonly handleOpenChange: (open: boolean) => void;
}

export function useCommandPaletteActions({
  filtered,
  activeIndex,
  setActiveIndex,
  close,
  reset,
}: UseCommandPaletteActionsInput): UseCommandPaletteActionsResult {
  const navigate = useNavigate();

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
    [filtered, activeIndex, selectItem, setActiveIndex],
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

  return { selectItem, handleKeyDown, handleOpenChange };
}
