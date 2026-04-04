# Bugs — CTC-Mobile-Wishlist

<!-- Add bugs in BUG-XXXX format as they are discovered. -->

## P0 — Critical (Agent execution failures)

### BUG-0001: AsyncStorage key schema conflict between docs

- **Severity:** Critical
- **Status:** Fixed
- **Found in:** `architecture/DATA_FLOW.md` line 70, `docs/agents/BE_DEV_AGENT.md`, `docs/agents/ARCHITECT_AGENT.md`
- **Description:** DATA_FLOW.md line 70 says `wishlists:${userId}` (per-user) but Section 5 key schema table says global `wishlists`. ARCHITECT_AGENT says global, BE_DEV_AGENT says per-user. Forge and Keystone would implement differently.
- **Fix:** P0.1 — Standardize to global `wishlists` key, filtered by ownerId at read time.

### BUG-0002: Palette agent never spawned in orchestration playbook

- **Severity:** Critical
- **Status:** Fixed
- **Found in:** `docs/agents/DM_AGENT.md` (orchestration playbook, Phase 3)
- **Description:** DM_AGENT.md orchestration playbook never spawns Palette. Design guidance is hardcoded as a string on line 110. Palette's instruction file exists but has no execution point.
- **Fix:** P0.2 — Insert Palette spawn step before Forge+Pixel parallel step in Phase 3.

### BUG-0003: No phase exit criteria defined for Conductor

- **Severity:** Critical
- **Status:** Fixed
- **Found in:** `docs/agents/DM_AGENT.md`
- **Description:** Conductor has no way to know when a phase is "done." No acceptance criteria per phase, no exit gates.
- **Fix:** P0.3 — Add Phase Exit Criteria table to DM_AGENT.md.

### BUG-0004: Vague error handling and escalation rules

- **Severity:** Critical
- **Status:** Fixed
- **Found in:** `docs/agents/DM_AGENT.md` lines 242-246
- **Description:** Escalation rules are vague prose with no retry limits, no timeout handling, no specific failure scenarios. Conductor cannot autonomously recover from agent failures.
- **Fix:** P0.4 — Replace with structured Error Handling SOP table.

### BUG-0005: Lens Phase 5 review scope undefined

- **Severity:** Critical
- **Status:** Fixed
- **Found in:** `docs/agents/CODE_REVIEWER_AGENT.md`
- **Description:** Lens has review instructions for Phases 2-4 but Phase 5 (Trigger/Test) review has no task description. Lens won't know what to check after testing.
- **Fix:** P0.5 — Add Phase 5 Review Focus subsection.

## P1 — Major (Prevents confusion)

### BUG-0006: AC ownership conflict between PO and Tester

- **Severity:** Major
- **Status:** Fixed
- **Found in:** `docs/agents/PO_AGENT.md`, `docs/agents/FUNCTIONAL_TESTER_AGENT.md`
- **Description:** Both Compass (PO) and Sentinel (Tester) are told to update AC status checkboxes in RELEASE_PLAN.md. Creates potential conflicts during execution.
- **Fix:** P1.1 — Clarify: Tester marks pass/fail, PO performs final acceptance sign-off.

### BUG-0007: Free-form context passing between agents

- **Severity:** Major
- **Status:** Fixed
- **Found in:** `docs/agents/DM_AGENT.md` lines 162-170
- **Description:** Context passing rules are free-form prose with no standard structure. Conductor may omit critical context when spawning agents.
- **Fix:** P1.2 — Add structured context passing template.

### BUG-0008: 4 acceptance criteria lack test cases

- **Severity:** Major
- **Status:** Fixed
- **Found in:** `docs/TEST_CASES.md`
- **Description:** AC-0004 (splash screen), AC-0006 (bundled images), AC-0007 (mock users), AC-0015 (search bar visibility) have no corresponding test cases.
- **Fix:** P1.3 — Add TC-0037 through TC-0040.

### BUG-0009: No single source of truth for real vs simulated features

- **Severity:** Major
- **Status:** Fixed
- **Found in:** `docs/AGENT_PLAN.md` Section 4
- **Description:** Multiple agents mention "POC Simulation" with different meanings. No feature-level table of what's real code vs. simulated documentation.
- **Fix:** P1.4 — Add feature-level real vs. simulated scope table.

### BUG-0010: ROLLBACK.md referenced but empty

- **Severity:** Major
- **Status:** Fixed
- **Found in:** `docs/ROLLBACK.md` (does not exist)
- **Description:** AGENTS.md Phase 5 references ROLLBACK.md but the file doesn't exist. Agents that check for it will find nothing.
- **Fix:** P1.5 — Create ROLLBACK.md with POC rollback strategy.

### BUG-0011: No cross-link between SDLC dashboard and Plan Visualizer

- **Severity:** Major
- **Status:** Fixed
- **Found in:** `tools/generate-dashboard.js`, `docs/dashboard.html`
- **Description:** The SDLC dashboard and Plan Visualizer are separate HTML files with no navigation between them. Users must know both URLs.
- **Fix:** P1.6 — Add Plan Visualizer link in dashboard footer.

