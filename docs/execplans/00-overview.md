# Corbusier mockup implementation — overview

This document is a navigation index for the ExecPlans that together
deliver the Corbusier front-end mockup. Each ExecPlan is a
self-contained, living document that can be executed independently once
its predecessors are complete.

Status: DRAFT

## Delivery order

The plans are numbered to reflect dependency order. Each plan produces
observable, testable output before the next begins.

1. **`01-foundation.md`** — Design system integration, layout shell,
   sidebar navigation, and theme toggle. Establishes the visual
   identity (Polychromie Architecturale tokens, DaisyUI theme, fonts,
   punch-card chamfer) and the persistent app shell (sidebar +
   header + content area) that all subsequent pages mount into.

2. **`02-dashboard-and-tasks.md`** — Dashboard (`/`), My Tasks
   (`/tasks`), Task Detail (`/tasks/:id`), and the Task Dependencies
   view (`/projects/:slug/tasks/:id/dependencies`). These are the
   densest pages in the application and exercise the most design system
   components (KPI cards, status badges, timelines, dependency panels,
   state machine controls).

3. **`03-projects-and-kanban.md`** — Project List (`/projects`),
   Project Landing (`/projects/:slug`), Kanban Board
   (`/projects/:slug/kanban`), and the remaining project sub-views
   (Backlog, Calendar, List, Timeline). Introduces the Kanban card
   family, view switcher, and drag-and-drop placeholder.

4. **`04-conversations-and-directives.md`** — Conversation List and
   Detail (`/projects/:slug/conversations`, `.../conversations/:id`),
   and the Directives registry (`/projects/:slug/directives`). Builds
   the chat-style message timeline, tool execution cards, agent status
   badges, slash-command input, and handoff annotations.

5. **`05-ai-suggestions.md`** — AI Suggestions page (`/suggestions`).
   Implements the suggestion card family, confidence scoring, priority
   grouping, and the AI Insights panel.

6. **`06-system-pages.md`** — All pages under `/system`: Personnel,
   Reports, Agent Backends, Tool Registry, Hooks & Policies,
   Monitoring, and Tenant Management. These are administrative views
   with tables, registry cards, dashboard panels, and hook editors.

7. **`07-settings-and-global.md`** — Settings pages (`/settings/*`),
   the command palette (`⌘K`), notifications bell, and any remaining
   global elements (help, feedback, sign-in screen).

## Cross-cutting concerns tracked across all plans

- **Accessibility**: WCAG 2.2 AA throughout. Every page tested with
  axe-core in Playwright, keyboard navigation verified, focus styles
  confirmed. See the design language accessibility risk register.
- **Design language adherence**: All pages must use the Polychromie
  Architecturale colour tokens, the specified type scale (DM Sans /
  Source Sans 3 / JetBrains Mono), and the punch-card chamfer on
  moveable work units and machine-readable surfaces only.
- **i18n readiness**: All user-visible strings go through i18next /
  Fluent. RTL layout support maintained.
- **Test coverage**: Each page gets at least one component test (bun
  test) and one accessibility test (vitest a11y or Playwright axe
  sweep). The `bun run ff` gate must pass after each plan completes.
- **Mock data**: All data is static fixture data — no backend. Fixture
  files live under `src/data/` and model the domain entities described
  in `docs/concept.md`.

## How to use these plans

Start with `01-foundation.md`. Complete it fully (all validation
passing) before moving to the next. Each plan names the exact files to
create or edit, the commands to run, and the outputs to expect.

When the user approves a plan, implement it milestone by milestone.
Commit after each milestone. Run `bun run ff` before each commit.
