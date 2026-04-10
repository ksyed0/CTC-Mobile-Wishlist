# CTC Mobile Wishlist

A mobile wishlist feature for Canadian Tire Corporation's app ecosystem — enabling customers to save products via catalog browsing or in-store barcode scanning, manage multiple wishlists, and share them with contacts for gift coordination.

Built as a **hackathon POC** using React Native + Expo with TypeScript, powered by **Claude Code's agentic AI SDLC** — 9 specialized AI agents orchestrated through Claude Code.

---

## Project Overview

| Attribute    | Detail                                                                                                    |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| **Stack**    | React Native, Expo SDK 55, TypeScript, expo-router                                                        |
| **Data**     | AsyncStorage with local mock data (POC)                                                                   |
| **Platform** | iOS + Android                                                                                             |
| **Brand**    | Canadian Tire (#D52B1E), system fonts, 4px grid                                                           |
| **Agents**   | 9 specialized AI agents, platform-agnostic (Claude Code, Codex, Gemini, Aider, CodeMie, OpenCode, EliteA) |

### Key Features (POC)

- Browse product catalog with category filters and search
- Scan barcodes in-store to add products to wishlists
- Create and manage multiple named wishlists
- Share wishlists with contacts for gift fulfillment
- Claim items as a gift recipient to prevent duplicates
- User switcher for demo purposes

---

## Running the Agentic AI SDLC

This project uses 9 specialized AI agents with **platform-agnostic orchestration** — run on Claude Code, OpenAI Codex, Google Gemini, Aider (open-source), or any agentic CLI. Each agent has a dedicated markdown instruction file that works as a system prompt on any platform.

### Supported Platforms

| Platform              | CLI        | Sub-Agent Spawning  | Setup                                                                            |
| --------------------- | ---------- | ------------------- | -------------------------------------------------------------------------------- |
| **Claude Code**       | `claude`   | Native (Agent tool) | `npm install -g @anthropic-ai/claude-code`                                       |
| **OpenAI Codex**      | `codex`    | Separate terminals  | `npm install -g @openai/codex`                                                   |
| **Google Gemini**     | `gemini`   | Separate terminals  | `npm install -g @anthropic-ai/gemini`                                            |
| **Aider** (any model) | `aider`    | Separate terminals  | `pip install aider-chat`                                                         |
| **CodeMie** (EPAM)    | `codemie`  | Separate terminals  | EPAM DIAL gateway — Claude/GPT/Gemini backends                                   |
| **OpenCode**          | `opencode` | Separate terminals  | `go install github.com/opencode-ai/opencode@latest` — Gemma, Qwen, MiniMax, Kimi |
| **EliteA** (EPAM)     | `elitea`   | Prompt chaining     | EPAM enterprise AI platform — registered prompt library                          |

Switch platforms with an env var:

```bash
export ORCHESTRATOR_PLATFORM=codex   # or: claude-code, gemini, aider, codemie, opencode, elitea
```

### Quick Start — Launch Conductor

**Claude Code** (default):

```bash
claude "Read docs/agents/DM_AGENT.md for your full instructions. You are Conductor, the
Delivery Manager orchestrating 9 specialized agents for today's hackathon. Follow
the orchestration playbook in your instruction file. Begin with Phase 1: spawn
Compass to prioritize the backlog."
```

**OpenAI Codex:**

```bash
codex "Read docs/agents/DM_AGENT.md for your full instructions. You are Conductor, the
Delivery Manager orchestrating 9 specialized agents for today's hackathon. Follow
the orchestration playbook in your instruction file. Begin with Phase 1: spawn
Compass to prioritize the backlog."
```

**Google Gemini:**

```bash
gemini "Read docs/agents/DM_AGENT.md for your full instructions. You are Conductor, the
Delivery Manager orchestrating 9 specialized agents for today's hackathon. Follow
the orchestration playbook in your instruction file. Begin with Phase 1: spawn
Compass to prioritize the backlog."
```

**Aider** (with any model — OpenAI, Anthropic, Ollama local):

```bash
aider --model ollama/llama3 --message "Read docs/agents/DM_AGENT.md for your full instructions. You are Conductor."
```

**Spawn helper** (generates correct command for your platform):

```bash
node orchestrator/spawn.js --agent Conductor
node orchestrator/spawn.js --list-platforms
node orchestrator/spawn.js --print-all
```

Conductor will automatically:

1. Spawn **Compass** (PO) to prioritize the backlog
2. Spawn **Keystone** (Architect) to scaffold the project
3. Spawn **Lens** (Code Reviewer) to review the scaffold
4. Spawn **Forge** + **Pixel** in parallel (Backend + Frontend)
5. Spawn **Lens** to review their work
6. Spawn **Pixel** to integrate services with screens
7. Spawn **Sentinel** + **Circuit** in parallel (QA)
8. Polish, merge, and prepare for demo

### The 9 Agents

| Agent             | Name          | Role                                        | Instruction File                         |
| ----------------- | ------------- | ------------------------------------------- | ---------------------------------------- |
| Delivery Manager  | **Conductor** | Orchestrates all agents, manages context    | `docs/agents/DM_AGENT.md`                |
| Code Reviewer     | **Lens**      | Reviews every PR for quality gates          | `docs/agents/CODE_REVIEWER_AGENT.md`     |
| Product Owner     | **Compass**   | Requirements, ACs, backlog prioritization   | `docs/agents/PO_AGENT.md`                |
| Architect         | **Keystone**  | Project scaffold, types, service interfaces | `docs/agents/ARCHITECT_AGENT.md`         |
| UI Designer       | **Palette**   | Theme, component styles, brand compliance   | `docs/agents/UI_DESIGNER_AGENT.md`       |
| Backend Dev       | **Forge**     | Services, mock data, AsyncStorage           | `docs/agents/BE_DEV_AGENT.md`            |
| Frontend Dev      | **Pixel**     | Screens, components, navigation             | `docs/agents/FE_DEV_AGENT.md`            |
| Functional Tester | **Sentinel**  | Manual test execution, bug reporting        | `docs/agents/FUNCTIONAL_TESTER_AGENT.md` |
| Automation Tester | **Circuit**   | Jest test suites, coverage reports          | `docs/agents/AUTOMATION_TESTER_AGENT.md` |

### Alternative: Run Individual Agents

Replace `claude` with your platform's CLI (`codex`, `gemini`, `aider --message`):

```bash
# Run the architect to scaffold the project
claude "Read docs/agents/ARCHITECT_AGENT.md for your full instructions.
        Scaffold the Expo project and create all type definitions."

# Run the backend dev to implement services
claude "Read docs/agents/BE_DEV_AGENT.md for your full instructions.
        Implement all services from architecture/DATA_FLOW.md."

# Run the code reviewer on a branch
claude "Read docs/agents/CODE_REVIEWER_AGENT.md for your full instructions.
        Review branch feature/US-001-001-expo-scaffold for merge readiness."
```

### Parallel Sessions (Maximum Velocity)

For fastest results, run 2-3 terminals simultaneously (works on any platform):

```bash
# Terminal 1: Backend (Keystone → Forge)
claude "Read docs/agents/ARCHITECT_AGENT.md then docs/agents/BE_DEV_AGENT.md.
        Scaffold the project, then implement all services."

# Terminal 2: Frontend (Palette → Pixel)
claude "Read docs/agents/UI_DESIGNER_AGENT.md then docs/agents/FE_DEV_AGENT.md.
        Set up the theme, then build all screens and components."

# Terminal 3: Testing (after code is ready)
claude "Read docs/agents/FUNCTIONAL_TESTER_AGENT.md. Execute all test cases."
```

---

## Project Structure

```
CTC-Mobile-Wishlist/
├── project.md                         # Single project entry point (all agents start here)
├── CLAUDE.md → project.md             # Platform symlink (Claude Code auto-read)
├── Gemini.md → project.md             # Platform symlink (Gemini auto-read)
├── Codex.md → project.md              # Platform symlink (Codex auto-read)
├── EliteA.md → project.md             # Platform symlink (EliteA auto-read)
├── CodeMie.md → project.md            # Platform symlink (CodeMie auto-read)
├── Qwen.md → project.md               # Platform symlink (Qwen auto-read)
├── MiniMax.md → project.md            # Platform symlink (MiniMax auto-read)
├── AGENTS.md                          # AI agent operating standards (BLAST framework)
├── PROJECT.md                         # Project constitution
├── agents.config.json                 # Agent registry — names, roles, icons, colors, files
├── plan-visualizer.config.json        # PlanVisualizer dashboard config
├── src/                               # POC app source (React Native + Expo)
│   ├── app/                           # Expo Router file-based routes
│   ├── components/                    # Reusable React Native components
│   ├── services/                      # Data access layer (AsyncStorage, mock data)
│   ├── types/                         # TypeScript type definitions
│   ├── theme/                         # Design tokens and theme config
│   ├── assets/                        # Images, fonts, mock data JSON
│   ├── hooks/                         # Custom React hooks
│   └── contexts/                      # React Context providers
├── architecture/
│   ├── SYSTEM_ARCHITECTURE.md         # 3-layer architecture
│   ├── DATA_FLOW.md                   # Service interfaces, types, AsyncStorage schema
│   ├── DESIGN_SYSTEM.md               # CTC brand, components, spacing
│   └── DIAGRAMS.md                    # Mermaid architecture diagrams
├── docs/
│   ├── AGENT_PLAN.md                  # Generic orchestration framework (reusable)
│   ├── HACKATHON_PLAN.md              # CTC hackathon agent roster, timeline, prompts
│   ├── BUSINESS_PLAN.md               # Revenue model, resource plan, ROI
│   ├── RELEASE_PLAN.md                # 6 epics, 13 stories, 21 tasks, 40 ACs
│   ├── TEST_CASES.md                  # 40 test cases (TC-001-001-001 – TC-002-003-002)
│   ├── ID_REGISTRY.md                 # Artifact ID tracking
│   ├── AI_COST_LOG.md                 # AI session cost tracking
│   ├── BUGS.md                        # Bug tracking
│   ├── LESSONS.md                     # Hard-won lessons
│   ├── CTC_Mobile_Wishlist_Business_Case.pptx  # 20-slide business case deck
│   └── agents/                        # Per-role agent instruction files
│       ├── DM_AGENT.md                # Conductor — Delivery Manager
│       ├── CODE_REVIEWER_AGENT.md     # Lens — Code Reviewer
│       ├── PO_AGENT.md                # Compass — Product Owner
│       ├── ARCHITECT_AGENT.md         # Keystone — Architect
│       ├── UI_DESIGNER_AGENT.md       # Palette — UI Designer
│       ├── BE_DEV_AGENT.md            # Forge — Backend Developer
│       ├── FE_DEV_AGENT.md            # Pixel — Frontend Developer
│       ├── FUNCTIONAL_TESTER_AGENT.md # Sentinel — Functional Tester
│       ├── AUTOMATION_TESTER_AGENT.md # Circuit — Automation Tester
│       └── images/                    # Agent avatar images (Pixar-style)
├── orchestrator/                      # Platform-agnostic agent spawning & concurrency
│   ├── spawn.js                       # CLI + API for spawning agents
│   ├── file-lock.js                   # mkdir-based file locking (race condition prevention)
│   ├── atomic-write.js                # Atomic JSON/text writes (prevents corruption)
│   ├── git-safe.js                    # Retry-safe git push, conflict detection
│   └── adapters/                      # Platform-specific adapters
│       ├── claude-code.js             # Anthropic Claude Code
│       ├── codex-cli.js               # OpenAI Codex CLI
│       ├── gemini-cli.js              # Google Gemini CLI
│       ├── aider.js                   # Aider (open-source, any model)
│       ├── codemie.js                 # EPAM CodeMie (Claude via DIAL)
│       ├── opencode.js                # OpenCode (Gemma, Qwen, MiniMax, Kimi)
│       └── elitea.js                  # EPAM EliteA (enterprise AI)
├── scripts/
│   └── generate-pptx.py              # PowerPoint deck generator
├── tools/
│   ├── generate-plan.js               # PlanVisualizer generator
│   ├── generate-dashboard.js          # SDLC dashboard generator
│   ├── process-avatars.js             # Face detection avatar extraction
│   ├── init-sdlc-status.js            # Generate sdlc-status.json from agents.config.json
│   ├── capture-cost.js                # AI cost capture hook
│   └── lib/
│       └── render-html.js             # Shared HTML rendering (XSS-safe output escaping)
├── tests/
│   ├── unit/                          # 246 unit tests (Jest)
│   └── fixtures/                      # Test fixture data
├── .husky/
│   └── pre-commit                     # Husky pre-commit hook (lint-staged)
└── .gitattributes                     # Cross-platform line endings + binary markers
```

---

## Dashboards & Tooling

Two dashboards track project health in real time:

| Dashboard           | File                    | Generator                     | Content                                         |
| ------------------- | ----------------------- | ----------------------------- | ----------------------------------------------- |
| **SDLC Dashboard**  | `docs/dashboard.html`   | `tools/generate-dashboard.js` | Agent status, phases, stories by epic, progress |
| **Plan Visualizer** | `docs/plan-status.html` | `tools/generate-plan.js`      | Release plan, test cases, bugs, cost tracking   |

```bash
npm run build            # Full pipeline: avatars → plan → dashboard
npm run init:status      # Generate sdlc-status.json from agents.config.json
npm run avatars          # Extract agent headshots from team-grid.png
npm run plan:generate    # Generate Plan Visualizer
npm run dashboard        # Generate SDLC Dashboard
npm run dashboard:watch  # Watch mode (auto-regenerate on status changes)
npm test                 # Run 459 unit tests
npm run test:coverage    # Run tests with coverage report
```

### SDLC Dashboard Features

- Light/dark mode toggle (persists across 5-second auto-refresh)
- Responsive layout for phones, tablets, and desktop
- Agent avatars with face-detection extraction from composite team image
- Active agent spotlight banner
- Stories grouped by epic
- About modal with team image

### Agent Avatar System

Drop images into `docs/agents/images/` (all lowercase filenames):

- `team-grid.png` — Composite image (5 top row, 4 bottom row) for headshot extraction
- `conductor.png`, `compass.png`, etc. — Individual landscape images for spotlight view
- `team.png` — Full team image for About popup

Run `npm run avatars` to extract headshots via tracking.js face detection (Viola-Jones). Configurable padding: `npm run avatars -- --padding 2.0`

### Config-Driven Agent Registry

All agent definitions live in `agents.config.json` — the single source of truth consumed by the dashboard, orchestrator, and avatar system. To customize agents for a different project:

1. Edit `agents.config.json` — add/remove/rename agents, set roles, icons, colors, instruction file paths
2. Run `npm run init:status` — generates `docs/sdlc-status.json` with your agents
3. Run `npm run build` — dashboard and avatars auto-adapt to the new config

No code changes needed. The orchestrator, dashboard, and avatar extractor all read from `agents.config.json`.

### Concurrency Safety

When agents run in parallel (e.g., Forge + Pixel in Phase 3), shared state files need protection against race conditions. Three orchestrator utilities handle this:

| Utility                        | Purpose                                                     | Mechanism                                      |
| ------------------------------ | ----------------------------------------------------------- | ---------------------------------------------- |
| `orchestrator/file-lock.js`    | Prevents simultaneous writes to shared files                | mkdir-based locking with 30s stale detection   |
| `orchestrator/atomic-write.js` | Ensures complete writes, locked appends, safe ID allocation | Write-to-temp + rename, file-lock integration  |
| `orchestrator/git-safe.js`     | Retry-safe push, conflict detection, overlap checking       | Exponential backoff (4 retries), dry-run merge |

Protected shared files: `sdlc-status.json`, `progress.md`, `BUGS.md`, `ID_REGISTRY.md`, `AI_COST_LOG.md`.

### CI Pipeline

GitHub Actions runs on every push/PR to `main` or `develop`:

| Job                         | Purpose                                      |
| --------------------------- | -------------------------------------------- |
| **Lint**                    | ESLint on all JS files                       |
| **Test & Coverage**         | Jest (246 tests) with coverage report upload |
| **Build**                   | Full pipeline build                          |
| **Orchestrator Validation** | Validates spawn.js agent/platform listing    |
| **Prettier Format Check**   | Enforces consistent formatting               |
| **Dependency Audit**        | `npm audit --audit-level=high`               |
| **CodeQL SAST**             | Static analysis security testing (JS/TS)     |
| **Secret Scanning**         | TruffleHog verified secret detection         |

### Pre-Commit Hooks

Husky + lint-staged run automatically on every `git commit`:

- **Prettier** formats staged `*.js`, `*.json`, `*.md`, `*.yml`, `*.yaml` files
- **ESLint** auto-fixes staged `*.js` files

Activated automatically via `npm install` (the `prepare` script runs `husky`). No global install needed.

---

## Business Case

| Metric                       | Value                   |
| ---------------------------- | ----------------------- |
| Year 1 incremental revenue   | $189.5M CAD             |
| Agentic AI build investment  | $344K CAD               |
| Year 1 ROI                   | 19,270%                 |
| Timeline (Agentic AI SDLC)   | 8–15 weeks              |
| Savings vs. traditional SDLC | $320K–550K CAD (48–61%) |

See `docs/BUSINESS_PLAN.md` and `docs/CTC_Mobile_Wishlist_Business_Case.pptx` for the full analysis.

---

_Built for the EPAM–CTC Hackathon using Claude Code agentic AI SDLC._
