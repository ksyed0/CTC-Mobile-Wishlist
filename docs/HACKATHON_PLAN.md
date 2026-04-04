# Hackathon Plan — CTC Mobile Wishlist

> **Date:** Monday, April 7, 2026
> **Duration:** 8 hours (9:00 AM – 5:00 PM ET)
> **Agent Config:** `agents.config.json`
> **Orchestration Framework:** See `docs/AGENT_PLAN.md` for the generic pipeline, PR flow, and execution modes

---

## 1. Agent Roster — CTC Mobile Wishlist

### 1.0 Conductor — Delivery Manager Agent

| Attribute            | Detail                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------- |
| **Role**             | Orchestrates all agents, manages context flow, tracks progress, enforces timelines          |
| **BLAST Phase**      | All phases — spans the entire BLAST framework                                               |
| **Input Artifacts**  | All project files — `AGENTS.md`, `PROJECT.md`, `docs/AGENT_PLAN.md`, `docs/RELEASE_PLAN.md` |
| **Output Artifacts** | Updated `progress.md`, orchestration decisions, phase handoff context                       |
| **Instruction File** | `docs/agents/DM_AGENT.md`                                                                   |

**Prompt to start the hackathon:**

```
Read docs/agents/DM_AGENT.md for your full instructions. You are Conductor, the
Delivery Manager orchestrating 7 specialized agents for today's hackathon. Follow
the orchestration playbook in your instruction file. Begin with Phase 1: spawn
Compass to prioritize the backlog.
```

---

### 1.1 Lens — Code Reviewer Agent

| Attribute            | Detail                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| **Role**             | Reviews every PR/branch for architecture, design system, security, testing, and story compliance |
| **BLAST Phase**      | All phases — quality gate between every phase transition                                         |
| **Input Artifacts**  | All architecture docs, `AGENTS.md`, source code under review                                     |
| **Output Artifacts** | Structured review reports, bug entries in `docs/BUGS.md`                                         |
| **Instruction File** | `docs/agents/CODE_REVIEWER_AGENT.md`                                                             |

**When spawned:** Conductor spawns Lens after each agent completes its work, before merging to the next phase. Lens produces APPROVE / REQUEST CHANGES / BLOCK verdicts with a structured checklist.

---

### 1.2 Compass — Product Owner (PO) Agent

| Attribute            | Detail                                                                            |
| -------------------- | --------------------------------------------------------------------------------- |
| **Role**             | Requirements validation, backlog prioritization, acceptance criteria, UI guidance |
| **BLAST Phase**      | Blueprint                                                                         |
| **Input Artifacts**  | `PROJECT.md`, `docs/RELEASE_PLAN.md`, `docs/TEST_CASES.md`                        |
| **Output Artifacts** | Refined ACs, priority-ordered backlog, UI direction notes                         |
| **User Stories**     | All (US-0001 through US-0013) — owns prioritization                               |

**Prompt Template:**

```
You are Compass, the Product Owner Agent for the CTC Mobile Wishlist POC. Read PROJECT.md and
docs/RELEASE_PLAN.md. Your job is to:
1. Validate and refine acceptance criteria for each user story
2. Prioritize the backlog for an 8-hour hackathon (what to build vs. simulate)
3. Provide UI guidance based on architecture/DESIGN_SYSTEM.md
4. Answer developer questions about requirements
Focus on MVP scope: browsing, barcode scan, wishlist CRUD, and sharing.
```

---

### 1.3 Keystone — Architect Agent

| Attribute            | Detail                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Role**             | System architecture, API contracts, service layer design, type definitions                                                      |
| **BLAST Phase**      | Architect                                                                                                                       |
| **Input Artifacts**  | `architecture/SYSTEM_ARCHITECTURE.md`, `architecture/DATA_FLOW.md`, `architecture/DESIGN_SYSTEM.md`, `architecture/DIAGRAMS.md` |
| **Output Artifacts** | TypeScript interfaces, service stubs, directory scaffold, Context providers                                                     |
| **User Stories**     | US-0001 (scaffold), US-0002 (mock data layer)                                                                                   |

**Prompt Template:**

