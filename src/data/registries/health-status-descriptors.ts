/** @file Health status descriptor registry. */

import type { EntityLocalizations } from "../../app/domain/entities/localization";
import type { HealthStatus } from "../dashboard";

export interface HealthStatusDescriptor {
  readonly id: HealthStatus;
  readonly localizations: EntityLocalizations;
}

export const healthStatusDescriptors: Record<string, HealthStatusDescriptor> = {
  healthy: {
    id: "healthy" as HealthStatus,
    localizations: {
      "en-GB": { name: "HEALTHY" },
      ar: { name: "سليم" },
      de: { name: "GESUND" },
      es: { name: "SALUDABLE" },
      hi: { name: "स्वस्थ" },
      ja: { name: "正常" },
      "zh-CN": { name: "正常" },
    },
  },
  degraded: {
    id: "degraded" as HealthStatus,
    localizations: {
      "en-GB": { name: "DEGRADED" },
      ar: { name: "متدهور" },
      de: { name: "BEEINTRÄCHTIGT" },
      es: { name: "DEGRADADO" },
      hi: { name: "अवनत" },
      ja: { name: "低下" },
      "zh-CN": { name: "降级" },
    },
  },
  critical: {
    id: "critical" as HealthStatus,
    localizations: {
      "en-GB": { name: "CRITICAL" },
      ar: { name: "حرج" },
      de: { name: "KRITISCH" },
      es: { name: "CRÍTICO" },
      hi: { name: "गंभीर" },
      ja: { name: "危機的" },
      "zh-CN": { name: "严重" },
    },
  },
};
