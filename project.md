# PROJECT.md — Project Constitution

## Project Overview

- **Name:** CTC-Mobile-Wishlist
- **Description:** A limited-functional POC for Canadian Tire's mobile app, enabling users to create arbitrary wishlists, add items via product catalog browsing or barcode scanning of physical store shelf products, and share wishlists with phone contacts for collaborative gift fulfillment.
- **Client:** Canadian Tire Corporation (CTC)
- **Team:** EPAM (Hackathon POC)
- **Platform:** iOS & Android (cross-platform)

## Discovery Questions (Phase 1)

- **North Star:** Enable Canadian Tire mobile app users to create wishlists, add products via browsing or barcode scanning, and share wishlists with contacts who can browse and select items to purchase/fulfill.

- **Integrations:** None for POC. All data is local. No real backend, auth, or payment integrations. Mock product catalog and images stored locally.

- **Source of Truth:** Local device storage. Product data and mock images stored as local assets. Wishlist data persisted on-device (AsyncStorage / local JSON). No remote database.

- **Delivery Payload:** Cross-platform mobile app built with **React Native + Expo**. Runs on Android phones and iPhones. Designed for mobile form factor.

- **Behavioral Rules:**
  - Login and anonymous user behavior are simulated via mocks only — no real authentication.
  - The app should work fully offline since all data is local.
  - Sharing is simulated — no real push notifications or server-side sync.
  - Keep the UI simple and demo-ready. Prioritize happy path flows.
  - Do not implement real payment, checkout, or account management.
  - Tone: friendly, retail-oriented, Canadian Tire brand voice.

## Tech Stack

| Layer            | Technology                         | Reason                                             |
| ---------------- | ---------------------------------- | -------------------------------------------------- |
| Framework        | React Native + Expo (SDK 55)       | Single codebase, iOS + Android, fast POC iteration |
| Language         | TypeScript                         | Type safety, better DX                             |
| Navigation       | Expo Router                        | File-based routing, simple setup                   |
| Barcode Scanning | expo-camera / expo-barcode-scanner | Native barcode scanning, no config                 |
| Contacts         | expo-contacts                      | Access phone contacts for sharing                  |
| Sharing          | expo-sharing / Share API           | Native share sheet                                 |
| Local Storage    | AsyncStorage                       | Simple key-value persistence for POC               |
| UI Components    | React Native Paper or NativeWind   | Polished UI with minimal effort                    |
| Mock Data        | Local JSON + bundled images        | No backend needed for POC                          |

## Data Schema

### Product

```json
{
  "id": "string",
  "barcode": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "image": "string (local asset path)",
  "category": "string",
  "inStock": "boolean"
}
```

### Wishlist

```json
{
  "id": "string",
  "name": "string",
  "createdAt": "ISO8601",
  "ownerId": "string",
  "items": [
    {
      "productId": "string",
      "addedAt": "ISO8601",
      "claimedBy": "string | null",
      "note": "string | null"
    }
  ],
  "sharedWith": [
    {
      "contactId": "string",
      "contactName": "string",
      "sharedAt": "ISO8601"
    }
  ]
}
```

### User (local mock)

```json
{
  "id": "string",
  "name": "string",
  "phone": "string"
}
```

## User Profile (§5)

**Primary Persona:** Canadian Tire customer (25–55 years old) who shops both in-store and online. Moderate smartphone proficiency. Uses the app casually while walking through the store or browsing at home. Expects simple, intuitive interactions — no onboarding friction.

**Secondary Persona:** Gift recipient — a contact who receives a shared wishlist link. May not have the app installed. Needs to quickly understand what items are on the list and mark what they intend to buy.

## Design System (§6)

