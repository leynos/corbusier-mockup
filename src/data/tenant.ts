/** @file Tenant fixture data for the tenant management page.
 *
 * A single tenant entity with entity-owned localised strings,
 * slug, status, plan tier, and owning user reference.
 */

import type { EntityLocalizations } from "../app/domain/entities/localization";
import { loc } from "./localization-helpers";

/* ── Types ────────────────────────────────────────────────────────── */

export type TenantStatus = "active" | "suspended";

export interface Tenant {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly slug: string;
  readonly status: TenantStatus;
  readonly plan: string;
  readonly ownerUserId: string;
  readonly createdAt: string;
  readonly memberCount: number;
  readonly projectCount: number;
}

/* ── Fixture data ─────────────────────────────────────────────────── */

export const TENANT: Tenant = {
  id: "TNT-001",
  localizations: loc(
    "Corbusier Operations",
    "Primary tenant for the Corbusier platform operations team.",
  ),
  slug: "corbusier-ops",
  status: "active",
  plan: "Enterprise",
  ownerUserId: "USR-1007",
  createdAt: "2025-09-15T00:00:00Z",
  memberCount: 7,
  projectCount: 4,
};
