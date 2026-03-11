/** @file SVG-framed punch-card chamfer card component.
 *
 * Renders an inline SVG polygon that stretches to fill the card via
 * `preserveAspectRatio="none"`. The `vector-effect: non-scaling-stroke`
 * property keeps the border width constant regardless of element size.
 * Works cross-browser without feature-detection fallbacks.
 */

import type { JSX, ReactNode } from "react";

/** Chamfer size — controls how deep the 45° corner cut is. */
type ChamferSize = "sm" | "md" | "lg" | "xl";

interface ChamferCardProps {
  /** Content to render inside the card. */
  readonly children: ReactNode;
  /** Additional CSS classes on the outer container. */
  readonly className?: string;
  /** Chamfer size. Defaults to "md". */
  readonly size?: ChamferSize;
  /** When true, the chamfer is on the top-left (blocked state). */
  readonly reversed?: boolean;
  /** Tailwind `stroke-*` class for the polygon border colour. */
  readonly strokeClassName?: string;
}

/*
 * SVG polygon points for each size/orientation combination.
 * Coordinates are in a 0–100 viewBox. The 1-unit inset from each
 * edge prevents stroke clipping.
 */
const STANDARD_POINTS: Record<ChamferSize, string> = {
  sm: "1,1 91,1 99,9 99,99 1,99",
  md: "1,1 82,1 99,18 99,99 1,99",
  lg: "1,1 77,1 99,23 99,99 1,99",
  xl: "1,1 72,1 99,28 99,99 1,99",
};

const REVERSED_POINTS: Record<ChamferSize, string> = {
  sm: "9,1 99,1 99,99 1,99 1,9",
  md: "18,1 99,1 99,99 1,99 1,18",
  lg: "23,1 99,1 99,99 1,99 1,23",
  xl: "28,1 99,1 99,99 1,99 1,28",
};

export function ChamferCard({
  children,
  className = "",
  size = "md",
  reversed = false,
  strokeClassName = "stroke-base-300",
}: ChamferCardProps): JSX.Element {
  const points = reversed ? REVERSED_POINTS[size] : STANDARD_POINTS[size];

  return (
    <div className={`chamfer-card ${className}`}>
      <svg
        className="chamfer-card__frame"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon className={strokeClassName} points={points} />
      </svg>
      <div className="chamfer-card__content">{children}</div>
    </div>
  );
}