### BUG-0012: No device compatibility section in design system

- **Severity:** Major
- **Status:** Fixed
- **Found in:** `architecture/DESIGN_SYSTEM.md`
- **Description:** No explicit responsive breakpoints, no target device matrix, no safe area dimensions documented. No confirmation the UI fits iPhone 17 Pro Max (430pt) or Pixel 10 Pro XL (411pt).
- **Fix:** P1.7 — Add Device Compatibility section.

### BUG-0013: No deployment strategy documented

- **Severity:** Major
- **Status:** Fixed
- **Found in:** `docs/AGENT_PLAN.md`, `docs/agents/DM_AGENT.md`
- **Description:** No deployment instructions anywhere in the docs. No guidance on how to run the app on iPhone, simulator, or Android for the hackathon demo.
- **Fix:** P1.8 — Add Deployment Strategy section to AGENT_PLAN.md and Phase 6 instruction to DM_AGENT.md.

### BUG-0014: Dashboard is dark-mode only with low contrast text

- **Severity:** Major
- **Status:** Fixed
- **Found in:** `tools/generate-dashboard.js`
- **Description:** Dashboard has no light mode toggle. Several text colors fail WCAG AA contrast: #666 on #1a1a2e = 2.8:1 ratio (requires 4.5:1). Card borders and metric dividers are nearly invisible.
- **Fix:** P1.9 — Add CSS variable theming, light/dark toggle with localStorage persistence, fix contrast ratios.

### BUG-0015: Dashboard references EliteA instead of Claude Code

- **Severity:** Major
- **Status:** Fixed
- **Found in:** `tools/generate-dashboard.js` lines 174, 314; `docs/sdlc-status.json` line 3
- **Description:** Dashboard subtitle and footer reference "EPAM EliteA" but the hackathon uses Claude Code as the agentic platform. EliteA is for the full production implementation.
- **Fix:** P1.10 — Replace "EPAM EliteA" with "Claude Code" in dashboard generator and status JSON.

## P2 — Minor (Polish)

### BUG-0016: Unused `spin` CSS keyframe in dashboard

- **Severity:** Minor
- **Status:** Fixed
- **Found in:** `tools/generate-dashboard.js` line 111
- **Description:** `@keyframes spin` is defined but never referenced by any CSS class. Dead code.
- **Fix:** P2.1 — Remove the unused keyframe.

### BUG-0017: No convenience `build` script in package.json

- **Severity:** Minor
- **Status:** Fixed
- **Found in:** `package.json`
- **Description:** Must run `plan:generate` and `dashboard` separately. No single command to regenerate all outputs.
- **Fix:** P2.2 — Add `"build": "npm run plan:generate && npm run dashboard"`.

### BUG-0018: No pre-phase file verification in orchestration

- **Severity:** Minor
- **Status:** Fixed
- **Found in:** `docs/agents/DM_AGENT.md`
- **Description:** Agents are told to read mandatory files at startup but no checklist to verify files exist before spawning. Agent could fail if a prior phase didn't produce expected files.
- **Fix:** P2.3 — Add pre-phase verification note to DM_AGENT.md.

### BUG-0019: Design tokens duplicated across 3 files

