# Settings, command palette, and global elements

This ExecPlan (execution plan) is a living document. The sections
`Constraints`, `Tolerances`, `Risks`, `Progress`, `Surprises &
Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be
kept up to date as work proceeds.

Status: DRAFT

## Purpose / big picture

After this plan is complete, the mockup is feature-complete against
the sitemap. A developer can:

- **`/settings`** — See Profile & Preferences with form fields for
  display name, email, avatar, and notification preferences.
- **`/settings/auth`** — See API key management (table of keys with
  generate/revoke controls) and active session list.
- **`/settings/workspace`** — See workspace defaults: encapsulation
  provider, resource limits, tool policy selectors.
- **`/settings/integrations`** — See VCS provider configuration cards
  (GitHub/GitLab) and Frankie review adapter settings.
- **`/settings/appearance`** — See theme toggle (light/dark), layout
  density selector, and notification preference controls. This is
  where the existing `GlobalControls` theme toggle logic gets a
  permanent home.
- **Press `⌘K`** — See a command palette overlay searching tasks,
  conversations, commands, and projects, matching the design system
  reference.
- **Click the notifications bell** — See a dropdown with recent
  notification entries (task assignments, hook failures, PR reviews).
- **Click the user avatar** — See a dropdown menu with profile link,
  tenant display, and sign out action.

This plan also includes the Sign In page as a standalone route
outside the authenticated shell, matching
`example_html/12-Sign In.html`.

## Constraints

- All constraints from `01-foundation.md` apply (including the
  technology stack section — Tailwind v4, DaisyUI v5, Radix UI, etc.).
- Settings forms use DaisyUI form components (`input`, `select`,
  `toggle`, `range`) styled with Tailwind v4 utilities
  (`docs/daisyui-v5-guide.md`, `docs/tailwind-v4-guide.md`). Radix
  UI primitives (`@radix-ui/react-switch`, `@radix-ui/react-slider`)
  provide accessible interactive behaviour.
- The command palette must be keyboard-accessible: focus-trapped, `↑↓`
  to navigate, `↵` to open, `Escape` to close. Implement with
  `@radix-ui/react-dialog` for the overlay and focus trap.
- Settings forms use the design system form input styles: labels
  above, always visible, focus rings in teal, error states with
  icon + colour + text.
- The command palette search is a static filtered list over fixture
  data — no actual fuzzy matching library needed. A simple
  `String.includes()` filter is sufficient.
- The sign-in page is a standalone page without the app shell sidebar.
  It should be visually striking, using the Corbusier palette as a
  branded entry point.

## Tolerances (exception triggers)

- Scope: if implementation requires more than 20 new files or 2,500
  lines of code (net), stop and escalate.
- Dependencies: no new npm dependencies.
- Iterations: if tests still fail after 3 attempts, stop and
  escalate.

## Risks

- Risk: Integrating the command palette with global keyboard shortcut
  (`⌘K`) requires event listener management that could conflict with
  other keyboard handlers.
  Severity: low
  Likelihood: low
  Mitigation: Use a single `useEffect` in the command palette
  provider that listens for `Cmd+K` / `Ctrl+K` and prevents default.
  The palette is a singleton at the root level.

- Risk: The existing `GlobalControls` component has its own theme
  toggle logic. Moving theme controls to the Appearance settings page
  may break the floating toggle.
  Severity: low
  Likelihood: medium
  Mitigation: Keep `GlobalControls` as a development-time floating
  panel (it is useful for quick theme switching during development).
  The Appearance settings page is the "production" location for theme
  controls. Both use the same `ThemeProvider` context.

## Progress

- [ ] Milestone 1: Command palette
- [ ] Milestone 2: Notifications dropdown
- [ ] Milestone 3: User menu dropdown
- [ ] Milestone 4: Settings pages
- [ ] Milestone 5: Sign In page
- [ ] Milestone 6: Tests and validation

## Surprises & discoveries

(None yet.)

## Decision log

(None yet.)

## Outcomes & retrospective

(To be completed when the plan is done.)

## Context and orientation

This plan depends on all previous plans (01–06). The app shell header
bar from plan 01 is updated to wire the command palette trigger,
notifications bell, and user menu into functional components. Settings
pages use the form input components from the design system.

### Key files this plan creates

- `src/app/features/command-palette/command-palette.tsx` — The ⌘K
  overlay.
- `src/app/features/command-palette/command-palette-provider.tsx` — A
  context provider that manages open/close state and the global
  keyboard shortcut.
- `src/app/layout/notifications-dropdown.tsx` — Bell dropdown.
- `src/app/layout/user-menu.tsx` — Avatar dropdown.
- `src/app/features/settings/settings-screen.tsx` — Profile form.
- `src/app/features/settings/auth-screen.tsx` — API keys and
  sessions.
- `src/app/features/settings/workspace-screen.tsx` — Workspace
  defaults.
- `src/app/features/settings/integrations-screen.tsx` — VCS and
  review config.
- `src/app/features/settings/appearance-screen.tsx` — Theme, density,
  notifications.
- `src/app/features/auth/sign-in-screen.tsx` — Sign-in page.
- `src/data/notifications.ts` — Fixture notification entries.

## Plan of work

### Milestone 1: Command palette

Create the command palette:

- **Provider** (`command-palette-provider.tsx`): wraps the app. Stores
  open/close state. Registers a global `keydown` listener for `⌘K` /
  `Ctrl+K`.
- **Palette** (`command-palette.tsx`): uses `@radix-ui/react-dialog`
  for the modal overlay. Contains a search input and a scrollable
  results list.
- Results are grouped: Tasks, Conversations, Commands, Projects. Each
  group has a label and items showing icon, text, and metadata (task
  ID, command name, etc.).
- Filtering: the search input filters the combined list using case-
  insensitive `includes()` on the item text.
- Keyboard navigation: `↑↓` moves the active item highlight, `↵`
  navigates to the selected item (using TanStack Router `navigate`),
  `Escape` closes.
- Footer shows keyboard hint badges: `↑↓ Navigate`, `↵ Open`,
  `esc Close`.

Wire the provider into `src/app/app.tsx` above the router. Update the
header bar search trigger button to open the palette.

### Milestone 2: Notifications dropdown

Create `src/app/layout/notifications-dropdown.tsx`:

- Uses `@radix-ui/react-popover` for the dropdown.
- Trigger is a bell icon button with a count badge (showing the
  number of unread notifications from fixture data).
- Dropdown shows a scrollable list of recent notifications: icon,
  text, and timestamp. Types include task assignments, hook failures,
  and PR reviews.

Create `src/data/notifications.ts` with 5–8 fixture notifications.

Wire into the header bar.

### Milestone 3: User menu dropdown

Create `src/app/layout/user-menu.tsx`:

- Uses `@radix-ui/react-dropdown-menu`.
- Trigger is a circular avatar with initials (from fixture user data).
- Dropdown shows: user name and email, a "Profile" link to
  `/settings`, a tenant display line, and a "Sign out" action.

Wire into the header bar.

### Milestone 4: Settings pages

Replace all settings placeholders:

- **Profile** (`/settings`): Form with display name, email, avatar
  upload placeholder, and notification preference toggles (using
  `@radix-ui/react-switch`).
- **Auth** (`/settings/auth`): A data table of API keys (name, key
  prefix, created date, last used) with "Generate" and "Revoke"
  buttons. An active sessions table (device, IP, last active) with
  "Revoke" buttons.
- **Workspace** (`/settings/workspace`): Select inputs for
  encapsulation provider, resource limit sliders (CPU, memory, disk,
  timeout using `@radix-ui/react-slider`), and a tool policy
  selector (allowed tools checklist, file edit policy radio buttons).
- **Integrations** (`/settings/integrations`): Cards for GitHub and
  GitLab with OAuth config fields (client ID, secret, webhook URL).
  A card for Frankie review adapter connection settings.
- **Appearance** (`/settings/appearance`): Theme toggle (wired to
  `ThemeProvider`), layout density selector (compact/comfortable/
  spacious — visual only), and SSE reconnection preference toggle.

### Milestone 5: Sign In page

Create `src/app/features/auth/sign-in-screen.tsx`:

- A full-page layout without the sidebar (renders outside the
  `AppShell`).
- Centred card with the Corbusier logo/wordmark, a "Sign in" heading,
  email and password inputs, a "Sign in" terracotta action button, and
  a "Forgot password?" link.
- Background uses the warm cream surface colour with a subtle
  decorative element (the teal accent as a geometric shape or border).

Add a `/sign-in` route to the route tree, rendered outside the root
layout (no sidebar/header).

### Milestone 6: Tests and validation

- Component test for command palette: renders, filters results, closes
  on Escape.
- Component test for notifications dropdown: renders notification
  count, opens on click.
- Component test for sign-in page rendering form fields.
- Playwright E2E: press `Ctrl+K`, verify palette opens, type a
  search term, verify results filter.
- Playwright axe sweep on command palette, settings pages, and
  sign-in page.
- `bun run ff` must pass.

## Validation and acceptance

**Quality criteria:**

- `⌘K` opens the command palette with search and keyboard navigation.
- Notifications bell shows count and dropdown.
- User menu shows profile link and sign-out action.
- All five settings pages render with form inputs matching the design
  system.
- Sign-in page renders outside the app shell.
- All `bun run ff` checks pass.
- Full Playwright axe sweep passes on all new routes at WCAG 2.2 AA.

**Quality method:**

```bash
bun run ff
```

## Idempotence and recovery

Each milestone produces a commit. Retry from last commit on failure.

## Interfaces and dependencies

No new npm dependencies. Uses existing Radix UI packages:
`@radix-ui/react-dialog` (command palette), `@radix-ui/react-popover`
(notifications), `@radix-ui/react-dropdown-menu` (user menu),
`@radix-ui/react-switch` and `@radix-ui/react-slider` (settings
forms).