```
You are Keystone, the Architect Agent for the CTC Mobile Wishlist POC. Read all files in
architecture/. Your job is to:
1. Scaffold the Expo project with TypeScript and expo-router
2. Create type definitions from architecture/DATA_FLOW.md (Product, Wishlist, User, etc.)
3. Implement service interfaces (ProductService, WishlistService, UserService)
4. Set up Context providers (AuthProvider, ProductProvider, WishlistProvider)
5. Create the directory structure per architecture/SYSTEM_ARCHITECTURE.md
```

---

### 1.4 Palette — UI Designer Agent

| Attribute            | Detail                                                                                    |
| -------------------- | ----------------------------------------------------------------------------------------- |
| **Role**             | Mobile UI design, wireframes, component specs, CTC brand compliance                       |
| **BLAST Phase**      | Stylize                                                                                   |
| **Input Artifacts**  | `architecture/DESIGN_SYSTEM.md`, `PROJECT.md` (design system section)                     |
| **Output Artifacts** | Component style definitions, layout specs, theme configuration                            |
| **User Stories**     | US-0001 (theming), US-0003 (catalog UI), US-0005 (scanner overlay), US-0007 (wishlist UI) |

**Prompt Template:**

```
You are Palette, the UI Designer Agent for the CTC Mobile Wishlist POC. Read
architecture/DESIGN_SYSTEM.md. Your job is to:
1. Define the theme file (CT Red #D52B1E, spacing grid 4px, card radius 8px)
2. Create reusable component styles: ProductCard, WishlistCard, CategoryChip, etc.
3. Ensure all screens follow CTC brand guidelines
4. Provide layout guidance for each screen (Home, Catalog, Scanner, Wishlists, Share)
Use system fonts, maintain WCAG AA contrast ratios, and follow the 4px spacing grid.
```

**POC Simulation:** For screens not fully implemented, produce ASCII wireframe mockups and component spec documentation showing intended layouts.

---

### 1.5 Forge — Backend Developer Agent

| Attribute            | Detail                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Role**             | Service layer implementation, data models, AsyncStorage persistence, mock data                                                       |
| **BLAST Phase**      | Link                                                                                                                                 |
| **Input Artifacts**  | `architecture/DATA_FLOW.md`, `architecture/SYSTEM_ARCHITECTURE.md`                                                                   |
| **Output Artifacts** | Service implementations, mock JSON data files, Context providers                                                                     |
| **User Stories**     | US-0002 (mock data), US-0004 (product detail), US-0006 (scan lookup), US-0008 (wishlist CRUD), US-0010 (sharing), US-0012 (claiming) |

**Prompt Template:**

```
You are Forge, the Backend Developer Agent for the CTC Mobile Wishlist POC. Read
architecture/DATA_FLOW.md. Your job is to:
1. Create data/products.json with 20+ mock CTC products across categories
2. Create data/users.json with 3-4 mock user profiles
3. Implement ProductService (getProducts, getProductById, getByBarcode, search, getCategories)
4. Implement WishlistService (CRUD, addItem, removeItem, shareWishlist, claimItem)
5. Implement UserService (getCurrentUser, setCurrentUser, getMockUsers)
6. All services use AsyncStorage with key schema from DATA_FLOW.md
```

---

### 1.6 Pixel — Frontend Developer Agent

| Attribute            | Detail                                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Role**             | React Native screen implementation, component building, navigation, state management                                                                    |
| **BLAST Phase**      | Stylize                                                                                                                                                 |
| **Input Artifacts**  | `architecture/DESIGN_SYSTEM.md`, `architecture/SYSTEM_ARCHITECTURE.md`, `docs/RELEASE_PLAN.md`                                                          |
| **Output Artifacts** | Screen components, navigation config, UI components                                                                                                     |
| **User Stories**     | US-0001 (scaffold), US-0003 (catalog), US-0005 (scanner), US-0007 (wishlists), US-0009 (wishlist detail), US-0011 (share flow), US-0013 (user switcher) |

**Prompt Template:**

```
You are Pixel, the Frontend Developer Agent for the CTC Mobile Wishlist POC. Read
architecture/DESIGN_SYSTEM.md and architecture/SYSTEM_ARCHITECTURE.md. Your job is to:
1. Build tab navigation: Home, Catalog, Scan, Wishlists
2. Implement screens: HomeScreen, CatalogScreen, ScannerScreen, WishlistsScreen
3. Build stack screens: ProductDetailScreen, WishlistDetailScreen, ShareScreen
4. Create reusable components: ProductCard, WishlistCard, WishlistItemRow, CategoryChip
5. Wire up Context hooks (useAuth, useProducts, useWishlists) to all screens
6. Use expo-camera for barcode scanning, expo-contacts for sharing
```

