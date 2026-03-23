/** @file Action callbacks for the command palette (keyboard, selection, open/close). */

import type React from "react";
import { useCallback } from "react";

import { router } from "../../routes/app-routes";
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
  const selectItem = useCallback(
    (item: PaletteItem) => {
      const route = item.route;
      close();
      reset();
      // CommandPalette renders outside RouterProvider (sibling in app.tsx), so
      // useNavigate() has no router context.  Use the router singleton directly
      // and defer until after Radix Dialog's unmount to avoid a React null-ref
      // error when the dialog and router commit DOM mutations in the same tick.
      requestAnimationFrame(() => {
        void router.navigate({ to: route });
      });
    },
    [close, reset],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown": {
          if (filtered.length === 0) break;
          e.preventDefault();
          setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
          break;
        }
        case "ArrowUp": {
          if (filtered.length === 0) break;
          e.preventDefault();
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          break;
        }
        case "Enter": {
          e.preventDefault();
          const item = filtered[activeIndex];
          if (item) selectItem(item);
          break;
        }
        default:
          break;
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
