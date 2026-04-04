# Lessons — CTC-Mobile-Wishlist

<!-- Distilled from 66 bugs (BUG-0001–BUG-0066) across Sessions 4–7. -->

---

## L-0001 — Establish a Single Source of Truth for Every Shared Artifact

**Bugs:** BUG-0001, BUG-0006, BUG-0019, BUG-0020, BUG-0021, BUG-0050, BUG-0054, BUG-0063, BUG-0064, BUG-0065
**Lesson:** Every piece of shared configuration should live in exactly one canonical file. Other consumers read from that source at runtime or build time. Prefer config files (`agents.config.json`) and CSS variables (`var(--brand-primary)`) over copy-pasting values. If duplication is unavoidable (e.g., agent isolation requires self-contained context), document it explicitly and accept the drift risk.
_When the same data (AsyncStorage key schemas, design tokens, agent registries, brand colors, branch naming conventions) is duplicated across multiple files, they inevitably drift._
**Date:** 2026-04-04

---

## L-0002 — Define Phase Exit Criteria and Error Handling Before Orchestration Begins

**Bugs:** BUG-0003, BUG-0004, BUG-0025, BUG-0026, BUG-0027, BUG-0029
**Lesson:** Every orchestration phase needs: (1) explicit exit criteria, (2) a retry budget with state tracking, (3) a hard timeout with a force-cut-scope action, (4) a concrete escalation workflow, and (5) a BLOCK recovery protocol. Vague prose like "handle errors appropriately" is worse than no instructions — it creates false confidence.
_The orchestration playbook had phases but no exit gates, vague error handling, no retry limits, no timeout, and no recovery protocol after a BLOCK verdict._
**Date:** 2026-04-04

---

## L-0003 — Design for Parallel Agent Failures from Day One

**Bugs:** BUG-0028, BUG-0044, BUG-0045, BUG-0046, BUG-0047, BUG-0048
**Lesson:** Parallel execution requires: (1) file-level locking for shared state, (2) atomic read-modify-write for JSON files, (3) locked append for log files, (4) locked ID reservation to prevent duplicates, (5) retry-safe git push, (6) pre-merge overlap detection between branches, and (7) explicit rules for when a sibling agent fails.
_When Forge and Pixel run in parallel, their writes to shared files race. Git pushes fail silently. Merging parallel branches without conflict detection breaks mid-way._
**Date:** 2026-04-04

---

## L-0004 — Escape All Dynamic Content in HTML Generation

**Bugs:** BUG-0055
**Lesson:** Every string interpolated into HTML must pass through an escape function — `esc()` for attribute values, `jsEsc()` for JavaScript string contexts. Treat all data as untrusted at the rendering boundary.
_The dashboard HTML generator interpolated data from JSON into data attributes and onclick handlers without escaping, enabling XSS._
**Date:** 2026-04-04

---

## L-0005 — Quote All Shell Variable Interpolations

**Bugs:** BUG-0056
**Lesson:** Always double-quote shell variable interpolations. Better yet, use `execFile` (array-based) instead of `exec` (string-based) to avoid shell interpretation entirely.
_Git commands in the orchestrator interpolated branch names without quoting, enabling command injection._
**Date:** 2026-04-04

---

## L-0006 — Guard Recursive Recovery Paths Against Infinite Loops

**Bugs:** BUG-0025, BUG-0057
**Lesson:** Any self-healing or retry mechanism must have: (1) a maximum depth/count parameter, (2) state tracking that persists across invocations, and (3) an explicit failure path when the limit is reached.
_The file lock's stale-lock recovery called tryAcquire() recursively with no depth limit, producing stack overflow._
**Date:** 2026-04-04

---

## L-0007 — Make Race Windows Explicit — PID Alone Is Not Unique

**Bugs:** BUG-0058
**Lesson:** Temp file names need at least PID + timestamp. Any time you think "this will never happen twice," add a second uniqueness factor.
_Atomic write temp files used process.pid as the only disambiguator. Two rapid writes from the same process would collide._
**Date:** 2026-04-04

---

## L-0008 — Wrap Every JSON.parse in a Try-Catch with Context

**Bugs:** BUG-0059, BUG-0060
**Lesson:** Every JSON.parse() should be wrapped in a try-catch that includes the file path in the error message. Corruption is more likely in shared state files.
_JSON.parse() calls in atomic-write.js and spawn.js had no error handling. A corrupt config file produced an opaque error._
**Date:** 2026-04-04

---

## L-0009 — Validate CLI Arguments Before Accessing Them

**Bugs:** BUG-0061
**Lesson:** Every CLI flag that takes a value needs a bounds check and a usage hint in the error message. This is a system boundary — validate strictly.
_The --agent flag accessed args[idx + 1] without checking if it existed, producing undefined as the agent name._
**Date:** 2026-04-04

---

## L-0010 — Expand Linting to Cover All Executable Code from Day One

