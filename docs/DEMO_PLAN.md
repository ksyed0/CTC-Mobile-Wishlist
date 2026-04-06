# CTC Mobile Wishlist — Live Demo Plan

**Event:** EPAM Hackathon POC Presentation  
**Client:** Canadian Tire Corporation (CTC)  
**Team:** EPAM  
**Duration:** ~10–15 minutes  
**Device:** iPhone (iOS Simulator or physical device)

---

## Before You Start — Preflight Checklist

- [ ] App is running on simulator or device via `npx expo start`
- [ ] Signed in as **Alice** (user-001) — check top-right logout icon is visible
- [ ] At least one wishlist exists for Alice (create one called "Home Reno" in advance)
- [ ] Wishlist is empty (clear any test items)
- [ ] Catalog is visible and images are loading
- [ ] Screen brightness is max, Do Not Disturb is on
- [ ] If mirroring to a display, font size is legible from the back of the room

---

## Demo Narrative

> Frame it as a user journey: Alice is getting ready for a home renovation project and wants to build a wishlist of Canadian Tire tools, then share it with her husband Bob so he knows what to pick up.

---

## Scene 1 — Login & First Impression (1 min)

**What to do:**
1. Show the Login screen
2. Tap **Alice** to sign in

**Talking points:**
- "In a real implementation this would be federated auth — Triangle Rewards, Apple ID, or Google. For the POC we use mock users to simulate different personas without any backend dependency."
- "The app is fully offline — no API calls, no server. Everything runs on-device using AsyncStorage. That's a deliberate POC constraint but it validates the UX end-to-end."

**Suggested discussion:**
> "For production, how would you envision auth integrating with Triangle Rewards accounts?"

---

## Scene 2 — Product Catalog Browsing (2 min)

**What to do:**
1. Tap the **Catalog** tab
2. Show the full product list (scroll briefly)
3. Tap the **Tools** category filter — list narrows
4. Tap **Automotive** — different set of products
5. Tap **All** to reset

**Talking points:**
- "Products are pulled from a local JSON catalog — 23 SKUs across 5 categories. In production this would be a CTC API call with real inventory data."
- "Category filtering is instant because everything is in memory. The search bar supports partial-match text search across name and description."

**Suggested discussion:**
> "The current catalog structure mirrors CTC's real category taxonomy. Would you want to surface sub-categories (e.g. Power Tools within Tools), or keep a flat category model for the initial release?"

---

## Scene 3 — Product Search (1 min)

**What to do:**
1. Tap the search bar at the top of Catalog
2. Type `drill`
3. Show the Cordless Drill result
4. Clear the search

**Talking points:**
- "Search is client-side but the UX is identical to what a server-backed search would feel like. In production you'd call the CTC product search API here."
- "We intentionally kept search simple — name + description matching. No typo correction or synonym expansion in the POC, but those would be easy additions."

---

## Scene 4 — Product Detail & Add to Wishlist (2 min)

**What to do:**
1. Tap the **Mastercraft Cordless Drill** ($89.99)
2. Show the product detail screen — image, price, stock status, description, barcode
3. Tap **Add to Wishlist**
4. Select **"Home Reno"** from the picker
5. Confirm the "Added!" alert
6. Go back to Catalog, tap the **Screwdriver Set** ($24.99), add it to the same wishlist
7. Go back, tap the **Tape Measure** ($14.99), add it too

**Talking points:**
- "The Add to Wishlist flow shows a picker when the user has multiple lists — we never silently add to the wrong one."
- "The duplicate guard prevents adding the same product twice — you'll get a friendly notice instead of a silent no-op."
- "The 'Add to Cart' button is a mock — in production it would handoff to the existing CTC cart and checkout flow."

**Suggested discussion:**
> "Should users be able to add the same product to multiple different wishlists? For example, a drill on both a 'Home Reno' list and a 'Gift Ideas' list?"

---

## Scene 5 — Barcode Scanning (2 min)

**What to do:**

*On simulator:*
1. Tap the **Scan** tab
2. The catalog WebView loads in "SIMULATOR MODE" — tap any product card to simulate a scan
3. Tap the **Jump Starter** card
4. The app instantly resolves the barcode and navigates to the product detail
5. Add it to the wishlist

*On physical device:*
1. Tap the **Scan** tab — camera opens
2. Point at a physical product barcode on screen (or use a printed barcode)
3. Barcode `062073000011` → Cordless Drill
4. Show the instant lookup and navigation

**Barcodes for demo (use on printed sheet or second screen):**

| Product | Barcode |
|---|---|
| Cordless Drill | `062073000011` |
| Jump Starter | `062073000066` |
| Camping Tent | `062073000111` |

**Talking points:**
- "Scanning uses the device camera with native barcode detection — no third-party SDK. We support EAN-13, UPC-A, Code 128, and QR."
- "The simulator mode is a developer convenience — it loads a tappable HTML version of the product catalog so we can demo this feature without needing a physical device or barcodes."
- "In a real store, a customer picks up a product off the shelf, scans it, and immediately has the full product info and the option to add to their wishlist — no typing required."

**Suggested discussion:**
> "Should the scan result always navigate to product detail first, or would users prefer a faster 'one-tap add to wishlist' directly from the scanner?"

---

## Scene 6 — Wishlist Management (2 min)

