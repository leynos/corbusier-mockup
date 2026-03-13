/** @file Shared section card wrapper with an accessible heading relationship. */

import { type ElementType, type JSX, type ReactNode, useId } from "react";

type SectionIconProps = {
  readonly size?: number;
  readonly stroke?: number;
  readonly className?: string;
  readonly "aria-hidden"?: boolean | "true" | "false";
};

type SectionIcon = ElementType<SectionIconProps>;

export interface SectionCardProps {
  readonly icon: SectionIcon;
  readonly title: string;
  readonly children: ReactNode;
  readonly className?: string;
}

export function SectionCard({
  icon: Icon,
  title,
  children,
  className = "",
}: SectionCardProps): JSX.Element {
  const headingId = useId();

  return (
    <section
      className={`card border border-base-300 bg-base-100 shadow-sm ${className}`.trim()}
      aria-labelledby={headingId}
    >
      <div className="card-body p-5">
        <h2
          id={headingId}
          className="mb-3 flex items-center gap-2 font-[family-name:var(--font-display)] text-[length:var(--font-size-sm)] font-semibold uppercase tracking-widest text-base-content/60"
        >
          <Icon size={16} stroke={1.5} aria-hidden="true" />
          <span>{title}</span>
        </h2>
        {children}
      </div>
    </section>
  );
}
