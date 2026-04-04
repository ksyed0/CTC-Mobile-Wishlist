# Lessons — CTC-Mobile-Wishlist

<!-- Distilled from 66 bugs (BUG-0001–BUG-0066) across Sessions 4–7. -->

## L-0001: Establish a Single Source of Truth for Every Shared Artifact

**Bugs:** BUG-0001, BUG-0006, BUG-0019, BUG-0020, BUG-0021, BUG-0050, BUG-0054, BUG-0063, BUG-0064, BUG-0065

**Pattern:** When the same data (AsyncStorage key schemas, design tokens, agent registries, brand colors, branch naming conventions) is duplicated across multiple files, they inevitably drift. One file says `wishlists:${userId}` while another says global `wishlists`. Three files each hardcode their own agent name/role/icon maps. Brand colors appear in 11+ CSS locations.

**Lesson:** Every piece of shared configuration should live in exactly one canonical file. Other consumers read from that source at runtime or build time. Prefer config files (`agents.config.json`) and CSS variables (`var(--brand-primary)`) over copy-pasting values. If duplication is unavoidable (e.g., agent isolation requires self-contained context), document it explicitly and accept the drift risk.

---

## L-0002: Define Phase Exit Criteria and Error Handling Before Orchestration Begins

**Bugs:** BUG-0003, BUG-0004, BUG-0025, BUG-0026, BUG-0027, BUG-0029

**Pattern:** The orchestration playbook had phases but no exit gates, vague error handling ("escalate to human"), no retry limits, no timeout, and no recovery protocol after a BLOCK verdict. Conductor could loop infinitely, or pause with no documented way to resume.

**Lesson:** Every orchestration phase needs: (1) explicit exit criteria, (2) a retry budget with state tracking, (3) a hard timeout with a force-cut-scope action, (4) a concrete escalation workflow (what gets written, where, how the human is notified, how to resume), and (5) a BLOCK recovery protocol (rollback steps, re-review trigger, resume point). Vague prose like "handle errors appropriately" is worse than no instructions — it creates false confidence.

---

## L-0003: Design for Parallel Agent Failures from Day One

**Bugs:** BUG-0028, BUG-0044, BUG-0045, BUG-0046, BUG-0047, BUG-0048

**Pattern:** When Forge and Pixel run in parallel, their writes to shared files (sdlc-status.json, ID_REGISTRY.md, progress.md) race. Git pushes fail silently. Merging parallel branches without conflict detection breaks mid-way. No coordination rules existed for what happens when one parallel agent fails.

**Lesson:** Parallel execution requires: (1) file-level locking for shared state (mkdir-based locks with stale detection), (2) atomic read-modify-write for JSON files (temp+rename), (3) locked append for log files, (4) locked ID reservation to prevent duplicates, (5) retry-safe git push with auto-pull on rejection, (6) pre-merge overlap detection between parallel branches, and (7) explicit rules for whether a surviving agent continues, pauses, or rolls back when its sibling fails.

---

## L-0004: Escape All Dynamic Content in HTML Generation

**Bugs:** BUG-0055

**Pattern:** The dashboard HTML generator interpolated data from JSON into `data-*` attributes and `onclick` handlers without escaping. Story IDs, epic names, and bug statuses flowed directly into HTML. A malicious value like `"><script>alert(1)</script>` in any tracked artifact could execute arbitrary JavaScript.

**Lesson:** Every string interpolated into HTML must pass through an escape function — `esc()` for attribute values, `jsEsc()` for JavaScript string contexts. This applies even to "internal" data that "should never contain special characters." Treat all data as untrusted at the rendering boundary. Audit every template literal that produces HTML.

---

## L-0005: Quote All Shell Variable Interpolations

**Bugs:** BUG-0056

**Pattern:** Git commands in the orchestrator interpolated branch names without quoting: `` `git push origin ${branch}` ``. A branch name containing `;rm -rf /` or `$(malicious-command)` would execute arbitrary shell commands.

**Lesson:** Always double-quote shell variable interpolations: `"${branch}"`. Better yet, use `execFile` (array-based) instead of `exec` (string-based) to avoid shell interpretation entirely. This applies to any value that originates from user input, config files, or external systems — even if "branch names should be safe."

---

## L-0006: Guard Recursive Recovery Paths Against Infinite Loops

**Bugs:** BUG-0025, BUG-0057

