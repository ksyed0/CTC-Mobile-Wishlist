# Specialized Agent Plan — CTC Mobile Wishlist Hackathon

> **Date:** Monday, April 7, 2026
> **Duration:** 8 hours (9:00 AM – 5:00 PM ET)
> **Platform:** Claude Code with EPAM EliteA agentic AI workflow
> **Branch:** `claude/install-plan-visualizer-09PFc`

---

## 1. Agent Roster

### 1.1 Product Owner (PO) Agent

| Attribute | Detail |
|-----------|--------|
| **Role** | Requirements validation, backlog prioritization, acceptance criteria, UI guidance |
| **BLAST Phase** | Blueprint |
| **Input Artifacts** | `PROJECT.md`, `docs/RELEASE_PLAN.md`, `docs/TEST_CASES.md` |
| **Output Artifacts** | Refined ACs, priority-ordered backlog, UI direction notes |
| **User Stories** | All (US-0001 through US-0013) — owns prioritization |

**Prompt Template:**
```
You are the Product Owner Agent for the CTC Mobile Wishlist POC. Read PROJECT.md and 
docs/RELEASE_PLAN.md. Your job is to:
1. Validate and refine acceptance criteria for each user story
2. Prioritize the backlog for an 8-hour hackathon (what to build vs. simulate)
3. Provide UI guidance based on architecture/DESIGN_SYSTEM.md
4. Answer developer questions about requirements
Focus on MVP scope: browsing, barcode scan, wishlist CRUD, and sharing.
```

---

### 1.2 Architect Agent

| Attribute | Detail |
|-----------|--------|
| **Role** | System architecture, API contracts, service layer design, type definitions |
| **BLAST Phase** | Architect |
| **Input Artifacts** | `architecture/SYSTEM_ARCHITECTURE.md`, `architecture/DATA_FLOW.md`, `architecture/DESIGN_SYSTEM.md`, `architecture/DIAGRAMS.md` |
| **Output Artifacts** | TypeScript interfaces, service stubs, directory scaffold, Context providers |
| **User Stories** | US-0001 (scaffold), US-0002 (mock data layer) |

**Prompt Template:**
```
You are the Architect Agent for the CTC Mobile Wishlist POC. Read all files in 
architecture/. Your job is to:
1. Scaffold the Expo project with TypeScript and expo-router
2. Create type definitions from architecture/DATA_FLOW.md (Product, Wishlist, User, etc.)
3. Implement service interfaces (ProductService, WishlistService, UserService)
4. Set up Context providers (AuthProvider, ProductProvider, WishlistProvider)
5. Create the directory structure per architecture/SYSTEM_ARCHITECTURE.md
```

---

### 1.3 UI Designer Agent

| Attribute | Detail |
|-----------|--------|
| **Role** | Mobile UI design, wireframes, component specs, CTC brand compliance |
| **BLAST Phase** | Stylize |
| **Input Artifacts** | `architecture/DESIGN_SYSTEM.md`, `PROJECT.md` (design system section) |
| **Output Artifacts** | Component style definitions, layout specs, theme configuration |
| **User Stories** | US-0001 (theming), US-0003 (catalog UI), US-0005 (scanner overlay), US-0007 (wishlist UI) |

**Prompt Template:**
```
You are the UI Designer Agent for the CTC Mobile Wishlist POC. Read 
architecture/DESIGN_SYSTEM.md. Your job is to:
1. Define the theme file (CT Red #D52B1E, spacing grid 4px, card radius 8px)
2. Create reusable component styles: ProductCard, WishlistCard, CategoryChip, etc.
3. Ensure all screens follow CTC brand guidelines
4. Provide layout guidance for each screen (Home, Catalog, Scanner, Wishlists, Share)
Use system fonts, maintain WCAG AA contrast ratios, and follow the 4px spacing grid.
```

**POC Simulation:** For screens not fully implemented, produce ASCII wireframe mockups and component spec documentation showing intended layouts.

---

### 1.4 Backend Developer Agent

| Attribute | Detail |
|-----------|--------|
| **Role** | Service layer implementation, data models, AsyncStorage persistence, mock data |
| **BLAST Phase** | Link |
| **Input Artifacts** | `architecture/DATA_FLOW.md`, `architecture/SYSTEM_ARCHITECTURE.md` |
| **Output Artifacts** | Service implementations, mock JSON data files, Context providers |
| **User Stories** | US-0002 (mock data), US-0004 (product detail), US-0006 (scan lookup), US-0008 (wishlist CRUD), US-0010 (sharing), US-0012 (claiming) |

