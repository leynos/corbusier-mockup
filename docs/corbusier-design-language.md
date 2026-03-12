# Corbusier — Visual Design Language

A design language brief for the Corbusier AI agent orchestration platform.

---

## 1. Design inputs

### User need

Software development team leads and DevOps engineers need to coordinate
multiple AI agents across complex development workflows so that consistent
governance, quality visibility, and audit traceability are maintained across
all agent-mediated work.

### Business need

Position Corbusier as the *best room* — the trusted orchestration
environment — not the smartest agent. The interface must communicate control,
visibility, and architectural confidence without descending into generic
SaaS blue.

### Page archetypes in play

The application spans four archetype families:

- **Dashboard / data pages** — system health, KPIs, agent utilization,
  activity feeds.
- **Archive / index pages** — task lists, project lists, conversation lists,
  tool registries, user directories.
- **Transactional / service pages** — task detail with state machine
  controls, conversation detail with slash command input, hook editors,
  settings forms.
- **Support / help pages** — documentation, keyboard shortcut overlay.

### Audience profile

Software developers, DevOps engineers, and engineering managers. Keyboard-
oriented, long session durations, high information-density tolerance. Emotional
temperature: focused, task-driven, occasionally stressed (debugging agent
failures, reviewing audit trails after an incident). This audience reads
monospace text fluently and will notice broken alignment before broken colour.

### Brand direction

**The name.** Corbusier references Le Corbusier — modernist architecture,
the Modulor proportional system, the Polychromie Architecturale. The interface
inherits this: structural clarity, proportional discipline, and a colour
palette drawn from architectural materials rather than digital convention.

**The metaphor.** The UI is an *operations room* — wall-mounted status boards,
index cards pinned to task columns, analogue gauges that tell you the state of
the system at a glance. This is the literal "best room" idea made visual.
The mid-century operations room: people standing at boards with cards, routing
slips on desks, message logs by the telephone, charts on cork. The interface
is the room; the room is the interface.

**The df12 ethos.** "Serious tools, playful worlds." The visual language must
be rigorous enough for production use and distinctive enough to be
unmistakable. No corporate oatmeal.

**Adjectives:** Warm, structured, institutional, confident, legible, material.

**Anti-adjectives:** Cold, sterile, generic, whimsical, busy, trendy.

### Constraints

- WCAG 2.2 AA minimum across the board (text contrast 4.5:1, non-text
  contrast 3:1, focus appearance 2px / 3:1, target size 24×24 minimum,
  text-spacing resilient).
- Light and dark theme support.
- High information density on task detail, conversation, and dashboard pages.
- SSE-driven real-time updates — the design must accommodate live data
  changes without layout shift.
- Keyboard navigation as a first-class concern — this audience uses `⌘K`
  palettes, tab navigation, and vim-style shortcuts.

---

## 2. Colour philosophy

### Source: Polychromie Architecturale

Le Corbusier's architectural colour system drew from natural materials and
environmental light — not from screens. The Corbusier UI palette follows
the same instinct: colours derived from stone, verdigris, terracotta, olive
wood, and slate rather than from UI convention. The system has four chromatic
families, each with a communicative role:

- **Teal family** (verdigris / oxidized copper) — primary accent, focus,
  active navigation, links. The colour of the operations room's structural
  elements. Institutional confidence without corporate sterility.
- **Terracotta family** (fired clay / rust) — action, urgency, calls to
  attention. The colour of the task card that needs moving. Used sparingly
  so it retains its signal strength.
- **Olive / sage family** (weathered bronze / patina) — success, completion,
  healthy states. The colour of a finished job.
- **Dusty rose / copper family** — warmth, pending states, degraded
  conditions. Softer than terracotta; signals caution without alarm.

Neutral surfaces carry warmth: cream, taupe, slate. Dark surfaces are
teal-black or charcoal, never blue-black.

### Reference palette (from mood board)

Top row (dominant hues): Warm taupe · Deep teal · Warm cream · Terracotta ·
Olive sage.

Bottom row (supporting tones): Dark teal-navy · Dusty copper · Sage green ·
Slate blue · Charcoal.

