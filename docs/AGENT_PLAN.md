# Agent Orchestration Framework

> **Platform:** Platform-agnostic (Claude Code, Codex, Gemini, Aider, CodeMie, OpenCode, EliteA) — see `orchestrator/spawn.js`
> **Agent Config:** `agents.config.json` — single source of truth for agent definitions
> **Project-Specific Plan:** See `docs/HACKATHON_PLAN.md` for agent roster, timeline, prompt templates, and scope

---

## 1. Orchestration Pipeline

The Delivery Manager agent (configured as `orchestrator.dmAgent` in `agents.config.json`) orchestrates the full pipeline — spawning agents as sub-agents. All agent metadata (names, roles, instruction files) is loaded from `agents.config.json`.

```
DM Agent orchestrates the full pipeline — spawning agents as sub-agents:

Phase 1: Blueprint
  DM spawns → PO Agent
  PO → Validates requirements, prioritizes backlog for scope
  DM reviews output, updates progress.md
       ↓
Phase 2: Architect
  DM spawns → Architect Agent (passes PO's priority list)
  Architect → Scaffolds project, creates types, service interfaces
  DM spawns → Reviewer Agent (reviews scaffold, types, service interfaces)
  Reviewer gate: APPROVE → proceed / REQUEST CHANGES → Architect fixes
       ↓
Phase 3: Build (PARALLEL)
  DM spawns → BE Dev + FE Dev simultaneously (passes Architect's scaffold context)
  ┌─ BE Dev → Implements services, mock data, providers
  └─ FE Dev → Builds screens, components, navigation
  (DM passes UI Designer's design guidance to FE Dev)
  DM spawns → Reviewer (reviews BE Dev's services + FE Dev's screens)
  Reviewer gate: APPROVE → proceed / REQUEST CHANGES → agents fix
       ↓
Phase 4: Integration
  DM spawns → FE Dev (passes BE Dev's completed service paths)
  FE Dev → Wires services to screens, end-to-end flows
  DM spawns → Reviewer (reviews integration code)
  Reviewer gate: APPROVE → proceed to testing
       ↓
Phase 5: Test (PARALLEL)
  DM spawns → Functional Tester + Automation Tester simultaneously
  ┌─ Functional Tester → Executes test cases, reports bugs
  └─ Automation Tester → Creates test suites
  DM spawns → Reviewer (reviews test quality and coverage)
  DM routes critical bugs back to dev agents if needed
       ↓
Phase 6: Polish
  DM spawns fixers as needed → Final merge, demo prep
```

---

## 2. PR Creation & Review Flow

Every phase that produces code follows this PR lifecycle, owned by the **DM Agent**:

```
Dev Agent (any code-producing agent)
  │
  ├─ Commits to feature branch (e.g., feature/US-XXXX-feature-name)
  ├─ Pushes to remote
  └─ Reports completion to DM
          │
          ▼
DM Agent
  │
  ├─ Creates PR targeting `develop`
  ├─ Assigns Reviewer as reviewer
  └─ Waits for Reviewer verdict
          │
          ▼
Reviewer Agent
  │
  ├─ APPROVE → DM verifies CI, then squash-merges
  ├─ REQUEST CHANGES → DM re-spawns dev agent with feedback
  │     └─ Agent fixes → push → DM re-requests review
  └─ BLOCK → DM halts, escalates to human
          │
          ▼
CI Pipeline (automated, 6 jobs)
  │
  ├─ Lint (eslint)
  ├─ Test + Coverage (jest, 80% threshold)
  ├─ Build (full pipeline)
  ├─ Orchestrator Validation (spawn.js smoke test)
  ├─ Prettier Format Check
  └─ Dependency Audit (npm audit)
          │
          ▼
All green → DM merges (squash and merge) → deletes feature branch
Any red → DM reads error, spawns appropriate agent to fix
```

**Key rules:**

- Dev agents **never** create PRs — only the DM Agent does
- DM **never** merges without Reviewer approval AND green CI
- BLOCK requires human intervention — DM does not retry
- REQUEST CHANGES gets exactly 1 retry before escalation
- Squash and merge keeps `develop` history clean

**Verdict Criteria (Reviewer):**

- **BLOCK** — Security vulnerabilities, fundamental type-safety violations, all tests failing, wrong architecture layer, data loss risk. Requires human intervention.
- **REQUEST CHANGES** — Missing error states, hardcoded values, test coverage gaps, minor architecture deviations, naming issues, accessibility gaps, scope mismatches. Dev agent can fix.
- **APPROVE** — All blockers resolved, no majors remain, tests pass, architecture followed, design system compliant.

