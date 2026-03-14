/** @file Stable current-time adapter for view logic.
 *
 * `now()` is the single project-level source of wall-clock time for
 * UI logic that only needs a snapshot of the current moment.
 * `useNow()` memoizes that snapshot for the lifetime of a component
 * instance so tests can replace the adapter without chasing repeated
 * `new Date()` calls through render paths.
 */

import { useMemo } from "react";

export function now(): Date {
  return new Date();
}

export function useNow(): Date {
  return useMemo(() => now(), []);
}