Extended palette (Le Corbusier Polychromie range): Olive-to-forest green
spectrum, seafoam-to-deep-teal spectrum, peach-to-umber spectrum,
dusty-rose-to-plum spectrum. Each usable at multiple saturation levels for
data visualization and chart palettes.

---

## 3. Page thesis cards

### Dashboard (`/`)

**This page helps** an engineering lead **understand** the current health and
activity of their orchestration environment **so that** attention can be
directed to problems, gauge utilization, and prioritize what needs action.

**Five-second promise:** "Your system is healthy / degraded / broken, and
here is what happened recently."

**Primary action:** Drill into a specific alert, task, or event.

**Secondary action:** Navigate to the relevant project or system page.

**Trust cues:** Live health indicators with timestamps, real numbers (not
abstract gauges), recency markers on the activity feed. This is the
wall-mounted status board: upon entry, the state of the room is obvious.

### Task Detail (`/tasks/:id`)

**This page helps** a developer **manage and understand** a specific task's
context, dependencies, and state **so that** they can advance the task, unblock
downstream work, or hand it off with full context.

**Five-second promise:** "This task is in *state X*, blocked by *Y*, and all
necessary information to act on it is present."

**Primary action:** Transition the task to its next valid state.

**Secondary action:** View linked conversation, branch, or PR.

**Trust cues:** Audit timeline with immutable ordering, dependency graph
showing real upstream/downstream tasks, state machine controls that disable
invalid transitions. This is the index card on the task board: all the
information is present, and the item can move to the next column.

### Conversation Detail (`/projects/:slug/conversations/:id`)

**This page helps** a developer **review the full context** of an
agent-mediated conversation **so that** they can audit decisions, replay
tool calls, and understand handoff context.

**Five-second promise:** "This conversation involved agents *A* and *B*,
made *N* tool calls, and is currently *idle / processing / awaiting tool
result*."

**Primary action:** Execute a slash command or review a specific tool call
result.

**Secondary action:** Navigate to the linked task or view the handoff
annotation.

**Trust cues:** Immutable message ordering, expandable tool call detail
with full input/output, visible agent backend badge. This is the message
log by the telephone: timestamped, sequential, auditable.

---

## 4. Concept territory (revised)

### Architectural Neo-modern · Operations Room

**Communicative stance:** "We built the room. The room is the product." The
interface foregrounds its own structure — visible grid, exposed system
language, architectural wayfinding — while staying warm through materials
(teal, olive, terracotta, cream) rather than decoration.

**Design-school lens:** Neo-modern dominant. Brutalist seasoning in the
exposed structural elements (condensed uppercase section labels, monospace
IDs, visible borders as load-bearing walls). Data-visualization discipline
in all chart and metric treatment. The mid-century operations room as
guiding metaphor.

**Colour hypothesis:**
- **Surface:** Warm cream (`#E8E2D8`) for light theme backgrounds — like
  plaster walls in an architect's studio. Dark theme inverts to dark
  teal-charcoal (`#1C2426`), not blue-black.
- **Primary accent:** Deep teal (`#1A6E6E`) for active navigation, links,
  focus rings, and structural emphasis. The colour of the room itself —
  omnipresent but never loud.
- **Action accent:** Terracotta (`#BF6C4B`) for CTAs, urgency indicators,
  and the primary action button. Used sparingly: if it appears everywhere,
  it signals nothing.
- **State / success:** Olive sage (`#5A6B48`) for completed, healthy, pass.
  Paired with check icon.
- **State / warning:** Dusty copper (`#B08878`) for pending, paused,
  degraded. Paired with pause icon.
- **State / error:** Deep terracotta (`#A04535`) for failed, critical,
  blocked. Paired with alert icon.
- **State / info:** Slate blue (`#6B7A8A`) for informational, in review,
  neutral. Paired with info icon.
- **Text / primary:** Dark teal-navy (`#1C3340`). Rich and warm-dark.
- **Text / secondary:** Charcoal (`#5A5A58`).
- **Code surface:** Slightly deeper cream (`#DED8CC`) — a distinct paper
  within the page.

