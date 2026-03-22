/** @file Health status badge for system pages (healthy/degraded/critical). */

import type { JSX } from "react";

import type { HealthStatus } from "../../../../data/dashboard";

const STYLE_MAP: Record<HealthStatus, { readonly bg: string; readonly text: string }> = {
  healthy: { bg: "bg-success/15", text: "text-success" },
  degraded: { bg: "bg-warning/15", text: "text-warning" },
  critical: { bg: "bg-error/15", text: "text-error" },
};

interface HealthBadgeProps {
  readonly status: HealthStatus;
  readonly label: string;
  readonly className?: string;
}

export function HealthBadge({ status, label, className = "" }: HealthBadgeProps): JSX.Element {
  const style = STYLE_MAP[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wide ${style.bg} ${style.text} ${className}`}
    >
      {label}
    </span>
  );
}