- **Brand colours:** Canadian Tire red (#D52B1E), white (#FFFFFF), dark grey (#333333)
- **Typography:** System fonts (San Francisco on iOS, Roboto on Android) for native feel
- **Corner radius:** 8px for cards, 12px for buttons
- **Spacing scale:** 4, 8, 12, 16, 24, 32
- **Icons:** Material Design Icons (via @expo/vector-icons)
- **Cards:** White background, subtle shadow, 8px radius — for product and wishlist items
- **Primary CTA:** Canadian Tire red with white text
- **Status bar:** Dark content on light background

## Maintenance Log

_Updated session 2026-04-09 (Session 14) — Tooling sync from PlanVisualizer + PR review fixes. Error-handling hardened: storage.ts setItem/removeItem re-throw, 4 wishlist handlers wrapped in try/catch with showToast, handleCopyLink uses expo-clipboard, markWishlistSeen fire-and-forget suppressed, resetDemoData error-alerted, BottomSheetInput switched to controlled value. Dashboard improvements synced: 30s smart reload, alerts on/off toggle, 3D agent card hover + portrait popup, full date footer. Plan visualizer improvements: costs tab scroll fix, bug filter epic+severity dropdowns, lesson/traceability filter support, pill-style topbar buttons, ☀️/🌙 theme toggle. New tools/lib/search-index.js (stories/bugs/lessons/epics indexed). budget.js NaN% guard for zero-budget epics. generate-dashboard.js exits 0 when sdlc-status.json absent (CI fix). US-008-007 added to RELEASE_PLAN.md. All 459 tests pass._

_Updated session 2026-04-08 (Session 12) — Hierarchical ID renumbering. Added EPIC-008 (Agentic SDLC Pipeline & Dashboard) to RELEASE_PLAN.md with 6 stories, 13 tasks, 29 ACs. Converted all project IDs from flat global-sequential (EPIC-0001, US-0001, AC-0001) to embedded-hierarchy format (EPIC-001, US-001-001, AC-001-001-001). Created tools/renumber-ids.js (365 mappings, --dry-run/--apply). Updated 4 parser files, render-html.js, 5 unit test files, 4 test fixtures, and ID_REGISTRY.md. 47 files updated, all 459 tests pass. US-0014 preserved unchanged (no epic parent)._

_Updated session 2026-04-06 (Session 11) — PlanVisualizer PR extraction. All tooling improvements (orchestrator, agentic dashboard, platform adapters, BLOCK alerts, agent registry, config-driven branding, bug fixes) extracted and submitted as PR #269 to ksyed0/PlanVisualizer (feat/agentic-dashboard-and-enhancements). Stale local branches (9) and worktrees removed. Generated files added to .gitignore. Session cost log committed. No outstanding CTC repo changes._

_Updated session 2026-04-06 (Session 10) — Post-release tooling fixes. BUG-113/0114/0115 found and fixed: AI cost timeline inflated by est/\* branches, Plan Visualizer hierarchy card view blank on init, Agent Status card not fixed width. Missing AI cost estimates added to 18 BUGS.md entries. bugsFixed=114, bugsOpen=3 (BUG-080/0082/0088 remain open). All tooling changes shipped to develop._

_Updated session 2026-04-05 — v1.0.0 released. All 24 stories complete. EPIC-007 (Plan A + Plan B) fully shipped. develop → pushed. No outstanding backlog._

## Tooling & Scripts

- `npm run plan:generate` / `npm run plan:watch` — regenerate PlanVisualizer dashboard (`docs/plan-status.html`)
- `npm run dashboard` / `npm run dashboard:watch` — regenerate SDLC agent dashboard (`docs/dashboard.html`)
- `npx expo install <pkg>` — always use instead of `npm install` for Expo packages (resolves SDK-compatible versions)

## Testing

- Tests live in `tests/` (not `__tests__/`); run with `npm test -- --watchAll=false`
- No React renderer installed — write pure logic/contract tests, not render tests

## Codebase Gotchas

- `parse-release-plan.js` requires `(EPIC-XXXX)` in US story headers to count them; US-0014 lacks this and is intentionally excluded
- `data/product-catalog-print.html`: `.card-meta` barcode text is authoritative (matches `products.json`); rendered JsBarcode SVG values differ for some products
- `metro.config.js` exists and bundles `.html` asset extensions (required for SimulatorScanView WebView)
- Simulator detection: use `Device.isDevice` from `expo-device`, not `__DEV__` (`__DEV__` is true on real devices in debug builds)
- Playwright MCP blocks `file://` protocol — serve local HTML via `python3 -m http.server <port>` instead
- `.claude/settings.json` Stop hook uses absolute path for `tools/capture-cost.js` — if changed back to relative, it breaks when session CWD shifts away from project root
- `project.md` is the single source of truth (PROJECT.md was a duplicate caused by macOS case-insensitive fs; removed from git)
- `docs/alert-test.html` — standalone test page for dashboard audio tones and browser notifications