**Pattern:** The file lock's stale-lock recovery called `tryAcquire()` recursively with no depth limit. If the info file was repeatedly unreadable, this produced a stack overflow. Similarly, the Conductor had no retry counter, risking infinite agent re-spawns.

**Lesson:** Any self-healing or retry mechanism must have: (1) a maximum depth/count parameter, (2) state tracking that persists across invocations (not just in-memory), and (3) an explicit failure path when the limit is reached. Recursive recovery without bounds is a latent crash.

---

## L-0007: Make Race Windows Explicit — PID Alone Is Not Unique

**Bugs:** BUG-0058

**Pattern:** Atomic write temp files used `process.pid` as the only disambiguator. Two rapid writes from the same process to the same directory would collide on the same temp filename.

**Lesson:** Temp file names need at least PID + timestamp (or a counter). Better: use `crypto.randomUUID()` or `os.tmpdir()` with `mkdtemp`. Any time you think "this will never happen twice," add a second uniqueness factor.

---

## L-0008: Wrap Every JSON.parse in a Try-Catch with Context

**Bugs:** BUG-0059, BUG-0060

**Pattern:** `JSON.parse()` calls in atomic-write.js and spawn.js had no error handling. A corrupt config file produced an opaque "Unexpected token" error with no indication of which file was malformed.

**Lesson:** Every `JSON.parse()` should be wrapped in a try-catch that includes the file path in the error message. This is especially important for config files and shared state files that multiple agents write to — corruption is more likely, and the error message is the first diagnostic clue.

---

## L-0009: Validate CLI Arguments Before Accessing Them

**Bugs:** BUG-0061

**Pattern:** The `--agent` flag accessed `args[idx + 1]` without checking if it existed, producing `undefined` as the agent name with no error message.

**Lesson:** Every CLI flag that takes a value needs a bounds check: verify `idx + 1 < args.length` and that the value is non-empty. Provide a usage hint in the error message. This is a system boundary — validate strictly.

---

## L-0010: Expand Linting to Cover All Executable Code from Day One

**Bugs:** BUG-0033, BUG-0034, BUG-0035, BUG-0036

**Pattern:** ESLint only covered `tools/`. When `orchestrator/` and `tests/` were added, they had unused imports, useless assignments, and lost error chains that went undetected. Adding tests to ESLint scope produced hundreds of false positives from missing Jest globals.

**Lesson:** Configure your linter to cover all JS/TS directories from the start, even if they're empty. Add framework globals (Jest, Node timers) in the initial config. Finding 50 lint errors in a new directory means 50 issues accumulated silently.

---

## L-0011: Enforce Formatting Locally, Not Just in CI

**Bugs:** BUG-0037, BUG-0043, BUG-0049

**Pattern:** Prettier was added to CI but not enforced locally. Every commit triggered CI failures for formatting issues that could have been auto-fixed on save. Worse, Prettier reformatted a test fixture's markdown structure, changing indentation that broke regex-based parsers.

**Lesson:** Install a pre-commit hook (husky + lint-staged) that auto-formats staged files. This catches formatting issues before they reach CI. Also: if your code parses markdown with regexes, test the fixture after formatting — Prettier's markdown reformatting can change semantic structure (list nesting, indentation).

---

## L-0012: Every Orchestration Agent Needs an Explicit Spawn Point

**Bugs:** BUG-0002, BUG-0005, BUG-0051

**Pattern:** Palette had an instruction file but no spawn point in the orchestration playbook — it would never execute. Lens had no Phase 5 review scope. The DM referenced "7 sub-agents" when 8 existed.

**Lesson:** For every agent in the registry, verify: (1) there is a spawn instruction in the orchestration playbook, (2) every phase the agent participates in has defined tasks, (3) the agent count in prose matches the actual count. A checklist or config-driven validation (compare `agents.config.json` to DM_AGENT.md mentions) prevents silent omissions.

---

## L-0013: Standardize Context Passing Between Agents

**Bugs:** BUG-0007

**Pattern:** Conductor passed context to sub-agents as free-form prose. Critical information (branch name, story IDs, file paths) was sometimes omitted, sometimes formatted differently, making agent execution inconsistent.

**Lesson:** Define a structured context template that every agent spawn must include: assigned stories, branch name, input files, output expectations, and predecessor artifacts. Treat agent spawning like a function call — define the interface.

---

## L-0014: Build Dashboards with WCAG Contrast and Responsive Layouts from the Start

**Bugs:** BUG-0014, BUG-0022, BUG-0023, BUG-0024

