/** @file Project descriptor registry — resolves project slugs to display names. */

import type { EntityLocalizations } from "../../app/domain/entities/localization";

export interface ProjectDescriptor {
  readonly id: ProjectSlug;
  readonly localizations: EntityLocalizations;
}

export const PROJECT_SLUGS = [
  "apollo-guidance",
  "manhattan-logistics",
  "skunkworks-alpha",
] as const;

export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export const projectDescriptors = {
  "apollo-guidance": {
    id: "apollo-guidance",
    localizations: {
      "en-GB": { name: "Apollo-Guidance" },
      ar: { name: "Apollo-Guidance" },
      de: { name: "Apollo-Guidance" },
      es: { name: "Apollo-Guidance" },
      hi: { name: "Apollo-Guidance" },
      ja: { name: "Apollo-Guidance" },
      "zh-CN": { name: "Apollo-Guidance" },
    },
  },
  "manhattan-logistics": {
    id: "manhattan-logistics",
    localizations: {
      "en-GB": { name: "Manhattan-Logistics" },
      ar: { name: "Manhattan-Logistics" },
      de: { name: "Manhattan-Logistics" },
      es: { name: "Manhattan-Logistics" },
      hi: { name: "Manhattan-Logistics" },
      ja: { name: "Manhattan-Logistics" },
      "zh-CN": { name: "Manhattan-Logistics" },
    },
  },
  "skunkworks-alpha": {
    id: "skunkworks-alpha",
    localizations: {
      "en-GB": { name: "Skunkworks-Alpha" },
      ar: { name: "Skunkworks-Alpha" },
      de: { name: "Skunkworks-Alpha" },
      es: { name: "Skunkworks-Alpha" },
      hi: { name: "Skunkworks-Alpha" },
      ja: { name: "Skunkworks-Alpha" },
      "zh-CN": { name: "Skunkworks-Alpha" },
    },
  },
} satisfies Record<ProjectSlug, ProjectDescriptor>;
