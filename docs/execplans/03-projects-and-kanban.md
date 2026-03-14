# Projects, Kanban Board, and project sub-views

This ExecPlan (execution plan) is a living document. The sections
`Constraints`, `Tolerances`, `Risks`, `Progress`, `Surprises &
Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be
kept up to date as work proceeds.

Status: COMPLETE

## Purpose / big picture

After this plan is complete, a developer can navigate to:

- **`/projects`** — and see a card grid of projects with name, lead,
  date range, status badge, and team avatar stack.
- **`/projects/:slug`** — and be redirected to the canonical
  **`/projects/:slug/kanban`** route.
- **`/projects/:slug/kanban`** — and see a Kanban board with five
  columns (To-Do, Planned, In Progress, In Review, Done), task cards
  with the punch-card chamfer, priority and category tags, progress
  bars, assignee avatars, and inline "Add New" creation placeholders.
- **`/projects/:slug/backlog`**, `calendar`, `list`, `timeline` — and
  see shipped project sub-views. Backlog, Calendar, and List render
  project data, while Timeline renders the milestone-marker view.

The Kanban board is the primary workspace for project-level task
management. It exercises the task card component in its natural
habitat: draggable between columns, with count badges on column
headers.

## Constraints

- All constraints from `01-foundation.md` apply (including the
  technology stack section — Tailwind v4, DaisyUI v5, Radix UI, etc.).
- Kanban cards follow the data-model-driven card architecture
  (`docs/data-model-driven-card-architecture.md`). Use DaisyUI `card`
  and `badge` components for visual presentation.
- Kanban columns must map to `TaskState` values: To-Do → `draft`
  with `isPlanned: false`, Planned → `draft` with `isPlanned: true`,
  In Progress → `in_progress`, In Review → `in_review`, Done → `done`.
  `paused` and `abandoned` tasks are excluded from board columns but remain in
  derived counts and summary data.
- Task cards must carry the punch-card chamfer (top-right bevel).
  Blocked tasks must show the reversed chamfer (top-left bevel).
- Drag-and-drop is a placeholder in this mockup — visual only, no
  actual reordering. A keyboard-accessible alternative must be
  documented (select card, Enter, arrow to target column, Enter).
- The view switcher must expose keyboard-accessible tab semantics via
  plain `role="tablist"` / `role="tab"` navigation links.
- Project status indicators in the sidebar (filled dot = active,
  hollow = inactive) must be consistent with the project fixture data.

## Tolerances (exception triggers)

- Scope: if implementation requires more than 25 new files or 3,500
  lines of code (net), stop and escalate.
- Dependencies: if drag-and-drop requires a new library, stop and
  escalate. The mockup should use CSS-only drag visual cues or
  minimal native HTML drag attributes without a library.
- Iterations: if tests still fail after 3 attempts, stop and
  escalate.

## Risks

- Risk: Calendar and Timeline remain read-only views rather than fully
  interactive planning surfaces.
  Severity: medium
  Likelihood: high
  Mitigation: Keep the shipped Calendar table and Timeline
  milestone-marker view aligned with project data, and add interactive
  planning controls only when product scope justifies the added
  accessibility and state-management complexity.

- Risk: Kanban drag-and-drop accessibility is non-trivial.
  Severity: medium
  Likelihood: certain
  Mitigation: This is a static mockup. Implement `cursor: grab` and
  hover effects on cards. Document the intended keyboard interaction
  pattern in an `aria-description` on the board container. Do not
  implement actual drag-and-drop logic.

## Progress

- [x] Milestone 0: Data model foundation and plan-02 migration
  (deferred — M0 was already handled by plan 02's entity
  localizations)
- [x] Milestone 1: Project fixture data — `ec1e25d`
- [x] Milestone 2: Project list page — `3841057`
- [x] Milestone 3: Project landing layout with view switcher — `3841057`
- [x] Milestone 4: Kanban board — `5b80b4a`
- [x] Milestone 5: Backlog, Calendar, List, and Timeline views — `8594b0a`
- [x] Milestone 6: Tests and validation — `5235789`
- [x] Post-completion review remediation: canonical project navigation,
  shared draft bucketing, localised calendar semantics, disabled
  control hardening, and regression coverage were tightened after PR
  review.

## Surprises & discoveries

- **`&ndash;` flagged as hard-coded text**: The custom
  `check-hardcoded-strings.ts` lint uses `\p{L}{2,}` to detect
  non-i18n strings. The TypeScript parser exposes HTML entity names
  (e.g., "ndash") as `JsxText`, which matches the pattern. Fixed by
  using `{"\u2013"}` JSX expressions instead.
- **Tabbed view-switcher `aria-controls` accessibility (a11y) violation**:
  Radix `Tabs.Trigger`
  emits `aria-controls` referencing panel IDs, but the ViewSwitcher
  uses tabs as navigation links — no panels exist. This caused an axe
  `aria-valid-attr-value` violation. Resolved by replacing the
  previous tab implementation with plain `<div role="tablist">` +
  `<Link role="tab">` elements.
- **Hooks after early return**: Putting `useMemo` after conditional
  `return <Navigate>` violates the Rules of Hooks. Fixed by extracting
  the derived data into a pure `deriveColumns()` function and calling
  hooks unconditionally before any returns.
- **Calendar Accessible Rich Internet Applications (ARIA) grid
  roles**: Initially used `role="grid"` /
  `role="gridcell"` / `role="columnheader"` for the calendar month
  layout, but this implied interactive grid navigation that doesn't
  exist. The shipped calendar in
  `src/app/features/projects/calendar-screen.tsx` now renders as a
  semantic HTML `<table>` with `<thead>` / `<tbody>`, weekday column
  headers via `<th scope="col">`, table rows for weeks, and table
  cells for dates. The table carries an `aria-label`, each populated
  date cell gets an `aria-label` describing the date and due-task
  state, and the current date uses `aria-current="date"` on its
  `<time>` element. No custom keyboard interaction is implemented
  beyond the native table semantics.

## Decision log

- **M0 deferred**: Milestone 0 (entity localizations migration) was
  already handled by plan 02. The `EntityLocalizations` pattern and
  `pickLocalization` helper were in place before this plan started.
- **M2+M3 combined commit**: Milestones 2 and 3 were committed
  together as they form a natural unit (project list + landing layout).
- **Tab implementation → plain ARIA**: Replaced
  `@radix-ui/react-tabs` with hand-rolled `role="tablist"` /
  `role="tab"` to avoid the `aria-controls` pointing to non-existent
  panels.
- **Backlog, Calendar, List, and Timeline shipping level**:
  `src/app/features/projects/backlog-screen.tsx`,
  `src/app/features/projects/calendar-screen.tsx`, and
  `src/app/features/projects/list-screen.tsx` now render live project
  task data. `src/app/features/projects/timeline-screen.tsx` ships the
  milestone-marker view rather than a fully interactive scheduling
  surface.

## Outcomes & retrospective

All 6 milestones delivered across 5 commits. The `bun run ff` gate
passes fully (95 unit tests, 14 end-to-end (E2E) tests, axe a11y
audits).

**Delivered:**

- 3 project fixtures with grouped task summaries
- Project list page with ChamferCard grid
- Project landing with shared header and view switcher (5 tabs)
- Kanban board with 5 task columns, count badges, and "Add New" buttons
- 4 shipped project sub-views: Backlog table, Calendar month grid,
  List dense table, and Timeline milestone markers
- 12 new unit tests, 5 new E2E tests

**Files created:** 14 new files across `src/data/`, `src/app/features/projects/`,
and `tests/`.

**Key lesson:** Radix UI components that assume panel-based tab usage
don't suit navigation tab patterns. Plain ARIA roles with TanStack
Router links are a better fit when tabs control URL routing rather
than in-page content panels.

## Context and orientation

This plan depends on `01-foundation.md` (app shell, routes, tokens),
`02-dashboard-and-tasks.md` (reusable components: status badges, task
cards, priority tags, avatar stacks), and milestone 0 (shared
localization-aware fixture registries and entity helpers). The task
card component from plan 02 is reused here in the Kanban columns.

### Key files this plan creates

- `src/data/projects.ts` — Fixture data for projects (3 projects
  matching the sidebar entries: Apollo-Guidance, Manhattan-Logistics,
  Skunkworks-Alpha).
- `src/app/features/projects/projects-screen.tsx` — Project list.
- `src/app/features/projects/project-landing-screen.tsx` — Project
  landing with view switcher.
- `src/app/features/projects/kanban-screen.tsx` — Kanban board.
- `src/app/features/projects/components/kanban-column.tsx` — A single
  Kanban column.
- `src/app/features/projects/components/project-card.tsx` — A card
  for the project list grid.
- `src/app/features/projects/components/view-switcher.tsx` — Plain
  ARIA tab-semantics view selector.
- `src/app/features/projects/backlog-screen.tsx`,
  `src/app/features/projects/calendar-screen.tsx`,
  `src/app/features/projects/list-screen.tsx`, and
  `src/app/features/projects/timeline-screen.tsx` — project sub-view
  screens.

## Plan of work

### Milestone 0: Data model foundation and plan-02 migration

Introduce the shared data model types and migrate existing plan-02
entities to the `EntityLocalizations` pattern.

- Create `src/app/domain/entities/localization.ts` to define
  `LocaleCode`, `LocalizedStringSet`, `EntityLocalizations`,
  `LocalizedAltText`, `ImageAsset`, and the `pickLocalization`
  helper with deterministic fallback (current locale → `en-GB` →
  any available).
- Create `src/data/registries/` with the following descriptor
  registries: `labelDescriptors`, `priorityDescriptors`,
  `taskStateDescriptors`, `healthStatusDescriptors`,
  `agentStatusDescriptors`, and `eventKindDescriptors`. Each registry
  entry owns its
  `localizations: EntityLocalizations`. The authoritative list of
  descriptor IDs for each registry is in the "Descriptor registries"
  section of `docs/data-model-driven-card-architecture.md`.
- Migrate `src/data/tasks.ts`: replace flat `title`, `description`
  fields on `Task` with `localizations: EntityLocalizations`. Replace
  flat `title` on `Subtask` with `localizations`. Replace flat
  `description` on `ActivityEvent` with `localizations`.
- Migrate `src/data/dashboard.ts`: replace flat `label`, `context`,
  `trendLabel` on `KpiMetric` with `localizations` and
  `trendLocalizations`. Replace flat `displayName` on `AgentBackend`
  with `localizations`. Replace flat `description` on
  `DashboardEvent` with `localizations`.
- Update all plan-02 components to use `pickLocalization` instead of
  `t()` for entity-owned strings. Fluent bundles retain only UI
  chrome (button labels, aria labels, section headings, format
  strings).
- Move entity strings out of `public/locales/*/common.ftl` into the
  entity fixture localization maps.
- Update unit and E2E tests to account for the new data shapes.
- `bun run ff` must pass.

### Milestone 1: Project fixture data

Create `src/data/projects.ts` to define:

- A `Project` interface with `slug`,
  `localizations: EntityLocalizations` (name, description), `lead`
  (assignee), `dateRange`, `status` (active/inactive/completed), and
  `team` (array of assignees).
- 3 fixture projects: Apollo-Guidance (active, space navigation
  system), Manhattan-Logistics (active, supply chain orchestration),
  and Skunkworks-Alpha (inactive, experimental agent framework).
- A function to get tasks grouped by state for a given project (using
  the task fixtures from plan 02), returning both grouped task arrays
  and the derived `taskCounts` object used by the Kanban headers.

### Milestone 2: Project list page

Replace the projects placeholder with a card grid. Each project card
shows:

- Project name as heading.
- Lead name and team avatar stack.
- Date range.
- Status badge (active/inactive).
- Short description.
- Task count summary (e.g., "12 tasks · 3 in progress · 2 blocked").

Clicking a project card navigates to `/projects/:slug/kanban`.

### Milestone 3: Project landing with view switcher

The canonical project landing page (`/projects/:slug/kanban`) renders:

- A project header with name, lead, status badge, date range, and
  team avatars.
- A view switcher with plain ARIA tab semantics and five tabs:
  Backlog, Kanban, Calendar, List, Timeline. The default tab is
  Kanban.
- The active tab panel renders the corresponding route.

The view switcher tabs link to sub-routes:
`/projects/:slug/backlog`, `/projects/:slug/kanban`, etc. TanStack
Router handles the nesting; `/projects/:slug` redirects to the
canonical `/projects/:slug/kanban` path and the tabs reflect the
current sub-route.

### Milestone 4: Kanban board

The Kanban board view renders five columns:

- **To-Do** — Tasks in `draft` state with `isPlanned: false`.
- **Planned** — Tasks in `draft` state with `isPlanned: true`.
- **In Progress** — Tasks in `in_progress` state.
- **In Review** — Tasks in `in_review` state.
- **Done** — Tasks in `done` state.

Each column has:

- A header with the column name, count badge, and optional colour
  accent (matching the state colour).
- A scrollable list of `TaskCard` components.
- An "Add New" button placeholder at the bottom.

Each task card shows priority tags, category tags, title, short
description, status icon, progress bar, assignee avatars, and task ID.
Clicking a card navigates to `/projects/:slug/tasks/:id`.

Blocked tasks (those with non-empty `blockedBy` dependencies where the
blocking tasks are not `done`) render with the reversed chamfer.

### Milestone 5: Backlog, Calendar, List, Timeline

These shipped project sub-views reuse the shared `ProjectHeader` and
the same view switcher, so navigation stays consistent:

- **Backlog**: `src/app/features/projects/backlog-screen.tsx` renders
  the project's draft-task table.
- **Calendar**: `src/app/features/projects/calendar-screen.tsx`
  renders the project's month grid with due-date markers.
- **List**: `src/app/features/projects/list-screen.tsx` renders the
  project's dense all-task table.
- **Timeline**: `src/app/features/projects/timeline-screen.tsx`
  renders the milestone-marker view.

Each shipped view uses the correct page heading and structural layout
from the design references while rendering real project data where
implemented.

### Milestone 6: Tests and validation

- Component test for `ProjectCard` rendering correctly.
- Component test for `KanbanColumn` showing correct task count.
- Component test for `ViewSwitcher` rendering all tabs.
- Playwright E2E: navigate to `/projects`, click a project, verify
  Kanban board renders with columns. Click a tab, verify URL changes.
- Playwright axe sweep on project list and Kanban routes.
- `bun run ff` must pass.

## Validation and acceptance

**Quality criteria:**

- Project list shows 3 projects in a card grid.
- Kanban board shows 5 columns populated from fixture data.
- Task cards carry the punch-card chamfer; blocked cards show reversed
  chamfer.
- View switcher tabs work and update the URL.
- All `bun run ff` checks pass.

**Quality method:**

```bash
bun run ff
```

## Idempotence and recovery

Each milestone produces a commit. Retry from the last commit on
failure.

## Interfaces and dependencies

One new npm dependency: `valibot` for calendar year-month parsing
validation. The view switcher uses plain ARIA tab semantics instead of
a tab library.

### Key interfaces

In `src/data/projects.ts`:

```tsx
export type KanbanColumnId =
  | "todo"
  | "planned"
  | "in_progress"
  | "in_review"
  | "done";

export interface Project {
  readonly slug: string;
  readonly localizations: EntityLocalizations;
  readonly lead: Assignee;
  readonly dateRange: { start: string; end: string };
  readonly status: "active" | "inactive" | "completed";
  readonly team: readonly Assignee[];
}
```

Fixture data in `src/data/projects.ts` should omit `taskCounts`.
Apollo-Guidance, Manhattan-Logistics, and Skunkworks-Alpha rely on the
grouping helper to recompute those counts from the task fixtures, so
the view model keeps a single documented source of truth.

```tsx
export const PROJECT_FIXTURES: readonly Project[] = [
  {
    slug: "apollo-guidance",
    localizations: {
      "en-GB": {
        name: "Apollo-Guidance",
        description: "Space navigation system",
      },
    },
  },
  {
    slug: "manhattan-logistics",
    localizations: {
      "en-GB": {
        name: "Manhattan-Logistics",
        description: "Supply chain orchestration",
      },
    },
  },
  {
    slug: "skunkworks-alpha",
    localizations: {
      "en-GB": {
        name: "Skunkworks-Alpha",
        description: "Experimental agent framework",
      },
    },
  },
];

export function groupTasksByState(projectSlug: string, tasks: readonly Task[]) {
  const grouped = getTasksForProject(projectSlug, tasks).reduce(
    (accumulator, task) => {
      accumulator[task.state].push(task);
      return accumulator;
    },
    createEmptyTaskStateBuckets(),
  );

  return {
    grouped,
    taskCounts: countTasksByColumn(grouped),
  };
}
```