**Pattern:** The dashboard launched as dark-mode-only with contrast ratios as low as 2.8:1 (WCAG AA requires 4.5:1), no responsive breakpoints (unusable on phones/tablets), no hover feedback, and no About/attribution section.

**Lesson:** Even for internal/demo dashboards: (1) check contrast ratios against WCAG AA (use a contrast checker), (2) add at least 3 breakpoints (phone, tablet, desktop), (3) add hover states to interactive elements, (4) include an About section for demo audiences. These are cheaper to add upfront than to retrofit.

---

## L-0015: Surface Blocked States with Multi-Channel Alerts

**Bugs:** BUG-0038, BUG-0039, BUG-0040, BUG-0041, BUG-0042

**Pattern:** When orchestration hit a BLOCKED state, the dashboard showed no visual difference from "pending." The human operator — the only one who can unblock — might not notice for minutes or hours, especially if the dashboard is in a background tab.

**Lesson:** BLOCKED states need escalating alert channels: (1) visual distinction in the UI (red pulsing, banner), (2) audio alert (Web Audio API tones), (3) browser push notification (Notification API with `requireInteraction: true`). Each channel should be independently toggleable and persist preference to localStorage. The cost of a missed BLOCK is far higher than the cost of an alert.

---

## L-0016: Make Frameworks Project-Agnostic from the Start

**Bugs:** BUG-0031, BUG-0050, BUG-0052, BUG-0053, BUG-0054

**Pattern:** Agent instruction files, dashboard generators, orchestrator spawn logic, and avatar processing all contained hardcoded project-specific content (story IDs, screen names, brand colors, service names). Reusing the framework for a different project required rewriting 15+ files.

**Lesson:** Separate the framework (how) from the project (what): (1) Agent instruction files define role behaviors as generic templates, (2) A single project entry point (`project.md`) holds all project-specific scope, (3) Config files (`agents.config.json`) hold agent registries, dashboard branding, and orchestrator settings, (4) Platform symlinks (`CLAUDE.md`, `Gemini.md`, etc.) enable auto-discovery. The DM builds project context dynamically at spawn time.

---

## L-0017: Add SAST and Secret Scanning to CI Early

**Bugs:** BUG-0032, BUG-0066

**Pattern:** The project had no CI pipeline initially, then added lint/test/build but no security scanning. XSS and command injection vulnerabilities (BUG-0055, BUG-0056) were found only through manual code review. Committed secrets would have gone undetected.

**Lesson:** Add CodeQL (or equivalent SAST) and secret scanning (TruffleHog, GitLeaks) to CI in the first sprint. Static analysis catches vulnerability patterns that unit tests miss. Secret scanning with `--only-verified` and `fetch-depth: 0` covers the full git history.

---

## L-0018: Document What Is Real vs. Simulated in a POC

**Bugs:** BUG-0009, BUG-0010, BUG-0013

**Pattern:** Different agents had different assumptions about which features were real code vs. simulated documentation. No deployment strategy existed. ROLLBACK.md was referenced but never created.

**Lesson:** In any POC or hackathon project, create a scope table early: for each feature, state whether it's real implementation, mock/stub, or documentation-only. Include deployment instructions (even if just "run on simulator") and create every referenced document — even if it's a stub — so agents don't fail on missing files.

---

## L-0019: Define Verdict Thresholds, Not Just Verdict Options

**Bugs:** BUG-0005, BUG-0030

**Pattern:** The code reviewer had three verdicts (APPROVE / REQUEST CHANGES / BLOCK) but no criteria distinguishing them. The boundary between "needs small fixes" and "stop everything" was left to individual judgment, producing inconsistent behavior.

**Lesson:** For any review or quality gate with multiple severity levels, define explicit threshold criteria. Example: security vulnerabilities and type-safety violations = BLOCK; style issues and missing tests = REQUEST CHANGES. Without thresholds, the same issue gets different verdicts depending on reviewer mood.

---

## L-0020: Log Cleanup Failures — Don't Swallow Them

**Bugs:** BUG-0062

**Pattern:** Lock directory removal in the `release()` function could fail silently, leaving stale lock directories that would eventually expire via timeout but could cause confusion in the meantime.

**Lesson:** Cleanup operations (file deletion, lock release, temp directory removal) should log warnings on failure rather than silently swallowing errors. A logged warning costs nothing during normal operation but saves significant debugging time when things go wrong.
