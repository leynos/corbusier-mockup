# Dashboard, My Tasks, and Task Detail

This ExecPlan (execution plan) is a living document. The sections
`Constraints`, `Tolerances`, `Risks`, `Progress`, `Surprises &
Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be
kept up to date as work proceeds.

Status: COMPLETE

## Purpose / big picture

After this plan is complete, a developer can navigate to:

- **`/` (Dashboard)** — and see the operations room: system health
  gauges, KPI cards (active tasks, agent utilization, tool success
  rate, SLA status), a recent activity feed, and an agent utilization
  summary. All panels show static fixture data.
- **`/tasks` (My Tasks)** — and see a filterable task queue with
  state, priority, and project filters. Each row shows task title,
  state badge, priority, project, and assignee.
- **`/tasks/:id` (Task Detail)** — and see the densest page in the
  application: task header with state badge and transition buttons,
  dependency hierarchy (Goal → Idea → Step → Task), progress and
  subtask checklist, dependency panels (blocks / blocked by), branch
  and PR association, activity timeline, and related tasks.
- **`/projects/:slug/tasks/:id/dependencies` (Task Dependencies)** —
  and see the hierarchical dependency view with the dependency graph,
  current task focus, and related tasks.

These four pages exercise the bulk of the design system's component
library: KPI cards, status badges, task cards (with punch-card
chamfer), data tables, activity timelines, progress bars, avatar
stacks, and state machine controls.

## Constraints

- All constraints from `01-foundation.md` apply (including the
  technology stack section — Tailwind v4, DaisyUI v5, Radix UI, etc.).
- KPI cards, status badges, and task cards follow the data-model-driven
  card architecture (`docs/data-model-driven-card-architecture.md`).
  Use DaisyUI `card`, `badge`, and `stat` components
  (`docs/daisyui-v5-guide.md`) styled with Tailwind v4 utilities
  (`docs/tailwind-v4-guide.md`).
- The Dashboard must match the hierarchy and scan-path plan from
  `docs/corbusier-design-language.md` section 5:
  1. System health status (loudest)
  2. KPI cards
  3. Recent activity feed
  4. Agent utilization summary
  5. Navigation (always visible, never dominant)
  6. Header (utility)
- Task Detail must match the hierarchy:
  1. Task title + state badge (loudest)
  2. State machine transition buttons
  3. Dependency panel
  4. Progress / subtask checklist
  5. Branch & PR association
  6. Activity timeline
  7. Task metadata (reference data)
- Status badges must always combine icon + text + colour (Web Content
  Accessibility Guidelines (WCAG) 1.4.1
  — colour must not be the sole means of conveying information).
- Task cards carry the punch-card chamfer. Information cards (KPI,
  registry) use standard rounded corners.
- State machine transitions must only show valid next states. The
  valid transitions are: `draft` → `in_progress`, `in_progress` →
  `in_review` | `paused`, `in_review` → `done` | `in_progress`,
  `paused` → `in_progress`, and any state → `abandoned`.

## Tolerances (exception triggers)

- Scope: if implementation requires more than 20 new files or 3,000
  lines of code (net), stop and escalate.
- Iterations: if tests still fail after 3 attempts at a fix, stop
  and escalate.
- Visual fidelity: if a component cannot be made to match the example
  HTML mockups within the design language's colour and type tokens,
  note the deviation in the Decision Log and proceed with the best
  approximation.

## Risks

- Risk: The example HTML mockups (`example_html/11-Dashboard.html`,
  `example_html/2-Task Detail.html`, `example_html/10-My Tasks.html`)
  may use different colours or spacing than the design language spec.
  Severity: medium
  Likelihood: high (the docs note they need adjustment)
  Mitigation: Follow the design language document. Use the example
  HTML as structural guidance only. Note specific deviations.

- Risk: The task detail page is very dense and may exceed the 400-line
  file limit if implemented as a single component.
  Severity: medium
  Likelihood: high
  Mitigation: Decompose into subcomponents: `TaskHeader`,
  `DependencyHierarchy`, `SubtaskChecklist`, `DependencyPanel`,
  `BranchPrAssociation`, `ActivityTimeline`, `RelatedTasks`,
  `StateMachineControls`. Each in its own file under
  `src/app/features/tasks/components/`.

- Risk: Activity timeline requires vertical line + dot styling that
  may be complex with Tailwind utilities alone.
  Severity: low
  Likelihood: medium
  Mitigation: Use a small set of component-layer CSS classes (as done
  in the design system HTML reference) in `src/index.css`.

## Progress

- [x] Milestone 1: Fixture data for tasks and dashboard
- [x] Milestone 2: Reusable UI components (badges, KPI cards,
      timelines, progress bars, avatar stacks)
- [x] Milestone 3: Dashboard page
- [x] Milestone 4: My Tasks page
- [x] Milestone 5: Task Detail page
- [x] Milestone 6: Task Dependencies page
- [x] Milestone 7: Tests and validation

## Surprises & discoveries

- Night theme semantic colours (`text-success` #7A9060, `text-error`
  #C65A48) fail Web Content Accessibility Guidelines (WCAG) AA
  contrast (3.98:1) against `bg-base-100`
  (#262D30). Supplementary text that conveys meaning via icons/labels
  should use `text-base-content/80` (7.47:1) instead.
- `text-base-content/50` gives exactly 4.5:1 in night theme — axe
  may flag this due to rounding. Use `/60` (4.9:1) as the minimum
  safe opacity for secondary text.
- `role="progressbar"` requires an accessible name; defaulting the
  `label` prop to `"Progress"` fixed the axe violation.
- `<section>` elements only become `region` landmarks when they have
  an accessible name (via `aria-label` or `aria-labelledby`). Added
  `aria-labelledby` with `useId()` to the Section wrapper component.

## Decision log

- Used `text-base-content/80` instead of semantic colours for KPI
  trend labels and agent status text. Semantic colour is carried by
  icons (which are `aria-hidden` and exempt from contrast rules).
- Decomposed Task Detail into 8 subcomponents under
  `src/app/features/tasks/components/` to stay within the 400-line
  file limit.
- Filter chips on My Tasks use `useState` with string arrays rather
  than URL search params, since this is a static mockup.
- Section wrapper uses `useId()` + `aria-labelledby` rather than
  `aria-label` to avoid duplicating the heading text.

## Outcomes & retrospective

All 7 milestones delivered. Four pages implemented:

- `/` — Dashboard with system health, KPI cards, activity feed,
  agent utilization summary.
- `/tasks` — My Tasks with state/priority/project filter chips.
- `/tasks/:id` — Task Detail with state machine controls, dependency
  hierarchy, subtask checklist, branch/pull request (PR), activity
  timeline.
- `/projects/:slug/tasks/:id/dependencies` — Dependency view with
  hierarchy, dependency graph, related tasks.

Test coverage: 59 unit tests, 9 end-to-end (E2E) tests (including 3
axe sweeps), all passing. `bun run ff` gate green throughout.

Files created: 18 new files, well within the 20-file tolerance.
All files under the 400-line limit.

**Migration note:** Plan 02 entities (Task, KpiMetric, AgentBackend,
DashboardEvent, Subtask) now use `EntityLocalizations` maps and
descriptor registries rather than flat string fields. Plan 03
milestone 0 formalizes that migration path across the remaining
project- and suggestion-oriented fixture models.

## Context and orientation

This plan depends on `01-foundation.md` being complete. The app shell,
sidebar, route tree, design tokens, and font stack must all be in
place before starting.

### Key files this plan creates

- `src/data/tasks.ts` — Fixture data for tasks (15–20 tasks with
  full metadata, dependencies, subtasks, and activity events).
- `src/data/dashboard.ts` — Fixture data for KPI metrics, system
  health, and activity feed.
- `src/app/features/dashboard/dashboard-screen.tsx` — Replaces the
  placeholder.
- `src/app/features/tasks/tasks-screen.tsx` — Replaces the
  placeholder.
- `src/app/features/tasks/task-detail-screen.tsx` — Replaces the
  placeholder.
- `src/app/features/tasks/task-deps-screen.tsx` — Replaces the
  placeholder.
- `src/app/features/tasks/components/` — Sub-components for task
  detail.
- `src/app/components/` — Reusable UI primitives (badges, KPI cards,
  etc.) shared across pages.

### Terms

- **State machine controls**: Buttons that transition a task between
  lifecycle states. Only valid transitions are enabled; invalid
  transitions are hidden or disabled.
- **Dependency hierarchy**: The Goal → Idea → Step → Task breadcrumb
  showing a task's position in the project breakdown structure.
- **Activity timeline**: A chronological audit log showing state
  transitions, subtask completions, comments, and agent actions as
  timestamped entries with coloured dots.
- **KPI card**: A dashboard panel showing a large number, a context
  line, and a trend indicator. These are "fixtures of the room" and
  do not carry the punch-card chamfer.

## Plan of work

### Milestone 1: Fixture data

Create `src/data/tasks.ts` defining:

- A `Task` interface with fields: `id`, `title`, `description`,
  `state` (TaskState enum), `priority`, `project`, `assignee`,
  `dueDate`, `estimate`, `labels`, `subtasks`, `dependencies`
  (`blockedBy`/`blocks`), `branchRef`, `pullRequestRef`, `activityLog`,
  `parentGoal`, `parentIdea`, `parentStep`, `relatedTasks`.
- A `TaskState` enum: `draft`, `in_progress`, `in_review`, `paused`,
  `done`, `abandoned`.
- A `Priority` enum: `low`, `medium`, `high`, `critical`.
- A `canTransitionTo(from: TaskState, to: TaskState): boolean`
  function encoding the valid transition rules.
- 15–20 fixture tasks spanning all states, with realistic
  Corbusier-themed content (agent orchestration tasks, MCP server
  integration, hook system implementation, etc.).

Create `src/data/dashboard.ts` defining:

- KPI data: active task count, agent utilization %, tool success
  rate %, SLA P95 latency.
- System health: status (healthy/degraded/critical), component
  health breakdown.
- Recent activity: 10–15 timestamped events (state transitions, tool
  calls, agent turns).
- Agent utilization: list of backends with name, status, turn count.

### Milestone 2: Reusable UI components

Create shared components under `src/app/components/`:

- **`status-badge.tsx`** — Renders a status badge with icon + text +
  colour for each `TaskState`. Maps states to the design system badge
  styles (draft=grey, in_progress=terracotta, in_review=slate,
  paused=dusty copper, done=olive, abandoned=grey, blocked=deep
  terracotta).
- **`priority-tag.tsx`** — Renders a priority tag (HIGH, MEDIUM, LOW,
  CRITICAL) using the design system tag styles.
- **`category-tag.tsx`** — Renders a category tag (BACKEND, FRONTEND,
  TESTING, etc.).
- **`kpi-card.tsx`** — Renders a KPI card with label, large value,
  context line, and optional trend indicator (↑/↓ with green/red
  colouring). Uses standard rounded corners (not chamfered).
- **`activity-timeline.tsx`** — Renders a vertical timeline with
  coloured dots (teal for structural, terracotta for state changes,
  olive for completions).
- **`progress-bar.tsx`** — A simple progress bar with configurable
  fill colour.
- **`avatar-stack.tsx`** — Overlapping circular avatars with initials.
- **`task-card.tsx`** — A Kanban-style task card with punch-card
  chamfer, priority and category tags, title, description, status
  badge, progress bar, avatar stack, and task ID. Includes a
  "blocked" variant with reversed chamfer.

### Milestone 3: Dashboard page

Replace the dashboard placeholder with the full implementation
matching the design spec. Four panels:

1. **System health** — A prominent status indicator (large icon +
   text) showing healthy/degraded/critical.
2. **KPI cards** — A 4-column responsive grid of `KpiCard` components.
3. **Activity feed** — A card containing an `ActivityTimeline`
   rendering the 10 most recent events.
4. **Agent utilization** — A card listing active backends with name,
   status badge, and turn count.

Use the hierarchy from section 5 of the design language: health is
loudest, then KPIs, then feed, then utilization.

### Milestone 4: My Tasks page

Replace the placeholder with a task list view:

- A filter bar at the top with filter chips for state, priority, and
  project.
- A list (or table) of tasks showing: status badge, title, priority
  tag, project name, assignee avatar, due date, and task ID.
- Clicking a task navigates to `/tasks/:id`.

### Milestone 5: Task Detail page

Replace the placeholder with the full task detail implementation.
Decompose into subcomponents under
`src/app/features/tasks/components/`:

- **`task-header.tsx`** — Title, state badge, assignee, due date,
  priority, "Edit Task" button.
- **`dependency-hierarchy.tsx`** — Goal → Idea → Step → Task
  breadcrumb.
- **`state-machine-controls.tsx`** — Transition buttons for valid
  next states only. Uses `canTransitionTo()` to determine which
  buttons to show.
- **`subtask-checklist.tsx`** — Ordered subtask list with check/
  uncheck icons and active highlight.
- **`dependency-panel.tsx`** — Two sections: "Blocked By" bound to
  `blockedBy` and "Blocks" bound to `blocks`. Each shows cards for
  related tasks with status, assignee, and completion date.
- **`branch-pr-panel.tsx`** — Branch name and PR number with links.
- **`task-metadata-panel.tsx`** — Assignee, due date, priority,
  estimate, labels.
- **`related-tasks.tsx`** — Sibling task cards from the same step.

The screen component (`task-detail-screen.tsx`) reads the task ID from
the route params, looks up the fixture data, and assembles these
subcomponents.

### Milestone 6: Task Dependencies page

Similar to the task detail but focused on the hierarchical dependency
view. Shows:

- The full dependency hierarchy with expand/collapse.
- Current task focus panel with progress bar, time spent, and subtask
  summary.
- A dependency graph section showing blocks/blocked-by relationships.
- Related tasks in the same step.
- An activity timeline.

### Milestone 7: Tests and validation

- Component tests for each reusable UI component (status badge, KPI
  card, progress bar, etc.).
- Component test for the dashboard rendering KPI cards and activity
  feed.
- Component test for task detail rendering all sections.
- Accessibility tests for status badges (icon + text present, not
  colour-only).
- Playwright E2E: navigate to dashboard, verify KPI cards visible;
  navigate to a task detail, verify state machine controls present.
- Playwright axe sweep on dashboard and task detail routes.
- `bun run ff` must pass.

## Validation and acceptance

**Quality criteria:**

- Dashboard renders four panel sections with fixture data.
- My Tasks shows a filterable task list.
- Task Detail renders all specified sections with correct data from
  fixtures.
- State machine controls only show valid transitions.
- Punch-card chamfer appears on task cards, not on KPI/info cards.
- Status badges always show icon + text + colour.
- All `bun run ff` checks pass.

**Quality method:**

```bash
bun run ff
```

## Idempotence and recovery

Each milestone produces a commit. Discard uncommitted changes and
retry from the last commit if a milestone fails.

## Artifacts and notes

### Task state transitions

```plaintext
draft → in_progress
in_progress → in_review | paused
in_review → done | in_progress
paused → in_progress
(any) → abandoned
```

### Dashboard layout sketch

```plaintext
┌─────────────────────────────────────────────────┐
│ System Health: ● HEALTHY                        │
├────────────┬────────────┬────────────┬──────────┤
│ Active     │ Agent      │ Tool       │ SLA      │
│ Tasks: 47  │ Util: 83%  │ Rate: 98%  │ P95:820ms│
├────────────┴────────────┴────────────┴──────────┤
│ Recent Activity Feed                            │
│ ● Task transitioned…        14 Mar 09:14        │
│ ● Branch associated…        14 Mar 09:15        │
│ ● Subtask completed…        14 Mar 11:42        │
├─────────────────────────────────────────────────┤
│ Agent Utilization                                │
│ claude_code_sdk  ✓ Active   142 turns           │
│ codex_cli        ✓ Active    87 turns           │
│ custom_backend   ✕ Inactive   0 turns           │
└─────────────────────────────────────────────────┘
```

## Interfaces and dependencies

No new npm dependencies. Uses:

- `@tabler/icons-react` for status icons
- `clsx` for conditional classes
- `react-i18next` for strings
- `@tanstack/react-router` for route params

### Key interfaces

In `src/data/tasks.ts`:

```tsx
export enum TaskState {
  Draft = "draft",
  InProgress = "in_progress",
  InReview = "in_review",
  Paused = "paused",
  Done = "done",
  Abandoned = "abandoned",
}

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly state: TaskState;
  readonly priority: Priority;
  readonly project: string;
  readonly assignee: Assignee;
  readonly dueDate: string;
  readonly estimate: string | undefined;
  readonly labels: readonly string[];
  readonly subtasks: readonly Subtask[];
  readonly dependencies: Dependencies;
  readonly branchRef: string | undefined;
  readonly pullRequestRef: string | undefined;
  readonly activityLog: readonly ActivityEvent[];
  readonly parentGoal: string | undefined;
  readonly parentIdea: string | undefined;
  readonly parentStep: string | undefined;
  readonly relatedTasks: readonly string[];
}

export function canTransitionTo(
  from: TaskState,
  to: TaskState,
): boolean;
```
