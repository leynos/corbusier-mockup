/** @file Action callbacks for the command palette (keyboard, selection, open/close). */

import type React from "react";
import { useCallback } from "react";

import { router } from "../../routes/app-routes";
import type { PaletteItem } from "./command-palette-items";

/** Input contract for {@link useCommandPaletteActions}. */
interface UseCommandPaletteActionsInput {
  /** Current filtered list of palette items used for navigation and selection. */
  readonly filtered: readonly PaletteItem[];
  /** Index of the currently highlighted item. */
  readonly activeIndex: number;
  /** Setter for `activeIndex`, forwarded to the keyboard handler. */
  readonly setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  /** Closes the palette overlay. */
  readonly close: () => void;
  /** Resets query text and active index to their initial values. */
  readonly reset: () => void;
}

/** Public callbacks returned by {@link useCommandPaletteActions}. */
interface UseCommandPaletteActionsResult {
  /** Navigates to the selected item's route and dismisses the palette. */
  readonly selectItem: (item: PaletteItem) => void;
  /** Keyboard event handler for ArrowUp, ArrowDown, and Enter. */
  readonly handleKeyDown: (e: React.KeyboardEvent) => void;
  /** Radix Dialog `onOpenChange` handler; resets state when the palette closes. */
  readonly handleOpenChange: (open: boolean) => void;
}

/* ── Module-scope key-handler helpers ── */

function applyArrowDown(
  filtered: readonly PaletteItem[],
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>,
): void {
  if (filtered.length === 0) return;
  setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
}

function applyArrowUp(
  filtered: readonly PaletteItem[],
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>,
): void {
  if (filtered.length === 0) return;
  setActiveIndex((prev) => Math.max(prev - 1, 0));
}

function applyEnter(
  e: React.KeyboardEvent,
  filtered: readonly PaletteItem[],
  activeIndex: number,
  selectItem: (item: PaletteItem) => void,
): void {
  if (e.nativeEvent.isComposing) return;
  const item = filtered[activeIndex];
  if (!item) return;
  e.preventDefault();
  selectItem(item);
}

/**
 * Build memoised command-palette callbacks for item selection,
 * keyboard control, and open/close lifecycle.
 */
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
          e.preventDefault();
          applyArrowDown(filtered, setActiveIndex);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          applyArrowUp(filtered, setActiveIndex);
          break;
        }
        case "Enter": {
          applyEnter(e, filtered, activeIndex, selectItem);
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
