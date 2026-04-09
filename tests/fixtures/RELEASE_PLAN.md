# RELEASE_PLAN.md — Fixture

## Epics

```
EPIC-001: Code Editing
Description: Core editor.
Release Target: MVP (v0.1)
Status: In Progress
Dependencies: None

EPIC-002: File Management
Description: File Explorer.
Release Target: MVP (v0.1)
Status: Planned
Dependencies: EPIC-001
```

## User Stories

### EPIC-001: Code Editing

```
US-001-001 (EPIC-001): As a developer, I want to open a file, so that I can edit code.
Priority: High (P0)
Estimate: M
Status: In Progress
Branch: feature/US-001-001-open-file
Acceptance Criteria:
  - [ ] AC-001-001-001: File picker opens
  - [x] AC-001-001-002: Content loads in editor
Dependencies: None
```

```
US-001-002 (EPIC-001): As a developer, I want syntax highlighting, so that I can read code.
Priority: High (P0)
Estimate: L
Status: Planned
Branch:
Acceptance Criteria:
  - [ ] AC-001-002-001: TypeScript highlighted correctly
Dependencies: US-001-001
```

## Tasks

```
TASK-001-001-001 (US-001-001): Implement CodeMirror 6 in WebView
Type: Dev
Assignee: Agent
Status: To Do
Branch: feature/US-001-001-open-file
Notes: Evaluate bundle size
```
