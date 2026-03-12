# Projects, Kanban Board, and project sub-views

This ExecPlan (execution plan) is a living document. The sections
`Constraints`, `Tolerances`, `Risks`, `Progress`, `Surprises &
Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be
kept up to date as work proceeds.

Status: DRAFT

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
  see styled placeholder views indicating the view type.

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
- The view switcher must be implemented with `@radix-ui/react-tabs`
  for keyboard accessibility.
- Project status indicators in the sidebar (filled dot = active,
  hollow = inactive) must be consistent with the project fixture data.

## Tolerances (exception triggers)

- Scope: if implementation requires more than 15 new files or 2,000
  lines of code (net), stop and escalate.
- Dependencies: if drag-and-drop requires a new library, stop and
  escalate. The mockup should use CSS-only drag visual cues or
  minimal native HTML drag attributes without a library.
- Iterations: if tests still fail after 3 attempts, stop and
  escalate.

## Risks

- Risk: The Calendar and Timeline views are complex to implement fully
  as static mockups.
  Severity: medium
  Likelihood: high
  Mitigation: Implement Calendar and Timeline as styled placeholders
  with representative layout structure (a month grid for Calendar, a
  horizontal bar chart skeleton for Timeline) rather than fully
  interactive components. Note this in the Decision Log.

- Risk: Kanban drag-and-drop accessibility is non-trivial.
  Severity: medium
  Likelihood: certain
  Mitigation: This is a static mockup. Implement `cursor: grab` and
  hover effects on cards. Document the intended keyboard interaction
  pattern in an `aria-description` on the board container. Do not
  implement actual drag-and-drop logic.

## Progress

- [ ] Milestone 1: Project fixture data
- [ ] Milestone 2: Project list page
- [ ] Milestone 3: Project landing layout with view switcher
- [ ] Milestone 4: Kanban board
- [ ] Milestone 5: Backlog, Calendar, List, and Timeline placeholders
- [ ] Milestone 6: Tests and validation

## Surprises & discoveries

(None yet.)

## Decision log

(None yet.)

## Outcomes & retrospective

(To be completed when the plan is done.)

## Context and orientation

This plan depends on `01-foundation.md` (app shell, routes, tokens)
and `02-dashboard-and-tasks.md` (reusable components: status badges,
task cards, priority tags, avatar stacks). The task card component
from plan 02 is reused here in the Kanban columns.

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
- `src/app/features/projects/components/view-switcher.tsx` — Tabbed
  view selector using Radix Tabs.
- Placeholder screens for Backlog, Calendar, List, Timeline.

## Plan of work

### Milestone 1: Project fixture data

Create `src/data/projects.ts` defining:

- A `Project` interface with: `slug`, `name`, `lead` (assignee),
  `dateRange`, `status` (active/inactive/completed), `description`,
  and `team` (array of assignees).
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
- A view switcher (Radix Tabs) with five tabs: Backlog, Kanban,
  Calendar, List, Timeline. The default tab is Kanban.
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

These are styled placeholders that communicate the view type:

- **Backlog**: A card with heading "Backlog" and a list of unscheduled
  tasks in a simple table format.
- **Calendar**: A month grid skeleton showing the current month with
  task dots on due dates.
- **List**: A dense table view (reusing the data table component
  pattern from the design system) with sortable column headers.
- **Timeline**: A horizontal bar chart skeleton showing tasks as bars
  against a date axis.

Each placeholder uses the correct page heading and structural layout
so it reads as a real view, not a blank "coming soon" page.

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

No new npm dependencies. Uses `@radix-ui/react-tabs` for the view
switcher.

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
  readonly name: string;
  readonly lead: Assignee;
  readonly dateRange: { start: string; end: string };
  readonly status: "active" | "inactive" | "completed";
  readonly description: string;
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
    name: "Apollo-Guidance",
  },
  {
    slug: "manhattan-logistics",
    name: "Manhattan-Logistics",
  },
  {
    slug: "skunkworks-alpha",
    name: "Skunkworks-Alpha",
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
