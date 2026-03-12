loading = Loading…
home-title = Dashboard
home-description = Welcome to the Corbusier orchestration platform.

about-title = About
about-description = This is a TypeScript/React mockup with accessibility-first design.

controls-language-label = Language
controls-theme-toggle-day-label = Switch to Day
controls-theme-toggle-night-label = Switch to Night
controls-theme-group-label = Theme
controls-theme-day-option-label = Day
controls-theme-night-option-label = Night
controls-display-toggle-full-label = Switch to Full View
controls-display-toggle-hosted-label = Switch to Hosted Frame
controls-drawer-heading = Display & theme
controls-drawer-close-label = Close display controls
controls-drawer-close-button = Close
controls-reset-to-device-default-label = Reset to device default
controls-trigger-label = Controls

app-skip-to-content = Skip to page content

nav-sidebar-label = Main navigation
nav-zone-mainframe = MAINFRAME
nav-zone-projects = PROJECTS
nav-zone-system = SYSTEM
nav-dashboard = Dashboard
nav-my-tasks = My Tasks
nav-ai-suggestions = AI Suggestions
nav-new-directive = New Directive
nav-personnel = Personnel
nav-reports = Reports
nav-agent-backends = Agent Backends
nav-tool-registry = Tool Registry
nav-hooks-policies = Hooks & Policies
nav-monitoring = Monitoring
nav-tenant-management = Tenant Management
nav-settings = Settings
nav-feedback = Feedback

header-search-label = Search Directives
header-search-placeholder = Search Directives
header-notifications-label = Notifications
header-user-menu-label = User menu

dashboard-demo-region-label = Chamfer demo
dashboard-demo-heading = Punch-card chamfer demo
dashboard-demo-card-title = Task card
dashboard-demo-card-subtitle-ltr = Standard chamfer-md (top-right bevel)
dashboard-demo-card-subtitle-rtl = Standard chamfer-md (top-left bevel)
dashboard-demo-blocked-title = Blocked card
dashboard-demo-blocked-subtitle-ltr = Reversed chamfer-md (top-left bevel)
dashboard-demo-blocked-subtitle-rtl = Reversed chamfer-md (top-right bevel)

page-dashboard = Dashboard
page-dashboard-sub = Overview of your workspace.
page-my-tasks = My Tasks
page-my-tasks-sub = Tasks assigned to you across all projects.
page-task-detail = Task Detail
page-task-detail-sub = View and edit task details.
page-ai-suggestions = AI Suggestions
page-ai-suggestions-sub = Intelligent recommendations from your agent backends.
page-directives = Directives
page-directives-sub = Standing instructions and policies for this project.
page-conversations = Conversations
page-conversations-sub = Agent conversation threads for this project.
page-conversation-detail = Conversation
page-conversation-detail-sub = View the full agent conversation thread.
page-projects = Projects
page-projects-sub = All directives and project workspaces.
page-project-landing = Project Overview
page-project-landing-sub = Summary and quick actions for this project.
page-backlog = Backlog
page-backlog-sub = Unprioritised tasks awaiting triage.
page-calendar = Calendar
page-calendar-sub = Timeline view of project milestones and deadlines.
page-kanban = Kanban Board
page-kanban-sub = Drag-and-drop task cards across workflow columns.
page-list-view = List View
page-list-view-sub = Tabular listing of all tasks in this project.
page-task-detail-project = Task Detail
page-task-detail-project-sub = View and edit this task within its project context.
page-task-deps = Task Dependencies
page-task-deps-sub = Dependency graph for this task.
page-timeline = Timeline
page-timeline-sub = Gantt-style view of task durations and dependencies.
page-settings = Settings
page-settings-sub = Application preferences and account configuration.
page-appearance = Appearance
page-appearance-sub = Theme, display density, and visual preferences.
page-auth-settings = Authentication
page-auth-settings-sub = Login methods, tokens, and session policies.
page-integrations = Integrations
page-integrations-sub = Third-party service connections and API keys.
page-workspace-settings = Workspace
page-workspace-settings-sub = Workspace name, defaults, and team preferences.
page-personnel = Personnel
page-personnel-sub = Manage team members and access roles.
page-reports = Reports
page-reports-sub = Analytics and performance dashboards.
page-agent-backends = Agent Backends
page-agent-backends-sub = Registered AI agent configurations and endpoints.
page-agent-detail = Agent Detail
page-agent-detail-sub = Configuration and status for this agent backend.
page-tool-registry = Tool Registry
page-tool-registry-sub = Available tools and their access policies.
page-tool-detail = Tool Detail
page-tool-detail-sub = Configuration and usage details for this tool.
page-hooks-policies = Hooks & Policies
page-hooks-policies-sub = Automation hooks and governance policies.
page-hook-detail = Hook Detail
page-hook-detail-sub = Configuration and trigger rules for this hook.
page-monitoring = Monitoring
page-monitoring-sub = System health, logs, and performance metrics.
page-tenant-management = Tenant Management
page-tenant-management-sub = Manage tenant configurations and isolation boundaries.
page-user-detail = User Profile
page-user-detail-sub = View and edit user details and permissions.

