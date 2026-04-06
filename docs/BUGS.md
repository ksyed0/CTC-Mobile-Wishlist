# Bugs — CTC-Mobile-Wishlist

<!-- Add bugs in BUG-XXXX format as they are discovered. -->

## P0 — Critical (Agent execution failures)

### BUG-0001: AsyncStorage key schema conflict between docs

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0001
- **Found in:** `architecture/DATA_FLOW.md` line 70, `docs/agents/BE_DEV_AGENT.md`, `docs/agents/ARCHITECT_AGENT.md`
- **Description:** DATA_FLOW.md line 70 says `wishlists:${userId}` (per-user) but Section 5 key schema table says global `wishlists`. ARCHITECT_AGENT says global, BE_DEV_AGENT says per-user. Forge and Keystone would implement differently.
- **Fix:** P0.1 — Standardize to global `wishlists` key, filtered by ownerId at read time.

### BUG-0002: Palette agent never spawned in orchestration playbook

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0002
- **Found in:** `docs/agents/DM_AGENT.md` (orchestration playbook, Phase 3)
- **Description:** DM_AGENT.md orchestration playbook never spawns Palette. Design guidance is hardcoded as a string on line 110. Palette's instruction file exists but has no execution point.
- **Fix:** P0.2 — Insert Palette spawn step before Forge+Pixel parallel step in Phase 3.

### BUG-0003: No phase exit criteria defined for Conductor

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0003
- **Found in:** `docs/agents/DM_AGENT.md`
- **Description:** Conductor has no way to know when a phase is "done." No acceptance criteria per phase, no exit gates.
- **Fix:** P0.3 — Add Phase Exit Criteria table to DM_AGENT.md.

### BUG-0004: Vague error handling and escalation rules

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0004
- **Found in:** `docs/agents/DM_AGENT.md` lines 242-246
- **Description:** Escalation rules are vague prose with no retry limits, no timeout handling, no specific failure scenarios. Conductor cannot autonomously recover from agent failures.
- **Fix:** P0.4 — Replace with structured Error Handling SOP table.

### BUG-0005: Lens Phase 5 review scope undefined

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0005
- **Found in:** `docs/agents/CODE_REVIEWER_AGENT.md`
- **Description:** Lens has review instructions for Phases 2-4 but Phase 5 (Trigger/Test) review has no task description. Lens won't know what to check after testing.
- **Fix:** P0.5 — Add Phase 5 Review Focus subsection.

## P1 — Major (Prevents confusion)

### BUG-0006: AC ownership conflict between PO and Tester

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0006
- **Found in:** `docs/agents/PO_AGENT.md`, `docs/agents/FUNCTIONAL_TESTER_AGENT.md`
- **Description:** Both Compass (PO) and Sentinel (Tester) are told to update AC status checkboxes in RELEASE_PLAN.md. Creates potential conflicts during execution.
- **Fix:** P1.1 — Clarify: Tester marks pass/fail, PO performs final acceptance sign-off.

### BUG-0007: Free-form context passing between agents

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0007
- **Found in:** `docs/agents/DM_AGENT.md` lines 162-170
- **Description:** Context passing rules are free-form prose with no standard structure. Conductor may omit critical context when spawning agents.
- **Fix:** P1.2 — Add structured context passing template.

### BUG-0008: 4 acceptance criteria lack test cases

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0008
- **Found in:** `docs/TEST_CASES.md`
- **Description:** AC-0004 (splash screen), AC-0006 (bundled images), AC-0007 (mock users), AC-0015 (search bar visibility) have no corresponding test cases.
- **Fix:** P1.3 — Add TC-0037 through TC-0040.

### BUG-0009: No single source of truth for real vs simulated features

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0009
- **Found in:** `docs/AGENT_PLAN.md` Section 4
- **Description:** Multiple agents mention "POC Simulation" with different meanings. No feature-level table of what's real code vs. simulated documentation.
- **Fix:** P1.4 — Add feature-level real vs. simulated scope table.

### BUG-0010: ROLLBACK.md referenced but empty

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0010
- **Found in:** `docs/ROLLBACK.md` (does not exist)
- **Description:** AGENTS.md Phase 5 references ROLLBACK.md but the file doesn't exist. Agents that check for it will find nothing.
- **Fix:** P1.5 — Create ROLLBACK.md with POC rollback strategy.

### BUG-0011: No cross-link between SDLC dashboard and Plan Visualizer

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0011
- **Found in:** `tools/generate-dashboard.js`, `docs/dashboard.html`
- **Description:** The SDLC dashboard and Plan Visualizer are separate HTML files with no navigation between them. Users must know both URLs.
- **Fix:** P1.6 — Add Plan Visualizer link in dashboard footer.

### BUG-0012: No device compatibility section in design system

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0012
- **Found in:** `architecture/DESIGN_SYSTEM.md`
- **Description:** No explicit responsive breakpoints, no target device matrix, no safe area dimensions documented. No confirmation the UI fits iPhone 17 Pro Max (430pt) or Pixel 10 Pro XL (411pt).
- **Fix:** P1.7 — Add Device Compatibility section.

### BUG-0013: No deployment strategy documented

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0013
- **Found in:** `docs/AGENT_PLAN.md`, `docs/agents/DM_AGENT.md`
- **Description:** No deployment instructions anywhere in the docs. No guidance on how to run the app on iPhone, simulator, or Android for the hackathon demo.
- **Fix:** P1.8 — Add Deployment Strategy section to AGENT_PLAN.md and Phase 6 instruction to DM_AGENT.md.

### BUG-0014: Dashboard is dark-mode only with low contrast text

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0014
- **Found in:** `tools/generate-dashboard.js`
- **Description:** Dashboard has no light mode toggle. Several text colors fail WCAG AA contrast: #666 on #1a1a2e = 2.8:1 ratio (requires 4.5:1). Card borders and metric dividers are nearly invisible.
- **Fix:** P1.9 — Add CSS variable theming, light/dark toggle with localStorage persistence, fix contrast ratios.

### BUG-0015: Dashboard references EliteA instead of Claude Code

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0015
- **Found in:** `tools/generate-dashboard.js` lines 174, 314; `docs/sdlc-status.json` line 3
- **Description:** Dashboard subtitle and footer reference "EPAM EliteA" but the hackathon uses Claude Code as the agentic platform. EliteA is for the full production implementation.
- **Fix:** P1.10 — Replace "EPAM EliteA" with "Claude Code" in dashboard generator and status JSON.

## P2 — Minor (Polish)

### BUG-0016: Unused `spin` CSS keyframe in dashboard

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0016
- **Found in:** `tools/generate-dashboard.js` line 111
- **Description:** `@keyframes spin` is defined but never referenced by any CSS class. Dead code.
- **Fix:** P2.1 — Remove the unused keyframe.

### BUG-0017: No convenience `build` script in package.json

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0017
- **Found in:** `package.json`
- **Description:** Must run `plan:generate` and `dashboard` separately. No single command to regenerate all outputs.
- **Fix:** P2.2 — Add `"build": "npm run plan:generate && npm run dashboard"`.

### BUG-0018: No pre-phase file verification in orchestration

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0018
- **Found in:** `docs/agents/DM_AGENT.md`
- **Description:** Agents are told to read mandatory files at startup but no checklist to verify files exist before spawning. Agent could fail if a prior phase didn't produce expected files.
- **Fix:** P2.3 — Add pre-phase verification note to DM_AGENT.md.

### BUG-0019: Design tokens duplicated across 3 files