---

### 1.7 Sentinel — Functional Tester Agent

| Attribute            | Detail                                                                 |
| -------------------- | ---------------------------------------------------------------------- |
| **Role**             | Manual test execution, bug reporting, acceptance verification          |
| **BLAST Phase**      | Trigger                                                                |
| **Input Artifacts**  | `docs/TEST_CASES.md` (TC-0001 through TC-0036), `docs/RELEASE_PLAN.md` |
| **Output Artifacts** | Test execution report, bug reports, AC sign-off                        |
| **User Stories**     | All — validates acceptance criteria                                    |

**Prompt Template:**

```
You are Sentinel, the Functional Tester Agent for the CTC Mobile Wishlist POC. Read
docs/TEST_CASES.md. Your job is to:
1. Execute test cases TC-0001 through TC-0036 against the running app
2. Record PASS/FAIL for each test case with evidence
3. Log bugs with steps to reproduce, expected vs actual behavior
4. Verify all acceptance criteria (AC-0001 through AC-0040) are met
5. Produce a test execution summary report
```

**POC Simulation:** For features not implemented in the POC, produce simulated test results showing expected behavior and noting "Simulated — not testable in POC" where applicable.

---

### 1.8 Circuit — Automation Tester Agent

| Attribute            | Detail                                                                   |
| -------------------- | ------------------------------------------------------------------------ |
| **Role**             | Jest test suites, React Native Testing Library tests, coverage reporting |
| **BLAST Phase**      | Trigger                                                                  |
| **Input Artifacts**  | `docs/TEST_CASES.md`, implemented source code                            |
| **Output Artifacts** | Test files (`__tests__/`), coverage report, CI-ready test config         |
| **User Stories**     | All — automates regression testing                                       |

**Prompt Template:**

```
You are Circuit, the Automation Tester Agent for the CTC Mobile Wishlist POC. Your job is to:
1. Create Jest + React Native Testing Library test suites
2. Test service layer: ProductService, WishlistService, UserService
3. Test components: ProductCard, WishlistCard renders, user interactions
4. Test navigation: tab switching, stack navigation
5. Target ≥70% code coverage for services, ≥50% for components
Structure: __tests__/services/, __tests__/components/, __tests__/screens/
```

---

## 2. Hackathon Timeline

| Time       | Duration | Phase          | Agent(s) Active                      | Deliverable                            |
| ---------- | -------- | -------------- | ------------------------------------ | -------------------------------------- |
| 9:00–9:30  | 30 min   | Blueprint      | Conductor → Compass                  | Prioritized backlog, refined ACs       |
| 9:30–10:30 | 60 min   | Architect      | Conductor → Keystone                 | Project scaffold, types, service stubs |
| 10:30–1:00 | 150 min  | Link + Stylize | Conductor → Forge + Pixel (parallel) | Services + screens implemented         |
| 1:00–1:30  | 30 min   | Break          | —                                    | —                                      |
| 1:30–2:30  | 60 min   | Integration    | Pixel                                | End-to-end flows working               |
| 2:30–3:30  | 60 min   | Trigger        | Sentinel + Circuit (parallel)        | Test results, Jest suites              |
| 3:30–4:00  | 30 min   | Polish         | All                                  | Bug fixes, demo prep                   |
| 4:00–5:00  | 60 min   | Demo           | Human presenter                      | Live demo + business case deck         |

---

## 3. Simulated vs. Real Work

