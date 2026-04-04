# CTC Mobile Wishlist

A mobile wishlist feature for Canadian Tire Corporation's app ecosystem — enabling customers to save products via catalog browsing or in-store barcode scanning, manage multiple wishlists, and share them with contacts for gift coordination.

Built as a **hackathon POC** using React Native + Expo with TypeScript, powered by **Claude Code's agentic AI SDLC** — 9 specialized AI agents orchestrated through Claude Code.

---

## Project Overview

| Attribute | Detail |
|-----------|--------|
| **Stack** | React Native, Expo SDK 52, TypeScript, expo-router |
| **Data** | AsyncStorage with local mock data (POC) |
| **Platform** | iOS + Android |
| **Brand** | Canadian Tire (#D52B1E), system fonts, 4px grid |
| **Agents** | 9 specialized AI agents via Claude Code |

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

| Platform | CLI | Sub-Agent Spawning | Setup |
|----------|-----|-------------------|-------|
| **Claude Code** | `claude` | Native (Agent tool) | `npm install -g @anthropic-ai/claude-code` |
| **OpenAI Codex** | `codex` | Separate terminals | `npm install -g @openai/codex` |
| **Google Gemini** | `gemini` | Separate terminals | `npm install -g @anthropic-ai/gemini` |
| **Aider** (any model) | `aider` | Separate terminals | `pip install aider-chat` |

Switch platforms with an env var:
```bash
export ORCHESTRATOR_PLATFORM=codex   # or: claude-code, gemini, aider
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

| Agent | Name | Role | Instruction File |
|-------|------|------|-----------------|
| Delivery Manager | **Conductor** | Orchestrates all agents, manages context | `docs/agents/DM_AGENT.md` |
| Code Reviewer | **Lens** | Reviews every PR for quality gates | `docs/agents/CODE_REVIEWER_AGENT.md` |
| Product Owner | **Compass** | Requirements, ACs, backlog prioritization | `docs/agents/PO_AGENT.md` |
| Architect | **Keystone** | Project scaffold, types, service interfaces | `docs/agents/ARCHITECT_AGENT.md` |
| UI Designer | **Palette** | Theme, component styles, CTC brand | `docs/agents/UI_DESIGNER_AGENT.md` |
| Backend Dev | **Forge** | Services, mock data, AsyncStorage | `docs/agents/BE_DEV_AGENT.md` |
| Frontend Dev | **Pixel** | Screens, components, navigation | `docs/agents/FE_DEV_AGENT.md` |
| Functional Tester | **Sentinel** | Manual test execution, bug reporting | `docs/agents/FUNCTIONAL_TESTER_AGENT.md` |
| Automation Tester | **Circuit** | Jest test suites, coverage reports | `docs/agents/AUTOMATION_TESTER_AGENT.md` |

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
        Review branch feature/US-0001-expo-scaffold for merge readiness."
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
├── AGENTS.md                          # AI agent operating standards (BLAST framework)
├── PROJECT.md                         # Project constitution
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
│   ├── AGENT_PLAN.md                  # Agent orchestration plan & timeline
│   ├── BUSINESS_PLAN.md               # Revenue model, resource plan, ROI
│   ├── RELEASE_PLAN.md                # 6 epics, 13 stories, 21 tasks, 40 ACs
│   ├── TEST_CASES.md                  # 40 test cases (TC-0001 – TC-0040)
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
├── orchestrator/                      # Platform-agnostic agent spawning
│   ├── spawn.js                       # CLI + API for spawning agents
│   └── adapters/                      # Platform-specific adapters
│       ├── claude-code.js             # Anthropic Claude Code
│       ├── codex-cli.js               # OpenAI Codex CLI
│       ├── gemini-cli.js              # Google Gemini CLI
│       └── aider.js                   # Aider (open-source, any model)
├── scripts/
│   └── generate-pptx.py              # PowerPoint deck generator
└── tools/
    ├── generate-plan.js               # PlanVisualizer generator
    ├── generate-dashboard.js          # SDLC dashboard generator
    └── capture-cost.js                # AI cost capture hook
```

---

## PlanVisualizer Dashboard

This project uses the [PlanVisualizer](https://github.com/ksyed0/PlanVisualizer) dashboard to track progress:

```bash
npm run plan:generate    # Generate the dashboard
npm test                 # Run tests
npm run test:coverage    # Run tests with coverage report
```

The dashboard parses `RELEASE_PLAN.md`, `TEST_CASES.md`, `BUGS.md`, `AI_COST_LOG.md`, and `coverage-summary.json` to provide a real-time view of project health.

---

## Business Case

| Metric | Value |
|--------|-------|
| Year 1 incremental revenue | $189.5M CAD |
| EliteA build investment | $344K CAD |
| Year 1 ROI | 19,270% |
| Timeline (EliteA) | 8–15 weeks |
| Savings vs. traditional SDLC | $320K–550K CAD (48–61%) |

See `docs/BUSINESS_PLAN.md` and `docs/CTC_Mobile_Wishlist_Business_Case.pptx` for the full analysis.

---

*Built for the EPAM–CTC Hackathon using Claude Code agentic AI SDLC.*