**Prompt Template:**
```
You are the Backend Developer Agent for the CTC Mobile Wishlist POC. Read 
architecture/DATA_FLOW.md. Your job is to:
1. Create data/products.json with 20+ mock CTC products across categories
2. Create data/users.json with 3-4 mock user profiles
3. Implement ProductService (getProducts, getProductById, getByBarcode, search, getCategories)
4. Implement WishlistService (CRUD, addItem, removeItem, shareWishlist, claimItem)
5. Implement UserService (getCurrentUser, setCurrentUser, getMockUsers)
6. All services use AsyncStorage with key schema from DATA_FLOW.md
```

---

### 1.5 Frontend Developer Agent

| Attribute | Detail |
|-----------|--------|
| **Role** | React Native screen implementation, component building, navigation, state management |
| **BLAST Phase** | Stylize |
| **Input Artifacts** | `architecture/DESIGN_SYSTEM.md`, `architecture/SYSTEM_ARCHITECTURE.md`, `docs/RELEASE_PLAN.md` |
| **Output Artifacts** | Screen components, navigation config, UI components |
| **User Stories** | US-0001 (scaffold), US-0003 (catalog), US-0005 (scanner), US-0007 (wishlists), US-0009 (wishlist detail), US-0011 (share flow), US-0013 (user switcher) |

**Prompt Template:**
```
You are the Frontend Developer Agent for the CTC Mobile Wishlist POC. Read 
architecture/DESIGN_SYSTEM.md and architecture/SYSTEM_ARCHITECTURE.md. Your job is to:
1. Build tab navigation: Home, Catalog, Scan, Wishlists
2. Implement screens: HomeScreen, CatalogScreen, ScannerScreen, WishlistsScreen
3. Build stack screens: ProductDetailScreen, WishlistDetailScreen, ShareScreen
4. Create reusable components: ProductCard, WishlistCard, WishlistItemRow, CategoryChip
5. Wire up Context hooks (useAuth, useProducts, useWishlists) to all screens
6. Use expo-camera for barcode scanning, expo-contacts for sharing
```

---

### 1.6 Functional Tester Agent

| Attribute | Detail |
|-----------|--------|
| **Role** | Manual test execution, bug reporting, acceptance verification |
| **BLAST Phase** | Trigger |
| **Input Artifacts** | `docs/TEST_CASES.md` (TC-0001 through TC-0036), `docs/RELEASE_PLAN.md` |
| **Output Artifacts** | Test execution report, bug reports, AC sign-off |
| **User Stories** | All — validates acceptance criteria |

**Prompt Template:**
```
You are the Functional Tester Agent for the CTC Mobile Wishlist POC. Read 
docs/TEST_CASES.md. Your job is to:
1. Execute test cases TC-0001 through TC-0036 against the running app
2. Record PASS/FAIL for each test case with evidence
3. Log bugs with steps to reproduce, expected vs actual behavior
4. Verify all acceptance criteria (AC-0001 through AC-0040) are met
5. Produce a test execution summary report
```

**POC Simulation:** For features not implemented in the POC, produce simulated test results showing expected behavior and noting "Simulated — not testable in POC" where applicable.

---

### 1.7 Automation Tester Agent

| Attribute | Detail |
|-----------|--------|
| **Role** | Jest test suites, React Native Testing Library tests, coverage reporting |
| **BLAST Phase** | Trigger |
| **Input Artifacts** | `docs/TEST_CASES.md`, implemented source code |
| **Output Artifacts** | Test files (`__tests__/`), coverage report, CI-ready test config |
| **User Stories** | All — automates regression testing |

**Prompt Template:**
```
You are the Automation Tester Agent for the CTC Mobile Wishlist POC. Your job is to:
1. Create Jest + React Native Testing Library test suites
2. Test service layer: ProductService, WishlistService, UserService
3. Test components: ProductCard, WishlistCard renders, user interactions
4. Test navigation: tab switching, stack navigation
5. Target ≥70% code coverage for services, ≥50% for components
Structure: __tests__/services/, __tests__/components/, __tests__/screens/
```

---

## 2. Agent Orchestration