- **Severity:** Minor
- **Status:** Fixed (partially — DM_AGENT.md hardcoded tokens removed by P0.2; remaining duplication acceptable)
- **Fix Branch:** est/BUG-0019
- **Found in:** `architecture/DESIGN_SYSTEM.md`, `docs/agents/UI_DESIGNER_AGENT.md`, `docs/agents/DM_AGENT.md` line 110
- **Description:** Same CTC brand color values (#D52B1E, etc.) defined in 3 places. If tokens change, all 3 need updating. Acceptable for hackathon since agents need self-contained context.
- **Fix:** Resolved by P0.2 (Palette spawn removes hardcoded tokens from DM_AGENT.md). Remaining duplication is acceptable.

### BUG-0020: Story priorities duplicated in PO_AGENT.md and AGENT_PLAN.md

- **Severity:** Minor
- **Status:** Won't Fix (acceptable duplication for agent isolation)
- **Fix Branch:** est/BUG-0020
- **Found in:** `docs/agents/PO_AGENT.md`, `docs/AGENT_PLAN.md`
- **Description:** Same priority ordering stated in two places. Low drift risk for a 1-day event.
- **Fix:** No change — acceptable duplication for agent isolation.

### BUG-0021: Branch naming convention stated 5+ times

- **Severity:** Minor
- **Status:** Won't Fix (acceptable duplication for agent isolation)
- **Fix Branch:** est/BUG-0021
- **Found in:** Multiple agent files
- **Description:** Branch naming format `feature/US-XXXX-description` repeated across 5+ agent instruction files.
- **Fix:** No change — acceptable duplication for agent isolation.

### BUG-0022: No hover states on dashboard interactive elements

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0022
- **Found in:** `tools/generate-dashboard.js`
- **Description:** Agent cards and story rows have no hover feedback. Dashboard feels static when interacting.
- **Fix:** P1.9 — Add hover brightness filter to agent cards and story rows.

### BUG-0023: Dashboard has no responsive layout for phones/tablets

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0023
- **Found in:** `tools/generate-dashboard.js`
- **Description:** Dashboard uses fixed desktop grid layouts (3-column metrics, 2-column story grid, 6-phase horizontal pipeline). On phones and tablets in portrait or landscape, UI elements overflow, get cut off, or become unreadable. No media queries exist.
- **Fix:** Add responsive CSS media queries for tablet portrait (768-1024px), tablet landscape, phone landscape (up to 767px), phone portrait (up to 480px), and small phone (up to 375px). Pipeline stacks vertically on phones, grids collapse to fewer columns, deliverables/agent tasks hide on small screens.

### BUG-0024: Dashboard has no About section or attribution

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0024
- **Found in:** `tools/generate-dashboard.js`
- **Description:** No way for viewers to learn what the dashboard is, who built it, or find the source repo. Missing attribution and context for hackathon demo audience.
- **Fix:** Add "About" button in header with modal popup: title "AI-SDLC Orchestrator Visualizer", author "by Kamal Syed", GitHub repo link, and close button. Modal has backdrop blur and closes on overlay click or close button.

## P0 — Critical (Orchestration Loop Failures)

### BUG-0025: No retry state tracking for Conductor

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0025
- **Found in:** `docs/agents/DM_AGENT.md`
- **Description:** Conductor has no mechanism to persist retry counts across agent spawns. If Conductor loses context or is re-spawned, it could re-invoke the same failing agent indefinitely, creating an infinite loop.
- **Fix:** Add retry tracking section — Conductor logs retry counts in `progress.md` with structured format per task.

### BUG-0026: "Escalate to human" workflow undefined

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0026
- **Found in:** `docs/agents/DM_AGENT.md` line 280
- **Description:** Error Handling SOP says "Escalate to human. Do not proceed." but never defines the mechanism — no instructions for how orchestration pauses, how the human is notified, or how orchestration resumes after human intervention.
- **Fix:** Add concrete escalation workflow: Conductor prints blocking issue summary, writes BLOCKED status to sdlc-status.json, pauses orchestration, and documents resume instructions.

### BUG-0027: No BLOCK recovery protocol

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0027
- **Found in:** `docs/agents/DM_AGENT.md`, `docs/agents/CODE_REVIEWER_AGENT.md`
- **Description:** After Lens issues a BLOCK verdict and human fixes the issue, there is no documented protocol for how Conductor knows to resume, which step to resume from, or whether the blocked branch should be rolled back first.
- **Fix:** Add BLOCK recovery protocol to DM_AGENT.md and post-BLOCK guidance to CODE_REVIEWER_AGENT.md.

### BUG-0028: No parallel agent failure coordination rules

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0028
- **Found in:** `docs/agents/DM_AGENT.md`
- **Description:** Phase 3 spawns Forge + Pixel in parallel. If one agent BLOCKs or fails, there are no rules for what happens to the other parallel agent — does it continue, pause, or get cancelled?
- **Fix:** Add parallel agent failure coordination rules to DM_AGENT.md.

### BUG-0029: No hard phase timeout

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0029
- **Found in:** `docs/agents/DM_AGENT.md` line 283
- **Description:** Only a 50% overrun guideline exists for timeboxing. No absolute hard timeout per phase. A phase could theoretically run indefinitely if scope keeps being renegotiated.
- **Fix:** Add hard phase timeout (90 min max per phase) with force-cut-scope action at DM_AGENT.md.

### BUG-0030: No BLOCK vs REQUEST CHANGES threshold criteria for Lens

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0030
- **Found in:** `docs/agents/CODE_REVIEWER_AGENT.md` line 100
- **Description:** Lens has three verdict options (APPROVE / REQUEST CHANGES / BLOCK) but no criteria for when to issue BLOCK vs REQUEST CHANGES. Left entirely to Lens discretion, which could produce inconsistent behavior across review cycles.
- **Fix:** Add explicit BLOCK threshold criteria to CODE_REVIEWER_AGENT.md — security vulnerabilities, type-safety violations, and test failures = BLOCK; all other issues = REQUEST CHANGES.

### BUG-0031: Agentic orchestration is coupled to Claude Code platform

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0031
- **Found in:** `docs/agents/DM_AGENT.md`, `README.md`
- **Description:** Agent spawning instructions, CLI invocations, and parallel execution patterns are hardcoded to Claude Code. Cannot run the same orchestration on Codex, Gemini, or open-source models without rewriting DM_AGENT.md and README.md. The agent instruction files themselves are platform-agnostic markdown, but the invocation and spawning mechanism is not.
- **Fix:** Create `orchestrator/` adapter layer with platform-specific spawn implementations. Abstract DM_AGENT.md spawning to use platform-agnostic patterns. Update README.md with multi-platform quick-start instructions.

### BUG-0032: No CI checks on pull requests

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0032
- **Found in:** `.github/workflows/`
- **Description:** Only 1 GitHub Actions workflow exists (`plan-visualizer.yml`) which auto-generates dashboards. No CI checks run on pull requests — PRs can be merged with broken code, failing tests, or lint errors. Conductor has no awareness of CI status after pushing code.
- **Fix:** Add `.github/workflows/ci.yml` with 4 jobs (lint, test+coverage, build, orchestrator validation) on all PRs to main/develop. Add CI verification step to Conductor Phase 6. Expand ESLint targets to include orchestrator/ files.

### BUG-0033: ESLint not covering orchestrator/ or tests/ files

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0033
- **Found in:** `eslint.config.js`
- **Description:** ESLint only targeted `tools/**/*.js`. The `orchestrator/` adapter code and `tests/` unit tests were never linted. Test files failed lint with hundreds of `no-undef` errors for Jest globals (`describe`, `it`, `expect`). Orchestrator files had unused imports.
- **Fix:** Expand ESLint config to cover `orchestrator/**/*.js` and `tests/**/*.js`. Add Jest globals to test config block. Add Node.js timer globals (`setTimeout`, `clearTimeout`).

### BUG-0034: Unused imports in orchestrator/spawn.js

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0034
- **Found in:** `orchestrator/spawn.js` lines 19-20
- **Description:** `path` and `fs` modules were imported but never used, causing ESLint `no-unused-vars` warnings.
- **Fix:** Remove unused `path` and `fs` require statements.

### BUG-0035: Useless assignment in generate-dashboard.js

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0035
- **Found in:** `tools/generate-dashboard.js` line 454
- **Description:** `let spotlight = ''` was immediately overwritten in both branches of the following `if/else`, triggering ESLint `no-useless-assignment` error.
- **Fix:** Change to `let spotlight;` (uninitialized declaration).

### BUG-0036: Error cause not preserved in generate-plan.js

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0036
- **Found in:** `tools/generate-plan.js` line 159
- **Description:** When rethrowing a caught error for failed `package.json` read, the original error cause was not attached. ESLint `preserve-caught-error` rule flagged this as losing the error chain.
- **Fix:** Add `{ cause: err }` to the rethrown `new Error(msg, { cause: err })`.

### BUG-0037: No code formatting standard enforced

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0037
- **Found in:** Project-wide
- **Description:** No code formatter configured. Inconsistent formatting across JS files, markdown, and config files. No CI check to enforce formatting consistency.
- **Fix:** Added Prettier with `.prettierrc` config (semi, singleQuote, trailingComma all, printWidth 120), `.prettierignore`, `format` and `format:check` npm scripts, and CI job to enforce formatting on PRs.

### BUG-0038: Dashboard does not render BLOCKED phase status

- **Severity:** High
- **Status:** Fixed
- **Fix Branch:** est/BUG-0038
- **Found in:** `tools/generate-dashboard.js` lines 151, 375
- **Description:** Phase pipeline only renders `pending`, `in-progress`, and `complete` states. No CSS class, icon, or visual treatment for `blocked` status. A blocked phase looks identical to pending, so human operators miss escalation events.
- **Fix:** Added `.phase-block.blocked` CSS (red background, red pulsing animation), ⛔ icon mapping, and light/dark theme support.

### BUG-0039: Dashboard does not render BLOCKED agent status

- **Severity:** High
- **Status:** Fixed
- **Fix Branch:** est/BUG-0039
- **Found in:** `tools/generate-dashboard.js` lines 492-507
- **Description:** Agent card status color logic only handles `active` and `complete`. Blocked agents render with gray status (#888), indistinguishable from idle. No border highlight or animation for blocked agents.
- **Fix:** Added blocked handling to statusBg/statusColor logic, `.agent-card.blocked` CSS class with red border and pulse animation, and `cardClass` variable for dynamic class assignment.

### BUG-0040: No alert banner when orchestration is BLOCKED

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0040
- **Found in:** `tools/generate-dashboard.js`
- **Description:** When Conductor sets a phase/agent to `blocked` in sdlc-status.json, the dashboard shows no prominent notification. Humans must scroll to the phase pipeline to notice the blocked state — easy to miss.
- **Fix:** Added top-of-page red alert banner that appears when any phase or agent is blocked. Includes dynamic summary of which phases/agents are blocked, a dismiss button, and pulsing animation.

### BUG-0041: No audio alert on BLOCK events

- **Severity:** High
- **Status:** Fixed
- **Fix Branch:** est/BUG-0041
- **Found in:** `tools/generate-dashboard.js`
- **Description:** When orchestration transitions to BLOCKED state, there is no audible notification. The dashboard auto-refreshes every 5 seconds but the human may not be watching the screen.
- **Fix:** Added Web Audio API three-tone ascending alert (440Hz, 554Hz, 659Hz square wave) that plays on BLOCK state transitions. Includes toggle switch in header to enable/disable, persisted to localStorage.

### BUG-0042: No browser notification on BLOCK events

- **Severity:** High
- **Status:** Fixed
- **Fix Branch:** est/BUG-0042
- **Found in:** `tools/generate-dashboard.js`
- **Description:** No browser push notification when orchestration becomes BLOCKED. If the user has the dashboard in a background tab, they receive no notification that human input is required.
- **Fix:** Added Notification API integration that sends a persistent browser notification on BLOCK transitions. Requests permission on toggle, persists preference to localStorage, uses `requireInteraction: true` so notification stays until acknowledged.

### BUG-0043: Prettier reformats test fixture breaking parse-bugs tests

- **Severity:** Medium
- **Status:** Fixed
- **Fix Branch:** est/BUG-0043
- **Found in:** `tests/fixtures/BUGS.md`
- **Description:** Prettier markdown formatting indented metadata fields (Status, Fix Branch, Estimated Cost USD) under a numbered list item. The `parseBugs` regex uses `^` anchors requiring column 0, causing 4 test failures in CI.
- **Fix:** Restructured fixture to keep numbered list items and metadata fields at separate paragraph levels so Prettier does not nest them.

### BUG-0044: Race condition on sdlc-status.json during parallel agent writes

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0044
- **Found in:** `docs/sdlc-status.json`, `docs/agents/DM_AGENT.md`
- **Description:** When Forge and Pixel run in parallel (Phase 3), both agents update `sdlc-status.json` to report progress. Without locking, one agent's write can overwrite the other's, losing status updates. This is a classic lost-update race condition.
- **Fix:** Added `orchestrator/file-lock.js` (mkdir-based locking with stale detection) and `orchestrator/atomic-write.js` (atomic read-modify-write via temp+rename). All agents must use `atomicReadModifyWriteJson()` for sdlc-status.json updates.

### BUG-0045: Race condition on ID_REGISTRY.md causes duplicate IDs

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0045
- **Found in:** `docs/ID_REGISTRY.md`
- **Description:** When parallel agents both need to allocate a new bug or task ID, they could read the same "next available" value from ID_REGISTRY.md simultaneously, producing duplicate IDs. This corrupts cross-references across BUGS.md, RELEASE_PLAN.md, and TEST_CASES.md.
- **Fix:** Added `reserveId(sequence)` in `orchestrator/atomic-write.js` that acquires a file lock, reads the registry, increments the sequence, and writes back atomically. Agents must use this instead of manual ID allocation.

### BUG-0046: Interleaved writes to progress.md and AI_COST_LOG.md

- **Severity:** High
- **Status:** Fixed
- **Fix Branch:** est/BUG-0046
- **Found in:** `progress.md`, `docs/AI_COST_LOG.md`
- **Description:** Append-only log files written by multiple parallel agents can produce interleaved or corrupted entries when two processes append simultaneously. Markdown structure breaks when partial lines from different agents mix.
- **Fix:** Added `atomicAppend()` in `orchestrator/atomic-write.js` that acquires a file lock before appending. All log-style file writes must use this function.

### BUG-0047: Git push failures during parallel agent branches

- **Severity:** High
- **Status:** Fixed
- **Fix Branch:** est/BUG-0047
- **Found in:** Orchestrator agent workflow
- **Description:** When parallel agents push to different branches simultaneously, network contention or remote rejections can cause silent push failures. Agents may believe code is pushed when it isn't, leading to lost work or stale PRs.
- **Fix:** Added `orchestrator/git-safe.js` with `safePush()` (exponential backoff retry, auto-pull on rejection), `detectConflicts()` (dry-run merge check), and `checkOverlap()` (overlapping file detection between branches).

### BUG-0048: No merge conflict detection before parallel branch merges

- **Severity:** High
- **Status:** Fixed
- **Fix Branch:** est/BUG-0048
- **Found in:** `docs/agents/DM_AGENT.md`
- **Description:** When Conductor merges parallel branches (e.g., Forge's backend + Pixel's frontend), there is no pre-merge conflict check. If both branches modify shared files (package.json, types, test fixtures), the merge fails mid-way and requires manual intervention.
- **Fix:** Added `checkOverlap()` and `detectConflicts()` to `orchestrator/git-safe.js`. Conductor must run overlap check before merging parallel branches. Sequential merge order: first-in merges clean, second rebases on top.

### BUG-0049: No pre-commit formatting enforcement

- **Severity:** Medium
- **Status:** Fixed
- **Fix Branch:** est/BUG-0049
- **Found in:** Project configuration
- **Description:** Prettier formatting was only enforced in CI. Developers and agents could commit unformatted code, causing CI failures on every PR. No local feedback loop before push.
- **Fix:** Added husky pre-commit hook with lint-staged. On commit, staged `.js`, `.json`, `.md`, `.yml`, `.yaml` files are auto-formatted with Prettier, and `.js` files are auto-fixed with ESLint.

### BUG-0050: Agent registry hardcoded across 3 files

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0050
- **Found in:** `orchestrator/spawn.js`, `tools/generate-dashboard.js`, `tools/process-avatars.js`
- **Description:** Agent names, roles, icons, and colors were hardcoded independently in 3 separate files (spawn.js had the agent registry, generate-dashboard.js had duplicate role/color/icon maps, process-avatars.js had a hardcoded AGENTS_ORDER array). Adding or renaming an agent required changes in 3+ files, making the framework non-portable and error-prone.
- **Fix:** Created `agents.config.json` as the single source of truth for all agent definitions. Updated spawn.js, generate-dashboard.js, and process-avatars.js to load from config. Added `tools/init-sdlc-status.js` to generate sdlc-status.json from config. Any project can now customize agents by editing one JSON file.

### BUG-0051: DM_AGENT.md says "7 sub-agents" but there are 8

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0051
- **Found in:** `docs/agents/DM_AGENT.md` (2 occurrences), `docs/HACKATHON_PLAN.md` (1 occurrence)
- **Description:** DM_AGENT.md "Your 7 Sub-Agents" heading and table listed only 7 agents, omitting one. HACKATHON_PLAN.md startup prompt also said "7 specialized agents." Conductor would not know to spawn the 8th agent.
- **Fix:** Updated to "8 sub-agents" in DM_AGENT.md and "8 specialized agents" in HACKATHON_PLAN.md.

### BUG-0052: Agent instruction files contain project-specific content

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0052
- **Found in:** All 9 files in `docs/agents/`
- **Description:** All agent instruction files contained hardcoded project-specific content: user story IDs (US-0001–US-0013), screen names (CatalogScreen, WishlistsScreen), service names (ProductService, WishlistService), branch names (feature/US-0001-expo-scaffold), design tokens (#D52B1E), mock data specs, and feature names (barcode, wishlist, catalog). This made the agent framework non-portable — using it on a different project required rewriting all 9 files.
- **Fix:** Refactored all 9 agent files to be project-agnostic role templates. Agent files now define HOW each role operates (patterns, rules, quality standards, output formats). The DM agent builds project-specific context dynamically at spawn time by reading `project.md` and the project's architecture docs.

### BUG-0053: No project entry point for multi-platform agent discovery

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0053
- **Found in:** Project root
- **Description:** No single file existed for AI agents to discover project-specific context on startup. Each agent had project knowledge baked into its instruction file. Different AI platforms (Claude Code, Gemini, Codex, etc.) auto-read different convention files (CLAUDE.md, Gemini.md, etc.) but none existed.
- **Fix:** Created `project.md` as the single project entry point referencing all architecture docs, release plan, test cases, and tracking files. Created 7 platform symlinks in repo root (`CLAUDE.md`, `Gemini.md`, `Codex.md`, `EliteA.md`, `CodeMie.md`, `Qwen.md`, `MiniMax.md`) all pointing to `project.md` for auto-discovery.

### BUG-0054: Dashboard title, footer, brand color, and repo URL hardcoded

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0054
- **Found in:** `tools/generate-dashboard.js` lines 84, 355, 577, 591; 11 occurrences of `#D52B1E`
- **Description:** Dashboard HTML had "CTC Mobile Wishlist" title, "Canadian Tire Corporation" footer, GitHub repo URL, and CTC brand color `#D52B1E` hardcoded throughout CSS and HTML. Changing the project required editing 15+ locations in the dashboard generator.
- **Fix:** Added `dashboard` section to `agents.config.json` with `title`, `subtitle`, `footer`, `repoUrl`, and `primaryColor` fields. Dashboard generator reads these from config, defaulting to the repo name from `package.json`. All `#D52B1E` CSS references replaced with `var(--brand-primary)` CSS variable set from config.

### BUG-0055: XSS via unescaped data attributes in render-html.js

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0055
- **Found in:** `tools/lib/render-html.js` lines 225, 284, 319, 549, 1096, 1205, 1206, 1355, 1369
- **Description:** Multiple `data-*` HTML attributes and `onclick` handler strings were interpolated without escaping. Malicious story/epic IDs or bug statuses could inject arbitrary HTML/JS. Affected: story cards, epic headers, bug table rows, bug card views.
- **Fix:** Applied `esc()` to all `data-*` attribute interpolations and `jsEsc()` to all `onclick` handler string interpolations across 9 locations.

### BUG-0056: Command injection via unquoted branch names in git-safe.js

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0056
- **Found in:** `orchestrator/git-safe.js` — `safePush`, `safePull`, `detectConflicts`, `branchFiles` functions
- **Description:** Branch names were interpolated into shell commands without quoting: `git push origin ${branch}`. A branch name containing shell metacharacters (`;`, `$()`, backticks) could execute arbitrary commands.
- **Fix:** Quoted all 6 branch name interpolations in git shell commands with double quotes.

### BUG-0057: Infinite recursion in stale lock recovery (file-lock.js)

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0057
- **Found in:** `orchestrator/file-lock.js` — `tryAcquire()` function
- **Description:** If a stale lock's info file was repeatedly unreadable, `tryAcquire()` would recursively call itself with no depth limit, causing a stack overflow.
- **Fix:** Added `_depth` parameter with max depth of 2 retries. Throws explicit error on excessive retries.

### BUG-0058: Race condition on temp file names in atomic-write.js

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0058
- **Found in:** `orchestrator/atomic-write.js` — `atomicWrite()` function
- **Description:** Temp file suffix used only `process.pid`, so two rapid writes from the same process to the same directory could collide.
- **Fix:** Added `Date.now()` to temp file suffix: `.${basename}.tmp.${pid}.${timestamp}`.

### BUG-0059: Missing JSON parse error handling in atomic-write.js

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0059
- **Found in:** `orchestrator/atomic-write.js` — `atomicReadModifyWriteJson()` function
- **Description:** `JSON.parse()` call had no try-catch. A corrupt JSON file would throw an opaque error without identifying the problematic file.
- **Fix:** Wrapped in try-catch with descriptive error message including the file path.

### BUG-0060: Missing JSON parse error handling in spawn.js

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0060
- **Found in:** `orchestrator/spawn.js` — `loadAgentsConfig()` function
- **Description:** `JSON.parse()` of `agents.config.json` had no error handling. A malformed config file would crash with an unhelpful stack trace.
- **Fix:** Added try-catch with descriptive error message.

### BUG-0061: Missing argument bounds checking in spawn.js CLI

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0061
- **Found in:** `orchestrator/spawn.js` — `main()` function
- **Description:** `--agent` and `--task` flags accessed `args[idx + 1]` without bounds checking, producing `undefined` if the argument was missing.
- **Fix:** Added bounds checks with descriptive error messages and usage hints.

### BUG-0062: Silent lock directory removal failure in file-lock.js

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0062
- **Found in:** `orchestrator/file-lock.js` — `release()` function
- **Description:** `rmdirSync` in `release()` could fail silently if directory had unexpected contents, leaving stale locks that would eventually expire via timeout.
- **Fix:** Added separate try-catch for `rmdirSync` with warning log.

### BUG-0063: Dashboard author info hardcoded in generate-dashboard.js

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0063
- **Found in:** `tools/generate-dashboard.js` lines 594-595
- **Description:** Author name "Kamal Syed" and title "Director of Program Management, EPAM Systems" were hardcoded in the About modal HTML.
- **Fix:** Added `author` and `authorTitle` fields to `agents.config.json` dashboard config. Dashboard reads from config and conditionally renders.

### BUG-0064: Hardcoded agent count (9) in process-avatars.js

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0064
- **Found in:** `tools/process-avatars.js` lines 292-306
- **Description:** Face detection expected exactly 9 faces, hardcoded. Adding or removing agents would require code changes.
- **Fix:** Changed to `AGENTS_ORDER.length` which derives from `agents.config.json`.

### BUG-0065: Project-specific branch examples in AGENTS.md and AGENT_PLAN.md

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0065
- **Found in:** `AGENTS.md` lines 338-339, `docs/AGENT_PLAN.md` line 61
- **Description:** Branch naming examples contained specific story/bug IDs (US-0003, BUG-0007, BUG-0012) instead of generic placeholders.
- **Fix:** Replaced with generic placeholders (US-XXXX, BUG-XXXX).

### BUG-0066: No SAST or secret scanning in CI pipeline

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0066
- **Found in:** `.github/workflows/ci.yml`
- **Description:** CI pipeline had lint, test, build, format check, and dependency audit but no static analysis security testing (SAST) or secret scanning. Code vulnerabilities and accidentally committed secrets would go undetected.
- **Fix:** Added CodeQL SAST job (javascript-typescript) and TruffleHog secret scanning job to CI pipeline.

---

## P1 — Major (functional test execution — found by Sentinel 2026-04-04)

### BUG-0084: Splash screen asset file missing — assets/ directory does not exist

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0084
- **Found in:** `app.json` splash config; project root (no `assets/` directory)
- **Story:** US-0001
- **AC:** AC-0004
- **TC:** TC-0037
- **Found by:** Sentinel (static analysis — test execution 2026-04-04)
- **Description:** `app.json` configures the Expo splash screen as `./assets/splash.png` with background color `#D52B1E`. However, the `assets/` directory does not exist in the project root. The referenced files — `splash.png`, `icon.png`, `adaptive-icon.png`, and `favicon.png` — are all missing. Without these files the app cannot be built (Expo build will fail on missing assets). If somehow launched in development mode without a build, no CTC-branded splash screen would display.
- **Fix:** Create the `assets/` directory and add all required Expo asset files: `icon.png` (1024×1024), `splash.png` (1284×2778 for iPhone, contain mode), `adaptive-icon.png` (1024×1024 foreground), and `favicon.png` (48×48). Use CTC red (`#D52B1E`) as background. Refer to `docs/assets/ASSET_SETUP_GUIDE.md` for the asset naming conventions and build pipeline.

### BUG-0085: No product images bundled — all products use placeholder string

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0085
- **Found in:** `data/products.json` (all 23 entries), project root (no `assets/` directory)
- **Story:** US-0002
- **AC:** AC-0006
- **TC:** TC-0038
- **Found by:** Sentinel (static analysis — test execution 2026-04-04)
- **Description:** All 23 products in `data/products.json` have `"image": "placeholder"`. `ProductCard.tsx` and `WishlistItemRow.tsx` both check `product.image !== 'placeholder'` before rendering a real `<Image>` component; when the check fails, they render a `MaterialIcons name="image"` icon placeholder. The `assets/` directory does not exist, so no bundled product images are available. The app displays icon placeholders everywhere instead of product photos, degrading the demo experience and failing AC-0006.
- **Fix:** (1) Add real or representative product images to `assets/images/products/` directory, named by product id (e.g., `prod-001.jpg`). (2) Update `data/products.json` image fields to reference bundled assets using `require()` paths or asset URIs. (3) Alternatively, use placeholder CDN URLs (e.g., `https://via.placeholder.com/300x300`) if bundled images are not feasible for the POC.

### BUG-0086: Search bar missing from catalog screen — AC-0015 and AC-0016 not implemented

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0086
- **Found in:** `app/(tabs)/catalog.tsx` — entire screen
- **Story:** US-0005
- **AC:** AC-0015, AC-0016
- **TC:** TC-0012, TC-0040
- **Found by:** Sentinel (static analysis — test execution 2026-04-04)
- **Description:** `catalog.tsx` contains no `TextInput`, `SearchBar`, or any search UI element. The screen renders only a horizontal category chip row and a product `FlatList`. `ProductContext` exposes a `search(query)` method and `productService.search()` performs case-insensitive name/description filtering — but neither is connected to any UI. AC-0015 requires a search bar visible at the top of the catalog screen; AC-0016 requires real-time filtering as the user types. Both acceptance criteria are unmet.
- **Fix:** Add a `TextInput` search bar at the top of `catalog.tsx` (above the category chip row). On text change, call `productContext.search(query)` or filter `products` locally using the same logic as `productService.search()`. Display results in the existing FlatList. When the search query is empty, show the full product list (or category-filtered list). Debounce the search input for performance.

---

## P1 — Major (feature/pixel-screens review — found by Lens 2026-04-04)

### BUG-0067: AC-0034/AC-0035 — No "I'll Get This" claim button in shared/[id].tsx

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0067
- **Found in:** `app/wishlist/shared/[id].tsx` — entire screen
- **Story:** US-0012
- **AC:** AC-0034, AC-0035
- **Description:** The shared wishlist screen renders a read-only list showing "Available to claim" or "Already claimed" text but provides no interactive claim button. AC-0034 requires an "I'll Get This" `TouchableOpacity` per unclaimed item. AC-0035 requires that claiming persists the claimer name and disables the button for other users. Neither UI element exists; the `claimItem` context action is unused from this screen.
- **Fix:** Add a `TouchableOpacity` "I'll Get This" button to each unclaimed item row in `shared/[id].tsx`. Wire it to `claimItem(wishlistId, item.productId)` from `useWishlists()`. For claimed items, show the claimer's name (or "Someone" to preserve surprise for non-owners per AC-0036) and hide/disable the button. Check if `currentUser.id === wishlist.ownerId` to suppress claimer name for the owner.
- **Resolution:** Fixed by Pixel (Phase 3/4). `TouchableOpacity` "I'll Get This" button implemented at lines 119–129; calls `claimItem(wishlist.id, productId)`. Button hidden for owners (`!isOwner` guard at line 111). Claimed items show "Claimed" badge without revealing claimer name.

### BUG-0068: AC-0036 — Owner can infer claimed status but owner/recipient distinction not implemented

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0068
- **Found in:** `app/wishlist/shared/[id].tsx` lines 53-57
- **Story:** US-0012
- **AC:** AC-0036
- **Description:** The screen renders `item.claimedBy ? "Already claimed" : "Available to claim"` for all viewers with no distinction between the wishlist owner and a recipient. AC-0036 requires that the owner cannot see who claimed which item. Currently there is no `currentUser` check against `wishlist.ownerId`; if the owner navigates to the shared view they will see claimed status the same as any recipient. Additionally, the wording "Already claimed" — though it hides the name — was not intentionally designed; it's the absence of an unimplemented feature. The fix for BUG-0067 must also implement this check explicitly.
- **Fix:** In `shared/[id].tsx`, call `useAuth()` to get `currentUser`. Where `item.claimedBy !== null`, show the claimer name only if `currentUser.id !== wishlist.ownerId`. Owners see "Claimed" (no name); recipients see the claimer's name (or their own name if they claimed it). This satisfies AC-0036 by design, not by accident.
- **Resolution:** Fixed by Pixel (Phase 3/4). `isOwner = currentUser?.id === wishlist.ownerId` at line 77. Owners see generic "Claimed" badge; recipients see claimer name. Button entirely hidden for owners via `!isOwner` at line 111.

### BUG-0069: AC-0024/AC-0025 — wishlist/[id].tsx shows raw productIds, not names/prices; no remove action

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0069
- **Found in:** `app/wishlist/[id].tsx` lines 48-49, 65
- **Story:** US-0008
- **AC:** AC-0024, AC-0025
- **Description:** The wishlist detail screen renders `Product: {item.productId}` (raw ID string) instead of resolving product name and price. AC-0024 requires items show image, name, and price. The `WishlistItemRow` component exists and accepts `productName` and `productPrice` props but is never used here. Additionally, AC-0025 requires a swipe-to-delete or remove button; no such control exists in the screen.
- **Fix:** (1) Import `useProducts()` and look up each `item.productId` to resolve name and price, then render `WishlistItemRow` with those props. (2) Add a remove button or swipe-to-delete gesture calling `removeItem(wishlist.id, item.productId)` from `useWishlists()`.
- **Resolution:** Fixed by Pixel (Phase 3/4). `getProductData(item.productId)` at line 131 resolves name/price. `WishlistItemRow` receives resolved props at line 138. Remove button with confirmation alert at lines 143–149 calls `removeItem`.

### BUG-0070: AC-0013/AC-0014 — No "Add to Wishlist" button on product detail screen

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0070
- **Found in:** `app/product/[id].tsx` — entire screen
- **Story:** US-0004
- **AC:** AC-0013, AC-0014
- **Description:** The product detail screen shows product info (name, price, description, stock status) but has no "Add to Wishlist" button. AC-0013 requires the button to be visible and functional. AC-0014 requires a wishlist picker when multiple wishlists exist, or add-to-default. The `addItem` action is available in `WishlistContext` but is not wired to this screen.
- **Fix:** Add a primary CTA button "Add to Wishlist" at the bottom of `product/[id].tsx`. If the user has multiple wishlists, show an `Alert.prompt` or modal picker. Call `addItem(selectedWishlistId, product.id)` from `useWishlists()`. Guard against guest users (show login prompt instead).
- **Resolution:** Fixed by Pixel (Phase 3/4). Primary CTA "Add to Wishlist" at lines 123–137. Includes duplicate detection, no-wishlists guard with navigation prompt, direct add for single wishlist, picker modal for multiple wishlists.

### BUG-0071: US-0006 scan screen is a placeholder stub — AC-0017 through AC-0020 not delivered

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0071
- **Found in:** `app/(tabs)/scan.tsx` — entire screen
- **Story:** US-0006
- **AC:** AC-0017, AC-0018, AC-0019, AC-0020
- **Description:** The scan screen renders a static message "Camera integration coming in next phase." No expo-camera integration, no barcode overlay, no permission handling, and no barcode-to-product lookup are present. Prior context indicated Pixel used expo-camera with a simulator fallback (TextInput for manual barcode entry, AC-0043), but this code was not committed. All four US-0006 acceptance criteria are unmet.
- **Fix:** Replace the stub with an expo-camera `CameraView` that scans barcodes. On a real device, use camera scanning. On simulator, show `BarcodeOverlay` and a manual TextInput fallback (AC-0043). On scan, call `getByBarcode(code)` from `useProducts()`. Navigate to `product/[barcode-product-id]` on success; show "Product not found" on failure. Request camera permission gracefully (AC-0020).
- **Resolution:** Fixed by Pixel (Phase 3/4). Real `CameraView` with `onBarcodeScanned` at lines 155–162. Permission flow at lines 100–144. Manual barcode TextInput fallback for simulator at lines 176–200. Debounced `handleBarcode()` calls `getByBarcode()` and routes to product detail.

### BUG-0072: shared/[id].tsx shows raw productIds — product names and prices not resolved

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0072
- **Found in:** `app/wishlist/shared/[id].tsx` line 52
- **Story:** US-0011
- **AC:** AC-0032
- **Description:** Like `wishlist/[id].tsx`, the shared view renders `Product: {item.productId}` raw IDs. AC-0032 requires shared wishlist items to show image, name, price, and claimed status. Product context is not imported and `useProducts()` is not called.
- **Fix:** Import `useProducts()`, resolve `item.productId` to product name and price for each item. Use or extend `WishlistItemRow` for a consistent display.
- **Resolution:** Fixed by Pixel (Phase 3/4). `getProductData(item.productId)` at line 95 resolves product. `WishlistItemRow` receives `productName` and `productPrice` at line 103.

### BUG-0073: No component tests for any screen or UI component

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** feature/BUG-0073-component-tests
- **Found in:** `tests/` — no component or screen test files
- **Story:** All UI stories
- **Description:** There are service unit tests for `wishlistService`, `productService`, `userService`, and `wishlistUtils` but zero component/screen tests exist. The agent instruction file requires component tests for all new UI components. 8 screens and 7 components were built with no corresponding test coverage.
- **Fix:** Add React Native Testing Library tests for at minimum: `ProductCard`, `WishlistCard`, `WishlistItemRow`, `EmptyState`, `CategoryChip`, `LoginScreen`, and `CatalogScreen`. Test render output, prop handling, and key interactions (press handlers).
- **Resolution:** Installed `@testing-library/react-native` and `react-test-renderer`. Added 6 render test files in `tests/components/`: `EmptyState.render.test.tsx` (7 tests), `ProductCard.render.test.tsx` (11 tests), `WishlistCard.render.test.tsx` (9 tests), `WishlistItemRow.render.test.tsx` (12 tests), `CategoryChip.render.test.tsx` (7 tests), `BarcodeOverlay.render.test.tsx` (6 tests), `PriceTag.render.test.tsx` (7 tests). Total: 59 new render tests. All 431 tests pass (up from 372). `LogoutButton` and `SimulatorScanView` were not present in codebase and were skipped. Note: `react-test-renderer is deprecated` warnings are benign — emitted by RNTL internally.

## P2 — Minor (feature/pixel-screens review — found by Lens 2026-04-04)

### BUG-0074: No accessibility attributes on any interactive elements

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0074
- **Found in:** All components and screens — `components/`, `app/`
- **Story:** US-0001 (design system compliance)
- **Description:** Zero `accessibilityRole`, `accessibilityLabel`, or `accessibilityHint` attributes are present on any `TouchableOpacity` or `Image` element across all 7 components and 8 screens. The design system (DESIGN_SYSTEM.md §8) requires all images to have `accessibilityLabel` and all buttons to have `accessibilityRole`.
- **Fix:** Add `accessibilityRole="button"` to all `TouchableOpacity` elements. Add descriptive `accessibilityLabel` to image placeholders. Add `accessibilityLabel` to icon-only buttons (chevron, heart icons in `WishlistCard`).
- **Resolution:** Partially fixed by Pixel (Phase 3) for `ProductCard`, `WishlistCard`, `WishlistItemRow`, `CategoryChip`, `catalog.tsx`. Remaining gaps fixed this session: `accessibilityRole`/`accessibilityLabel` added to all `TouchableOpacity` elements in `app/login.tsx` and `app/(tabs)/scan.tsx`; `accessibilityLabel`/`accessibilityRole="image"` added to `BarcodeOverlay.tsx`.

### BUG-0075: catalog.tsx does not use ProductCard component; wishlists.tsx does not use WishlistCard

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0075
- **Found in:** `app/(tabs)/catalog.tsx` lines 23-33; `app/(tabs)/wishlists.tsx` lines 36-50
- **Story:** US-0003, US-0007
- **Description:** Both screens render inline ad-hoc card `View` elements instead of using the dedicated `ProductCard` and `WishlistCard` components that Pixel built. This creates duplicate rendering logic and means the components are never exercised by the running app. The catalog also lacks the category chip filter row (AC-0009) and the product grid is single-column with no `onPress` navigation to product detail (AC-0011).
- **Fix:** Replace inline card rendering in `catalog.tsx` with `<ProductCard product={item} onPress={() => router.push(\`/product/${item.id}\`)} />`. Replace inline rendering in `wishlists.tsx` with `<WishlistCard wishlist={item} onPress={() => router.push(\`/wishlist/${item.id}\`)} />`. Add a horizontal `FlatList`of`CategoryChip` components above the product list.
- **Resolution:** Fixed by Pixel during Phase 3 re-review. `catalog.tsx` uses `<ProductCard>` with `onPress` navigation to `/product/${item.id}` and `<CategoryChip>` for category filters. `wishlists.tsx` uses `<WishlistCard>` with correct `isShared` and `onPress` props via SectionList. Bug was not closed at fix time due to BUG-0088 (agents on isolated branches cannot write back to shared files).

### BUG-0076: wishlistUtils.ts duplicated — exists in both main branch and Forge's pending branch

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0076
- **Found in:** `utils/wishlistUtils.ts`
- **Story:** US-0009
- **Description:** Per prior context, Forge has `wishlistUtils.ts` on a separate unmerged branch. Pixel independently created an identical copy here. When Forge's branch is merged there will be a duplicate file conflict. Both implementations compute `getTotalPrice` identically.
- **Fix:** When merging Forge's branch, verify both files are identical, keep one copy, and delete the duplicate. Pixel's version in `utils/wishlistUtils.ts` is well-written and should be retained. Coordinate merge order to resolve without conflict.
- **Resolution:** Fixed at merge time. Only one canonical copy of `utils/wishlistUtils.ts` exists on `main`. Copies under `.claude/worktrees/` are isolated worktree dev environments, not repo duplicates. No conflict occurred during merge.

### BUG-0079: Dashboard spotlight always shows Conductor because Conductor is always active

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0079
- **Found in:** `tools/generate-dashboard.js`, `docs/dashboard.html`
- **Story:** N/A — dashboard tooling
- **Found by:** Kamal (user observation during Phase 3 build)
- **Description:** The "Active Agent Spotlight" banner always highlights Conductor because Conductor's status is permanently set to "active" throughout the entire pipeline. This means the spotlight never rotates to show the agent actually doing work (Forge, Pixel, etc.), making it misleading. Need an alternative approach — e.g., spotlight the most recently active non-Conductor agent, or show the agent that changed status most recently, or display Conductor only when no other agent is active.
- **Fix:** In `generate-dashboard.js`, update spotlight selection logic: pick the non-Conductor agent with `status === "active"` first; fall back to Conductor only if no other agent is active.
- **Resolution:** Fixed in `tools/generate-dashboard.js`. Spotlight now selects the first non-orchestrator agent with `status === "active"`; falls back to Conductor only when no other agent is active.

### BUG-0080: Dashboard needs more dynamic visualizations for agentic activity

- **Severity:** Minor
- **Status:** Open
- **Found in:** `docs/dashboard.html`, `tools/generate-dashboard.js`
- **Story:** N/A — dashboard tooling
- **Found by:** Kamal (user observation during Phase 3 build)
- **Description:** The current dashboard is largely static — agent cards show status badges but don't communicate the dynamism of parallel agent execution. Missing: animated progress bars during active phases, a visual pipeline/flow diagram showing agent handoffs, real-time token/tool-use counters per agent, and a timeline view of agent activity.
- **Fix:** Add at minimum: (1) CSS pulse animation on active agent cards, (2) phase progress bar showing % of stories complete, (3) per-agent task counter that increments visibly. Longer term: Mermaid or SVG pipeline diagram in the dashboard.

### BUG-0081: PlanVisualizer not in sync with actual pipeline status

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0081
- **Found in:** PlanVisualizer integration, `plan-visualizer.config.json`, `docs/RELEASE_PLAN.md`
- **Story:** N/A — tooling
- **Found by:** Kamal (user observation during Phase 3 build)
- **Description:** The PlanVisualizer dashboard reads from `docs/RELEASE_PLAN.md` task statuses, but agents are updating statuses inconsistently — some tasks marked Done by Keystone, others not updated by Pixel/Forge. As a result the PlanVisualizer shows stale planned status for tasks that are actually complete. Needs investigation after all Phase 3/4 merges are done.
- **Fix:** After Phase 3 merges, audit `docs/RELEASE_PLAN.md` — ensure every TASK that was completed has `Status: Done` and every US has the correct status. Then re-run `npm run dashboard` to sync.
- **Resolution:** Fixed this session. All 6 EPICs, all 13 user stories (including US-0001, US-0002, US-0005), and all 21 tasks updated to `Status: Done` in `docs/RELEASE_PLAN.md`. `parse-bugs.js` field-name mismatch corrected (`"Story"` lookup). `parse-coverage.js` fixed to use line coverage (91.68%) as primary metric. TC-0037/0038/0012/0040 updated to Pass. `npm run plan:generate` now shows 6/6 epics Done, 13/13 stories Done, 40/40 TCs Pass, 91.68% coverage.

### BUG-0082: Quality metrics (code coverage, tests passed) not updating during Build phase

- **Severity:** Minor
- **Status:** Open
- **Found in:** `docs/sdlc-status.json`, `tools/generate-dashboard.js`
- **Story:** N/A — dashboard tooling
- **Found by:** Kamal (user observation during Phase 3 build)
- **Description:** The dashboard metrics panel shows `coveragePercent: 0`, `testsPassed: 0`, `testsFailed: 0` throughout the Build phase even though Forge added 94 tests (all passing) and the service layer has coverage. Conductor is not updating `docs/sdlc-status.json` metrics after each agent completes. The dashboard auto-refresh picks up the JSON but the values are stale.
- **Fix:** After each agent merge, Conductor should update the relevant metrics in `sdlc-status.json` — specifically `tasksCompleted`, `testsPassed`, and `storiesCompleted` based on RELEASE_PLAN.md status. In Phase 5 Circuit will produce the coverage report to populate `coveragePercent`.

### BUG-0098: Dead if/else in wishlists.tsx sections builder — both branches identical

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0098
- **Found in:** `app/(tabs)/wishlists.tsx` lines 71–75
- **Story:** US-0010 (Shared Wishlists), US-0011 (Create Wishlist)
- **Found by:** Lens (code review — feature/pixel-integration)
- **Description:** The `sections` array builder has an `if/else` where both branches execute the same `sections.push({ title: 'My Wishlists', data: wishlists, isShared: false })`. The condition `wishlists.length > 0 || sharedWishlists.length === 0` was likely intended to guard showing an empty "My Wishlists" section, but the else branch is identical so the guard has no effect. This is dead code — the `else` branch is unreachable in a meaningful way. Functionally harmless because "My Wishlists" shows correctly in both states, but the code signals unfinished intent and adds confusion for any future developer.
- **Fix:** Remove the `if/else` entirely and replace with a single unconditional `sections.push({ title: 'My Wishlists', data: wishlists, isShared: false })`.
- **Resolution:** Removed dead `if/else` in `app/(tabs)/wishlists.tsx` lines 71–75. Single unconditional `sections.push()` replaces both identical branches.

### BUG-0083: Activity log timestamps use UTC offset instead of local time (EDT)

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0083
- **Found in:** `docs/sdlc-status.json` log entries, `tools/generate-dashboard.js`
- **Story:** N/A — dashboard tooling
- **Found by:** Kamal (user observation — log shows 16:20 when local time is 18:20)
- **Description:** Activity log timestamps are hardcoded as strings in HH:MM format without timezone awareness. The pipeline started at ~16:00 UTC but the user's local time is EDT (UTC-4 → actual 20:xx, or possibly the session shows UTC-4 as 16:xx when local is 18:xx indicating a 2-hour offset — likely UTC vs EDT). The dashboard displays these raw strings without conversion.
- **Fix:** In `generate-dashboard.js` or in the dashboard HTML, convert log timestamps to the user's local timezone using `new Date().toLocaleTimeString()`. Alternatively, store timestamps as full ISO-8601 in the log entries and format them at render time.

### BUG-0077: AC-0041 and AC-0042 used in code but not registered in RELEASE_PLAN or ID_REGISTRY

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0077
- **Found in:** `tests/services/productService.test.ts`, `tests/services/wishlistService.test.ts`, `services/wishlistService.ts`, `services/productService.ts`
- **Story:** US-0006 (AC-0041 — unique barcode lookup), US-0008 (AC-0042 — duplicate item guard)
- **Found by:** Lens (code review — feature/forge-services)
- **Description:** Forge references AC-0041 (unique barcode lookup) and AC-0042 (duplicate item guard) in service code comments and test annotations. However, neither AC is formally defined in `docs/RELEASE_PLAN.md` under its user story. The ID_REGISTRY still shows `AC | AC-0041 | AC-0040`, meaning AC-0041 is "next available" — not assigned. AC-0042 is entirely untracked. Any reader of the release plan cannot trace these acceptance criteria.
- **Fix:** Add AC-0041 under US-0006 in RELEASE_PLAN.md ("getByBarcode returns the matching product for a known barcode"), add AC-0042 under US-0008 ("addItem does not add a duplicate product to the wishlist"), and update ID_REGISTRY to `AC | AC-0043 | AC-0042`.
- **Resolution:** AC-0041 added under US-0006 in `docs/RELEASE_PLAN.md`. AC-0042 added under US-0008. ID_REGISTRY updated: `AC | AC-0043 | AC-0042`.

### BUG-0078: wishlistService.removeItem missing test for empty productId guard

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0078
- **Found in:** `tests/services/wishlistService.test.ts` (removeItem describe block, lines 268–304)
- **Story:** US-0008
- **Found by:** Lens (code review — feature/forge-services)
- **Description:** `wishlistService.removeItem` validates both `wishlistId` and `productId` as non-empty strings and throws if either is falsy. The test suite covers the `wishlistId` empty guard (line 299) but has no test for `productId` empty string throwing `productId must be a non-empty string`. This leaves a validation branch untested.
- **Fix:** Add a test case to the `removeItem` describe block: `it('throws when productId is empty')` asserting `wishlistService.removeItem('wl-001', '')` rejects with `/productId must be a non-empty string/`.
- **Resolution:** Test already exists. `tests/services/wishlistService.test.ts` line 419: `it('throws when productId is empty', ...)` asserts `rejects.toThrow(/productId must be a non-empty string/)` against `removeItem`. Bug was filed before Forge's full test suite was committed; never closed at merge time.

### BUG-0087: Agentic dashboard resets to initial state — shows 0/6 phases, "Waiting for Conductor to activate agents"

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0087
- **Found in:** `docs/sdlc-status.json`, `tools/generate-dashboard.js`
- **Story:** N/A (tooling)
- **Found by:** User (post-pipeline observation)
- **Description:** After the full 6-phase BLAST pipeline completed, the Agentic dashboard reverted to an initial/empty state: Phases Complete 0/6, Stories Done 0/13, Tasks Done 0/21, Tests Passed 0, Code Coverage 0%, all agents showing "idle", all stories showing "Planned", and the Agent Status panel displaying "Waiting for Conductor to activate agents...". Root cause: `sdlc-status.json` on the `main` branch was never updated past Phase 3 (Build) — Phases 4 (Integrate), 5 (Test), and 6 (Polish) completion were not written back. Additionally, the `claude/install-plan-visualizer-09PFc` branch contains a completely fresh sdlc-status.json (currentPhase: 0, all zeros) predating the pipeline, so running the dashboard on that branch always shows the reset state.
- **Fix:** Update `sdlc-status.json` on `main` to reflect the final pipeline state: currentPhase 6, all 6 phases complete, all agents done, correct final metrics (13/13 stories, 371 tests, 91.68% coverage). Ensure any active branch that serves the dashboard is rebased or cherry-picks the corrected status file.

### BUG-0089: Plan Visualizer "Cost Breakdown (Projected vs AI)" chart shows no AI Cost bars despite $299 total in header

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0089
- **Found in:** `tools/generate-plan.js`, `tools/lib/compute-costs.js`, `docs/AI_COST_LOG.md`
- **Story:** N/A (tooling)
- **Found by:** User (post-pipeline observation)
- **Description:** The Charts tab header correctly shows $299.09 total AI cost, but the "Cost Breakdown (Projected vs AI)" bar chart shows only orange Projected bars — the teal AI Cost bars are all at 0 (invisible against the right Y-axis). Root cause: the `attributeAICosts()` function distributes costs by matching `AI_COST_LOG.md` branch names to story IDs using the pattern `feature/US-XXXX-*`. The actual branches in the cost log (`develop`, `feature/forge-services`, `feature/pixel-screens`, `claude/install-plan-visualizer-09PFc`, `feature/US-0000-business-case-deck`) do not match any `US-XXXX` story pattern, so all $299.09 accumulates under the internal `_totals` bucket and is never distributed to individual stories or epics. The per-epic chart therefore renders zero AI cost for all 6 epics.
- **Proposed Fix:** Either (A) add a branch→story/epic mapping table to `plan-visualizer.config.json` so non-standard branch names can be attributed, or (B) fall back to distributing unattributed cost proportionally across epics by their story count when no per-story attribution is possible, or (C) show the total AI cost as a single "Unattributed" bar so the chart is not misleadingly empty.
- **Resolution:** Implemented Option B in `tools/lib/compute-costs.js`. After exact branch-name matching, any unattributed cost is distributed evenly across all stories (`unattributed / stories.length` per story). Chart now shows non-zero AI Cost bars totalling the full $299.09 even when branch names don't follow the `feature/US-XXXX-*` convention.

### BUG-0088: Agentic dashboard has structural concurrency issues — metrics lag, phase shown incorrectly, counts diverge from source files

- **Severity:** Major
- **Status:** Open
- **Found in:** `docs/sdlc-status.json`, `docs/agents/DM_AGENT.md` (orchestration model)
- **Story:** N/A (tooling / orchestration architecture)
- **Found by:** User (post-pipeline observation)
- **Description:** The dashboard suffers from a fundamental concurrency problem rooted in the parallel-branch agent model. Each agent runs in an isolated git worktree on its own feature branch, so any writes to `sdlc-status.json` stay on that branch and never reach the branch the dashboard reads from. This causes several observable symptoms:
  1. **Phase shown incorrectly** — dashboard shows Phase 2 or 3 while Phase 6 is actively running, because the main/develop branch sdlc-status.json was never updated by the sub-agents.
  2. **Bug count mismatch** — `docs/BUGS.md` accumulates new entries across branches, but `sdlc-status.json` `bugsFixed`/`bugsOpen` metrics are only updated manually by Conductor at merge time and fall behind the real count.
  3. **Metrics batch-update at the end** — because the file is only reconciled at merge time, the dashboard appears static for hours then jumps to a near-complete state, rather than progressing incrementally.
  4. **Agent status stale** — parallel agents (Forge + Pixel running simultaneously) each write their own agent status updates to their own branch; the dashboard on develop only ever sees the last merged branch's view.
- **Proposed Fixes (in order of preference):**
  - **Option A — Sequential agents on a single branch:** Run each agent sequentially on `develop` without worktree isolation. Each agent commits its sdlc-status.json update directly to develop before the next agent starts. Dashboard always reads the live state. Trade-off: no parallelism, but dashboard is always accurate.
  - **Option B — Shared status file outside git:** Store `sdlc-status.json` outside the repo (e.g., a local SQLite file, a temp JSON at a fixed absolute path, or a small local HTTP server) that all worktrees read/write via absolute path. Dashboard polls this shared file. Trade-off: requires setup but preserves parallel agent execution.
  - **Option C — Conductor writes status on merge:** Keep current model but require Conductor to recount `docs/BUGS.md` and update all metrics in sdlc-status.json immediately after every `git merge`. This fixes the batch-update symptom but not the within-phase lag.
  - **Option D — Dashboard reads directly from source files:** Instead of sdlc-status.json, have generate-dashboard.js parse `docs/BUGS.md` for bug counts, `docs/RELEASE_PLAN.md` for story/task statuses, and `docs/coverage/coverage-summary.json` for coverage. sdlc-status.json becomes append-only event log only. This eliminates the sync problem for derived metrics.

---

## P2 — iOS Build & Runtime (Post-pipeline simulator run)

### BUG-0090: Missing `"main": "expo-router/entry"` in package.json — app crashed on launch with "Unable to resolve module ../../App"

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0090
- **Found in:** `package.json`
- **Story:** US-0001
- **Found by:** User (first iOS simulator run)
- **Description:** The app crashed immediately on launch with `Unable to resolve module ../../App from node_modules/expo/AppEntry.js`. Without `"main": "expo-router/entry"` in `package.json`, Expo falls back to its legacy entry point (`expo/AppEntry.js`) which expects a root-level `App.tsx`. expo-router projects use file-based routing with no `App.tsx` — the entry must point to `expo-router/entry`.
- **Fix:** Added `"main": "expo-router/entry"` to `package.json`.

### BUG-0091: Empty `src/app/.gitkeep` scaffold dir causes expo-router v4 to show "Welcome to Expo" onboarding instead of app routes

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0091
- **Found in:** `src/app/.gitkeep` (scaffold artifact), expo-router v4 directory resolution
- **Story:** US-0001
- **Found by:** User (second iOS simulator run)
- **Description:** expo-router v4 (SDK 55) changed its route root resolution order — it checks `src/app` before `app`. The initial project scaffold created `src/app/.gitkeep` as a placeholder. This empty directory was detected by expo-router's `getRouterDirectory()`, which selected `src/app` as the route root. Since `src/app` was empty, expo-router rendered its built-in onboarding screen ("Start by creating a file in the src/app directory") instead of the real app routes in `app/`.
- **Fix:** Deleted `src/app/` (contained only `.gitkeep`). expo-router now correctly falls back to `app/` as the route root.

### BUG-0092: Stale `Podfile.lock` pinned `React-Core-prebuilt@0.84.1` after react-native downgrade to 0.83.4 — Swift API mismatch

- **Severity:** Critical
- **Status:** Fixed
- **Fix Branch:** est/BUG-0092
- **Found in:** `ios/Podfile.lock`
- **Story:** US-0001
- **Found by:** iOS build error (`ExpoReactNativeFactory.swift:135` — missing `bundleConfiguration` parameter)
- **Description:** After downgrading `react-native` from `0.84.1` to `0.83.4` in `package.json`, the `Podfile.lock` was not deleted. It still pinned `React-Core-prebuilt (0.84.1)`. The 0.84.1 prebuilt XCFramework introduced a breaking API change — `viewWithModuleName:` now requires a `bundleConfiguration:` parameter and `devMenuConfiguration:` became non-nullable. expo SDK 55's `ExpoReactNativeFactory.swift` was written against the 0.83.4 API (no `bundleConfiguration`, nullable `devMenuConfiguration`), causing a Swift compile error.
- **Fix:** Deleted `ios/Podfile.lock` and `ios/Pods/`, then re-ran `pod install`. CocoaPods resolved `React-Core-prebuilt (0.83.4)` whose XCFramework headers match the expo SDK 55 Swift code.

### BUG-0093: Native iOS xcassets (icon and splash) not updated when `assets/` source files are changed — requires `expo prebuild` to sync

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0093
- **Found in:** `ios/CTCMobileWishlist/Images.xcassets/AppIcon.appiconset/`, `ios/CTCMobileWishlist/Images.xcassets/SplashScreenLegacy.imageset/`
- **Story:** US-0001
- **Found by:** User (icon and splash incorrect after asset copy)
- **Description:** Changing `assets/icon.png` and `assets/splash.png` has no effect on a native iOS build. Expo's two-layer asset system requires `expo prebuild` to process `assets/` and write the results into the native iOS xcassets. Without running prebuild, the xcassets retained the original placeholder images (34KB each) that were generated during initial scaffold — an old Canadian Tire triangle icon and a generic splash. The app icon displayed the wrong triangle graphic on the simulator springboard; the splash screen showed a different image.
- **Fix:** Manually copied the correct CTC-branded assets directly into the native xcassets: `assets/icon.png` → `AppIcon.appiconset/App-Icon-1024x1024@1x.png`, `assets/splash.png` → `SplashScreenLegacy.imageset/image.png|@2x|@3x`. Also deleted Xcode DerivedData to force the xcasset processor to recompile the images.

### BUG-0094: App icon rejected by Xcode — RGBA with alpha channel and incorrect size (2048×2048 instead of 1024×1024)

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** est/BUG-0094
- **Found in:** `assets/icon.png`, `ios/CTCMobileWishlist/Images.xcassets/AppIcon.appiconset/`
- **Story:** US-0001
- **Found by:** Xcode build error ("did not have any applicable content")
- **Description:** After copying `assets/icon.png` into the native xcassets, the Xcode build failed with: `The stickers icon set, app icon set, or icon stack named "AppIcon" did not have any applicable content.` The icon file was RGBA mode (alpha channel present) at 2048×2048 pixels. iOS requires app icons to be exactly 1024×1024 and must not have an alpha channel — presence of an alpha channel causes the xcassets compiler to silently reject the entire icon set.
- **Fix:** Used Pillow to convert the icon: `Image.open(...).convert('RGB').resize((1024, 1024), Image.LANCZOS)`. The resulting RGB-mode 1024×1024 PNG was written to the xcassets and the build succeeded.

### BUG-0095: Back button on Wishlist and Product Detail screens shows "(tabs)" instead of a readable label

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0095
- **Found in:** `app/_layout.tsx`
- **Story:** US-0007, US-0004
- **Found by:** User (simulator demo observation)
- **Description:** Navigating from the Wishlists tab into a wishlist detail screen showed a back button labeled "< (tabs)" — the raw expo-router file-system segment name of the parent route group. Similarly, navigating to Product Details from the Catalog tab would show the same. The `Stack.Screen` options for `wishlist/[id]`, `wishlist/shared/[id]`, and `product/[id]` did not set `headerBackTitle`, so iOS used the parent segment name `(tabs)` as the default.
- **Fix:** Added `headerBackTitle: 'Wishlists'` to `wishlist/[id]` and `wishlist/shared/[id]` screens, and `headerBackTitle: 'Catalog'` to `product/[id]` in `app/_layout.tsx`.

## P2 — Minor (Plan Visualizer UX — post-pipeline observation)

### BUG-0096: Plan Visualizer Hierarchy tab column view appears empty — all epic sections start collapsed

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0096
- **Found in:** `tools/lib/render-html.js` (Hierarchy tab column view, line 360)
- **Story:** N/A (tooling)
- **Found by:** User (post-pipeline plan visualizer review)
- **Description:** The Hierarchy tab's "≡ Column" view renders all epic sections with their story content collapsed by default (`class="hidden"`). The user sees only a list of clickable epic header rows — no stories are visible without individually clicking each header to expand it. The initial rendered state is visually indistinguishable from an empty view. The Card view has the same issue (line 379: `class="hidden"`). Both views generate the story HTML correctly, but the all-collapsed default makes the view appear broken or empty on first load. The `localStorage`-persisted `hierarchyView` setting restores the last-used toggle (column/card) but never restores which epics were expanded.
- **Fix:** Removed `class="hidden"` from epic story/card content divs and changed the initial arrow from `&#9654;` (►) to `&#9660;` (▼) so sections render expanded. Clicking a header now correctly collapses/expands via the existing `toggleSection()` logic.
- **Resolution:** Applied to `tools/lib/render-html.js`. Regenerated `docs/plan-status.html` — 0 hidden epic content sections confirmed.

### BUG-0097: Plan Visualizer Costs tab "Bug Fix Costs" column view appears empty — all epic groups collapsed with bugs out of sight

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** est/BUG-0097
- **Found in:** `tools/lib/render-html.js` (Costs tab bug fix column section, line 1106)
- **Story:** N/A (tooling)
- **Found by:** User (post-pipeline plan visualizer review)
- **Description:** The Costs tab "Bug Fix Costs" table groups bugs by epic (via `bug.relatedStory` → story → epic lookup) and renders each group as a collapsible `<tbody>` starting with `class="hidden"`. On first load the user sees only the epic group header rows with bug counts, but no actual bug rows — the table body appears empty. The issue is compounded by the fact that most bugs in `BUGS.md` have a `Story:` value of `N/A`, `N/A (tooling)`, or a multi-value string that doesn't match any single story ID in the story-epic map. These bugs are bucketed into a single `_ungrouped` group labeled "No Epic". The result is one collapsed header row ("No Epic (N)") with all N bugs hidden underneath — the entire "Bug Fix Costs" section appears blank to the user.
- **Fix:** Removed `class="hidden"` from bug group `<tbody>` elements and changed the initial arrow from `&#9654;` (►) to `&#9660;` (▼) so all bug rows are visible on first render.
- **Resolution:** Applied to `tools/lib/render-html.js`. Regenerated `docs/plan-status.html` — 0 hidden bug-cost group tbodies confirmed.

## P2 — Minor (US-0015 Simulator Scan — demo observation)

### BUG-0099: Product detail screen always shows placeholder — Image never rendered

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** feature/US-0015-simulator-scan-mock
- **Found in:** `app/product/[id].tsx`
- **Story:** US-0004
- **Found by:** User (simulator demo observation)
- **Description:** The product detail screen rendered a static grey placeholder View with a MaterialIcons "image" icon regardless of whether the product had an image URL. The `<Image>` component was never used, so products with real images always showed a grey box.
- **Fix:** Replaced placeholder View with an Image component matching the ProductCard approach, with a colored-view fallback (using category color) for products without an image.

### BUG-0100: No mock "Add to Cart" button on product detail screen

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** feature/US-0015-simulator-scan-mock
- **Found in:** `app/product/[id].tsx`
- **Story:** US-0004
- **Found by:** User (simulator demo observation)
- **Description:** The product detail screen had no "Add to Cart" button, making the demo feel incomplete. Users expected to see both cart and wishlist actions on the detail screen.
- **Fix:** Added a secondary outlined button below the "Add to Wishlist" CTA that shows an Alert reading "Added to cart!" when tapped.

### BUG-0101: "Add to Wishlist" skipped picker when user had exactly one wishlist

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** feature/US-0015-simulator-scan-mock
- **Found in:** `app/product/[id].tsx`
- **Story:** US-0004
- **Found by:** User (simulator demo observation)
- **Description:** When a user had exactly one wishlist, tapping "Add to Wishlist" would silently add the item directly without any confirmation or visual feedback. This was confusing and inconsistent with the multi-wishlist picker flow.
- **Fix:** Changed `handleAddToWishlist` to always call `setShowPicker(true)` when `wishlists.length >= 1`, so the picker sheet always appears and the user confirms which wishlist to add to.

### BUG-0102: Wishlist detail screen never passed productImage prop to WishlistItemRow — always showed grey placeholder

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** feature/US-0015-simulator-scan-mock
- **Found in:** `app/wishlist/[id].tsx`
- **Story:** US-0008
- **Found by:** User (simulator demo observation)
- **Description:** The wishlist detail screen looked up product data for each wishlist item but never passed the `productImage` prop to `WishlistItemRow`. Every item rendered a grey placeholder image even when the product had a valid image URL.
- **Fix:** Added `productImage={product?.image}` to the `WishlistItemRow` render call so item thumbnails display correctly.

### BUG-0103: Wishlist total footer clipped by iPhone home indicator

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** feature/US-0015-simulator-scan-mock
- **Found in:** `app/wishlist/[id].tsx`
- **Story:** US-0009
- **Found by:** User (simulator demo observation)
- **Description:** The wishlist total price footer was positioned at the bottom of the screen without accounting for the iPhone home indicator safe area. On modern iPhones the total price text was partially hidden behind the home indicator swipe zone.
- **Fix:** Applied `useSafeAreaInsets()` from `react-native-safe-area-context` and added `paddingBottom: spacing.md + insets.bottom` to the footer container.

### BUG-0104: No logout/switch-user button in tab header — blocks demo user switching

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** feature/US-0015-simulator-scan-mock
- **Found in:** `app/(tabs)/_layout.tsx`
- **Story:** US-0013
- **Found by:** User (simulator demo observation)
- **Description:** The `LogoutButton` component did not exist and the tab layout had no `headerRight` configured, so there was no way to switch between mock users during a demo without force-quitting the app.
- **Fix:** Created `components/LogoutButton.tsx` wired to `useAuth().logout()` and `router.replace('/login')`. Added `headerRight: () => <LogoutButton />` to the global `screenOptions` on the `Tabs` component so the button appears on every tab header.

### BUG-0105: Create Wishlist modal keyboard obscures input on iOS

- **Severity:** Minor
- **Status:** Fixed
- **Fix Branch:** feature/US-0015-simulator-scan-mock
- **Found in:** `app/(tabs)/wishlists.tsx`
- **Story:** US-0007
- **Found by:** User (simulator demo observation)
- **Description:** When creating a new wishlist, tapping the name input caused the iOS keyboard to appear and slide over the modal, hiding the text field. The user could not see what they were typing.
- **Fix:** Wrapped the modal sheet content in a `KeyboardAvoidingView` with `behavior="padding"` so the modal shifts upward when the keyboard appears.

### BUG-0108: Dashboard phase pipeline accumulates across sessions — misleading progress metrics

- **Severity:** Medium
- **Status:** To Do (Enhancement)
- **Found in:** `docs/sdlc-status.json` (phases array), `tools/generate-dashboard.js` (phase strip rendering)
- **Story:** Tooling
- **Found by:** User (observation — screenshot showing 7/8 complete when only 1 phase is active in current session)
- **Description:** The `phases` array in `sdlc-status.json` grows indefinitely across sessions. The dashboard renders all phases in a single horizontal strip, so completed phases from prior sessions (Blueprint, Architect, Build, etc.) always show alongside the current session's active phase. This makes "Phases Complete: 7/8" misleading — 7 of those phases belong to previous sessions and the ratio has no meaning within the current session's context.
- **Root cause:** `sdlc-status.json` has no concept of sessions. All phases are flat in one array, and the dashboard has no way to distinguish "current session" from "historical session" phases.
- **Approaches considered:**

  **A — Per-session reset (user's suggestion):** Add a `sessions` array to `sdlc-status.json`. Each session is `{ id, startedAt, phases: [...] }`. The dashboard shows only the current (last) session's phases and progress metrics. Previous sessions collapse into a "Session History" accordion. Metrics (phases complete, tasks done) reset per session.
  - ✅ Clean, accurate per-session metrics
  - ✅ Historical sessions still browsable
  - ⚠️ Requires schema migration + dashboard rendering change

  **B — Phase type tagging:** Add `"type": "sdlc" | "iteration"` to each phase. BLAST phases 1–6 are `sdlc` (run once, shown as project foundation). Any subsequent phases are `iteration` (shown in a separate "Iterations" row below). Progress metrics only count `iteration` phases for the current session.
  - ✅ Minimal schema change
  - ✅ Preserves the visual BLAST pipeline as a permanent reference
  - ⚠️ Iteration phases still accumulate across sessions without session grouping

  **C — Rolling current-session view (simplest):** Add `"sessionStartPhaseId"` to the root of `sdlc-status.json`. Conductor sets this to the first phase ID of each session. The dashboard renders phases before `sessionStartPhaseId` as a greyed "prior work" strip and phases from `sessionStartPhaseId` onward as the active pipeline. Metrics only count active phases.
  - ✅ Single integer field change — minimal migration
  - ✅ Dashboard change is CSS-level (grey vs active styling)
  - ✅ "Phases Complete" becomes meaningful within the session
  - ⚠️ Prior work strip can get long over many sessions

- **Recommendation:** **Option C** for now (low effort, high impact on the misleading metric). Option A is the proper long-term fix if the project runs many more sessions.
- **Fix scope:** `docs/sdlc-status.json` (add `sessionStartPhaseId`), `tools/generate-dashboard.js` (split phase strip rendering, scope metrics to session phases).

### BUG-0107: Dashboard blinks on every auto-refresh due to full-page reload architecture

- **Severity:** Low
- **Status:** Backlog (Future Enhancement)
- **Found in:** `tools/generate-dashboard.js` (line 112 — `<meta http-equiv="refresh" content="5">`)
- **Story:** Tooling
- **Found by:** User (observation)
- **Description:** The dashboard uses `<meta http-equiv="refresh" content="5">` to stay live during pipeline runs. This causes a full browser page reload every 5 seconds, resulting in a visible blink/flash even when no data has changed. It also resets scroll position and any expanded UI state on every cycle.
- **Enhancement:** Replace the meta-refresh with a WebSocket or SSE (Server-Sent Events) connection so the dashboard can receive push updates from a lightweight local dev server (e.g. `ws` or Node's `http` module). Alternatively, a polling `fetch` from JavaScript against a JSON endpoint would allow DOM diffing without a full reload. This is a project-agnostic pipeline improvement relevant to any team using the SDLC dashboard tooling.

### BUG-0109: ProductCard savedPill and savedPillText use hardcoded hex colors instead of theme tokens

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** feature/plan-a-fixes
- **Found in:** `components/ProductCard.tsx` (lines 197, 208)
- **Story:** US-0017
- **Found by:** Lens (code review)
- **Description:** The `savedPill` style uses `backgroundColor: '#E8F5E9'` and `savedPillText` uses `color: '#2E7D32'` — both are hardcoded hex values that bypass the design-system theme tokens. The theme `colors.ts` does not expose a `successLight` or `savedBackground` token, so Pixel introduced ad-hoc colours. Per the design system compliance rule, all colours must come from `theme/colors.ts`.
- **Fix:** Added `successLight: '#E8F5E9'` and `successDark: '#2E7D32'` tokens to `theme/colors.ts`; updated `ProductCard.tsx` to reference `colors.successLight` and `colors.successDark`.

---

### BUG-0110: BottomSheetInput confirm button is never visually disabled when input is empty — AC-0060 not met

- **Severity:** Major
- **Status:** Fixed
- **Fix Branch:** feature/plan-a-fixes
- **Found in:** `components/BottomSheetInput.tsx` (lines 81–88), `app/wishlist/[id].tsx` (line 85)
- **Story:** US-0019
- **Found by:** Lens (code review)
- **Description:** AC-0060 requires the save button to be disabled when the input is empty. The component uses a `useRef` (not `useState`) to track the current value, so the component cannot reactively re-render to toggle `disabled`. The confirm `TouchableOpacity` has no `disabled` prop and no visual disabled style. The rename handler in `wishlist/[id].tsx` does guard `!newName.trim()` so data integrity is safe, but the button appears pressable even when the field is empty, which fails the acceptance criterion.
- **Fix:** Converted `valueRef` to `useState` in `BottomSheetInput`. Added `disabled={value.trim() === ''}` to the confirm `TouchableOpacity` and a `confirmButtonDisabled: { opacity: 0.4 }` style for visual feedback.

---

### BUG-0106: Dashboard shows no audio/notification alert when pipeline state changes — user has no signal to return to terminal

- **Status:** Fixed
- **Severity:** Medium
- **Found in:** `tools/generate-dashboard.js` (dashboard HTML generation)
- **Story:** Tooling
- **Found by:** User (demo prep observation)
- **Description:** The agentic SDLC dashboard auto-refreshes every 5 seconds but gives no audio or notification signal when pipeline phases complete, agents become blocked, or bugs are opened. Users stepping away from the terminal have no way to know when their attention is required.
- **Fix:** Added a `localStorage`-based state change detection system. Each generated page embeds a `DASH_SNAPSHOT` JSON object with current phase, bug count, agent statuses, and pipeline completion state. On page load, the snapshot is compared to the previous render stored in `localStorage`. When a meaningful change is detected (phase completes, agent blocked, pipeline finishes, new bugs opened), the system plays a Web Audio API tone and fires a browser `Notification`. A "🔔 Alerts" button in the header lets users grant notification permission. No new dependencies — uses only built-in browser APIs.