## Task states and priorities

task-state-draft = Draft
task-state-in-progress = In Progress
task-state-in-review = In Review
task-state-paused = Paused
task-state-done = Done
task-state-abandoned = Abandoned

task-priority-low = Low
task-priority-medium = Medium
task-priority-high = High
task-priority-critical = Critical

## Task actions (state machine)

task-action-draft = Draft
task-action-start = Start
task-action-submit-review = Submit for Review
task-action-pause = Pause
task-action-mark-done = Mark Done
task-action-abandon = Abandon
task-action-none = No transitions available from this state.
task-action-transition = Transition to { $target }

## Task hierarchy

task-hierarchy-goal = Goal
task-hierarchy-idea = Idea
task-hierarchy-step = Step
task-hierarchy-task = Task
task-hierarchy-label = Task hierarchy

## Task sections

task-section-current = Current Task
task-section-dependencies = Dependencies
task-section-progress = Progress
task-section-subtasks = Subtasks
task-section-source-control = Source Control
task-section-activity = Activity
task-section-details = Details
task-section-description = Description
task-section-related = Related Tasks

## Task components

task-subtask-heading = Subtasks
task-deps-none = No dependencies.
task-deps-blocked-by = Blocked By
task-deps-blocks = Blocks
task-deps-subtask-progress = Subtask progress
task-deps-estimate-label = Estimate:
task-branch-none = No branch or PR associated.
task-related-none = No related tasks.
task-not-found = Task not found

## Task metadata

task-meta-assignee = Assignee
task-meta-due = Due
task-meta-priority = Priority
task-meta-estimate = Estimate
task-meta-labels = Labels

## Task filters

task-filter-region = Task filters
task-filter-state = State
task-filter-priority = Priority
task-filter-project = Project
task-filter-all = All
task-filter-reset = Reset filters
task-list-region = Task list
task-list-summary = Showing { $shown } of { $total } tasks
task-list-empty = No tasks match the current filters.

## Task card

task-card-progress = { $progress }% subtasks complete
task-card-subtasks = { $done }/{ $total } subtasks

## Dashboard

dashboard-health-healthy = HEALTHY
dashboard-health-degraded = DEGRADED
dashboard-health-critical = CRITICAL
dashboard-health-status = System Status: { $label }
dashboard-health-region = System health
dashboard-health-last-checked = Last checked:
dashboard-kpi-region = Key metrics
dashboard-activity-region = Recent activity
dashboard-activity-heading = Recent Activity
dashboard-agent-region = Agent utilization
dashboard-agent-heading = Agent Utilization
dashboard-agent-active = Active
dashboard-agent-inactive = Inactive
dashboard-agent-turns = turns

## Shared components

activity-timeline-label = Activity timeline
progress-label = Progress

## Fixture — project names

project-platform-api-v3 = Platform API v3
project-mobile-app-v2 = Mobile App v2
project-data-pipeline-upgrade = Data Pipeline Upgrade

## Fixture — roles

role-tech-lead = Tech Lead
role-backend-eng = Backend Eng
role-frontend-eng = Frontend Eng
role-devops-eng = DevOps Eng
role-qa-engineer = QA Engineer
role-platform-eng = Platform Eng

## Fixture — labels

label-backend = backend
label-agent = agent
label-schema = schema
label-hooks = hooks
label-policy = policy
label-streaming = streaming
label-frontend = frontend
label-ui = ui
label-testing = testing
label-devops = devops
label-governance = governance
label-dashboard = dashboard
label-parser = parser
label-security = security
label-automation = automation
label-a11y = a11y
label-monitoring = monitoring
label-settings = settings

## Fixture — agent backends