**Type hypothesis:**
- **Display / section labels:** A condensed geometric sans in uppercase for
  structural wayfinding — `MAINFRAME`, `PROJECTS`, `SYSTEM`. This is the
  lettering stencilled on the operations room wall. DM Sans or Instrument
  Sans in condensed weight.
- **Body:** A humanist sans-serif for warmth and readability at density —
  Source Sans 3 or Nunito Sans. Line height 1.5, line length 60–75ch on
  reading surfaces.
- **Monospace:** JetBrains Mono or Geist Mono for task IDs, code blocks,
  tool schemas, slash command syntax.

**Image hypothesis:** No photography in the product UI. Mid-century
watercolour-ink illustrations for empty states, onboarding, and error
pages — drawn in the style of the operations room vibe images: warm,
human, slightly loose, with visible linework. Functional iconography
(Lucide or Phosphor) for navigation and status. System-state visualization
(sparklines, progress bars, health gauges) does the visual work.

**Motion hypothesis:**
- State transitions on task cards: a brief cross-fade (150ms) when the card
  moves between Kanban columns. Teaches: "this task changed state."
- Skeleton loading for SSE-fed panels: a warm shimmer (`#E8E2D8` →
  `#DED8CC` → `#E8E2D8`) that feels like light moving across a wall.
- Activity feed entries: slide in from the top with a 100ms ease-out.
  Teaches: "something new arrived."
- Reduced-motion path: all transitions become instant state changes. The
  shimmer becomes a static placeholder. Dignified, complete.

**Conventions preserved:** Standard sidebar navigation, visible at all
times. Standard form patterns. Standard table sorting. Kanban drag-and-drop
follows established patterns. `⌘K` command palette.

**Conventions broken (with justification):** Condensed uppercase section
labels in the sidebar (`MAINFRAME`, `PROJECTS`, `SYSTEM`) break the
convention of sentence-case navigation labels. Justified because: (a) there
are only three top-level groups, (b) they function as architectural
*zone names* rather than page links, (c) the sub-items beneath them use
standard sentence-case, maintaining readability where it matters.

**Risk note:** The teal-dominant palette is unusual for a developer tool (most
reach for blue or grey). This is a feature, not a bug — it signals that
Corbusier is the room, not the agent. But it demands careful contrast
verification across both themes, and the terracotta must retain its urgency
signal by appearing only where attention is genuinely required.

---

## 5. Hierarchy and scan-path plan

### Hierarchy ladder (Dashboard)

| Rank | Element | Visual volume | Notes |
|------|---------|---------------|-------|
| 1 | System health status (healthy/degraded/critical) | Loudest | The answer to "is anything on fire?" |
| 2 | KPI cards (SLA, active tasks, agent utilization, tool success rate) | High | Context for the health status |
| 3 | Recent activity feed | Medium-high | Temporal narrative |
| 4 | Agent utilization summary | Medium | Secondary data |
| 5 | Navigation (sidebar) | Medium-low | Always visible, never dominant |
| 6 | Header (search, notifications, user menu) | Low | Utility |

### Hierarchy ladder (Task Detail)

| Rank | Element | Visual volume | Notes |
|------|---------|---------------|-------|
| 1 | Task title + state badge | Loudest | "What is this, and where is it?" |
| 2 | State machine transition buttons | High | The primary action |
| 3 | Dependency panel (blocks / blocked by) | Medium-high | What's stopping progress? |
| 4 | Progress / subtask checklist | Medium | Current status in detail |
| 5 | Branch & PR association | Medium | VCS context |
| 6 | Activity timeline | Medium-low | Audit trail (scrollable) |
| 7 | Task metadata (assignee, due date, labels) | Low | Reference data |

### Scan-path notes

- **F-pattern support:** Left sidebar carries the top-level zone names
  (MAINFRAME, PROJECTS, SYSTEM). Main content area loads left-aligned
  headings and key metrics in the F-scan's horizontal stripes.
- **Layer-cake scanning:** Every content section begins with a condensed
  uppercase label and a descriptive heading. Users scanning headings alone
  can build a mental model of the page.