```
Phase 1: Blueprint (30 min)
  PO Agent → Validates requirements, prioritizes backlog for hackathon scope
       ↓
Phase 2: Architect (60 min)
  Architect Agent → Scaffolds project, creates types, service interfaces
       ↓
Phase 3: Link + Stylize (150 min, PARALLEL)
  ┌─ Backend Dev Agent → Implements services, mock data, Context providers
  └─ Frontend Dev Agent → Builds screens, components, navigation
  (UI Designer Agent provides guidance to Frontend Dev as needed)
       ↓
Phase 4: Integration (60 min)
  Frontend Dev Agent → Wires services to screens, end-to-end flows
       ↓
Phase 5: Trigger (60 min, PARALLEL)
  ┌─ Functional Tester Agent → Executes test cases, reports bugs
  └─ Automation Tester Agent → Creates Jest test suites
       ↓
Phase 6: Polish (30 min)
  All Agents → Bug fixes, demo preparation, documentation cleanup
```

---

## 3. Hackathon Timeline

| Time | Duration | Phase | Agent(s) Active | Deliverable |
|------|----------|-------|-----------------|-------------|
| 9:00–9:30 | 30 min | Blueprint | PO Agent | Prioritized backlog, refined ACs |
| 9:30–10:30 | 60 min | Architect | Architect Agent | Project scaffold, types, service stubs |
| 10:30–1:00 | 150 min | Link + Stylize | BE Dev + FE Dev (parallel) | Services + screens implemented |
| 1:00–1:30 | 30 min | Break | — | — |
| 1:30–2:30 | 60 min | Integration | FE Dev Agent | End-to-end flows working |
| 2:30–3:30 | 60 min | Trigger | Functional + Automation Testers (parallel) | Test results, Jest suites |
| 3:30–4:00 | 30 min | Polish | All | Bug fixes, demo prep |
| 4:00–5:00 | 60 min | Demo | Human presenter | Live demo + business case deck |

---

## 4. Simulated vs. Real Work

| Agent | Real Work (POC) | Simulated Work |
|-------|----------------|----------------|
| **PO Agent** | Backlog prioritization, AC refinement | Stakeholder interviews, market research |
| **Architect Agent** | Project scaffold, types, service interfaces | Infrastructure design, CI/CD pipeline |
| **UI Designer Agent** | Theme file, component styles | Full Figma mockups, accessibility audit |
| **Backend Dev Agent** | AsyncStorage services, mock data | Real API integration, database design |
| **Frontend Dev Agent** | All screens, navigation, components | Performance optimization, animations |
| **Functional Tester Agent** | Test cases on working screens | Cross-device testing, load testing |
| **Automation Tester Agent** | Jest unit tests for services + components | E2E tests (Detox), CI integration |

---

## 5. Claude Code Execution Modes

### Option A: Sequential (Single Terminal)
Run one agent at a time in a single Claude Code session, switching roles via prompts.
- **Best for:** Solo developer, simple workflow
- **Command:** `claude` then paste each agent's prompt template

### Option B: Parallel Sessions (Multiple Terminals)
Run 2-3 Claude Code sessions simultaneously with different agent roles.
- **Best for:** Maximizing hackathon velocity
- **Terminal 1:** Architect → Backend Dev Agent
- **Terminal 2:** UI Designer → Frontend Dev Agent
- **Terminal 3:** Tester Agents (after code is ready)

### Option C: Agent Tool Delegation
Use Claude Code's built-in Agent tool to spawn sub-agents for independent tasks.
- **Best for:** Automated orchestration within a single session
- **Command:** Let Claude Code's Agent tool handle parallelism internally

**Recommended for Monday:** Option B (Parallel Sessions) — gives maximum velocity with human oversight at each terminal.

---

## 6. Per-Agent Input File Map

| Agent | Must Read | May Reference |
|-------|-----------|---------------|
| PO Agent | `PROJECT.md`, `docs/RELEASE_PLAN.md` | `docs/TEST_CASES.md` |
| Architect Agent | `architecture/SYSTEM_ARCHITECTURE.md`, `architecture/DATA_FLOW.md` | `architecture/DIAGRAMS.md` |
| UI Designer Agent | `architecture/DESIGN_SYSTEM.md` | `PROJECT.md` |
| BE Dev Agent | `architecture/DATA_FLOW.md` | `architecture/SYSTEM_ARCHITECTURE.md` |
| FE Dev Agent | `architecture/DESIGN_SYSTEM.md`, `architecture/SYSTEM_ARCHITECTURE.md` | `docs/RELEASE_PLAN.md` |
| Functional Tester | `docs/TEST_CASES.md` | `docs/RELEASE_PLAN.md` |
| Automation Tester | `docs/TEST_CASES.md`, source code | `architecture/DATA_FLOW.md` |

---

*This agent plan is prepared for the EPAM–CTC Hackathon. Each agent operates within the BLAST framework (Blueprint → Link → Architect → Stylize → Trigger) and follows the operational standards defined in AGENTS.md.*