agent-claude-code-sdk = Claude Code SDK
agent-codex-cli = Codex CLI
agent-custom-backend = Custom Backend

## Fixture — KPI metrics

kpi-active-tasks-label = Active Tasks
kpi-active-tasks-context = across 4 projects
kpi-active-tasks-trend = +3 this week
kpi-agent-utilization-label = Agent Utilization
kpi-agent-utilization-context = 2 of 3 backends active
kpi-agent-utilization-trend = +5% from yesterday
kpi-tool-success-rate-label = Tool Success Rate
kpi-tool-success-rate-context = last 24 hours
kpi-tool-success-rate-trend = stable
kpi-sla-p95-label = SLA P95 Latency
kpi-sla-p95-context = target: <1000ms
kpi-sla-p95-trend = -40ms from last week

## Fixture — task data

task-1001-title = Implement Claude Code SDK agent backend
task-1001-description = Integrate the Claude Code SDK as a first-class agent backend, including turn lifecycle management and tool dispatch.
task-1001-estimate = 5 pts
task-1001-goal = Multi-agent orchestration
task-1001-idea = Pluggable agent backends
task-1001-step = SDK integration

task-1002-title = Design MCP tool registry schema
task-1002-description = Define the JSON schema for registering tools in the MCP tool registry, including capability declarations and access policies.
task-1002-estimate = 3 pts
task-1002-goal = Multi-agent orchestration
task-1002-idea = Pluggable agent backends
task-1002-step = Tool registry

task-1003-title = Build hook execution engine
task-1003-description = Implement the server-side hook execution engine that runs pre/post hooks around agent turns and tool calls.
task-1003-estimate = 8 pts
task-1003-goal = Multi-agent orchestration
task-1003-idea = Governance layer
task-1003-step = Hook system

task-1004-title = Implement tool access policy evaluator
task-1004-description = Build the policy evaluation engine that checks whether an agent is permitted to invoke a given tool based on the access policy configuration.
task-1004-estimate = 5 pts
task-1004-goal = Multi-agent orchestration
task-1004-idea = Governance layer
task-1004-step = Policy engine

task-1005-title = Add SSE streaming for agent turns
task-1005-description = Implement server-sent events endpoint for streaming agent turn progress to the dashboard in real time.
task-1005-estimate = 5 pts
task-1005-goal = Real-time visibility
task-1005-idea = Live dashboard
task-1005-step = SSE infrastructure

task-1006-title = Design conversation thread UI
task-1006-description = Create the conversation detail view showing agent messages, tool call results, and handoff annotations.
task-1006-estimate = 5 pts
task-1006-goal = Conversation audit trail
task-1006-idea = Agent transparency
task-1006-step = Conversation UI

task-1007-title = Set up Playwright E2E test harness
task-1007-description = Configure Playwright for end-to-end testing with Podman container support on Fedora/WSL2.
task-1007-estimate = 3 pts
task-1007-goal = Quality infrastructure
task-1007-idea = Automated testing
task-1007-step = E2E setup

task-1008-title = Implement governance audit logging
task-1008-description = Record all policy evaluations, hook executions, and tool access decisions to an immutable audit log.
task-1008-estimate = 8 pts
task-1008-goal = Multi-agent orchestration
task-1008-idea = Governance layer
task-1008-step = Audit logging

task-1009-title = Build real-time dashboard widgets
task-1009-description = Create dashboard components that consume SSE events and render live KPI updates, agent status, and activity feed.
task-1009-estimate = 5 pts
task-1009-goal = Real-time visibility
task-1009-idea = Live dashboard
task-1009-step = Dashboard widgets

task-1010-title = Add slash command parser
task-1010-description = Implement a parser for slash commands in the conversation input (/run, /approve, /reject, /escalate) with auto-complete.
task-1010-estimate = 3 pts
task-1010-goal = Conversation audit trail
task-1010-idea = Agent transparency
task-1010-step = Command interface

task-1011-title = Configure tenant isolation boundaries
task-1011-description = Set up namespace-level isolation ensuring agent backends, tools, and hooks are scoped to tenant boundaries.
task-1011-estimate = 8 pts
task-1011-goal = Production readiness
task-1011-idea = Multi-tenancy
task-1011-step = Isolation boundaries