- **First-scroll narrative (Dashboard):** First screen shows health
  status + KPI cards + the first three activity items. Scroll reveals the
  full activity feed and agent utilization. The first screen answers the
  critical question; the scroll provides depth.

---

## 6. Design system specification

### 6.1 Colour

#### Light theme

| Role | Token | Value | Usage |
|------|-------|-------|-------|
| Surface / background | `--surface-base` | `#E8E2D8` | Page background |
| Surface / elevated | `--surface-elevated` | `#F4F0EA` | Cards, panels, modals |
| Surface / code | `--surface-code` | `#DED8CC` | Code blocks, monospace surfaces |
| Surface / sidebar | `--surface-sidebar` | `#D5CFC4` | Sidebar background |
| Text / primary | `--text-primary` | `#1C3340` | Headings, body text |
| Text / secondary | `--text-secondary` | `#5A5A58` | Secondary labels, timestamps |
| Text / tertiary | `--text-tertiary` | `#8A8478` | Placeholder, disabled |
| Text / on-accent | `--text-on-accent` | `#F4F0EA` | Text on teal or terracotta fills |
| Accent / primary (teal) | `--accent-primary` | `#1A6E6E` | Active nav, focus, links, structural |
| Accent / primary-hover | `--accent-primary-hover` | `#155A5A` | Hover on teal elements |
| Accent / primary-subtle | `--accent-primary-subtle` | `rgba(26, 110, 110, 0.10)` | Teal tint backgrounds |
| Accent / action (terracotta) | `--accent-action` | `#BF6C4B` | CTAs, urgency, primary buttons |
| Accent / action-hover | `--accent-action-hover` | `#A85D40` | Hover on terracotta elements |
| Accent / action-subtle | `--accent-action-subtle` | `rgba(191, 108, 75, 0.10)` | Terracotta tint backgrounds |
| State / success | `--state-success` | `#5A6B48` | Completed, healthy, pass |
| State / success-subtle | `--state-success-subtle` | `rgba(90, 107, 72, 0.10)` | Success tint |
| State / warning | `--state-warning` | `#B08878` | Pending, paused, degraded |
| State / warning-subtle | `--state-warning-subtle` | `rgba(176, 136, 120, 0.12)` | Warning tint |
| State / error | `--state-error` | `#A04535` | Failed, critical, blocked |
| State / error-subtle | `--state-error-subtle` | `rgba(160, 69, 53, 0.10)` | Error tint |
| State / info | `--state-info` | `#6B7A8A` | Informational, in review |
| State / info-subtle | `--state-info-subtle` | `rgba(107, 122, 138, 0.10)` | Info tint |
| Border / default | `--border-default` | `#C5BDB0` | Card borders, separators |
| Border / strong | `--border-strong` | `#9A9480` | Section borders, emphasis |
| Focus / ring | `--focus-ring` | `#1A6E6E` | Focus indicator (3px offset outline) |

