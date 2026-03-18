# Conversations and Directives

This ExecPlan (execution plan) is a living document. The sections
`Constraints`, `Tolerances`, `Risks`, `Progress`, `Surprises &
Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be
kept up to date as work proceeds.

Status: COMPLETE

## Purpose / big picture

After this plan is complete, a developer can navigate to:

- **`/projects/:slug/conversations`** — and see a list of
  conversations scoped to the project, showing conversation title,
  linked task, agent backend, message count, last activity timestamp,
  and status.
- **`/projects/:slug/conversations/:id`** — and see a chat-style
  conversation detail with: a message timeline colour-coded by role
  (user, assistant, tool, system), inline expandable tool execution
  cards with syntax-highlighted output, an agent status badge showing
  backend name and model, a slash-command input area with a `/`
  trigger, and handoff annotations marking where the backing agent
  changed mid-conversation.
- **`/projects/:slug/directives`** — and see a registry of slash
  command definitions with command name, parameters, template body,
  and example expansion previews.

These pages bring the "message log by the telephone" metaphor to life.
The conversation detail is the second-most complex page after task
detail, rendering a rich timeline of structured messages with
embedded tool-call artefacts.

## Constraints

- All constraints from `01-foundation.md` apply (including the
  technology stack section — Tailwind v4, DaisyUI v5, Radix UI, etc.).
- Chat message bubbles and tool execution cards use DaisyUI `chat` and
  `card` components (`docs/daisyui-v5-guide.md`). Expandable sections
  use Radix UI primitives for accessible disclosure behaviour
  (`docs/pure-accessible-and-localizable-react-components.md`),
  except where noted in the Decision Log.
- Message roles must be visually distinct: user messages left-aligned,
  assistant messages right-aligned (or distinctly styled), tool
  messages rendered as expandable cards, system messages rendered as
  grey informational banners.
- Tool execution cards must show `call_id`, `tool_name`, `status`,
  and execution duration. Expandable to full input/output JSON.
- Tool execution cards and slash command expansions carry the
  punch-card chamfer (they are machine-readable surfaces).
- The slash-command input is a text input with autocomplete
  placeholder behaviour — typing `/` shows a dropdown of available
  commands. This is a visual mockup; actual command execution is not
  required.
- Handoff annotations must be visually prominent — a horizontal
  divider with a label showing source and target backend names.
- Agent status badge shows: backend name, model identifier, and turn
  state (idle / processing / awaiting tool result). This is static
  fixture data.

## Tolerances (exception triggers)

- Scope: if implementation requires more than 15 new files or 2,000
  lines of code (net), stop and escalate.
- Dependencies: no new npm dependencies allowed.
- Iterations: if tests still fail after 3 attempts, stop and
  escalate.

## Risks

- Risk: Chat-style layouts with alternating alignment can be
  accessibility-unfriendly if not structured as a list with proper
  Accessible Rich Internet Applications (ARIA) roles.
  Severity: medium
  Likelihood: medium
  Mitigation: Render the message timeline as a
  `<div role="log" aria-live="polite">` wrapping a plain `<ol>`
  (even though this is a static mockup, the markup should be correct
  for the intended live behaviour). Each message is an `<li>` with
  role annotation.

- Risk: Syntax highlighting for tool call output would normally
  require a library (Prism, Shiki, etc.).
  Severity: low
  Likelihood: certain
  Mitigation: Use a `<pre><code>` block on the code surface
  background (`--surface-code`) without runtime syntax highlighting.
  The monospace font and chamfered container are sufficient for the
  mockup. Note in the Decision Log.

## Progress

- [x] Milestone 1: Conversation and directive fixture data
- [x] Milestone 2: Conversation list page
- [x] Milestone 3: Conversation detail page
- [x] Milestone 4: Directives registry page
- [x] Milestone 5: Tests and validation

## Surprises & discoveries

- `<ol role="log">` overrides the implicit `list` role, causing axe
  `list` violations for child `<li>` elements. Fix: wrap with
  `<div role="log" aria-live="polite">` and keep `<ol>` as plain list.
- Biome's `useSemanticElements` rejects `<div role="status">` in
  favour of `<output>` (which carries implicit `status` role).
- Biome rejects `<li role="separator">` (multiple rules), `<ul
  role="listbox">`, `<li role="option">`. Use generic `<div>` for
  ARIA widget roles that conflict with list semantics.
- `<pre>` with `overflow-x-auto` triggers axe
  `scrollable-region-focusable`; adding `tabIndex={0}` then triggers
  Biome `noNoninteractiveTabindex`. Solution: use
  `whitespace-pre-wrap break-words` to eliminate scrollability.
- Heading order: page `<h1>` → card `<h3>` skips a level. Changed
  card headings to `<h2>` with subheadings at `<h3>`.
- Slash command input combobox accessibility: the input element with
  `role="combobox"` needed `aria-autocomplete="list"` and
  `aria-controls` pointing to the dropdown listbox. The dropdown
  container uses `<div role="listbox">` with direct `<button
  role="option">` children (not nested in wrapper divs) to satisfy
  both Biome's `noNoninteractiveElementToInteractiveRole` and
  `useFocusableInteractive` rules. Removed redundant `tabIndex={0}`
  from buttons since they are focusable by default.

## Decision log

- No syntax highlighting library for tool-call output. A plain
  `<pre><code>` on code surface background with monospace font and
  chamfered container is sufficient for the mockup.
- Slash-command input uses a plain text input plus a semantic button
  list for suggestions rather than a partial combobox pattern, since
  the behaviour is a mockup filter rather than a true select widget.
- `ToolCallCard` expandable disclosure uses a native `<button>` with
  `aria-expanded` and a conditional panel rather than a Radix UI
  primitive. No new npm dependency was warranted for a single-component
  toggle in a mockup context.

## Outcomes & retrospective

All five milestones delivered. `bun run ff` passes fully (118 unit
tests, 1 accessibility (a11y) test, 22 end-to-end (E2E) tests, zero
violations). 24 files changed,
2405 lines added. Key components: MessageBubble, ToolCallCard,
HandoffAnnotation, AgentStatusBadge, SlashCommandInput,
DirectiveCard. All seven locale Fluent files updated with ~50 new
keys each.

## Context and orientation

This plan depends on plans 01 (foundation) and 02 (reusable
components). The status badge, avatar stack, and activity timeline
components from plan 02 are reused here.

The shared data model types (`EntityLocalizations`,
`pickLocalization`, descriptor registries) introduced in plan 03
milestone 0 are used throughout this plan. Entity-owned strings
(conversation titles, directive names and descriptions) live in
`localizations` maps, not Fluent bundles.

### Key files this plan creates

- `src/data/conversations.ts` — Fixture data for conversations with
  messages, tool calls, and handoffs.
- `src/data/directives.ts` — Fixture data for slash command
  definitions.
- `src/app/features/conversations/conversations-screen.tsx` — List.
- `src/app/features/conversations/conversation-detail-screen.tsx` —
  Detail.
- `src/app/features/conversations/components/message-bubble.tsx` —
  A single message in the timeline (role-aware styling).
- `src/app/features/conversations/components/tool-call-card.tsx` —
  Expandable tool execution result card.
- `src/app/features/conversations/components/handoff-annotation.tsx`
  — Agent handoff divider.
- `src/app/features/conversations/components/agent-status-badge.tsx`
  — Backend/model/state indicator.
- `src/app/features/conversations/components/slash-command-input.tsx`
  — Input with `/` autocomplete mockup.
- `src/app/features/directives/directives-screen.tsx` — Registry.
- `src/app/features/directives/components/directive-card.tsx` — A
  single command definition with expansion preview.

## Plan of work

### Milestone 1: Conversation and directive fixture data

Create `src/data/conversations.ts` defining:

- A `Message` interface with: `id`, `role` (user / assistant / tool /
  system), `content`, `timestamp`, `agentBackend` (for assistant
  messages), `toolCall` (for tool messages: `callId`, `toolName`,
  `status`, `duration`, `input`, `output`).
- A `Conversation` interface with: `id`,
  `localizations: EntityLocalizations` (name = title), `taskId`,
  `projectSlug`, `messages`, `agentBackend`, `status` (active/idle),
  `handoffs` (array of `{position, fromBackend, toBackend}`).
- 3–4 fixture conversations with 10–20 messages each, including
  tool calls and at least one handoff.

Create `src/data/directives.ts` defining:

- A `Directive` interface with: `id`,
  `localizations: EntityLocalizations` (name = command name,
  description), `parameters` (array of `{name, type, required,
  description}`), `template`, `exampleExpansions`.
- 5–6 fixture directives: `/task`, `/review`, `/deploy`, `/search`,
  `/status`, `/rollback`.

### Milestone 2: Conversation list page

Replace the placeholder. Show a list of conversations for the current
project. Each row displays: conversation title, linked task ID, agent
backend name, message count, last activity timestamp, and status
(active/idle badge).

Clicking a conversation navigates to
`/projects/:slug/conversations/:id`.

### Milestone 3: Conversation detail page

The conversation detail renders:

- **Agent status badge** — At the top of the content area, showing
  backend name, model, and turn state.
- **Message timeline** — A `<div role="log" aria-live="polite">`
  wrapping a plain `<ol>` of messages. Each
  message renders differently by role:
  - *User*: left-aligned bubble on base surface.
  - *Assistant*: left-aligned bubble on elevated surface with a teal
    left border accent.
  - *Tool*: an expandable card (chamfered) showing call ID, tool
    name, status badge, and duration. Click to expand full
    input/output JSON in a `<pre><code>` block on code surface.
  - *System*: a grey informational banner, full-width.
- **Handoff annotations** — A horizontal divider inserted at the
  handoff position in the message list, showing "Agent handoff: X → Y"
  with source and target backend names.
- **Slash command input** — A text input at the bottom with a
  placeholder "Type / for commands…". Typing `/` shows a static
  dropdown of available commands (from the directives fixture data).
  This is visual only — no actual command processing.

### Milestone 4: Directives registry page

Replace the placeholder. Show a list of registered slash commands:

- Each directive is a card (chamfered — it is a machine-readable
  surface) showing: command name in monospace, description, parameter
  list, and an expandable "Example expansion" section showing a
  sample input and the resulting tool call plan in a code block.

### Milestone 5: Tests and validation

- Component test for `MessageBubble` rendering correct styling per
  role.
- Component test for `ToolCallCard` rendering call metadata and
  expanding on click.
- Component test for conversation list rendering fixture data.
- Playwright E2E: navigate to a conversation detail, verify messages
  render, expand a tool call card.
- Playwright axe sweep on conversation detail.
- `bun run ff` must pass.

## Validation and acceptance

**Quality criteria:**

- Conversation list shows conversations with metadata.
- Conversation detail renders messages by role with correct styling.
- Tool call cards are expandable and show chamfered containers.
- Handoff annotations are visible as dividers.
- Directives page shows command definitions with expansion previews.
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

In `src/data/conversations.ts`:

```tsx
export type MessageRole = "user" | "assistant" | "tool" | "system";

export interface ToolCallInfo {
  readonly callId: string;
  readonly toolName: string;
  readonly status: "succeeded" | "failed" | "pending";
  readonly durationMs: number;
  readonly input: string;
  readonly output: string;
}

export interface Message {
  readonly id: string;
  readonly role: MessageRole;
  readonly content: string;
  readonly timestamp: string;
  readonly agentBackend?: string;
  readonly toolCall?: ToolCallInfo;
}

export interface Conversation {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly taskId: string;
  readonly projectSlug: string;
  readonly messages: readonly Message[];
  readonly agentBackend: string;
  readonly status: "active" | "idle";
}
```

In `src/data/directives.ts`:

```tsx
export interface DirectiveParameter {
  readonly name: string;
  readonly type: string;
  readonly required: boolean;
  readonly description: string;
}

export interface Directive {
  readonly id: string;
  readonly localizations: EntityLocalizations;
  readonly parameters: readonly DirectiveParameter[];
  readonly template: string;
  readonly exampleExpansions: readonly string[];
}
```
