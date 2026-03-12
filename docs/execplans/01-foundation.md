# Foundation: design system, layout shell, and sidebar

This ExecPlan (execution plan) is a living document. The sections
`Constraints`, `Tolerances`, `Risks`, `Progress`, `Surprises &
Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be
kept up to date as work proceeds.

Status: PARTIAL

## Purpose / big picture

After this plan is complete, a developer can start the dev server
(`bun dev`) and see:

- The Corbusier Polychromie Architecturale visual identity — warm
  cream surfaces, teal/terracotta/olive accents, DM Sans / Source
  Sans 3 / JetBrains Mono type stack — applied across a functioning
  app shell.
- A persistent sidebar with three navigation zones (MAINFRAME,
  PROJECTS, SYSTEM) plus Settings and Feedback links, matching the
  navigation model from `docs/sitemap.md`.
- A header bar with a search trigger (`⌘K` placeholder), notifications
  bell placeholder, and user menu placeholder.
- A content area that renders a placeholder page for each defined
  route.
- A working light/dark theme toggle that switches between the
  Polychromie light and dark token sets.
- The punch-card chamfer rendering correctly on sample task card and
  code block elements.
- All existing tests passing, plus new tests for the layout shell and
  sidebar.

This is the "build the room" milestone. Everything else in the mockup
is furniture placed inside this room.

## Constraints

- The existing test suite (`bun run ff`) must pass at every commit.
  No regressions.
- File paths follow the existing convention: features under
  `src/app/features/`, layout under `src/app/layout/`, routes under
  `src/app/routes/`, providers under `src/app/providers/`.
- No file may exceed 400 lines (per `AGENTS.md`).
- All user-visible strings must go through i18next/Fluent
  (`useTranslation` hook), even if only English translations exist
  initially.
- Design tokens must be the single source of truth for colour,
  spacing, and typography values. Components must not hard-code hex
  values or pixel sizes that should come from tokens.
- WCAG 2.2 AA compliance: text contrast 4.5:1, non-text 3:1, focus
  appearance 3px/3:1, target size 24×24 minimum.
- en-GB-oxendict spelling in comments and documentation.
- Commit messages in imperative mood, gated by `bun run ff`.

### Technology stack

The checked-in stack is documented in `docs/v2a-front-end-stack.md`.
Plan-specific technology references are noted in each plan's
constraints; the following apply everywhere.

- **Styling**: Tailwind CSS v4 with DaisyUI v5. Use semantic class
  composition per
  `docs/semantic-tailwind-with-daisyui-best-practice.md` and
  `docs/enforcing-semantic-tailwind-best-practice.md`. Tailwind v4
  patterns are documented in `docs/tailwind-v4-guide.md`; DaisyUI v5
  components in `docs/daisyui-v5-guide.md`. Migration notes (v3 → v4)
  are in `docs/tailwind-v3-v4-migration-guide.md`.
- **Component primitives**: Radix UI for all interactive behaviours
  (dialogs, popovers, tabs, switches, sliders, selects, accordions,
  toasts). DaisyUI classes provide visual presentation atop Radix
  primitives. See
  `docs/pure-accessible-and-localizable-react-components.md`.
- **Framework**: React 19, bundled with Vite 5 (`@vitejs/plugin-react`
  for JSX and Fast Refresh). Bun is the package manager and script
  runner.
- **Routing**: TanStack Router. Route modules live under
  `src/app/routes/`; the route tree is assembled in
  `src/app/routes/route-tree.tsx`.
- **Design tokens**: Style Dictionary pipeline
  (`tokens/src/tokens.json` → `tokens/dist/tokens.css` +
  `tokens/dist/tailwind.theme.cjs`). The design language spec is
  `docs/corbusier-design-language.md`; the rendered component
  reference is `docs/corbusier-design-system.html`.
- **Icons**: `@tabler/icons-react` for primary iconography;
  `@radix-ui/react-icons` as supplement. Class composition with
  `clsx`.
- **Localization**: i18next with Fluent `.ftl` bundles
  (`i18next-fluent` + `i18next-fluent-backend`). Locale files in
  `public/locales/<locale>/common.ftl`.
- **Testing**: Bun for unit/component tests (Happy DOM + Testing
  Library), Vitest for a11y tests (`*.a11y.test.tsx`), Playwright +
  axe-core for E2E. See
  `docs/high-velocity-accessibility-first-component-testing.md`.
- **Linting and formatting**: Biome for formatting and lint. Semantic
  checks via Semgrep and Stylelint (`bun run semantic`). Strict
  TypeScript (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
- **Card architecture**: data-model-driven cards per
  `docs/data-model-driven-card-architecture.md`. Punch-card chamfer
  on moveable work units and machine-readable surfaces only, standard
  rounded corners elsewhere.
- **Responsive and accessible patterns**:
  `docs/building-accessible-and-responsive-progressive-web-applications.md`
  covers PWA, viewport, and assistive-technology considerations.

## Tolerances (exception triggers)

- Scope: if this plan requires changes to more than 25 files or 2,500
  lines of code (net), stop and escalate.
- Dependencies: if a new npm dependency is required beyond what is
  already in `package.json`, stop and escalate.
- Iterations: if tests still fail after 3 attempts at a fix, stop and
  escalate.
- Ambiguity: if the design language document and the example HTML files
  conflict on a visual detail, follow the design language document
  (`docs/corbusier-design-language.md`) and note the deviation in the
  Decision Log.

## Risks

- Risk: The existing token pipeline (`tokens/src/tokens.json` and
  Style Dictionary) uses a generic blue/teal palette that does not
  match the Polychromie Architecturale colours.
  Severity: high
  Likelihood: certain (confirmed by reading `tokens.json`)
  Mitigation: Replace the token source files with Corbusier palette
  values in Milestone 1. Rebuild tokens and verify the generated CSS
  picks up the new values.

- Risk: The existing DaisyUI theme names
  (`corbusier-mockup-day`/`night`) are wired into `ThemeProvider` and
  tests. Renaming or restructuring them could break existing tests.
  Severity: medium
  Likelihood: medium
  Mitigation: Keep the existing theme names but update their colour
  mappings to use the Polychromie tokens. Update tests that assert
  specific colour values.

- Risk: The `MobileShell` component wraps content in a phone-frame
  viewport. The Corbusier mockup is a desktop-first application with a
  sidebar. The `MobileShell` may need to be bypassed or replaced for
  the desktop layout.
  Severity: medium
  Likelihood: certain
  Mitigation: The desktop layout component (`AppShell`) will be the
  primary wrapper. `MobileShell` can remain in the codebase for
  potential mobile views but will not be used by the main route tree.

- Risk: Google Fonts (DM Sans, Source Sans 3, JetBrains Mono) may be
  slow to load or blocked in some environments.
  Severity: low
  Likelihood: low
  Mitigation: Use `font-display: swap` and declare system-ui
  fallbacks in the font stack. Fonts are non-blocking.

## Progress

- [x] (2026-03-11) Milestone 1: Design tokens — Polychromie Architecturale
- [x] (2026-03-11) Milestone 2: DaisyUI theme configuration (no changes needed — token pipeline handles it)
- [x] (2026-03-11) Milestone 3: Font stack and CSS foundation
- [x] (2026-03-11) Milestone 4: App shell layout (sidebar + header + content)
- [x] (2026-03-11) Milestone 5: Route tree scaffold (33 placeholder screens, 4 route segment files)
- [x] (2026-03-11) Milestone 6: Punch-card chamfer utility classes
- [x] (2026-03-11) Milestone 7: Tests and validation (11 new tests, all 37 passing)

## Surprises & discoveries

- Observation: Milestone 2 required no code changes.
  Evidence: DaisyUI theme registration is handled entirely by the token
  pipeline (`style-dictionary.js`), which generates `@plugin "daisyui/theme"`
  blocks in `tokens/dist/tokens.css`. No `tailwind.config.cjs` changes needed.
  Impact: One fewer commit; no risk of mis-wiring themes.

- Observation: Biome wants `lazyRouteComponent` calls collapsed to single lines.
  Evidence: Biome formatting rules collapse the multi-line `component:
  lazyRouteComponent(() => import("..."), "Name")` calls to a single line
  when they fit within the line length.
  Impact: Route files are more compact than initially written. Run `bun fmt`
  after writing route definitions.

- Observation: Stylelint enforces `color-no-hex` even inside CSS fallback values.
  Evidence: `var(--color-primary, #1a6e6e)` was rejected.
  Impact: Cannot use hex fallbacks in CSS custom property references. Use
  `var(--color-primary)` without fallback.

- Observation: The `SidebarLink` wrapper pattern is needed because TanStack
  Router's `Link` component type-checks `to` against registered routes.
  Evidence: TypeScript errors when using `<Link to="/projects">` before routes
  are registered.
  Impact: Created a thin wrapper that casts `to: string` props to bypass
  strict route typing.

## Decision log

- Decision: Map DaisyUI base-100/200/300 as lightest-to-darkest.
  Rationale: base-100 = lightest (cards/elevated surfaces), base-200 = main
  page background, base-300 = sidebar/muted areas. This follows DaisyUI's
  convention where base-100 is the primary content surface.
  Date/Author: 2026-03-11 / agent

- Decision: Use `useRouterState` for active route detection in Sidebar.
  Rationale: Simpler than `useMatchRoute` for prefix-based path matching.
  Allows both exact match (Dashboard) and prefix match (all other items).
  Date/Author: 2026-03-11 / agent

- Decision: Split route tree into 4 segment files.
  Rationale: The full route tree would exceed 400 lines if kept in one file.
  Splitting by zone (mainframe, project, system, settings) follows the
  feature-grouped convention and keeps each file under the limit.
  Date/Author: 2026-03-11 / agent

## Outcomes & retrospective

All 7 milestones delivered. The app shell renders with:

- Polychromie Architecturale colour palette (cream/charcoal surfaces, teal
  primary, terracotta secondary) across both light and dark themes.
- DM Sans / Source Sans 3 / JetBrains Mono font stack loaded from Google Fonts.
- Three-zone sidebar (MAINFRAME, PROJECTS, SYSTEM) with active-state highlighting.
- Header bar with search trigger, notifications, and user menu placeholders.
- 33 placeholder screens with i18n-ready titles across all sitemap routes.
- Punch-card chamfer utility classes with `corner-shape: bevel` and
  `clip-path` fallback.
- 37 passing unit tests (26 existing + 11 new) covering app shell, sidebar,
  and layout behaviour.

Gate results: `bun lint`, `bun check:types`, `bun test`, `bun run test:a11y`,
and `bun run semantic` all pass. The required E2E gate still fails due to
missing Playwright Chromium in WSL2 (known environment limitation), so this
plan remains partial.

## Context and orientation

### Repository state

The repository is a Vite + React 19 + TanStack Router SPA with
Tailwind CSS v4 and DaisyUI v5. The current route tree
(`src/app/routes/route-tree.tsx`) defines only two routes (`/` and
`/about`), both rendering placeholder screens wrapped in a
`MobileShell` (a phone-frame viewport component from a previous
project).

### Key files and their roles

- `tokens/src/tokens.json` — Style Dictionary source tokens.
  Currently holds a generic blue/teal palette. Must be replaced with
  the Polychromie Architecturale values.
- `tokens/src/themes/day.json`, `night.json` — DaisyUI theme
  definitions consumed by Style Dictionary. Must be rewritten for
  Corbusier light/dark themes.
- `tokens/build/style-dictionary.js` — The token build script.
  Generates `tokens/dist/tokens.css` and
  `tokens/dist/tailwind.theme.cjs`.
- `src/index.css` — Global CSS entry point. Imports tokens and
  Tailwind. Defines component-layer classes for global controls.
- `tailwind.config.cjs` — Tailwind config. Extends theme from
  generated tokens. Registers DaisyUI plugin.
- `src/app/app.tsx` — Root component. Wraps providers around the
  router.
- `src/app/providers/theme-provider.tsx` — Manages `data-theme`
  attribute. Theme names are `corbusier-mockup-day` and
  `corbusier-mockup-night`.
- `src/app/routes/route-tree.tsx` — Defines route tree. Currently
  two routes.
- `src/app/layout/mobile-shell.tsx` — Phone-frame viewport wrapper.
  Will be superseded by a new desktop `AppShell`.
- `src/app/layout/global-controls.tsx` — Floating theme/display
  toggle. Will be simplified or integrated into the header.
- `docs/corbusier-design-language.md` — The authoritative design
  specification. Section 6 contains all token values.
- `docs/corbusier-design-system.html` — A self-contained HTML
  reference rendering the design system components. Use as a visual
  reference.

### Terms

- **Polychromie Architecturale**: Le Corbusier's architectural colour
  system. The source of the application's palette.
- **Punch-card chamfer**: A 45° bevel on the top-right corner of task
  cards and code blocks, implemented with `corner-shape: bevel` (CSS
  Backgrounds Level 4) with a `clip-path` fallback.
- **App shell**: The persistent layout frame (sidebar + header +
  scrollable content area) that wraps every page.
- **DaisyUI theme**: A set of CSS custom properties (prefixed
  `--b1`, `--bc`, `--p`, etc.) that DaisyUI components consume for
  colour. Defined as JSON in `tokens/src/themes/`.

## Plan of work

### Milestone 1: Design tokens — Polychromie Architecturale

Replace the generic token palette with the Corbusier design language
values from `docs/corbusier-design-language.md` section 6.1.

Edit `tokens/src/tokens.json` to define the Polychromie colour
families:

- Surfaces: `surface-base`, `surface-elevated`, `surface-code`,
  `surface-sidebar`, `surface-overlay`
- Text: `text-primary`, `text-secondary`, `text-tertiary`,
  `text-on-accent`
- Accents: `accent-primary` (teal family), `accent-action`
  (terracotta family), plus hover and subtle variants
- State: `state-success` (olive), `state-warning` (dusty copper),
  `state-error` (deep terracotta), `state-info` (slate), plus subtle
  variants
- Borders: `border-default`, `border-strong`
- Focus: `focus-ring`

Also update the spacing, radius, and typography tokens to match the
design spec (base unit 4px, `--space-1` through `--space-12`; radius
`sm`/`md`/`lg`/`pill`; font families for display, body, and mono).

Edit `tokens/src/themes/day.json` and `tokens/src/themes/night.json`
to map semantic DaisyUI colour slots (`base-100`, `base-200`,
`base-300`, `base-content`, `primary`, `primary-content`, `secondary`,
`accent`, `neutral`, `info`, `success`, `warning`, `error`) to the
Polychromie values.

Run `bun run tokens:build` and verify the generated
`tokens/dist/tokens.css` contains the new custom properties.

**Validation**: Open the design system HTML reference
(`docs/corbusier-design-system.html`) alongside the dev server output.
The generated CSS variables should produce the same colour values as
the reference. Run `bun run ff` — all existing tests must still pass.

### Milestone 2: DaisyUI theme configuration

The DaisyUI plugin in `tailwind.config.cjs` must expose the Corbusier
light and dark themes. Update `tailwind.config.cjs` to:

- Register the two themes (`corbusier-mockup-day` and
  `corbusier-mockup-night`) with explicit DaisyUI colour mappings
  derived from the token build output.
- Set `darkTheme` to `corbusier-mockup-night`.
- Configure DaisyUI to use only these two themes (no default DaisyUI
  themes).

The `ThemeProvider` in `src/app/providers/theme-provider.tsx` already
uses these theme names, so no change is needed there unless the token
build output changes the theme registration mechanism.

**Validation**: Start the dev server. Toggle the theme. The background
colour should shift from warm cream (`#E8E2D8`) to dark teal-charcoal
(`#1C2426`). Text colours should invert accordingly. Run `bun run ff`.

### Milestone 3: Font stack and CSS foundation

Update `src/index.css` to:

1. Import Google Fonts for DM Sans, Source Sans 3, and JetBrains
   Mono (or configure them via the Vite HTML template `index.html`).
2. Set the base font family to Source Sans 3 (body) via the
   `:root` rule.
3. Define CSS custom properties for the three font families:
   `--font-display`, `--font-body`, `--font-mono`.
4. Define the punch-card chamfer clip sizes as custom properties:
   `--clip-sm` (8px), `--clip-md` (12px), `--clip-lg` (16px),
   `--clip-xl` (20px).
5. Define transition speed tokens: `--transition-fast` (100ms),
   `--transition-base` (150ms), `--transition-slow` (200ms).
6. Set global focus-visible styles: 3px solid teal outline, 2px
   offset.

Update `index.html` to add the Google Fonts `<link>` preconnect and
stylesheet tags (matching the design system HTML reference).

**Validation**: Inspect the rendered page in the browser. Body text
should render in Source Sans 3. Headings in DM Sans. Monospace
elements in JetBrains Mono. Focus rings should be teal. Run
`bun run ff`.

### Milestone 4: App shell layout (sidebar + header + content)

Create the primary layout components:

**`src/app/layout/app-shell.tsx`** — The desktop app shell. A flex
container with:

- A fixed-width sidebar (240px) on the inline-start side.
- A vertical stack on the inline-end side containing the header bar
  and a scrollable content area.
- The sidebar and header are persistent; the content area renders the
  route outlet.

**`src/app/layout/sidebar.tsx`** — The sidebar navigation. Three
zones with condensed uppercase labels (`MAINFRAME`, `PROJECTS`,
`SYSTEM`), matching the navigation model in `docs/sitemap.md`:

- MAINFRAME: Dashboard, My Tasks, AI Suggestions (with Lucide/Tabler
  icons).
- PROJECTS: A "New Directive" link, plus three fixture projects
  (Apollo-Guidance, Manhattan-Logistics, Skunkworks-Alpha) with
  active/inactive status dots.
- SYSTEM: Personnel, Reports, Agent Backends, Tool Registry, Hooks &
  Policies, Monitoring, Tenant Management.
- Below the zones: Settings and Feedback links.

Each sidebar item is a `<Link>` (TanStack Router) or `<a>` with
active-state styling (teal left border, bold text, background
highlight).

**`src/app/layout/header-bar.tsx`** — The top header bar. Contains:

- The page title (dynamic, derived from the current route).
- A search trigger button (placeholder, labelled "Search Directives"
  with `⌘K` hint).
- A notifications bell icon (placeholder, with a count badge).
- A user avatar/menu trigger (placeholder).

**`src/app/layout/layout.tsx`** — A barrel file that re-exports
layout components.

Update `src/app/routes/root-route.tsx` to render `<AppShell>` instead
of just `<Outlet />` + `<GlobalControls />`.

The `GlobalControls` floating panel can be retained temporarily for
the theme toggle until it is integrated into the header or settings
page.

**Validation**: Start the dev server. The sidebar should be visible on
the left with three labelled zones. Clicking navigation items should
change the URL (routes won't render real content yet — placeholder
pages are fine). The header should show at the top. The content area
should fill the remaining space. Run `bun run ff`.

### Milestone 5: Route tree scaffold

Expand the route tree (`src/app/routes/route-tree.tsx`) to define
every route from the sitemap. Each route renders a minimal placeholder
component that displays the page name and breadcrumb.

Create placeholder screen components under
`src/app/features/<section>/` grouped by feature:

- `src/app/features/dashboard/dashboard-screen.tsx` — `/`
- `src/app/features/tasks/tasks-screen.tsx` — `/tasks`
- `src/app/features/tasks/task-detail-screen.tsx` — `/tasks/:id`
- `src/app/features/suggestions/suggestions-screen.tsx` —
  `/suggestions`
- `src/app/features/projects/projects-screen.tsx` — `/projects`
- `src/app/features/projects/project-landing-screen.tsx` —
  `/projects/:slug`
- `src/app/features/projects/kanban-screen.tsx` —
  `/projects/:slug/kanban`
- `src/app/features/projects/backlog-screen.tsx` —
  `/projects/:slug/backlog`
- `src/app/features/projects/calendar-screen.tsx` —
  `/projects/:slug/calendar`
- `src/app/features/projects/list-screen.tsx` —
  `/projects/:slug/list`
- `src/app/features/projects/timeline-screen.tsx` —
  `/projects/:slug/timeline`
- `src/app/features/projects/task-detail-project-screen.tsx` —
  `/projects/:slug/tasks/:id`
- `src/app/features/projects/task-deps-screen.tsx` —
  `/projects/:slug/tasks/:id/dependencies`
- `src/app/features/conversations/conversations-screen.tsx` —
  `/projects/:slug/conversations`
- `src/app/features/conversations/conversation-detail-screen.tsx` —
  `/projects/:slug/conversations/:id`
- `src/app/features/directives/directives-screen.tsx` —
  `/projects/:slug/directives`
- `src/app/features/system/personnel-screen.tsx` —
  `/system/personnel`
- `src/app/features/system/user-detail-screen.tsx` —
  `/system/personnel/:id`
- `src/app/features/system/reports-screen.tsx` — `/system/reports`
- `src/app/features/system/agents-screen.tsx` — `/system/agents`
- `src/app/features/system/agent-detail-screen.tsx` —
  `/system/agents/:id`
- `src/app/features/system/tools-screen.tsx` — `/system/tools`
- `src/app/features/system/tool-detail-screen.tsx` —
  `/system/tools/:id`
- `src/app/features/system/hooks-screen.tsx` — `/system/hooks`
- `src/app/features/system/hook-detail-screen.tsx` —
  `/system/hooks/:id`
- `src/app/features/system/monitoring-screen.tsx` —
  `/system/monitoring`
- `src/app/features/system/tenants-screen.tsx` — `/system/tenants`
- `src/app/features/settings/settings-screen.tsx` — `/settings`
- `src/app/features/settings/auth-screen.tsx` — `/settings/auth`
- `src/app/features/settings/workspace-screen.tsx` —
  `/settings/workspace`
- `src/app/features/settings/integrations-screen.tsx` —
  `/settings/integrations`
- `src/app/features/settings/appearance-screen.tsx` —
  `/settings/appearance`

Each placeholder component is a `<main>` element with an `<h1>`
displaying the page name. The route tree file will grow large, so
split it: `route-tree.tsx` imports route segments from
`routes/mainframe-routes.ts`, `routes/project-routes.ts`,
`routes/system-routes.ts`, `routes/settings-routes.ts`.

**Validation**: Navigate to every route in the browser. Each should
render its placeholder heading inside the app shell. The sidebar
should highlight the correct active item. Run `bun run ff`.

### Milestone 6: Punch-card chamfer utility classes

Add the chamfer CSS to `src/index.css` in the `@layer components`
block, matching the implementation from
`docs/corbusier-design-language.md` section 6.4 and the design system
HTML reference:

- `.chamfer-sm`, `.chamfer-md`, `.chamfer-lg`, `.chamfer-xl` — top-
  right bevel using `corner-shape: bevel` with `clip-path` fallback.
- `.chamfer-reversed-sm`, `.chamfer-reversed-md` — top-left bevel
  for blocked states.

Create a small demo section on the dashboard placeholder page showing
a sample task card and code block with the chamfer applied, to
visually verify the implementation.

**Validation**: Open the dashboard in Chrome 139+ (or Edge 139+).
Task cards should show a bevelled top-right corner. In Firefox, the
`clip-path` fallback should produce the same visual shape. Run
`bun run ff`.

### Milestone 7: Tests and validation

Add or update tests:

- **`tests/app-shell.test.tsx`** — Renders `AppShell` with a child
  element. Asserts the sidebar landmark (`<nav>`) is present, the
  three zone labels are rendered, and the content area contains the
  child.
- **`tests/sidebar.test.tsx`** — Renders `Sidebar`. Asserts all
  three zones (MAINFRAME, PROJECTS, SYSTEM) are present. Asserts
  navigation items match the expected labels. Asserts active-state
  styling applies to the correct item for a given route.
- **`tests/e2e/app-shell.pw.ts`** — Playwright test that navigates
  to `/`, verifies the sidebar is visible, clicks "My Tasks", and
  verifies the URL changes to `/tasks`.
- **`tests/e2e/a11y.pw.ts`** — Update the existing Playwright
  accessibility sweep to cover the dashboard route with axe-core.
- Update any existing tests that break due to the layout change
  (e.g., tests that expected `MobileShell` wrapping).

Run the full gate:

```bash
bun run ff
```

Expected: all tests pass, no lint errors, no type errors, Tailwind
compiles cleanly, Playwright axe sweep reports no violations at
WCAG 2.2 AA.

## Concrete steps

All commands run from the repository root.

### Milestone 1

1. Edit `tokens/src/tokens.json` — replace the colour, font, radius,
   and space sections with Polychromie Architecturale values.
2. Edit `tokens/src/themes/day.json` — rewrite semantic mappings for
   light theme.
3. Edit `tokens/src/themes/night.json` — rewrite semantic mappings
   for dark theme.
4. Run `bun run tokens:build`. Expected: exits 0, files generated in
   `tokens/dist/`.
5. Run `bun run ff`. Expected: all tests pass.
6. Commit: "Replace design tokens with Polychromie Architecturale
   palette"

### Milestone 2

1. Edit `tailwind.config.cjs` — register Corbusier DaisyUI themes.
2. Run `bun run ff`. Expected: all tests pass.
3. Commit: "Configure DaisyUI themes for Corbusier light and dark"

### Milestone 3

1. Edit `index.html` — add Google Fonts link tags.
2. Edit `src/index.css` — add font family properties, chamfer size
   properties, transition tokens, and global focus styles.
3. Run `bun run ff`. Expected: all tests pass.
4. Commit: "Add Corbusier font stack and CSS foundation tokens"

### Milestone 4

1. Create `src/app/layout/app-shell.tsx`.
2. Create `src/app/layout/sidebar.tsx`.
3. Create `src/app/layout/header-bar.tsx`.
4. Edit `src/app/routes/root-route.tsx` — render `AppShell`.
5. Run `bun run ff`. Expected: existing tests may need adjustment for
   the new layout wrapper.
6. Fix any broken tests.
7. Commit: "Add app shell layout with sidebar and header"

### Milestone 5

1. Create placeholder screen components under
   `src/app/features/<section>/`.
2. Create route segment files under `src/app/routes/`.
3. Edit `src/app/routes/route-tree.tsx` — assemble full route tree.
4. Run `bun run ff`. Expected: all tests pass.
5. Commit: "Scaffold all sitemap routes with placeholder screens"

### Milestone 6

1. Edit `src/index.css` — add chamfer utility classes.
2. Add a visual chamfer demo to the dashboard placeholder.
3. Run `bun run ff`. Expected: all tests pass.
4. Commit: "Add punch-card chamfer utility classes"

### Milestone 7

1. Create `tests/app-shell.test.tsx`.
2. Create `tests/sidebar.test.tsx`.
3. Create or update `tests/e2e/app-shell.pw.ts`.
4. Update `tests/e2e/a11y.pw.ts`.
5. Fix any remaining test failures.
6. Run `bun run ff`. Expected: all tests pass.
7. Commit: "Add layout shell and sidebar tests"

## Validation and acceptance

**Quality criteria:**

- Tests: `bun test` passes with ≥ current test count plus new layout
  and sidebar tests. `bun run test:a11y` passes. `bun test:e2e`
  passes including axe sweep.
- Lint/typecheck: `bun lint` and `bun check:types` report zero
  errors.
- Visual: the dev server renders the app shell with Polychromie
  colours, correct fonts, and working theme toggle.
- Accessibility: Playwright axe sweep should report zero WCAG 2.2 AA
  violations on the dashboard route once the Playwright environment is
  available.

**Quality method:**

```bash
bun run ff
```

This single command runs the Tailwind compilation check, all unit
tests, accessibility tests, lint, type-check, Fluent variable
validation, semantic lint, and Playwright E2E tests. Completion stays
partial until the Playwright portion succeeds.

## Idempotence and recovery

Every milestone produces a commit. If a milestone fails partway
through, discard uncommitted changes (`git checkout -- .`) and retry
from the last successful commit.

The token build (`bun run tokens:build`) is idempotent — running it
again produces identical output for the same inputs.

## Artifacts and notes

### Token value reference (light theme)

From `docs/corbusier-design-language.md` section 6.1:

```plaintext
Surface base:     #E8E2D8
Surface elevated: #F4F0EA
Surface code:     #DED8CC
Surface sidebar:  #D5CFC4
Text primary:     #1C3340
Text secondary:   #5A5A58
Text tertiary:    #8A8478
Accent primary:   #1A6E6E (teal)
Accent action:    #BF6C4B (terracotta)
State success:    #5A6B48 (olive)
State warning:    #B08878 (dusty copper)
State error:      #A04535 (deep terracotta)
State info:       #6B7A8A (slate)
Border default:   #C5BDB0
Border strong:    #9A9480
```

### Token value reference (dark theme)

```plaintext
Surface base:     #1C2426
Surface elevated: #262D30
Surface code:     #1A2022
Surface sidebar:  #212829
Text primary:     #E8E2D8
Text secondary:   #B5ADA2
Accent primary:   #3AADAD
Accent action:    #D4805E
State success:    #7A9060
State warning:    #C49A88
State error:      #C65A48
State info:       #8A9AAA
Border default:   #333A3C
Border strong:    #4A5254
```

## Interfaces and dependencies

No new npm dependencies are required. All work uses existing packages:

- `@tanstack/react-router` for route definitions
- `@tabler/icons-react` for sidebar icons
- `clsx` for conditional class composition
- `react-i18next` for string translation
- `daisyui` + `tailwindcss` for styling
- `style-dictionary` for token generation

### Component interfaces

In `src/app/layout/app-shell.tsx`:

```tsx
interface AppShellProps {
  readonly children: React.ReactNode;
}
export function AppShell(props: AppShellProps): JSX.Element;
```

In `src/app/layout/sidebar.tsx`:

```tsx
export function Sidebar(): JSX.Element;
```

In `src/app/layout/header-bar.tsx`:

```tsx
export function HeaderBar(): JSX.Element;
```