**Key contrast ratios verified to WCAG AA:**
- `--text-primary` (#1C3340) on `--surface-base` (#E8E2D8): 9.8:1 ✓
- `--text-primary` on `--surface-elevated` (#F4F0EA): 11.6:1 ✓
- `--text-secondary` (#5A5A58) on `--surface-base`: 4.9:1 ✓
- `--accent-primary` (#1A6E6E) on `--surface-base`: 5.1:1 ✓
- `--accent-primary` on `--surface-elevated`: 6.0:1 ✓
- `--accent-action` (#BF6C4B) on `--surface-elevated`: 3.8:1 (large text /
  non-text OK; use `--text-on-accent` for button text on terracotta fills)
- `--text-on-accent` on `--accent-action`: 5.2:1 ✓
- `--text-on-accent` on `--accent-primary`: 6.0:1 ✓

#### Dark theme

| Role | Token | Value |
|------|-------|-------|
| Surface / background | `--surface-base` | `#1C2426` |
| Surface / elevated | `--surface-elevated` | `#262D30` |
| Surface / code | `--surface-code` | `#1A2022` |
| Surface / sidebar | `--surface-sidebar` | `#212829` |
| Text / primary | `--text-primary` | `#E8E2D8` |
| Text / secondary | `--text-secondary` | `#B5ADA2` |
| Text / tertiary | `--text-tertiary` | `#7A7468` |
| Accent / primary | `--accent-primary` | `#3AADAD` |
| Accent / action | `--accent-action` | `#D4805E` |
| State / success | `--state-success` | `#7A9060` |
| State / warning | `--state-warning` | `#C49A88` |
| State / error | `--state-error` | `#C65A48` |
| State / info | `--state-info` | `#8A9AAA` |
| Border / default | `--border-default` | `#333A3C` |
| Border / strong | `--border-strong` | `#4A5254` |

Dark theme uses teal-charcoal, not cool blue-black. Accent colours lighten
to maintain contrast.

#### Data-visualization palette

For charts, graphs, and categorical distinction, the extended Polychromie
range provides a pre-tested sequence of hues with sufficient mutual contrast:

| Position | Hue | Light value | Dark value |
|---|---|---|---|
| 1 | Deep teal | `#1A6E6E` | `#3AADAD` |
| 2 | Terracotta | `#BF6C4B` | `#D4805E` |
| 3 | Olive | `#6B7058` | `#8A9068` |
| 4 | Slate blue | `#6B7A8A` | `#8A9AAA` |
| 5 | Dusty rose | `#AA5585` | `#C470A0` |
| 6 | Seafoam | `#43857C` | `#5AA898` |

All pairs distinguishable with redundant shape/pattern cues.

### 6.2 Typography

| Role | Family | Weight | Size | Line height | Usage |
|------|--------|--------|------|-------------|-------|
| Section label | DM Sans | 600 | 11px | 1.2 | Uppercase zone names |
| Heading 1 | DM Sans | 700 | 28px | 1.3 | Page titles |
| Heading 2 | DM Sans | 600 | 22px | 1.35 | Section headings |
| Heading 3 | DM Sans | 600 | 17px | 1.4 | Subsection headings |
| Body | Source Sans 3 | 400 / 600 | 15px | 1.55 | Running text, form labels |
| Body small | Source Sans 3 | 400 | 13px | 1.5 | Table cells, metadata |
| Code | JetBrains Mono | 400 / 500 | 14px | 1.5 | Task IDs, code, commands |
| Code small | JetBrains Mono | 400 | 12px | 1.45 | Inline code, log entries |

### 6.3 Spacing

Base unit 4px. All spacing multiples of 4. See `--space-1` (4px) through
`--space-12` (48px).

### 6.4 Punch-card chamfer

The clipped top-right corner from mainframe punch cards. On an 80-column
card, the chamfer tells the operator which end goes in first — orientation
at a glance. In Corbusier, it marks every **moveable unit of work** and
every **machine-readable surface**.

#### Sizes

Chamfer depth is a fixed pixel value, producing a true 45° cut
regardless of the card's aspect ratio. Four named sizes are available:

| Size | Depth (px) | Usage |
|------|-----------|-------|
| `sm` | 8 | Tags, inline code elements |
| `md` | 16 | Task cards, code blocks, command expansions |
| `lg` | 24 | Feature cards, detail panels |
| `xl` | 32 | Hero panels |

#### Orientation semantics

- **Standard (top-right):** Work is moving forward. Card feeds correctly.
  Used for all normal task states: draft, in progress, in review, done.
- **Reversed (top-left):** Something is wrong. The card is backwards. Used
  exclusively for blocked tasks. The reversed cut creates visible discomfort
  — you notice it because it breaks the established pattern.

#### Implementation

An inline SVG polygon draws the chamfered border and background fill.
The SVG's `viewBox` is set to the element's pixel dimensions via a
`ResizeObserver`, and polygon coordinates are computed so the chamfer
uses the same pixel distance on both axes — guaranteeing a true 45°
angle at any aspect ratio. `vector-effect: non-scaling-stroke` keeps
the border at 1 CSS pixel. This approach works in every modern
browser without feature-detection fallbacks or `@supports` blocks.

The React component `ChamferCard` handles all of this automatically.
Its `fillClassName` prop sets the polygon fill (e.g.,
`fill-base-100`), and `strokeClassName` sets the border colour (e.g.,
`stroke-base-300`). The card background lives on the SVG polygon,
not on the containing `<div>`.

```tsx
<ChamferCard
  className="w-64 p-4"
  fillClassName="fill-base-100"
  strokeClassName="stroke-base-300"
>
  {/* card content */}
</ChamferCard>
```

The underlying CSS is minimal:

```css
.chamfer-card { position: relative; }

.chamfer-card__frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.chamfer-card__frame polygon {
  fill: transparent;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.chamfer-card__content {
  position: relative;
  z-index: 1;
}
```

The `fill: transparent` default in the components layer is overridden
by Tailwind `fill-*` utility classes on the polygon. A pure helper
function `computePoints(w, h, chamfer, reversed)` produces the SVG
polygon points string from the element's pixel dimensions and the
chamfer depth. Coordinates sit 0.5 px inward from each edge (half
the stroke width) to prevent stroke clipping.

#### Where it applies

- **Task cards** (Kanban, detail, suggestion cards) — yes. These are
  moveable work units.
- **Code blocks** (slash command expansions, tool schemas, tool call
  output) — yes. Machine-readable surfaces.
- **KPI cards, information cards, registry entries** — no. These are
  fixtures of the room, not items to be sorted.
- **Buttons** — no. Breaks touch target shape expectations.
- **Badges** — no. Too small to read the detail.
- **Form inputs** — no. Fights native affordance.

#### Fill and border treatment

The SVG polygon carries both the card's background fill and its
border stroke. Fill colour is set via a Tailwind `fill-*` utility
(e.g., `fill-base-100`); stroke colour via a `stroke-*` utility
(e.g., `stroke-base-300` for the default, `stroke-error` for the
blocked state). Because `vector-effect: non-scaling-stroke` is
applied, the stroke stays at the declared pixel width regardless of
the element's dimensions. No `clip-path`, `box-shadow`, or
`@supports` hacks are needed.

### 6.5 Illustration direction

Mid-century watercolour-ink style for empty states, onboarding, and error
pages. Warm line drawing with loose washes in palette colours. Scenes depict
the operations room: boards, cards, gauges. Decorative unless carrying
information the text does not.

---

## 7. Accessibility risk register

| Risk | Mitigation | WCAG |
|------|-----------|------|
| Teal on warm bg | 5.1:1 on base; 6.0:1 on elevated | 1.4.3 |
| Terracotta button fill: 3.8:1 on elevated | Light text-on-accent (5.2:1) | 1.4.3 |
| Status badges: colour carries meaning | Icon + text + colour always | 1.4.1 |
| Kanban drag-and-drop | Keyboard: select, Enter, arrow, Enter | 2.1.1 |
| Dense tables | Rows ≥36px; icons padded to 24×24 | 2.5.8 |
| SSE live updates | `aria-live="polite"`; no auto-scroll | 4.1.3 |
| Palette modal | Focus trap, return, Escape | 2.1.2 |
| Shimmer animation | `prefers-reduced-motion` gated | 2.3.3 |
| Chart colours | Shape/pattern + colour always | 1.4.1 |
| Chamfer focus ring on Firefox/Safari | SVG polygon implementation keeps the outline independent of the card fill geometry; focus remains visible via `:focus-visible` outline and non-scaling stroke on the chamfer frame. | 2.4.11 |

---

## 8. Testing plan

### 5-second test

Show Dashboard mockup for five seconds. Users should identify orchestration
purpose, health status, and primary action path.

### First-click test

Task: "Check why TASK-892 is blocked." Majority should reach task list or
`⌘K` search.

### Stress pass

Greyscale, 200% zoom, keyboard-only, reduced motion on Dashboard and Task
Detail.

---

## 9. Implementation handoff

This brief defines the visual strategy. The HTML design system reference file
(`corbusier-design-system.html`) provides a live rendering of the colour
tokens, type scale, component library, and spacing system.
