# Lessons — CTC-Mobile-Wishlist

<!-- Distilled from 101 bugs (BUG-0001–BUG-0097) across Sessions 4–9. -->

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

---

## L-0021 — Parallel Agents Must Not Share Mutable State Through Git Branches

**Bugs:** BUG-0087, BUG-0088
**Lesson:** When agents run in isolated git worktrees on separate branches, any file they write to is invisible to other branches until a merge. A shared "status" or "metrics" file placed inside the repo becomes N divergent copies — one per branch — and the dashboard or orchestrator reading from `main`/`develop` sees a frozen snapshot of the last merged state, not the live state. Three viable patterns, in order of implementation cost:

1. **Sequential agents on one branch** — simplest; eliminates all concurrency; dashboard always accurate. Use when parallelism isn't the bottleneck.
2. **Shared file outside the repo** — a fixed absolute path (e.g., `/tmp/pipeline-status.json` or a local SQLite DB) that all worktrees read/write directly. Requires atomic writes (file locking or WAL-mode SQLite) but preserves true parallelism.
3. **Derive metrics from source files at read time** — dashboard reads `docs/BUGS.md`, `docs/RELEASE_PLAN.md`, coverage JSON directly. The status file becomes append-only event log. No sync required because the source files are each agent's actual work output, not a redundant copy.
   _Parallel agents (Forge + Pixel + Circuit) each wrote sdlc-status.json updates to their own branches. The develop/main branch never received those updates in real time — only at merge time, hours later. The dashboard showed Phase 2 state while Phase 6 was running._
   **Date:** 2026-04-04

---

## L-0022 — Derive Dashboard Metrics From Source Files, Not a Separate Sync File

**Bugs:** BUG-0082, BUG-0087, BUG-0088
**Lesson:** Any metric that can be computed from an existing artifact (bug count from `BUGS.md`, story status from `RELEASE_PLAN.md`, coverage from `coverage-summary.json`) should be computed live by the dashboard generator rather than cached in a secondary state file. Secondary state files require a synchronisation discipline that breaks under parallel writes, branch isolation, and human error. Reserve the state file for data that has no other canonical home: agent task descriptions, phase timestamps, the activity event log.
_`sdlc-status.json` duplicated bug counts, story statuses, and coverage percentages that already existed in other files. When those files were updated (agents adding bugs, Circuit generating coverage) the state file fell behind, producing visibly wrong dashboard numbers._
**Date:** 2026-04-04

---

## L-0023 — The Expo Native Layer Is a Separate Artifact System — Changes Don't Propagate Automatically

**Bugs:** BUG-0090, BUG-0091, BUG-0092, BUG-0093, BUG-0094
**Lesson:** An Expo project has two independent artifact layers: (1) the JavaScript/Metro layer (`package.json`, `app/`, `assets/`) and (2) the native layer (`ios/`, `android/`, CocoaPods, xcassets). Changes to the JS layer do not propagate to the native layer automatically. Treat each layer as having its own lock file and cache:

- Always set `"main": "expo-router/entry"` in `package.json` for file-based routing projects — without it, Expo falls back to the legacy `AppEntry.js` which expects `App.tsx`.
- Never leave scaffold placeholder directories (`.gitkeep` under `src/app/`) that can hijack framework directory resolution. expo-router v4 checks `src/app` before `app` — an empty directory there takes over as route root.
- Delete `ios/Podfile.lock` and `ios/Pods/` whenever `react-native` version changes in `package.json`. The lock file pins native prebuilt XCFrameworks; mismatched API versions produce cryptic Swift compile errors.
- Run `expo prebuild` (or manually copy to xcassets) whenever source assets change. Xcode DerivedData caches compiled xcassets — clear it too.
- iOS app icons must be RGB mode, exactly 1024×1024px. Alpha channels cause silent rejection of the entire icon set with a misleading "did not have any applicable content" error.
  _All five bugs were discovered only on the first real iOS simulator run, hours after the app was "complete". None were caught by Jest or TypeScript._
  **Date:** 2026-04-04

---

## L-0024 — Run a Scaffold Completeness Check Before Any Build Agent Writes Feature Code

**Bugs:** BUG-0084, BUG-0085, BUG-0086, BUG-0091
**Lesson:** Before spawning build agents, the orchestrator must verify that the scaffold is complete: (1) every directory referenced in `app.json`, `package.json`, and config files actually exists; (2) all required asset files (`icon.png`, `splash.png`, `adaptive-icon.png`, `favicon.png`) are present and meet platform specifications; (3) every user story has at least one acceptance criterion defined; (4) any component or service referenced in another agent's task description exists as at least an empty file. A missing directory or placeholder string in mock data discovered in Phase 5 costs far more to fix than a pre-build checklist.
_The `assets/` directory didn't exist when build agents started. All 23 products had `"image": "placeholder"`. A search bar required by AC-0015/AC-0016 was never created. All three were found only during Phase 5 testing._
**Date:** 2026-04-04

