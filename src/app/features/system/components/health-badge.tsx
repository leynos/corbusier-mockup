/** @file Health status badge for system pages (healthy/degraded/critical). */

import type { JSX } from "react";
import { useTranslation } from "react-i18next";

import type { HealthStatus } from "../../../../data/dashboard";
import { healthStatusDescriptors } from "../../../../data/registries";
import { pickLocalization } from "../../../domain/entities/localization";

const STYLE_MAP: Record<HealthStatus, { readonly bg: string; readonly text: string }> = {
  healthy: { bg: "bg-success/15", text: "text-success" },
  degraded: { bg: "bg-warning/15", text: "text-warning" },
  critical: { bg: "bg-error/15", text: "text-error" },
};

interface HealthBadgeProps {
  readonly status: HealthStatus;
  readonly className?: string;
}

export function HealthBadge({ status, className = "" }: HealthBadgeProps): JSX.Element {
  const { i18n } = useTranslation();
  const style = STYLE_MAP[status];
  const label = pickLocalization(healthStatusDescriptors[status].localizations, i18n.language).name;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-[family-name:var(--font-display)] text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wide ${style.bg} ${style.text} ${className}`}
    >
      {label}
    </span>
  );
}
