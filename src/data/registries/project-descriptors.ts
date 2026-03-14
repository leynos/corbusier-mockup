/** @file Project descriptor registry — canonical project slugs and display names.
 *
 * Invariants:
 * - `PROJECT_SLUGS` is the canonical source of truth for accepted project
 *   route slugs.
 * - `parseProjectSlug()` returns `undefined` for any non-canonical slug so
 *   route parsing fails closed.
 *
 * @see src/app/routes/project-routes.ts for route-param validation against the
 *   canonical slug list.
 * @see src/app/features/tasks/tasks-screen.tsx for project-name lookups used by
 *   task filtering and display copy.
 */

import type { EntityLocalizations } from "../../app/domain/entities/localization";

export interface ProjectDescriptor {
  readonly id: ProjectSlug;
  readonly localizations: EntityLocalizations;
}

export const APOLLO_GUIDANCE_SLUG = "apollo-guidance";
export const MANHATTAN_LOGISTICS_SLUG = "manhattan-logistics";
export const SKUNKWORKS_ALPHA_SLUG = "skunkworks-alpha";

export const PROJECT_SLUGS = [
  APOLLO_GUIDANCE_SLUG,
  MANHATTAN_LOGISTICS_SLUG,
  SKUNKWORKS_ALPHA_SLUG,
] as const;

export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export function parseProjectSlug(value: string): ProjectSlug | undefined {
  return PROJECT_SLUGS.find((slug) => slug === value);
}

export const projectDescriptors = {
  [APOLLO_GUIDANCE_SLUG]: {
    id: APOLLO_GUIDANCE_SLUG,
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
  [MANHATTAN_LOGISTICS_SLUG]: {
    id: MANHATTAN_LOGISTICS_SLUG,
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
  [SKUNKWORKS_ALPHA_SLUG]: {
    id: SKUNKWORKS_ALPHA_SLUG,
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
