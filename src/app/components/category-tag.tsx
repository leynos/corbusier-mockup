/** @file Category tag for task labels (BACKEND, FRONTEND, TESTING, etc.). */

import type { JSX } from "react";

interface CategoryTagProps {
  readonly label: string;
  readonly className?: string;
}

export function CategoryTag({ label, className = "" }: CategoryTagProps): JSX.Element {
  return (
    <span
      className={`inline-block rounded bg-primary/10 px-2 py-0.5 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-primary ${className}`}
    >
      {label}
    </span>
  );
}