---

## L-0025 — Register Acceptance Criteria in the Plan Before Any Code References Them

**Bugs:** BUG-0008, BUG-0077
**Lesson:** An AC is only a real contract when it exists in `RELEASE_PLAN.md` and the ID*REGISTRY. If a build agent references `AC-0041` in a code comment or test annotation, that AC must already be formally defined under its user story — not filed afterward. The reverse order (code first, plan second) means: (1) the plan is perpetually behind reality, (2) test cases and ACs can't be properly linked, and (3) the reviewer has no baseline to check against. Similarly, every AC should have at least one test case mapped to it before the story is marked Done.
\_Forge referenced AC-0041 and AC-0042 in service code and tests before they existed in RELEASE_PLAN.md. Four other ACs had no test cases mapped to them.*
**Date:** 2026-04-04

---

## L-0026 — Build Agents Must Enumerate Existing Components Before Writing New Code

**Bugs:** BUG-0075, BUG-0076
**Lesson:** Before writing any screen or utility, a build agent must enumerate the current `components/` and `utils/` directories. If `ProductCard`, `WishlistCard`, or `wishlistUtils.ts` already exists, use it — don't re-implement equivalent logic inline. Two failure modes occur when agents don't check: (1) screens contain duplicated ad-hoc card markup that diverges from the actual component, meaning the built component is never exercised; (2) parallel agents create identical utility files on separate branches that conflict at merge time. Add an explicit "check for existing components" step to the build agent's task checklist before any screen is created.
_`catalog.tsx` duplicated `ProductCard` card markup inline instead of importing `<ProductCard>`. `wishlistUtils.ts` was independently created by two agents on separate branches._
**Date:** 2026-04-04

---

## L-0027 — Write Component and Screen Tests at Creation Time, Not as a Separate Later Phase

**Bugs:** BUG-0073, BUG-0078
**Lesson:** The moment a component or screen is created, its test file should be created alongside it — not deferred to a dedicated testing phase. Service tests can be separated (they require no rendering infrastructure) but UI tests require React Native Testing Library setup that is much harder to retrofit: mocking navigation, context providers, and async state requires intimate knowledge of how the component was wired up, which fades rapidly after the build agent's session ends. Each component file should have a corresponding `.test.tsx` that at minimum: (1) renders without crashing, (2) checks key visible text/elements, and (3) asserts press handlers are called. Missing one test branch is also caught here — the `removeItem` empty-productId guard existed in code but wasn't tested until Lens discovered it in review.
_8 screens and 7 components were built with zero render tests. Service tests existed; screen/component tests were deferred to a later phase that never ran._
**Date:** 2026-04-04

---

## L-0028 — Add Accessibility Attributes at Component Creation Time — Never Retrofit

**Bugs:** BUG-0074, BUG-0095
**Lesson:** Accessibility is a creation-time discipline, not a polish task. Every `TouchableOpacity` needs `accessibilityRole="button"` and a descriptive `accessibilityLabel`. Every `Image` or icon-only button needs an `accessibilityLabel`. Navigation stack screens need `headerBackTitle` explicitly set — framework defaults (`(tabs)`) are file-system segment names, not human-readable labels. Retrofitting accessibility requires re-reading every interactive element across all screens; doing it at component creation costs seconds per component. Add an accessibility checklist to the build agent's component template: `[ ] accessibilityRole, [ ] accessibilityLabel, [ ] headerBackTitle for stack screens`.
_Zero accessibility attributes existed on any of 7 components and 8 screens after Phase 3. Back button showed "(tabs)" because no `headerBackTitle` was set on any stack screen. Both were fixed only in a post-pipeline polish session._
**Date:** 2026-04-04

---

## L-0029 — Tooling Must Degrade Visibly, Not Silently, When Attribution or Mapping Fails

**Bugs:** BUG-0089, BUG-0096, BUG-0097
**Lesson:** When a tooling pipeline can't match input data to expected patterns — branch names that don't follow the expected convention, cross-references that resolve to nothing, sections with no content — it must produce a visible fallback, not a silent zero or hidden UI. Three concrete rules: (1) When cost attribution finds no matching stories, distribute the total proportionally rather than showing empty bars; (2) When collapsible UI sections are generated, default to expanded so content is immediately visible — collapsed-by-default requires the user to discover the interaction model before seeing any data; (3) When a cross-reference (bug→lesson, lesson→epic) resolves to nothing, show "—" or "No Epic" as a labelled placeholder, not an empty cell or missing row.
_The AI cost chart showed $0 bars despite $299 in the header because branches didn't match `feature/US-XXXX-*`. The Hierarchy, Bugs, and Costs tab column views appeared empty because all sections started collapsed._
**Date:** 2026-04-04
