# System administration pages

This ExecPlan (execution plan) is a living document. The sections
`Constraints`, `Tolerances`, `Risks`, `Progress`, `Surprises &
Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be
kept up to date as work proceeds.

Status: DRAFT

## Purpose / big picture

After this plan is complete, a developer can navigate to every page
under `/system/` and see functional administrative views:

- **Personnel** (`/system/personnel`) — User directory with name,
  role, task count, last active. Detail view with activity history.
- **Reports** (`/system/reports`) — Three report tabs: Audit Trail,
  Performance, Compliance. Each shows a representative data table or
  chart skeleton.
- **Agent Backends** (`/system/agents`) — Registry of agent backends
  with name, vendor, version, status, capabilities. Detail view with
  activate/deactivate controls.
- **Tool Registry** (`/system/tools`) — MCP server list with name,
  transport, lifecycle state, health. Detail view with start/stop
  controls and tool catalog.
- **Hooks & Policies** (`/system/hooks`) — Hook definitions with
  trigger, predicate, actions, priority. Detail view with editor and
  execution log.
- **Monitoring** (`/system/monitoring`) — Operational dashboard with
  Grafana-style metric panels, alerts, and health checks.
- **Tenant Management** (`/system/tenants`) — Current tenant details
  (read-only).

These are the "operational controls of the room" — administrative
surfaces that make governance and observability tangible.

## Constraints

- All constraints from `01-foundation.md` apply (including the
  technology stack section — Tailwind v4, DaisyUI v5, Radix UI, etc.).
- Data tables use DaisyUI `table` component classes
  (`docs/daisyui-v5-guide.md`) with Tailwind v4 utilities for
  responsive layout (`docs/tailwind-v4-guide.md`). Registry cards use
  the data-model-driven card architecture
  (`docs/data-model-driven-card-architecture.md`).
- These pages are gated behind Team Lead / Admin roles in the real
  application. The mockup does not implement auth, but the pages
  should display a subtle role indicator in the header (e.g., "Admin"
  badge) to communicate the access model.
- Data tables must use proper `<th scope>`, tabular figures, row
  hover, and ≥36px row height (WCAG 2.5.8 target size).
- Registry cards (agent backends, MCP servers) use standard rounded
  corners — they are fixtures of the room, not moveable work units.
- Monitoring panels are skeletal chart areas (coloured rectangles with
  labels and axis markers), not actual chart implementations. The
  visual pattern should evoke Grafana-style dashboards.

## Tolerances (exception triggers)

- Scope: if implementation requires more than 25 new files or 3,500
  lines of code (net), stop and escalate. This plan covers 7 page
  families, so the per-page budget is modest.
- Dependencies: no new npm dependencies.
- Iterations: if tests still fail after 3 attempts, stop and
  escalate.

## Risks

- Risk: The monitoring dashboard calls for Grafana-style charts which
  are complex to render without a charting library.
  Severity: medium
  Likelihood: certain
  Mitigation: Use static SVG or CSS shapes to suggest chart panels.
  A coloured rectangle with labelled axes and a few plotted points is
  sufficient for the mockup. No actual data visualisation library.

- Risk: Seven page families is a large scope for a single plan.
  Severity: medium
  Likelihood: medium
  Mitigation: Many of these pages share the same pattern (index list
  → detail view with a data table). Extract a shared `RegistryList`
  and `RegistryDetail` layout component to reduce per-page
  boilerplate.

## Progress

- [ ] Milestone 1: Fixture data for all system entities
- [ ] Milestone 2: Shared system page components
- [ ] Milestone 3: Personnel pages
- [ ] Milestone 4: Reports page
- [ ] Milestone 5: Agent Backends pages
- [ ] Milestone 6: Tool Registry pages
- [ ] Milestone 7: Hooks & Policies pages
- [ ] Milestone 8: Monitoring page
- [ ] Milestone 9: Tenant Management page
- [ ] Milestone 10: Tests and validation

## Surprises & discoveries

(None yet.)

## Decision log

(None yet.)

## Outcomes & retrospective

(To be completed when the plan is done.)

## Context and orientation

This plan depends on plan 01 (foundation) and plan 02 (reusable
components: status badges, data table styling, activity timelines).
The data table pattern from the design system HTML reference is the
primary component used across these pages.

### Key files this plan creates

Fixture data:

- `src/data/personnel.ts`
- `src/data/agents.ts` (agent backends)
- `src/data/mcp-servers.ts` (tool registry)
- `src/data/hooks.ts`
- `src/data/monitoring.ts`
- `src/data/tenant.ts`

Shared components:

- `src/app/components/data-table.tsx` — A reusable data table with
  proper semantics, hover states, and sortable header indicators.
- `src/app/features/system/components/registry-list.tsx` — A shared
  list layout for registry pages.

Page components (replacing placeholders):

- `src/app/features/system/personnel-screen.tsx` (+ detail)
- `src/app/features/system/reports-screen.tsx`
- `src/app/features/system/agents-screen.tsx` (+ detail)
- `src/app/features/system/tools-screen.tsx` (+ detail)
- `src/app/features/system/hooks-screen.tsx` (+ detail)
- `src/app/features/system/monitoring-screen.tsx`
- `src/app/features/system/tenants-screen.tsx`

## Plan of work

### Milestone 1: Fixture data

Create fixture files for each entity:

- **Personnel**: 6–8 users with name, role (Viewer/Developer/Team
  Lead/Admin), assigned task count, last active timestamp, and
  activity history.
- **Agent backends**: 3 backends (Claude Code SDK, Codex CLI, Custom
  Backend) with name, vendor, version, status (Active/Inactive),
  capability flags (supports_streaming, supports_tools).
- **MCP servers**: 3 servers (workspace_tools, weaver_mcp,
  podbot_runtime) with name, transport, lifecycle state, health
  status, tool catalog, and health history.
- **Hooks**: 4–5 hook definitions with trigger type, predicate,
  action chain, priority, enabled status, and execution log entries.
- **Monitoring**: Metric data for HTTP request rate, agent turn
  latency (P50/P95/P99), tool execution throughput, DB connection
  pool utilisation. Active alerts. Health check statuses.
- **Tenant**: A single tenant with ID, slug, display name, status,
  and owning user.

### Milestone 2: Shared system page components

Create `src/app/components/data-table.tsx`:

- Accepts a generic `columns` definition and `data` array.
- Renders `<table>` with `<th scope="col">`, sortable header
  indicators, row hover, zebra striping, and tabular figures.
- Uses the design system table styles.

Create `src/app/features/system/components/registry-list.tsx`:

- A layout component that renders a page heading, optional filter
  bar, and a grid or list of cards/table rows.

### Milestones 3–9: Page implementations

Each milestone replaces one placeholder with a functional page
using the shared components and fixture data. The pattern is
consistent:

- **List view**: A heading, optional filters, and a data table or
  card grid.
- **Detail view** (where applicable): A header with entity name and
  status, metadata panel, and entity-specific content (tool catalog,
  hook editor, execution log).

Specific notes:

- **Personnel detail**: Shows user activity history using the
  `ActivityTimeline` component from plan 02.
- **Reports**: Three tabs (Audit Trail, Performance, Compliance).
  Audit Trail is a data table of events. Performance shows metric
  panels (skeletal charts). Compliance shows a pass/fail summary.
- **Agent detail**: Activate/deactivate toggle button, capability
  flag checkboxes (read-only in mockup).
- **Tool detail**: Start/stop control buttons, tool catalog list
  (each tool shows name, description, input schema in a code block
  with chamfer), health history timeline.
- **Hook detail**: A read-only editor area showing trigger config,
  predicate rules, and action chain. Below it, an execution log
  table with pass/fail/skip outcomes.
- **Monitoring**: A 2×2 grid of metric panels (coloured SVG
  rectangles with labels). Below: active alerts table and health
  check status cards for `/health/live`, `/health/ready`,
  `/health/detailed`.
- **Tenant**: A single card showing tenant details. Read-only.

### Milestone 10: Tests and validation

- Component test for `DataTable` rendering columns and rows.
- Component test for at least two system pages (personnel list and
  agent backends list).
- Playwright E2E: navigate to `/system/agents`, verify table
  renders; click a backend, verify detail view.
- Playwright axe sweep on personnel and monitoring routes.
- `bun run ff` must pass.

## Validation and acceptance

**Quality criteria:**

- All seven system page families render with fixture data.
- Data tables use proper semantics and meet target size requirements.
- Registry cards use standard rounded corners (no chamfer).
- Tool catalog code blocks use chamfered containers.
- Monitoring shows skeletal chart panels.
- All `bun run ff` checks pass.

**Quality method:**

```bash
bun run ff
```

## Idempotence and recovery

Each milestone produces a commit. Retry from last commit on failure.

## Interfaces and dependencies

No new npm dependencies.

### Key interfaces

In `src/app/components/data-table.tsx`:

```tsx
export interface Column<T> {
  readonly key: keyof T;
  readonly header: string;
  readonly render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  readonly columns: readonly Column<T>[];
  readonly data: readonly T[];
  readonly onRowClick?: (row: T) => void;
}

export function DataTable<T>(props: DataTableProps<T>): JSX.Element;
```
