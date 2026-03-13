/** @file Shared helpers for fixture-localized entity data.
 *
 * These helpers keep fixture modules aligned on the same
 * `EntityLocalizations` shape while the mock app progressively moves
 * more model-owned text out of Fluent UI chrome.
 */

import type { EntityLocalizations } from "../app/domain/entities/localization";

/**
 * Build a single-locale localization map for fixture entities.
 *
 * @example
 * ```ts
 * const metric = loc("Active Tasks", "across 4 projects");
 * ```
 */
export function loc(name: string, description?: string): EntityLocalizations {
  const entry = description !== undefined ? { name, description } : { name };
  return { "en-GB": entry };
}
