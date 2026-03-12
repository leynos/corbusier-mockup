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
