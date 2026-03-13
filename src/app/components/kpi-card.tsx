/** @file KPI card for dashboard metrics.
 *
 * The dashboard formats metric values and localized copy upstream in
 * `src/app/features/dashboard/dashboard-screen.tsx`, then passes those
 * display strings into this presentational card.
 */

import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import type { JSX } from "react";

import type { TrendDirection } from "../../data/dashboard";

/**
 * Props required to render a single KPI card.
 *
 * `label`, `value`, `context`, and `trendLabel` must already be
 * localized and formatted for display before they reach this component.
 */
interface KpiCardProps {
  readonly label: string;
  readonly value: string;
  readonly context?: string | undefined;
  readonly trend: TrendDirection;
  readonly trendLabel: string;
}

/** Visual treatment for trend labels and icons, exhaustive over every trend direction. */
const TREND_STYLES: Record<
  TrendDirection,
  { readonly text: string; readonly icon: typeof IconTrendingUp | null }
> = {
  up: { text: "text-base-content/80", icon: IconTrendingUp },
  down: { text: "text-base-content/80", icon: IconTrendingDown },
  flat: { text: "text-base-content/60", icon: null },
};

/**
 * Render a dashboard KPI card with a preformatted value and trend callout.
 *
 * The card does not perform numeric formatting itself; callers keep that
 * policy centralized so all KPI surfaces stay consistent.
 */
export function KpiCard({ label, value, context, trend, trendLabel }: KpiCardProps): JSX.Element {
  const trendStyle = TREND_STYLES[trend];
  const TrendIcon = trendStyle.icon;

  return (
    <div data-testid="kpi-card" className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body gap-1 p-5">
        <p className="font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-widest text-base-content/60">
          {label}
        </p>
        <p className="font-[family-name:var(--font-mono)] text-[length:var(--font-size-2xl)] font-bold text-base-content">
          {value}
        </p>
        {context ? (
          <p className="text-[length:var(--font-size-xs)] text-base-content/60">{context}</p>
        ) : null}
        <p
          className={`mt-1 flex items-center gap-1 text-[length:var(--font-size-xs)] font-semibold ${trendStyle.text}`}
        >
          {TrendIcon ? <TrendIcon size={14} stroke={1.8} aria-hidden="true" /> : null}
          {trendLabel}
        </p>
      </div>
    </div>
  );
}