**What to do:**
1. Tap the **Wishlists** tab
2. Show the **"Home Reno"** wishlist card with item count
3. Tap into the wishlist
4. Scroll through the items — show the running total at the bottom
5. Long-press or swipe to remove one item (show the remove gesture)
6. Show the total updating

**Talking points:**
- "The running total is calculated client-side from the items in the list — Alice can see the full estimated spend before she shares it."
- "Wishlists persist across sessions via AsyncStorage — closing and reopening the app preserves everything."
- "Users can have multiple wishlists for different occasions — Home Reno, Birthday, Christmas — each managed independently."

**Suggested discussion:**
> "Would CTC want to tie wishlist items to real-time inventory? For example, show a 'Low Stock' warning if a product drops below a threshold?"

---

## Scene 7 — Share the Wishlist (1 min)

**What to do:**
1. From inside the "Home Reno" wishlist, tap **Share**
2. The share modal shows the mock contacts — Alice, Bob, Carol
3. Tap **Bob** (already shared items will be greyed out)
4. Confirm — "Wishlist shared with Bob"

**Talking points:**
- "In the POC, sharing adds the recipient to the wishlist's `sharedWith` list in local storage. In production this would trigger a push notification or SMS to the contact."
- "The share list is populated from the device's mock contacts — in a real implementation this would integrate with the phone's Contacts API and the CTC account directory."

**Suggested discussion:**
> "Should wishlist sharing require the recipient to have the CTC app installed? Or should there be a web-based view for recipients who are app-agnostic?"

---

## Scene 8 — Recipient View & Item Claiming (2 min)

**What to do:**
1. Tap the logout icon (top-right) — return to the Login screen
2. Tap **Bob** to sign in as the recipient
3. Tap the **Wishlists** tab — show the **"Shared With Me"** section with Alice's "Home Reno" list
4. Tap into the wishlist
5. Show all items with **"I'll Get This"** buttons
6. Tap **"I'll Get This"** on the Cordless Drill — "Reserved!" confirmation
7. Show the item now shows **"Claimed"** badge and is dimmed

**Talking points:**
- "The recipient sees the wishlist owner's items but not who claimed what — that's intentional to preserve the gift surprise. Alice just knows it's been claimed, not by whom."
- "Claiming is atomic — if two contacts open the list simultaneously, only one claim is written. The second person would see 'Claimed' already."
- "The 'Shared With Me' section only appears when there are shared wishlists — the tab stays clean for users who haven't received anything."

**Suggested discussion:**
> "Should the wishlist owner be notified when an item is claimed? Real-time would require a backend, but a 'check next time you open the app' pattern could work with polling."

---

## Scene 9 — Owner Sees Claimed State (1 min)

**What to do:**
1. Tap logout — sign back in as **Alice**
2. Navigate to **Wishlists** → **"Home Reno"**
3. Show the Cordless Drill is now dimmed with a "Claimed" indicator
4. Point out that Alice sees it's claimed but not who claimed it

**Talking points:**
- "The experience is symmetric — the owner gets visibility that items are being handled, without spoiling the surprise."
- "This is the core value prop: Alice builds the list, shares it, and can shop knowing her contacts won't double-buy."

---

## Scene 10 — Wrap & Architecture Callout (1–2 min)

**Talking points:**
- "Everything you saw — catalog, scanning, wishlists, sharing, claiming — was built in a single hackathon day by an AI-assisted agentic development pipeline."
- "The app uses React Native + Expo so it runs on iOS and Android from one codebase. No custom native code — just JavaScript and TypeScript."
- "The data layer is fully swappable: replace AsyncStorage with an API client and the entire feature set is production-ready. The service interfaces are already abstracted."
- "Test coverage is at 91.68% — 436 tests across services, utilities, and components. The pipeline ran code review, test generation, and bug triage autonomously."

**Suggested discussion:**
> "If CTC were to take this forward, what would the MVP backend look like — hosted wishlists tied to Triangle Rewards accounts, real-time sync, or something simpler first?"

> "The agentic pipeline that built this app is itself a reusable asset. Would EPAM want to present the pipeline architecture separately as a delivery accelerator story?"

---

## Fallback Scripts

**If the app crashes or freezes:**
> "We'll restart — the app state is persisted, so the wishlist and user data will come back exactly as we left it."

**If a barcode doesn't scan (physical device):**
> "Let me switch to the simulator mode — it's actually a feature we built specifically for demo scenarios like this." *(switch to Scan tab on simulator)*

**If asked about real CTC integration:**
> "The service layer is fully abstracted — `wishlistService`, `productService`, `userService` are all swappable. Pointing them at real CTC APIs is a configuration change, not a rewrite."

**If asked 'is this production ready?':**
> "The UX and architecture are production-grade. What's missing is the backend plumbing — auth, persistent storage, push notifications, and the CTC product API integration. Those are well-understood engineering problems, not unknowns."

---

## Demo Environment Quick Reference

| Item | Value |
|---|---|
| Mock user A | Alice (`user-001`) |
| Mock user B | Bob (`user-002`) |
| Mock user C | Carol (`user-003`) |
| Scan barcode (Drill) | `062073000011` |
| Scan barcode (Jump Starter) | `062073000066` |
| Scan barcode (Tent) | `062073000111` |
| Start command | `npx expo start` |
| Pre-built wishlist name | "Home Reno" |
