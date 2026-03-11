/** @file SVG-framed punch-card chamfer card component.
 *
 * Renders an inline SVG polygon that draws the chamfered border and
 * background fill. A ResizeObserver dynamically recomputes polygon
 * points in pixel coordinates so the chamfer angle stays at exactly
 * 45° regardless of the card's aspect ratio.
 *
 * Fill colour is set via a Tailwind `fill-*` utility class on the
 * polygon — the card background lives on the SVG, not the div.
 */

import type { JSX, ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";

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
  /** Tailwind `fill-*` class for the polygon background colour. */
  readonly fillClassName?: string;
}

/** Chamfer depth in CSS pixels for each named size. */
export const CHAMFER_PX: Record<ChamferSize, number> = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

/** Half of stroke-width — inset from SVG edge to prevent clipping. */
const INSET = 0.5;

/**
 * Compute SVG polygon points for a chamfered rectangle.
 *
 * Coordinates are in pixel units matching the element's dimensions,
 * with a 0.5 px inset on every edge to prevent stroke clipping.
 * The chamfer cut is `c` pixels on both axes, producing a true 45°
 * angle.
 *
 * @example
 * ```ts
 * computePoints(256, 100, 16, false)
 * // => "0.5,0.5 239.5,0.5 255.5,16.5 255.5,99.5 0.5,99.5"
 * ```
 */
export function computePoints(w: number, h: number, c: number, reversed: boolean): string {
  const i = INSET;
  const r = w - i;
  const b = h - i;

  if (reversed) {
    return `${i + c},${i} ${r},${i} ${r},${b} ${i},${b} ${i},${i + c}`;
  }
  return `${i},${i} ${r - c},${i} ${r},${i + c} ${r},${b} ${i},${b}`;
}

export function ChamferCard({
  children,
  className = "",
  size = "md",
  reversed = false,
  strokeClassName = "stroke-base-300",
  fillClassName = "",
}: ChamferCardProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Read initial dimensions synchronously to avoid a flash. */
    setDims({ w: el.offsetWidth, h: el.offsetHeight });

    const observer = new ResizeObserver(() => {
      if (ref.current) {
        setDims({
          w: ref.current.offsetWidth,
          h: ref.current.offsetHeight,
        });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const chamfer = CHAMFER_PX[size];
  const hasSize = dims.w > 0 && dims.h > 0;

  return (
    <div ref={ref} className={`chamfer-card ${className}`}>
      {hasSize && (
        <svg
          className="chamfer-card__frame"
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon
            className={`${fillClassName} ${strokeClassName}`}
            points={computePoints(dims.w, dims.h, chamfer, reversed)}
          />
        </svg>
      )}
      <div className="chamfer-card__content">{children}</div>
    </div>
  );
}