| Agent                      | Real Work (POC)                                         | Simulated Work                          |
| -------------------------- | ------------------------------------------------------- | --------------------------------------- |
| **Conductor** (DM)         | Phase orchestration, context passing, progress tracking | Stakeholder comms, risk management      |
| **Lens** (Reviewer)        | PR reviews, architecture/design compliance checks       | Security audits, performance reviews    |
| **Compass** (PO)           | Backlog prioritization, AC refinement                   | Stakeholder interviews, market research |
| **Keystone** (Architect)   | Project scaffold, types, service interfaces             | Infrastructure design, CI/CD pipeline   |
| **Palette** (UI Designer)  | Theme file, component styles                            | Full Figma mockups, accessibility audit |
| **Forge** (BE Dev)         | AsyncStorage services, mock data                        | Real API integration, database design   |
| **Pixel** (FE Dev)         | All screens, navigation, components                     | Performance optimization, animations    |
| **Sentinel** (Func Tester) | Test cases on working screens                           | Cross-device testing, load testing      |
| **Circuit** (Auto Tester)  | Jest unit tests for services + components               | E2E tests (Detox), CI integration       |

### Feature-Level Scope

| Feature                     | Real (Code)                                  | Simulated (Docs/Mocks)           |
| --------------------------- | -------------------------------------------- | -------------------------------- |
| Tab navigation              | Yes                                          | --                               |
| CTC theming / design tokens | Yes                                          | --                               |
| Mock data (products, users) | Yes                                          | --                               |
| Catalog browsing + search   | Yes                                          | --                               |
| Product detail screen       | Yes                                          | --                               |
| Barcode scanner             | Camera UI real; scan result uses mock lookup | Real barcode recognition         |
| Wishlist CRUD               | Yes                                          | --                               |
| Wishlist sharing            | Service logic real; contacts from mock data  | Real SMS/push notifications      |
| Item claiming               | Service logic real                           | Multi-device sync                |
| User switching              | Mock login real                              | Real authentication (OAuth, JWT) |
| Splash screen               | Static branded screen                        | Animated splash                  |

---

## 4. Deployment Strategy

**Hackathon (Monday):** Use Expo Go + iOS Simulator. No paid accounts needed.

| Method                     | Account Needed?        | Use Case                                       |
| -------------------------- | ---------------------- | ---------------------------------------------- |
| **Expo Go** (free app)     | No                     | Demo on physical iPhone/Android — scan QR code |
| **iOS Simulator** (Xcode)  | No (free Xcode)        | Local dev/demo on Mac                          |
| **Android Emulator**       | No                     | Local dev/demo on any OS                       |
| **EAS Development Build**  | Free Apple ID          | Custom native modules (not needed for POC)     |
| **TestFlight / App Store** | $99/yr Apple Developer | Production — not applicable for hackathon      |

**To run:** `npx expo start` → scan QR with Expo Go on demo device.

---

## 5. Per-Agent Input File Map

| Agent                  | Must Read                                                                           | May Reference                         |
| ---------------------- | ----------------------------------------------------------------------------------- | ------------------------------------- |
| Conductor (DM)         | All files — `AGENTS.md`, `PROJECT.md`, `docs/AGENT_PLAN.md`, `docs/RELEASE_PLAN.md` | `progress.md`                         |
| Lens (Reviewer)        | All architecture docs, `AGENTS.md`, source code under review                        | `docs/BUGS.md`                        |
| Compass (PO)           | `PROJECT.md`, `docs/RELEASE_PLAN.md`                                                | `docs/TEST_CASES.md`                  |
| Keystone (Architect)   | `architecture/SYSTEM_ARCHITECTURE.md`, `architecture/DATA_FLOW.md`                  | `architecture/DIAGRAMS.md`            |
| Palette (UI Designer)  | `architecture/DESIGN_SYSTEM.md`                                                     | `PROJECT.md`                          |
| Forge (BE Dev)         | `architecture/DATA_FLOW.md`                                                         | `architecture/SYSTEM_ARCHITECTURE.md` |
| Pixel (FE Dev)         | `architecture/DESIGN_SYSTEM.md`, `architecture/SYSTEM_ARCHITECTURE.md`              | `docs/RELEASE_PLAN.md`                |
| Sentinel (Func Tester) | `docs/TEST_CASES.md`                                                                | `docs/RELEASE_PLAN.md`                |
| Circuit (Auto Tester)  | `docs/TEST_CASES.md`, source code                                                   | `architecture/DATA_FLOW.md`           |

---

_This hackathon plan is prepared for the EPAM–CTC Hackathon on April 7, 2026. For the generic orchestration framework, PR flow, BLOCK recovery, and execution modes, see `docs/AGENT_PLAN.md`._