**Bugs:** BUG-0033, BUG-0034, BUG-0035, BUG-0036
**Lesson:** Configure your linter to cover all JS/TS directories from the start, even if they're empty. Add framework globals (Jest, Node timers) in the initial config.
_ESLint only covered tools/. When orchestrator/ and tests/ were added, they had unused imports, useless assignments, and lost error chains that went undetected._
**Date:** 2026-04-04

---

## L-0011 — Enforce Formatting Locally, Not Just in CI

**Bugs:** BUG-0037, BUG-0043, BUG-0049
**Lesson:** Install a pre-commit hook (husky + lint-staged) that auto-formats staged files. If your code parses markdown with regexes, test the fixture after formatting.
_Prettier was added to CI but not enforced locally. Every commit triggered CI failures. Prettier reformatted a test fixture's markdown structure, breaking regex-based parsers._
**Date:** 2026-04-04

---

## L-0012 — Every Orchestration Agent Needs an Explicit Spawn Point

**Bugs:** BUG-0002, BUG-0005, BUG-0051
**Lesson:** For every agent in the registry, verify: (1) there is a spawn instruction in the orchestration playbook, (2) every phase the agent participates in has defined tasks, (3) the agent count in prose matches the actual count.
_Palette had an instruction file but no spawn point in the orchestration playbook. The DM referenced "7 sub-agents" when 8 existed._
**Date:** 2026-04-04

---

## L-0013 — Standardize Context Passing Between Agents

**Bugs:** BUG-0007
**Lesson:** Define a structured context template that every agent spawn must include: assigned stories, branch name, input files, output expectations, and predecessor artifacts. Treat agent spawning like a function call — define the interface.
_Conductor passed context to sub-agents as free-form prose. Critical information was sometimes omitted or formatted differently._
**Date:** 2026-04-04

---

## L-0014 — Build Dashboards with WCAG Contrast and Responsive Layouts from the Start

**Bugs:** BUG-0014, BUG-0022, BUG-0023, BUG-0024
**Lesson:** Even for internal dashboards: (1) check contrast ratios against WCAG AA, (2) add at least 3 breakpoints (phone, tablet, desktop), (3) add hover states to interactive elements, (4) include an About section.
_The dashboard launched dark-mode-only with contrast ratios as low as 2.8:1 (WCAG AA requires 4.5:1), no responsive breakpoints, and no hover feedback._
**Date:** 2026-04-04

---

## L-0015 — Surface Blocked States with Multi-Channel Alerts

**Bugs:** BUG-0038, BUG-0039, BUG-0040, BUG-0041, BUG-0042
**Lesson:** BLOCKED states need escalating alert channels: (1) visual distinction in UI, (2) audio alert, (3) browser push notification. Each should be toggleable and persist preference to localStorage.
_When orchestration hit a BLOCKED state, the dashboard showed no visual difference from pending. The human operator might not notice for hours._
**Date:** 2026-04-04

---

## L-0016 — Make Frameworks Project-Agnostic from the Start

**Bugs:** BUG-0031, BUG-0050, BUG-0052, BUG-0053, BUG-0054
**Lesson:** Separate the framework (how) from the project (what): agent files define role behaviors as generic templates, a single project entry point holds scope, config files hold registries and branding.
_Agent instruction files, dashboard generators, orchestrator spawn logic, and avatar processing all contained hardcoded project-specific content._
**Date:** 2026-04-04

---

## L-0017 — Add SAST and Secret Scanning to CI Early

**Bugs:** BUG-0032, BUG-0066
**Lesson:** Add CodeQL (or equivalent SAST) and secret scanning (TruffleHog, GitLeaks) to CI in the first sprint. Static analysis catches vulnerability patterns that unit tests miss.
_The project had no CI pipeline initially, then added lint/test/build but no security scanning. XSS and command injection were found only through manual review._
**Date:** 2026-04-04

---

## L-0018 — Document What Is Real vs. Simulated in a POC

**Bugs:** BUG-0009, BUG-0010, BUG-0013
**Lesson:** In any POC or hackathon project, create a scope table early: for each feature, state whether it's real implementation, mock/stub, or documentation-only. Create every referenced document — even stubs.
_Different agents had different assumptions about which features were real code vs. simulated documentation. ROLLBACK.md was referenced but never created._
**Date:** 2026-04-04

---

## L-0019 — Define Verdict Thresholds, Not Just Verdict Options

**Bugs:** BUG-0005, BUG-0030
**Lesson:** For any review or quality gate with multiple severity levels, define explicit threshold criteria. Without thresholds, the same issue gets different verdicts depending on reviewer mood.
_The code reviewer had three verdicts (APPROVE / REQUEST CHANGES / BLOCK) but no criteria distinguishing them._
**Date:** 2026-04-04

---

## L-0020 — Log Cleanup Failures — Don't Swallow Them

**Bugs:** BUG-0062
**Lesson:** Cleanup operations (file deletion, lock release, temp directory removal) should log warnings on failure rather than silently swallowing errors. A logged warning costs nothing during normal operation but saves significant debugging time.
_Lock directory removal in the release() function could fail silently, leaving stale lock directories._
**Date:** 2026-04-04