task-1012-title = Write tenant onboarding automation
task-1012-description = Automate tenant provisioning: create namespace, seed default hooks/policies, register initial agent backend.
task-1012-estimate = 5 pts
task-1012-goal = Production readiness
task-1012-idea = Multi-tenancy
task-1012-step = Onboarding flow

task-1013-title = Implement Kanban board drag-and-drop
task-1013-description = Add accessible drag-and-drop to the Kanban board with keyboard support (select, Enter, arrow, Enter).
task-1013-estimate = 5 pts
task-1013-goal = Project management
task-1013-idea = Visual workflow
task-1013-step = Kanban interactions

task-1014-title = Add monitoring dashboard for agent health
task-1014-description = Build the system monitoring page showing agent backend health checks, response latency P95, and error rates.
task-1014-estimate = 3 pts
task-1014-goal = Real-time visibility
task-1014-idea = System monitoring
task-1014-step = Health dashboard

task-1015-title = Design settings page layout
task-1015-description = Create the application settings page with sections for appearance, authentication, integrations, and workspace config.
task-1015-estimate = 2 pts
task-1015-goal = User experience
task-1015-idea = Configurable workspace
task-1015-step = Settings UI

task-1016-title = Integrate Codex CLI agent backend
task-1016-description = Add OpenAI Codex CLI as a second agent backend option alongside Claude Code SDK.
task-1016-estimate = 5 pts
task-1016-goal = Multi-agent orchestration
task-1016-idea = Pluggable agent backends
task-1016-step = Codex integration

## Fixture — subtask titles

st-1-title = Define agent adapter interface
st-2-title = Implement SDK client wrapper
st-3-title = Add turn lifecycle hooks
st-4-title = Write integration tests
st-5-title = Draft JSON schema document
st-6-title = Add capability declarations
st-7-title = Define access policy shape
st-8-title = Review with team
st-9-title = Define hook lifecycle events
st-10-title = Implement pre-hook runner
st-11-title = Implement post-hook runner
st-12-title = Add timeout/retry logic
st-13-title = Set up SSE endpoint
st-14-title = Implement event serialization
st-15-title = Add client reconnection logic
st-16-title = Message bubble component
st-17-title = Tool call expansion panel
st-18-title = Handoff annotation badge
st-19-title = Write Podman wrapper script
st-20-title = Add axe-core integration
st-21-title = Create smoke test suite
st-22-title = KPI card with live update
st-23-title = Agent status indicator
st-24-title = Activity feed auto-scroll
st-25-title = Define namespace schema
st-26-title = Implement scope middleware
st-27-title = Add cross-tenant guard tests
st-28-title = Drag handle component
st-29-title = Drop zone highlighting
st-30-title = Keyboard navigation path
st-31-title = Appearance section
st-32-title = Authentication section
st-33-title = Integrations section
st-34-title = Implement Codex adapter
st-35-title = Map tool schemas to Codex format
st-36-title = Add health check endpoint

## Fixture — activity events (task)

ev-1-description = Moved from Draft to In Progress
ev-2-description = Associated branch feature/claude-sdk-backend
ev-3-description = Completed: Define agent adapter interface
ev-4-description = Moved from In Progress to In Review
ev-5-description = Opened PR #251 for review
ev-6-description = Moved from Draft to In Progress
ev-7-description = Moved from Draft to In Progress
ev-8-description = Completed: Message bubble component
ev-9-description = Moved from In Review to Done
ev-10-description = Paused — waiting for SSE endpoint
ev-11-description = Generated namespace isolation middleware
ev-12-description = Ensure WCAG 2.1.1 keyboard-only path is complete
ev-13-description = Abandoned — superseded by TASK-1009
ev-14-description = Moved from In Review to Done
ev-15-description = Moved from In Progress to In Review

## Fixture — dashboard events

da-1-description = Transitioned TASK-1001 to In Progress
da-2-description = Associated branch feature/claude-sdk-backend
da-3-description = Completed subtask: Define agent adapter interface
da-4-description = Invoked file_write on src/agent/adapter.ts
da-5-description = Completed turn 142 — 3 tool calls, 0 errors
da-6-description = Opened PR #251 for tool registry schema
da-7-description = Transitioned TASK-1002 to In Review
da-8-description = Left comment on TASK-1006: Tool call panel needs expand/collapse
da-9-description = Completed turn 87 — schema validation pass
da-10-description = Transitioned TASK-1007 to Done
da-11-description = Invoked bash: bun test — all passing
da-12-description = Completed subtask: Implement scope middleware