- **Severity:** Minor
- **Status:** Fixed (partially — DM_AGENT.md hardcoded tokens removed by P0.2; remaining duplication acceptable)
- **Found in:** `architecture/DESIGN_SYSTEM.md`, `docs/agents/UI_DESIGNER_AGENT.md`, `docs/agents/DM_AGENT.md` line 110
- **Description:** Same CTC brand color values (#D52B1E, etc.) defined in 3 places. If tokens change, all 3 need updating. Acceptable for hackathon since agents need self-contained context.
- **Fix:** Resolved by P0.2 (Palette spawn removes hardcoded tokens from DM_AGENT.md). Remaining duplication is acceptable.

### BUG-0020: Story priorities duplicated in PO_AGENT.md and AGENT_PLAN.md

- **Severity:** Minor
- **Status:** Won't Fix (acceptable duplication for agent isolation)
- **Found in:** `docs/agents/PO_AGENT.md`, `docs/AGENT_PLAN.md`
- **Description:** Same priority ordering stated in two places. Low drift risk for a 1-day event.
- **Fix:** No change — acceptable duplication for agent isolation.

### BUG-0021: Branch naming convention stated 5+ times

- **Severity:** Minor
- **Status:** Won't Fix (acceptable duplication for agent isolation)
- **Found in:** Multiple agent files
- **Description:** Branch naming format `feature/US-XXXX-description` repeated across 5+ agent instruction files.
- **Fix:** No change — acceptable duplication for agent isolation.

### BUG-0022: No hover states on dashboard interactive elements

- **Severity:** Minor
- **Status:** Fixed
- **Found in:** `tools/generate-dashboard.js`
- **Description:** Agent cards and story rows have no hover feedback. Dashboard feels static when interacting.
- **Fix:** P1.9 — Add hover brightness filter to agent cards and story rows.

### BUG-0023: Dashboard has no responsive layout for phones/tablets

- **Severity:** Major
- **Status:** Fixed
- **Found in:** `tools/generate-dashboard.js`
- **Description:** Dashboard uses fixed desktop grid layouts (3-column metrics, 2-column story grid, 6-phase horizontal pipeline). On phones and tablets in portrait or landscape, UI elements overflow, get cut off, or become unreadable. No media queries exist.
- **Fix:** Add responsive CSS media queries for tablet portrait (768-1024px), tablet landscape, phone landscape (up to 767px), phone portrait (up to 480px), and small phone (up to 375px). Pipeline stacks vertically on phones, grids collapse to fewer columns, deliverables/agent tasks hide on small screens.

### BUG-0024: Dashboard has no About section or attribution

- **Severity:** Minor
- **Status:** Fixed
- **Found in:** `tools/generate-dashboard.js`
- **Description:** No way for viewers to learn what the dashboard is, who built it, or find the source repo. Missing attribution and context for hackathon demo audience.
- **Fix:** Add "About" button in header with modal popup: title "AI-SDLC Orchestrator Visualizer", author "by Kamal Syed", GitHub repo link, and close button. Modal has backdrop blur and closes on overlay click or close button.

## P0 — Critical (Orchestration Loop Failures)

### BUG-0025: No retry state tracking for Conductor

- **Severity:** Critical
- **Status:** Fixed
- **Found in:** `docs/agents/DM_AGENT.md`
- **Description:** Conductor has no mechanism to persist retry counts across agent spawns. If Conductor loses context or is re-spawned, it could re-invoke the same failing agent indefinitely, creating an infinite loop.
- **Fix:** Add retry tracking section — Conductor logs retry counts in `progress.md` with structured format per task.

### BUG-0026: "Escalate to human" workflow undefined

- **Severity:** Critical
- **Status:** Fixed
- **Found in:** `docs/agents/DM_AGENT.md` line 280
- **Description:** Error Handling SOP says "Escalate to human. Do not proceed." but never defines the mechanism — no instructions for how orchestration pauses, how the human is notified, or how orchestration resumes after human intervention.
- **Fix:** Add concrete escalation workflow: Conductor prints blocking issue summary, writes BLOCKED status to sdlc-status.json, pauses orchestration, and documents resume instructions.

### BUG-0027: No BLOCK recovery protocol

- **Severity:** Critical
- **Status:** Fixed
- **Found in:** `docs/agents/DM_AGENT.md`, `docs/agents/CODE_REVIEWER_AGENT.md`
- **Description:** After Lens issues a BLOCK verdict and human fixes the issue, there is no documented protocol for how Conductor knows to resume, which step to resume from, or whether the blocked branch should be rolled back first.
- **Fix:** Add BLOCK recovery protocol to DM_AGENT.md and post-BLOCK guidance to CODE_REVIEWER_AGENT.md.

### BUG-0028: No parallel agent failure coordination rules

- **Severity:** Critical
- **Status:** Fixed
- **Found in:** `docs/agents/DM_AGENT.md`
- **Description:** Phase 3 spawns Forge + Pixel in parallel. If one agent BLOCKs or fails, there are no rules for what happens to the other parallel agent — does it continue, pause, or get cancelled?
- **Fix:** Add parallel agent failure coordination rules to DM_AGENT.md.

### BUG-0029: No hard phase timeout

- **Severity:** Major
- **Status:** Fixed
- **Found in:** `docs/agents/DM_AGENT.md` line 283
- **Description:** Only a 50% overrun guideline exists for timeboxing. No absolute hard timeout per phase. A phase could theoretically run indefinitely if scope keeps being renegotiated.
- **Fix:** Add hard phase timeout (90 min max per phase) with force-cut-scope action at DM_AGENT.md.

### BUG-0030: No BLOCK vs REQUEST CHANGES threshold criteria for Lens

- **Severity:** Major
- **Status:** Fixed
- **Found in:** `docs/agents/CODE_REVIEWER_AGENT.md` line 100
- **Description:** Lens has three verdict options (APPROVE / REQUEST CHANGES / BLOCK) but no criteria for when to issue BLOCK vs REQUEST CHANGES. Left entirely to Lens discretion, which could produce inconsistent behavior across review cycles.
- **Fix:** Add explicit BLOCK threshold criteria to CODE_REVIEWER_AGENT.md — security vulnerabilities, type-safety violations, and test failures = BLOCK; all other issues = REQUEST CHANGES.

### BUG-0031: Agentic orchestration is coupled to Claude Code platform

- **Severity:** Major
- **Status:** Fixed
- **Found in:** `docs/agents/DM_AGENT.md`, `README.md`
- **Description:** Agent spawning instructions, CLI invocations, and parallel execution patterns are hardcoded to Claude Code. Cannot run the same orchestration on Codex, Gemini, or open-source models without rewriting DM_AGENT.md and README.md. The agent instruction files themselves are platform-agnostic markdown, but the invocation and spawning mechanism is not.
- **Fix:** Create `orchestrator/` adapter layer with platform-specific spawn implementations. Abstract DM_AGENT.md spawning to use platform-agnostic patterns. Update README.md with multi-platform quick-start instructions.
