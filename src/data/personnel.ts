/** @file Personnel fixture data for the system administration pages.
 *
 * Each user has entity-owned localised strings via `EntityLocalizations`,
 * a role, assigned task count, last active timestamp, and activity history
 * entries reusable with the `ActivityTimeline` component.
 */

import type { EntityLocalizations, ImageAsset } from "../app/domain/entities/localization";
import { loc } from "./localization-helpers";

/* ── Types ────────────────────────────────────────────────────────── */

export type PersonnelRole = "viewer" | "developer" | "team_lead" | "admin";

export type PersonnelId = `USR-${number}`;

export function personnelId(raw: string): PersonnelId {
  return raw as PersonnelId;
}

/** Activity event kinds specific to personnel history. */
export type PersonnelEventKind =
  | "login"
  | "role_change"
  | "task_completed"
  | "comment"
  | "review_approved";

export interface PersonnelActivityEntry {
  readonly id: string;
  readonly kind: PersonnelEventKind;
  readonly timestamp: string;
  readonly localizations: EntityLocalizations;
}

export interface Personnel {
  readonly id: PersonnelId;
  readonly localizations: EntityLocalizations;
  readonly role: PersonnelRole;
  readonly assignedTaskCount: number;
  readonly lastActive: string;
  readonly avatar?: ImageAsset;
  readonly activityHistory: readonly PersonnelActivityEntry[];
}

/* ── Role descriptor registry ─────────────────────────────────────── */

export const personnelRoleDescriptors: Record<
  PersonnelRole,
  { readonly localizations: EntityLocalizations }
> = {
  viewer: { localizations: loc("Viewer") },
  developer: { localizations: loc("Developer") },
  team_lead: { localizations: loc("Team Lead") },
  admin: { localizations: loc("Admin") },
};

/* ── Fixture data ─────────────────────────────────────────────────── */

export const PERSONNEL: readonly Personnel[] = [
  {
    id: personnelId("USR-1001"),
    localizations: loc("Ava Chen", "Lead backend developer"),
    role: "team_lead",
    assignedTaskCount: 8,
    lastActive: "2026-03-12T16:45:00Z",
    activityHistory: [
      {
        id: "pa-1",
        kind: "task_completed",
        timestamp: "2026-03-12T16:45:00Z",
        localizations: loc("Completed TASK-1001"),
      },
      {
        id: "pa-2",
        kind: "review_approved",
        timestamp: "2026-03-12T14:20:00Z",
        localizations: loc("Approved PR #251"),
      },
      {
        id: "pa-3",
        kind: "comment",
        timestamp: "2026-03-12T11:00:00Z",
        localizations: loc("Commented on TASK-1006"),
      },
      {
        id: "pa-4",
        kind: "login",
        timestamp: "2026-03-12T08:30:00Z",
        localizations: loc("Signed in"),
      },
    ],
  },
  {
    id: personnelId("USR-1002"),
    localizations: loc("Marcus Webb", "Frontend engineer"),
    role: "developer",
    assignedTaskCount: 5,
    lastActive: "2026-03-12T15:30:00Z",
    activityHistory: [
      {
        id: "pa-5",
        kind: "task_completed",
        timestamp: "2026-03-12T15:30:00Z",
        localizations: loc("Completed TASK-1002"),
      },
      {
        id: "pa-6",
        kind: "comment",
        timestamp: "2026-03-12T12:00:00Z",
        localizations: loc("Opened PR #252"),
      },
      {
        id: "pa-7",
        kind: "login",
        timestamp: "2026-03-12T09:00:00Z",
        localizations: loc("Signed in"),
      },
    ],
  },
  {
    id: personnelId("USR-1003"),
    localizations: loc("Priya Sharma", "Full-stack developer"),
    role: "developer",
    assignedTaskCount: 6,
    lastActive: "2026-03-12T16:00:00Z",
    activityHistory: [
      {
        id: "pa-8",
        kind: "comment",
        timestamp: "2026-03-12T16:00:00Z",
        localizations: loc("Commented on hook policy review"),
      },
      {
        id: "pa-9",
        kind: "task_completed",
        timestamp: "2026-03-12T13:00:00Z",
        localizations: loc("Completed TASK-1006"),
      },
      {
        id: "pa-10",
        kind: "login",
        timestamp: "2026-03-12T08:45:00Z",
        localizations: loc("Signed in"),
      },
    ],
  },
  {
    id: personnelId("USR-1004"),
    localizations: loc("Elena Rossi", "DevOps engineer"),
    role: "developer",
    assignedTaskCount: 3,
    lastActive: "2026-03-12T14:15:00Z",
    activityHistory: [
      {
        id: "pa-11",
        kind: "task_completed",
        timestamp: "2026-03-12T14:15:00Z",
        localizations: loc("Completed TASK-1007"),
      },
      {
        id: "pa-12",
        kind: "login",
        timestamp: "2026-03-12T09:15:00Z",
        localizations: loc("Signed in"),
      },
    ],
  },
  {
    id: personnelId("USR-1005"),
    localizations: loc("Tomás Herrera", "Security analyst"),
    role: "developer",
    assignedTaskCount: 4,
    lastActive: "2026-03-12T16:50:00Z",
    activityHistory: [
      {
        id: "pa-13",
        kind: "review_approved",
        timestamp: "2026-03-12T16:50:00Z",
        localizations: loc("Approved PR #249"),
      },
      {
        id: "pa-14",
        kind: "task_completed",
        timestamp: "2026-03-12T15:00:00Z",
        localizations: loc("Completed TASK-1011"),
      },
      {
        id: "pa-15",
        kind: "role_change",
        timestamp: "2026-03-10T10:00:00Z",
        localizations: loc("Role changed to Developer"),
      },
      {
        id: "pa-16",
        kind: "login",
        timestamp: "2026-03-12T08:00:00Z",
        localizations: loc("Signed in"),
      },
    ],
  },
  {
    id: personnelId("USR-1006"),
    localizations: loc("Jordan Blake", "Product manager"),
    role: "viewer",
    assignedTaskCount: 0,
    lastActive: "2026-03-11T17:00:00Z",
    activityHistory: [
      {
        id: "pa-17",
        kind: "comment",
        timestamp: "2026-03-11T17:00:00Z",
        localizations: loc("Reviewed sprint backlog"),
      },
      {
        id: "pa-18",
        kind: "login",
        timestamp: "2026-03-11T09:00:00Z",
        localizations: loc("Signed in"),
      },
    ],
  },
  {
    id: personnelId("USR-1007"),
    localizations: loc("Kenji Tanaka", "Platform administrator"),
    role: "admin",
    assignedTaskCount: 2,
    lastActive: "2026-03-12T17:00:00Z",
    activityHistory: [
      {
        id: "pa-19",
        kind: "role_change",
        timestamp: "2026-03-12T17:00:00Z",
        localizations: loc("Granted Admin role to USR-1007"),
      },
      {
        id: "pa-20",
        kind: "task_completed",
        timestamp: "2026-03-12T12:30:00Z",
        localizations: loc("Completed TASK-1016"),
      },
      {
        id: "pa-21",
        kind: "login",
        timestamp: "2026-03-12T07:45:00Z",
        localizations: loc("Signed in"),
      },
    ],
  },
];

/* ── Lookup helpers ───────────────────────────────────────────────── */

export function findPersonnelById(id: string): Personnel | undefined {
  return PERSONNEL.find((p) => p.id === id);
}
