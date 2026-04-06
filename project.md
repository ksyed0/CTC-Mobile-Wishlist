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

_Updated session 2026-04-06 (Session 10) — Post-release tooling fixes. BUG-0113/0114/0115 found and fixed: AI cost timeline inflated by est/\* branches, Plan Visualizer hierarchy card view blank on init, Agent Status card not fixed width. Missing AI cost estimates added to 18 BUGS.md entries. bugsFixed=114, bugsOpen=3 (BUG-0080/0082/0088 remain open). All tooling changes shipped to develop._

_Updated session 2026-04-05 — v1.0.0 released. All 24 stories complete. EPIC-0007 (Plan A + Plan B) fully shipped. develop → pushed. No outstanding backlog._

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