**Concurrency safety during parallel phases:**

- When dev agents push simultaneously, use `safePush(branch)` (auto-retry with backoff)
- Before merging parallel branches, DM runs `checkOverlap(branchA, branchB)` to detect conflicting edits
- All `sdlc-status.json` updates use `atomicReadModifyWriteJson()` to prevent lost-update races
- All `progress.md` entries use `atomicAppend()` to prevent interleaved writes
- New bug/task IDs use `reserveId('BUG')` to prevent duplicate allocation

---

## 3. BLOCK Recovery Protocol

When the Reviewer issues a BLOCK verdict:

1. DM pauses orchestration — no more agents spawned
2. DM sets phase status to `blocked` in `sdlc-status.json` (via `atomicReadModifyWriteJson()`)
3. DM writes BLOCKED entry in `progress.md` (via `atomicAppend()`)
4. **Human resolves the issue** and commits to the affected branch
5. DM re-spawns Reviewer to re-review
6. If APPROVE → resume. If BLOCK again → re-escalate. No looping.

---

## 4. Execution Modes

### Option A: Sequential (Single Terminal)

Run one agent at a time in a single session, switching roles via prompts.

- **Best for:** Solo developer, simple workflow
- **Command:** Launch your CLI, then paste each agent's prompt template

### Option B: Parallel Sessions (Multiple Terminals)

Run 2-3 sessions simultaneously with different agent roles.

- **Best for:** Maximizing velocity
- **Terminal 1:** Architect → BE Dev
- **Terminal 2:** UI Designer → FE Dev
- **Terminal 3:** Testers (after code is ready)

### Option C: Agent Tool Delegation

Use Claude Code's built-in Agent tool to spawn sub-agents for independent tasks.

- **Best for:** Automated orchestration within a single session
- **Command:** Let the Agent tool handle parallelism internally

### Option D: Spawn Helper

Use the orchestrator to generate correct commands for your platform:

```bash
node orchestrator/spawn.js --agent <AgentName>
node orchestrator/spawn.js --list-platforms
node orchestrator/spawn.js --list-agents
node orchestrator/spawn.js --print-all
```

---

## 5. Concurrency Safety

When agents run in parallel, shared state files require concurrency-safe access. Three orchestrator utilities handle this:

| Module            | Purpose                                                      | Key Functions                                                  |
| ----------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| `file-lock.js`    | mkdir-based file locking with stale detection                | `withLock()`, `withLockSync()`                                 |
| `atomic-write.js` | Atomic JSON read-modify-write, locked append, ID reservation | `atomicReadModifyWriteJson()`, `atomicAppend()`, `reserveId()` |
| `git-safe.js`     | Retry-safe push, conflict detection, overlap checking        | `safePush()`, `detectConflicts()`, `checkOverlap()`            |

**Protected shared files:** `docs/sdlc-status.json`, `progress.md`, `docs/BUGS.md`, `docs/ID_REGISTRY.md`, `docs/AI_COST_LOG.md`

**Rules:**

- Never write directly to shared files during parallel execution — always use the concurrency utilities
- Never manually increment IDs in `ID_REGISTRY.md` — use `reserveId(sequence)` to atomically allocate
- Always use `safePush()` instead of raw `git push` — it retries on network errors and auto-pulls on rejection
- Before merging parallel branches, run `checkOverlap()` to identify conflicting file edits

**Git push safety:** `safePush(branch)` retries on network errors (exponential backoff, 4 attempts) and auto-pulls on rejection.

**Before merging parallel branches:** Run `checkOverlap(branchA, branchB)` to identify overlapping file edits. If files overlap, merge branches sequentially (first-in merges clean, second rebases on top).

---

## 6. Config-Driven Setup

All agent definitions are centralized in `agents.config.json`. To set up a new project:

1. Edit `agents.config.json` — define agents with names, roles, icons, colors, instruction files
2. Set `orchestrator.dmAgent` and `orchestrator.reviewer` to identify the DM and reviewer agents
3. Set `orchestrator.avatarGrid` to define the avatar composite image layout
4. Run `npm run init:status` — generates `docs/sdlc-status.json` with your agents
5. Run `npm run build` — dashboard and avatars auto-adapt
6. Create a project-specific plan (e.g., `docs/HACKATHON_PLAN.md`) with agent roster, timeline, and prompt templates

---

_This is the generic orchestration framework. For project-specific agent rosters, timelines, prompt templates, and scope, see `docs/HACKATHON_PLAN.md`._
