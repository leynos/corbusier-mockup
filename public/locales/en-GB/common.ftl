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
personnel-not-found = Personnel not found.
personnel-detail-id = Personnel ID
personnel-detail-tasks = Assigned Tasks
personnel-detail-last-active = Last Active
personnel-activity-region = Activity history
personnel-activity-heading = Personnel Activity History
personnel-activity-empty = No activity recorded.

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

dashboard-health-status = System Status: { $label }
dashboard-health-region = System health
dashboard-health-last-checked = Last checked:
dashboard-kpi-region = Key metrics
dashboard-activity-region = Recent activity
dashboard-activity-heading = Recent Activity
dashboard-agent-region = Agent utilization
dashboard-agent-heading = Agent Utilization
dashboard-agent-turn-count =
    { $count ->
        [one] turn
       *[other] turns
    }

## Project cards

project-list-region = Project list
project-card-lead = Lead:
project-card-task-summary =
    { $total ->
        [one] { $total } task
       *[other] { $total } tasks
    } · { $inProgress } in progress · { $blocked } blocked
project-status-active = Active
project-status-inactive = Inactive
project-status-completed = Completed

## Project landing

project-view-tabs-label = Project views
project-view-backlog = Backlog
project-view-kanban = Kanban
project-view-calendar = Calendar
project-view-list = List
project-view-timeline = Timeline

## Kanban board

kanban-board-label = Kanban board
kanban-column-todo = To-Do
kanban-column-planned = Planned
kanban-column-in-progress = In Progress
kanban-column-in-review = In Review
kanban-column-done = Done
kanban-add-new = Add New

## Backlog view

backlog-col-priority = Priority
backlog-col-task = Task
backlog-col-assignee = Assignee
backlog-col-due = Due
backlog-empty-state = No draft tasks for this project.

## Calendar view

calendar-grid-label = Calendar
calendar-day-no-tasks = { $date } — no tasks due
calendar-day-no-tasks-today = { $date } — today — no tasks due
calendar-day-with-tasks =
    { $date } — { $count ->
        [one] { $count } task due
       *[other] { $count } tasks due
    }
calendar-day-with-tasks-today =
    { $date } — today — { $count ->
        [one] { $count } task due
       *[other] { $count } tasks due
    }

## List view

list-col-id = ID
list-col-task = Task
list-col-status = Status
list-col-priority = Priority
list-col-assignee = Assignee
list-col-due = Due

## Shared components

activity-timeline-label = Activity timeline
progress-label = Progress
task-subtask-status-complete = completed
task-subtask-status-pending = pending
task-subtask-item = { $name } ({ $status })

## Conversations

conversation-list-region = Conversation list
conversation-list-empty = No conversations for this project.
conversation-message-count-label =
    { $count ->
        [one] { $count } message
       *[other] { $count } messages
    }
conversation-status-active = Active
conversation-status-idle = Idle
conversation-not-found = Conversation not found
conversation-timeline-label = Conversation timeline

## Message roles

message-role-user = User
message-role-assistant = Agent
message-role-tool = Tool
message-role-system = System

## Agent status

agent-status-label = Agent status
agent-status-backend = Backend
agent-status-model = Model
agent-turn-idle = Idle
agent-turn-processing = Processing
agent-turn-awaiting-tool = Awaiting tool result

## Tool calls

tool-status-succeeded = Succeeded
tool-status-failed = Failed
tool-status-pending = Pending
tool-call-id = Call ID
tool-call-duration = Duration
tool-call-show = Show details
tool-call-hide = Hide details
tool-call-input = Input
tool-call-output = Output

## Handoff annotations

handoff-annotation-label = Agent handoff
handoff-annotation-prefix = Handoff

## Slash command input

slash-input-label = Command input
slash-input-placeholder = Type / for commands…
slash-input-suggestions-label = Available commands

## Directives

directive-list-region = Directive list
directive-parameters = Parameters
directive-required = required
directive-template = Template
directive-show-examples = Show examples
directive-hide-examples = Hide examples
directive-example-heading = Example expansions

## AI Suggestions

suggestion-confidence-label = { $value }% confidence
suggestion-duration = Est.
suggestion-assignees-label = Suggested assignees
suggestion-dismiss = Dismiss
suggestion-add-backlog = Add to Backlog
suggestion-metric-analysed = Items Analysed
suggestion-metric-suggested = Tasks Suggested
suggestion-metric-confidence = Avg. Confidence
suggestion-metric-updated = Last Updated
suggestion-summary-region = Suggestion summary
suggestion-filter-tabs = Project filter
suggestion-filter-all = All Projects
suggestion-priority-high = High Priority
suggestion-priority-medium = Medium Priority
suggestion-priority-low = Low Priority
suggestion-empty = No suggestions to display.
suggestion-insights-region = AI Insights
suggestion-insights-heading = AI Insights
insight-severity-critical = Critical
insight-severity-warning = Warning
insight-severity-info = Info
