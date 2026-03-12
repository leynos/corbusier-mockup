/** @file Shared placeholder screen used until real page implementations arrive. */

import type { JSX } from "react";

export interface PlaceholderScreenProps {
  readonly title: string;
  readonly subtitle?: string;
}

export function PlaceholderScreen({ title, subtitle }: PlaceholderScreenProps): JSX.Element {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {title}
      </h1>
      {subtitle ? <p className="mt-2 text-base-content/70">{subtitle}</p> : null}
    </div>
  );
}
