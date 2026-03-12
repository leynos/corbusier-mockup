/** @file Project descriptor registry (temporary — replaced by Project entities in M1). */

import type { EntityLocalizations } from "../../app/domain/entities/localization";

export interface ProjectDescriptor {
  readonly id: string;
  readonly localizations: EntityLocalizations;
}

export const projectDescriptors: Record<string, ProjectDescriptor> = {
  "platform-api-v3": {
    id: "platform-api-v3",
    localizations: {
      "en-GB": { name: "Platform API v3" },
      ar: { name: "Platform API v3" },
      de: { name: "Platform API v3" },
      es: { name: "Platform API v3" },
      hi: { name: "Platform API v3" },
      ja: { name: "Platform API v3" },
      "zh-CN": { name: "Platform API v3" },
    },
  },
  "mobile-app-v2": {
    id: "mobile-app-v2",
    localizations: {
      "en-GB": { name: "Mobile App v2" },
      ar: { name: "Mobile App v2" },
      de: { name: "Mobile App v2" },
      es: { name: "Mobile App v2" },
      hi: { name: "Mobile App v2" },
      ja: { name: "Mobile App v2" },
      "zh-CN": { name: "Mobile App v2" },
    },
  },
  "data-pipeline-upgrade": {
    id: "data-pipeline-upgrade",
    localizations: {
      "en-GB": { name: "Data Pipeline Upgrade" },
      ar: { name: "Data Pipeline Upgrade" },
      de: { name: "Data Pipeline Upgrade" },
      es: { name: "Data Pipeline Upgrade" },
      hi: { name: "Data Pipeline Upgrade" },
      ja: { name: "Data Pipeline Upgrade" },
      "zh-CN": { name: "Data Pipeline Upgrade" },
    },
  },
};
