/** @file Shared layout component for system registry list pages.
 *
 * Renders a page heading, optional subtitle, and children content
 * area. Used by all system list views for consistent layout.
 */

import type { JSX, ReactNode } from "react";

export interface RegistryListProps {
  readonly heading: string;
  readonly subtitle?: string;
  readonly children: ReactNode;
}

export function RegistryList({ heading, subtitle, children }: RegistryListProps): JSX.Element {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
        {heading}
      </h1>
      {subtitle ? <p className="mt-1 text-base-content/70">{subtitle}</p> : null}
      <div className="mt-6">{children}</div>
    </div>
  );
}
