# Release Plan — CTC-Mobile-Wishlist

## MVP — Core Wishlist POC

---

### Epic 1: Project Scaffolding & Mock Data

```
EPIC-001: Project Scaffolding & Mock Data Layer
Description: Set up the Expo project with navigation, theming, and local mock data for products and users
Release Target: MVP
Status: Done
Dependencies: None
```

```
US-001-001 (EPIC-001): As a developer, I want an Expo project scaffold with tab navigation and Canadian Tire theming, so that all screens have a consistent structure.
Priority: High
Estimate: M
Status: Done
Branch: feature/US-001-001-expo-scaffold
Dependencies: None
Acceptance Criteria:
  - [ ] AC-001-001-001: Expo project initializes and runs on iOS and Android simulators
  - [ ] AC-001-001-002: Tab navigation with Home, Catalog, Scan, Wishlists tabs is functional
  - [ ] AC-001-001-003: Canadian Tire brand colours (#D52B1E, #333, #FFF) and system fonts are applied globally
  - [ ] AC-001-001-004: App displays a splash screen with Canadian Tire branding on launch
```

```
TASK-001-001-001 (US-001-001): Initialize Expo project with TypeScript template and expo-router
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-001-001-expo-scaffold
Notes: Use expo-router for file-based navigation
```

```
TASK-001-001-002 (US-001-001): Create tab layout with Home, Catalog, Scan, Wishlists screens
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-001-001-expo-scaffold
Notes: Use Material Design Icons via @expo/vector-icons
```

```
TASK-001-001-003 (US-001-001): Define global theme (colours, spacing, typography) and apply to app
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-001-001-expo-scaffold
Notes: Canadian Tire red #D52B1E as primary, system fonts
```

```
US-001-002 (EPIC-001): As a developer, I want a local mock data layer with products and user profiles, so that the app can function without a backend.
Priority: High
Estimate: M
Status: Done
Branch: feature/US-001-002-mock-data
Dependencies: US-001-001
Acceptance Criteria:
  - [ ] AC-001-002-001: At least 20 mock products exist with name, price, barcode, image, and category
  - [ ] AC-001-002-002: Mock product images are bundled as local assets
  - [ ] AC-001-002-003: A mock user profile is available for simulated login
  - [ ] AC-001-002-004: Data access layer abstracts storage so it could be swapped later
```

```
TASK-001-002-001 (US-001-002): Create mock product catalog JSON with 20+ products across 4+ categories
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-001-001-expo-scaffold
Notes: Include realistic Canadian Tire product names, prices, barcodes
```

```
TASK-001-002-002 (US-001-002): Bundle placeholder product images as local assets
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-001-001-expo-scaffold
Notes: Use placeholder images sized for mobile (300x300). Using "placeholder" string — real images in Phase 3.
```

```
TASK-001-002-003 (US-001-002): Implement data access layer using AsyncStorage with typed interfaces
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-001-001-expo-scaffold
Notes: Abstract behind service interface for future swapability
```

---

### Epic 2: Product Catalog Browsing

```
EPIC-002: Product Catalog Browsing
Description: Allow users to browse, search, and view products from the mock catalog
Release Target: MVP
Status: Done
Dependencies: EPIC-001
```

```
US-002-001 (EPIC-002): As a shopper, I want to browse products by category, so that I can discover items I want to add to my wishlist.
Priority: High
Estimate: M
Status: Done
Branch: feature/US-002-001-catalog-browse
Dependencies: US-001-002
Acceptance Criteria:
  - [ ] AC-002-001-001: Catalog screen displays product categories as filterable tabs or chips
  - [ ] AC-002-001-002: Products display as cards showing image, name, and price
  - [ ] AC-002-001-003: Tapping a product card navigates to the product detail screen
```

```
TASK-002-001-001 (US-002-001): Build catalog screen with category filter chips and product grid
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: Search bar, category chips, FlatList 2-col grid, EmptyState — all implemented
```

```
US-002-002 (EPIC-002): As a shopper, I want to view product details and add the product to a wishlist, so that I can save items I'm interested in.
Priority: High
Estimate: S
Status: Done
Branch: feature/US-002-002-product-detail
Dependencies: US-002-001
Acceptance Criteria:
  - [ ] AC-002-002-001: Product detail screen shows image, name, description, price, and stock status
  - [ ] AC-002-002-002: An "Add to Wishlist" button is visible and functional
  - [ ] AC-002-002-003: Tapping "Add to Wishlist" shows a picker if multiple wishlists exist, or adds to default
```

```
TASK-002-002-001 (US-002-002): Build product detail screen with Add to Wishlist action
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: Image placeholder, price, stock badge, wishlist picker modal, duplicate guard (AC-004-002-004)
```

```
US-002-003 (EPIC-002): As a shopper, I want to search products by name, so that I can quickly find a specific item.
Priority: Medium
Estimate: S
Status: Done
Branch: feature/US-002-003-product-search
Dependencies: US-002-001
Acceptance Criteria:
  - [ ] AC-002-003-001: A search bar is visible at the top of the catalog screen
  - [ ] AC-002-003-002: Typing filters the product list in real time by name match
```

```
TASK-002-003-001 (US-002-003): Add search bar to catalog screen with real-time filtering
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/polish-fixes
Notes: BUG-086 fix — TextInput search bar above category chips; filters filteredProducts locally via useMemo for real-time response; clear (×) button; theme-token styles.
```

---

### Epic 3: Barcode Scanning

```
EPIC-003: Barcode Scanning
Description: Enable users to scan physical product barcodes in-store and add them to wishlists
Release Target: MVP
Status: Done
Dependencies: EPIC-001
```

```
US-003-001 (EPIC-003): As an in-store shopper, I want to scan a product barcode with my phone camera, so that I can quickly identify and add the product to my wishlist.
Priority: High
Estimate: M
Status: Done
Branch: feature/US-003-001-barcode-scan
Dependencies: US-001-002
Acceptance Criteria:
  - [ ] AC-003-001-001: Scan tab opens the camera with a barcode scanning overlay
  - [ ] AC-003-001-002: Scanning a recognized barcode navigates to the matching product detail screen
  - [ ] AC-003-001-003: Scanning an unrecognized barcode shows a "Product not found" message
  - [ ] AC-003-001-004: Camera permission is requested gracefully with an explanation
  - [ ] AC-003-001-005: getByBarcode returns the matching product for a known barcode; returns null for unknown barcodes
```

```
TASK-003-001-001 (US-003-001): Implement barcode scanner screen using expo-camera
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: Camera permission flow, BarcodeOverlay, manual entry fallback (AC-0043), product lookup
```

```
TASK-003-001-002 (US-003-001): Add barcode-to-product lookup logic against mock catalog
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-integration
Notes: productService.getByBarcode() wired in scan.tsx; recent scans saved to AsyncStorage
```

```
US-003-002 (EPIC-003): As a demo presenter, I want the scan screen to show a tappable product catalog when running on a simulator, so that I can demonstrate the scan flow without a physical device or real barcode.
Priority: High
Estimate: M
Status: Done
Branch: feature/US-003-002-simulator-scan-mock
Dependencies: US-003-001
Spec: docs/superpowers/specs/2026-04-05-simulator-scan-mock-design.md
Plan: docs/superpowers/plans/2026-04-05-simulator-scan-mock.md
Acceptance Criteria:
  - [x] AC-003-002-001: On a physical device, scan screen behaves exactly as before (camera + live barcode scanning)
  - [x] AC-003-002-002: On a simulator (Device.isDevice === false), the camera view is replaced with a scrollable WebView rendering data/product-catalog-print.html
  - [x] AC-003-002-003: Each product card in the WebView is tappable; tapping fires handleBarcode() with the card's barcode string
  - [x] AC-003-002-004: A simulator-mode banner is shown at the top of the scan screen
```

```
TASK-003-002-001 (US-003-002): Build SimulatorScanView component — WebView loading product-catalog-print.html with injected tap-to-scan click handlers
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-003-002-simulator-scan-mock
Plan: docs/superpowers/plans/2026-04-05-simulator-scan-mock.md — Tasks 1, 2, 3
Notes: extractBarcodeFromMeta reads barcode from .card-meta text; expo-asset + expo-file-system load HTML; tap handler script injected before </body>; new deps: expo-device, react-native-webview, expo-asset, expo-file-system
```

```
TASK-003-002-002 (US-003-002): Wire Device.isDevice simulator detection into scan.tsx
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-003-002-simulator-scan-mock
Plan: docs/superpowers/plans/2026-04-05-simulator-scan-mock.md — Tasks 4, 5
Notes: isSimulator = !Device.isDevice evaluated at module level; renders SimulatorScanView in place of CameraView+BarcodeOverlay on simulators; physical device path unchanged; metro.config.js required to bundle .html asset
```

---

### Epic 4: Wishlist Management

```
EPIC-004: Wishlist Management
Description: Allow users to create, view, edit, and manage multiple wishlists with product items
Release Target: MVP
Status: Done
Dependencies: EPIC-001, EPIC-002
```

```
US-004-001 (EPIC-004): As a shopper, I want to create and name multiple wishlists, so that I can organize items for different occasions.
Priority: High
Estimate: S
Status: Done
Branch: feature/US-004-001-create-wishlist
Dependencies: US-001-002
Acceptance Criteria:
  - [ ] AC-004-001-001: Wishlists tab shows a list of all wishlists with name and item count
  - [ ] AC-004-001-002: A "Create Wishlist" button opens a dialog to name the new wishlist
  - [ ] AC-004-001-003: Wishlists persist across app restarts via AsyncStorage
```

```
TASK-004-001-001 (US-004-001): Build wishlists list screen with create dialog
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: SectionList for My/Shared sections, FAB, create modal, guest prompt
```

```
TASK-004-001-002 (US-004-001): Implement wishlist CRUD operations in data access layer
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-integration
Notes: wishlistService fully wired (create/delete/addItem/removeItem/share/claim) via WishlistContext
```

```
US-004-002 (EPIC-004): As a shopper, I want to view a wishlist's items and remove items I no longer want, so that I can keep my wishlist up to date.
Priority: High
Estimate: S
Status: Done
Branch: feature/US-004-002-wishlist-detail
Dependencies: US-004-001
Acceptance Criteria:
  - [ ] AC-004-002-001: Wishlist detail screen shows all items with image, name, and price
  - [ ] AC-004-002-002: Swipe-to-delete or a remove button removes an item from the wishlist
  - [ ] AC-004-002-003: Empty wishlist shows a friendly empty state with a prompt to add items
  - [ ] AC-004-002-004: addItem does not add a duplicate product to the wishlist; duplicate attempts are rejected
```

```
TASK-004-002-001 (US-004-002): Build wishlist detail screen with item list and remove action
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: FlatList of WishlistItemRow, remove confirm dialog, EmptyState, price total footer, share modal
```

```
US-004-003 (EPIC-004): As a shopper, I want to see the total value of items in my wishlist, so that I can gauge my spending.
Priority: Low
Estimate: S
Status: Done
Branch: feature/US-004-003-wishlist-total
Dependencies: US-004-002
Acceptance Criteria:
  - [ ] AC-004-003-001: Wishlist detail screen displays the sum of all item prices at the bottom
```

```
TASK-004-003-001 (US-004-003): Add price total to wishlist detail footer
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: getTotalPrice() from wishlistUtils.ts wired in wishlist/[id].tsx footer
```

---

### Epic 5: Wishlist Sharing & Fulfillment

```
EPIC-005: Wishlist Sharing & Fulfillment
Description: Enable users to share wishlists with phone contacts and let recipients claim items they want to buy
Release Target: MVP
Status: Done
Dependencies: EPIC-004
```

```
US-005-001 (EPIC-005): As a shopper, I want to share my wishlist with contacts from my phone, so that friends and family can see what I want.
Priority: High
Estimate: M
Status: Done
Branch: feature/US-005-001-share-wishlist
Dependencies: US-004-001
Acceptance Criteria:
  - [ ] AC-005-001-001: A "Share" button on the wishlist detail screen opens a contact picker
  - [ ] AC-005-001-002: Selected contacts are added to the wishlist's sharedWith list
  - [ ] AC-005-001-003: A simulated share notification is shown confirming the share action
```

```
TASK-005-001-001 (US-005-001): Implement contact picker using expo-contacts
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: Mock contact list used (AC-0044); share modal in wishlist detail with toggle selection
```

```
TASK-005-001-002 (US-005-001): Add share flow — select contacts, update wishlist, show confirmation
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: Share modal in wishlist/[id].tsx; uses mockUsers as contacts; confirms with Alert
```

```
US-005-002 (EPIC-005): As a gift buyer (recipient), I want to view a shared wishlist, so that I can see what the person wants.
Priority: High
Estimate: M
Status: Done
Branch: feature/US-005-002-shared-view
Dependencies: US-005-001
Acceptance Criteria:
  - [ ] AC-005-002-001: A "Shared With Me" section appears on the Wishlists tab showing received wishlists
  - [ ] AC-005-002-002: Tapping a shared wishlist shows items with image, name, price, and claimed status
  - [ ] AC-005-002-003: Items already claimed by another person are visually marked as taken
```

```
TASK-005-002-001 (US-005-002): Build shared wishlist view with claimed-status indicators
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: Claimed items greyed out with badge; owner view hides claimer names (AC-005-003-003)
```

```
US-005-003 (EPIC-005): As a gift buyer, I want to claim an item on a shared wishlist, so that others know I intend to buy it and duplicates are avoided.
Priority: High
Estimate: S
Status: Done
Branch: feature/US-005-003-claim-item
Dependencies: US-005-002
Acceptance Criteria:
  - [ ] AC-005-003-001: An unclaimed item shows a "I'll Get This" button
  - [ ] AC-005-003-002: Claiming an item marks it with the claimer's name and disables the button for others
  - [ ] AC-005-003-003: The wishlist owner cannot see who claimed which item (surprise preserved)
```

```
TASK-005-003-001 (US-005-003): Implement claim/unclaim logic and UI for shared wishlist items
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: claimItem/unclaimItem via useWishlists(); "I'll Get This" button; unclaim on re-tap
```

---

### Epic 6: Mock Authentication

```
EPIC-006: Mock Authentication
Description: Simulate login and anonymous browsing modes without real auth infrastructure
Release Target: MVP
Status: Done
Dependencies: EPIC-001
```

```
US-006-001 (EPIC-006): As a user, I want to simulate logging in or browsing anonymously, so that the POC can demonstrate both authenticated and guest experiences.
Priority: Medium
Estimate: S
Status: Done
Branch: feature/US-006-001-mock-auth
Dependencies: US-001-002
Acceptance Criteria:
  - [ ] AC-006-001-001: A mock login screen allows selecting from pre-defined user profiles
  - [ ] AC-006-001-002: A "Continue as Guest" option skips login and limits features (no sharing)
  - [ ] AC-006-001-003: The current user identity is shown in a profile/settings area
  - [ ] AC-006-001-004: Switching users resets the session context to that user's wishlists
```

```
TASK-006-001-001 (US-006-001): Build mock login screen with user profile selector and guest mode
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-001-001-expo-scaffold
Notes: Pre-define 2-3 mock users for demo switching
```

```
TASK-006-001-002 (US-006-001): Implement user context provider to propagate identity throughout the app
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-001-001-expo-scaffold
Notes:
```

---

### Tooling & Process Enhancements

```
US-0014: As a pipeline engineer, I want each lesson in LESSONS.md to have an "Applies to" field listing relevant agent roles, so that agents can efficiently scan their lessons without reading all 29 entries.
Priority: Low
Estimate: XS
Status: To Do
Branch: —
Dependencies: None
Acceptance Criteria:
  - [ ] AC-0043: Each lesson entry in docs/LESSONS.md has an "Applies to:" line listing agent names (e.g. "Applies to: Pixel, Lens")
  - [ ] AC-0044: Each agent's Mandatory Startup step for LESSONS.md is updated to scan for its own name rather than reading the full file
```

```
US-003-002 (EPIC-003): As a developer testing on a simulator, I want a mock scan UI that lets me tap a product to simulate a barcode scan, so that I can demo the scan flow without a physical device.
Priority: High
Estimate: S
Status: Done
Branch: feature/US-003-002-simulator-scan-mock
Dependencies: US-003-001
Acceptance Criteria:
  - [ ] AC-003-002-001: On simulator, the Scan tab shows a product picker instead of the camera
  - [ ] AC-003-002-002: Tapping a product in the picker navigates to the product detail screen as if scanned
```

```
TASK-003-002-001 (US-003-002): Detect simulator vs physical device and conditionally render SimulatorScanView
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-003-002-simulator-scan-mock
Notes: Uses Device.isDevice from expo-device; renders SimulatorScanView on simulator, real CameraView on device
```

```
TASK-003-002-002 (US-003-002): Build SimulatorScanView component with mock product picker
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-003-002-simulator-scan-mock
Notes: FlatList of all products; tapping navigates to /product/[id] with fromScan param
```

---

### Epic 7: POC Demo Enhancements

```
EPIC-007: POC Demo Enhancements
Description: Nine UX and feature enhancements to improve demo polish, gift-sharing UX, and presenter ergonomics
Release Target: POC v2
Status: Done
Dependencies: EPIC-004, EPIC-005, EPIC-006
Spec (Plan A — #1-4): docs/superpowers/specs/2026-04-05-poc-enhancements-plan-a-design.md
Spec (Plan B — #5,7-10): docs/superpowers/specs/2026-04-05-poc-enhancements-plan-b-design.md
Plan (Plan A): docs/superpowers/plans/2026-04-05-poc-enhancements-plan-a.md
Plan (Plan B): docs/superpowers/plans/2026-04-05-poc-enhancements-plan-b.md
```

```
US-007-001 (EPIC-007): As a wishlist owner, I want to attach a short note to any wishlist item, so that I can give the gift buyer useful context (size, colour, variant).
Priority: Medium
Estimate: S
Status: Done
Branch: feature/plan-a-ui
Dependencies: US-004-002
Spec: docs/superpowers/specs/2026-04-05-poc-enhancements-plan-a-design.md#feature-1--item-notes-us-0016
Plan: docs/superpowers/plans/2026-04-05-poc-enhancements-plan-a.md — Tasks 2, 3, 4
Acceptance Criteria:
  - [x] AC-003-002-002: Owner can tap "+ Add note" on any item to open a bottom sheet input
  - [x] AC-003-002-003: Entering text and tapping Save persists the note via AsyncStorage
  - [x] AC-003-002-004: The note is shown as a subtitle below the item name in both owner and shared views
  - [x] AC-007-001-001: Owner can edit or clear an existing note by tapping it
```

```
US-007-002 (EPIC-007): As a shopper, I want to see which catalog products I've already saved to a wishlist, so that I don't add duplicates while browsing.
Priority: Medium
Estimate: S
Status: Done
Branch: feature/plan-a-ui
Dependencies: US-004-001, US-002-001
Spec: docs/superpowers/specs/2026-04-05-poc-enhancements-plan-a-design.md#feature-2--already-in-wishlist-indicator-us-0017
Plan: docs/superpowers/plans/2026-04-05-poc-enhancements-plan-a.md — Task 5
Acceptance Criteria:
  - [x] AC-007-002-001: Products already saved to any wishlist show a filled red heart badge on their catalog card
  - [x] AC-007-002-002: Saved products show a green "✓ Saved" pill instead of the add button
  - [x] AC-007-002-003: Indicator updates immediately after adding a product to a wishlist
```

```
US-007-003 (EPIC-007): As a demo presenter, I want a one-tap button to reset all demo data, so that I can start fresh between live demonstrations.
Priority: High
Estimate: XS
Status: Done
Branch: feature/plan-a-ui
Dependencies: US-006-001
Spec: docs/superpowers/specs/2026-04-05-poc-enhancements-plan-a-design.md#feature-3--demo-reset-us-0018
Plan: docs/superpowers/plans/2026-04-05-poc-enhancements-plan-a.md — Tasks 2, 3, 6
Acceptance Criteria:
  - [x] AC-007-003-001: A "Reset demo data" button is visible on the login/user-select screen
  - [x] AC-007-003-002: Tapping it shows a confirmation dialog before any data is deleted
  - [x] AC-007-003-003: After confirming, all wishlists and recent scans are cleared from AsyncStorage
  - [x] AC-007-003-004: The app remains on the login screen after reset; no navigation side effects
```

```
US-007-004 (EPIC-007): As a wishlist owner, I want to rename a wishlist, so that I can fix typos or change the purpose of an existing list.
Priority: Low
Estimate: XS
Status: Done
Branch: feature/plan-a-ui
Dependencies: US-004-001
Spec: docs/superpowers/specs/2026-04-05-poc-enhancements-plan-a-design.md#feature-4--wishlist-rename-us-0019
Plan: docs/superpowers/plans/2026-04-05-poc-enhancements-plan-a.md — Tasks 1, 2, 3, 7
Acceptance Criteria:
  - [x] AC-007-004-001: A pencil icon is visible next to the wishlist name in the detail header
  - [x] AC-007-004-002: Tapping the pencil opens a pre-filled bottom sheet input
  - [x] AC-007-004-003: Saving updates the wishlist name immediately in the header and list views
  - [x] AC-007-004-004: The save button is disabled when the name input is empty
```

```
US-007-005 (EPIC-007): As a user, I want to see a badge on the Wishlists tab when I have unread shared wishlists, so that I know when someone has shared something with me.
Priority: Medium
Estimate: S
Status: Done
Branch: feature/plan-b-ui
Dependencies: US-005-002
Spec: docs/superpowers/specs/2026-04-05-poc-enhancements-plan-b-design.md#feature-5--unseen-shared-wishlist-tab-badge-us-0020
Plan: docs/superpowers/plans/2026-04-05-poc-enhancements-plan-b.md — Tasks 3, 4
Acceptance Criteria:
  - [x] AC-007-005-001: Wishlists tab shows a numeric badge when there are unseen shared wishlists
  - [x] AC-007-005-002: Opening a shared wishlist removes it from the unseen count
  - [x] AC-007-005-003: Badge disappears when all shared wishlists have been viewed
  - [x] AC-007-005-004: Switching users shows the correct badge count for the new user
```

```
US-007-006 (EPIC-007): As a wishlist owner, I want to optionally reveal who claimed each item, so that I can see fulfillment status after the event when the surprise is no longer needed.
Priority: Low
Estimate: S
Status: Done
Branch: feature/plan-b-ui
Dependencies: US-005-003
Spec: docs/superpowers/specs/2026-04-05-poc-enhancements-plan-b-design.md#feature-7--claimer-reveal-toggle-us-0021
Plan: docs/superpowers/plans/2026-04-05-poc-enhancements-plan-b.md — Tasks 1, 2, 3, 5
Acceptance Criteria:
  - [x] AC-007-006-001: Owner's wishlist detail shows a "Show who claimed items" toggle in the header
  - [x] AC-007-006-002: Toggle defaults to off; "Claimed" items show no name
  - [x] AC-007-006-003: When toggled on, claimed items show "Claimed by [contact name]"
  - [x] AC-007-006-004: Toggle state persists across app restarts
  - [x] AC-007-006-005: Recipients never see the toggle
```

```
US-007-007 (EPIC-007): As a shopper, I want to set a restock alert on an out-of-stock product, so that I'm notified when it becomes available (mock).
Priority: Low
Estimate: XS
Status: Done
Branch: feature/plan-b-ui
Dependencies: US-002-002
Spec: docs/superpowers/specs/2026-04-05-poc-enhancements-plan-b-design.md#feature-8--9--restock--price-drop-alerts-us-0022--us-0023
Plan: docs/superpowers/plans/2026-04-05-poc-enhancements-plan-b.md — Task 6
Acceptance Criteria:
  - [x] AC-007-007-001: "Notify me when back in stock" button appears only when product.inStock === false
  - [x] AC-007-007-002: Tapping the restock button shows an Alert confirmation (no navigation)
```

```
US-007-008 (EPIC-007): As a shopper, I want to set a price-drop alert on any product, so that I'm notified if the price decreases (mock).
Priority: Low
Estimate: XS
Status: Done
Branch: feature/plan-b-ui
Dependencies: US-002-002
Spec: docs/superpowers/specs/2026-04-05-poc-enhancements-plan-b-design.md#feature-8--9--restock--price-drop-alerts-us-0022--us-0023
Plan: docs/superpowers/plans/2026-04-05-poc-enhancements-plan-b.md — Task 6
Acceptance Criteria:
  - [x] AC-007-008-001: "Notify me if price drops" button is always visible on the product detail screen
  - [x] AC-007-008-002: Tapping the price-drop button shows an Alert confirmation (no navigation)
  - [x] AC-007-008-003: Both buttons use an outlined style to avoid competing with the main CTAs
```

```
US-007-009 (EPIC-007): As a wishlist owner, I want to set a privacy level on my wishlist (Private / Contacts / Public link), so that I control who can see it.
Priority: Medium
Estimate: M
Status: Done
Branch: feature/plan-b-ui
Dependencies: US-005-001
Spec: docs/superpowers/specs/2026-04-05-poc-enhancements-plan-b-design.md#feature-10--privacy-levels-us-0024
Plan: docs/superpowers/plans/2026-04-05-poc-enhancements-plan-b.md — Tasks 1, 2, 3, 7
Acceptance Criteria:
  - [x] AC-007-009-001: Wishlist detail header shows the current privacy setting
  - [x] AC-007-009-002: Tapping the privacy row opens a 3-option picker sheet
  - [x] AC-007-009-003: Setting to "Private" hides the Share button
  - [x] AC-007-009-004: Setting to "Public link" shows a "Copy Link" button that copies a mock deep link
  - [x] AC-007-009-005: Privacy setting persists across app restarts
```

---

### Epic 8: Agentic SDLC Pipeline & Live Dashboard

```
EPIC-008: Agentic SDLC Pipeline & Live Dashboard
Description: The orchestration framework, agent roster, multi-platform spawn helper, concurrency safety utilities, live HTML dashboard, sdlc-status schema, and plan visualizer that powered the agentic build of this POC
Release Target: Tooling (internal)
Status: Done
Dependencies: None
```

```
US-008-001 (EPIC-008): As a pipeline engineer, I want a documented agent roster and orchestration framework with named roles, icons, and prompt templates, so that any team member can understand and extend the agentic pipeline.
Priority: High
Estimate: M
Status: Done
Branch: develop
Dependencies: None
Acceptance Criteria:
  - [x] AC-008-001-001: agents.config.json exists as the single source of truth, defining name, role, icon, color, and instructionFile for each agent
  - [x] AC-008-001-002: Nine agent roles are defined — Conductor (DM), Compass (PO), Keystone (Architect), Lens (Reviewer), Palette (UI Designer), Forge (BE Dev), Pixel (FE Dev), Sentinel (Functional Tester), Circuit (Automation Tester)
  - [x] AC-008-001-003: Each agent has a dedicated instruction file in docs/agents/ with mandatory startup steps, responsibilities, and tool instructions
  - [x] AC-008-001-004: docs/AGENT_PLAN.md documents the full 6-phase pipeline (Blueprint → Architect → Build → Integration → Test → Polish) with phase entry/exit criteria, the PR review lifecycle, BLOCK recovery protocol, and execution mode options
```

```
TASK-008-001-001 (US-008-001): Create agents.config.json with 9 agent definitions and dashboard/orchestrator metadata
Type: Dev
Assignee: Agent
Status: Done
Branch: develop
Notes: Single JSON file; agents map, dashboard branding block, orchestrator.dmAgent/reviewer/avatarGrid; loaded by spawn.js, generate-dashboard.js, process-avatars.js, and init-sdlc-status.js
```

```
TASK-008-001-002 (US-008-001): Write 9 agent instruction files in docs/agents/ with roles, responsibilities, and prompt templates
Type: Dev
Assignee: Agent
Status: Done
Branch: develop
Notes: DM_AGENT.md, PO_AGENT.md, ARCHITECT_AGENT.md, CODE_REVIEWER_AGENT.md, UI_DESIGNER_AGENT.md, BE_DEV_AGENT.md, FE_DEV_AGENT.md, FUNCTIONAL_TESTER_AGENT.md, AUTOMATION_TESTER_AGENT.md
```

```
TASK-008-001-003 (US-008-001): Write docs/AGENT_PLAN.md — 6-phase pipeline, PR/review flow, BLOCK recovery, execution modes, concurrency safety rules, and config-driven setup guide
Type: Dev
Assignee: Agent
Status: Done
Branch: develop
Notes: Covers sequential, parallel, Agent-tool delegation, and spawn helper execution modes; references all concurrency utilities
```

```
US-008-002 (EPIC-008): As a pipeline engineer, I want a CLI spawn helper that generates correct launch commands for any supported AI coding platform, so that agents can be started consistently across environments without manual prompt assembly.
Priority: High
Estimate: M
Status: Done
Branch: develop
Dependencies: US-008-001
Acceptance Criteria:
  - [x] AC-008-002-001: orchestrator/spawn.js supports --list-platforms, --list-agents, --agent <name>, and --print-all flags
  - [x] AC-008-002-002: Seven platform adapters exist for claude-code, codex-cli, gemini-cli, aider, codemie, elitea, and opencode
  - [x] AC-008-002-003: spawn.js loads all agent definitions from agents.config.json — no hardcoded agent data in the script
  - [x] AC-008-002-004: Running --print-all outputs a complete prompt block for every agent on the detected platform
  - [x] AC-008-002-005: Running --agent <name> outputs a ready-to-paste launch command with the agent's instruction file path resolved
```

```
TASK-008-002-001 (US-008-002): Implement orchestrator/spawn.js with CLI flag parsing and dynamic agent/platform resolution from agents.config.json
Type: Dev
Assignee: Agent
Status: Done
Branch: develop
Notes: Reads agents.config.json; delegates to adapter modules; supports all 4 CLI flags; prints platform-specific spawn syntax
```

```
TASK-008-002-002 (US-008-002): Implement 7 platform adapter modules in orchestrator/adapters/ (claude-code.js, codex-cli.js, gemini-cli.js, aider.js, codemie.js, elitea.js, opencode.js)
Type: Dev
Assignee: Agent
Status: Done
Branch: develop
Notes: Each adapter exports formatSpawnCommand(agent, config); adapters differ in flag syntax and instruction file handling
```

```
US-008-003 (EPIC-008): As a pipeline engineer, I want atomic file utilities for shared state during parallel agent execution, so that simultaneous agents cannot corrupt shared pipeline files.
Priority: High
Estimate: M
Status: Done
Branch: develop
Dependencies: US-008-001
Acceptance Criteria:
  - [x] AC-008-003-001: orchestrator/file-lock.js provides withLock() and withLockSync() using mkdir-based locking with configurable stale timeout
  - [x] AC-008-003-002: orchestrator/atomic-write.js provides atomicReadModifyWriteJson() for safe concurrent JSON mutation, atomicAppend() for locked log appends, and reserveId() for race-free ID allocation
  - [x] AC-008-003-003: orchestrator/git-safe.js provides safePush() with exponential backoff (4 retries) and checkOverlap() to detect conflicting file edits across parallel branches before merging
  - [x] AC-008-003-004: All shared pipeline files (sdlc-status.json, progress.md, BUGS.md, ID_REGISTRY.md, AI_COST_LOG.md) are protected by these utilities in agent instruction files
```

```
TASK-008-003-001 (US-008-003): Implement orchestrator/file-lock.js — mkdir-based mutual exclusion with stale lock detection and configurable retry backoff
Type: Dev
Assignee: Agent
Status: Done
Branch: develop
Notes: Uses fs.mkdirSync as atomic lock primitive; stale detection via mtime; exposes withLock(path, fn) and withLockSync(path, fn)
```

```
TASK-008-003-002 (US-008-003): Implement orchestrator/atomic-write.js — atomicReadModifyWriteJson, atomicAppend, reserveId backed by file-lock.js
Type: Dev
Assignee: Agent
Status: Done
Branch: develop
Notes: atomicReadModifyWriteJson parses, calls transform fn, writes back atomically; reserveId reads ID_REGISTRY, increments, writes back; atomicAppend acquires lock before fs.appendFileSync
```

```
TASK-008-003-003 (US-008-003): Implement orchestrator/git-safe.js — safePush with retry/backoff and checkOverlap for parallel branch conflict detection
Type: Dev
Assignee: Agent
Status: Done
Branch: develop
Notes: safePush wraps git push; retries on exit code 1 with pull-rebase; checkOverlap diffs two branches and reports overlapping file paths
```

```
US-008-004 (EPIC-008): As a pipeline engineer, I want a self-contained HTML dashboard that visualises real-time phase progress, agent statuses, and delivery metrics, so that I can monitor the agentic build at a glance without reading JSON.
Priority: High
Estimate: L
Status: Done
Branch: develop
Dependencies: US-008-001, US-008-005
Acceptance Criteria:
  - [x] AC-008-004-001: tools/generate-dashboard.js reads sdlc-status.json and agents.config.json and emits a self-contained docs/dashboard.html with no external dependencies
  - [x] AC-008-004-002: Dashboard displays the 6-phase pipeline as a visual flow with per-phase completion status (planned/in-progress/done/blocked)
  - [x] AC-008-004-003: Dashboard shows a status card per agent with icon, role, current status (idle/active/done/blocked), and active task label; icons and colours are driven by agents.config.json
  - [x] AC-008-004-004: Dashboard shows a metrics panel: stories done/total, tasks done/total, tests passed, code coverage percentage, and open bug count
  - [x] AC-008-004-005: Dashboard auto-refreshes by polling sdlc-status.json every 5 seconds without a full page reload
  - [x] AC-008-004-006: Dashboard plays distinct audio tones and surfaces browser notifications when a phase completes, an agent transitions to blocked, or a new critical bug is opened
  - [x] AC-008-004-007: All dashboard branding (title, subtitle, footer, primary colour, author, repo URL) is driven by the dashboard section of agents.config.json — no hardcoded project values in the generator
  - [x] AC-008-004-008: npm run dashboard runs a one-shot generation; npm run dashboard:watch re-generates on every sdlc-status.json change
```

```
TASK-008-004-001 (US-008-004): Implement tools/generate-dashboard.js — reads sdlc-status.json + agents.config.json, renders phase pipeline, agent cards, metrics panel, and alert triggers into a single self-contained HTML file
Type: Dev
Assignee: Agent
Status: Done
Branch: develop
Notes: 820-line generator; getDashboardMeta() reads branding from config; auto-refresh via setInterval fetch; all CSS/JS inlined; audio context for tone alerts
```

```
TASK-008-004-002 (US-008-004): Add config-driven branding layer to generate-dashboard.js — title, subtitle, footer, primaryColor, author, authorTitle, repoUrl all sourced from agents.config.json dashboard block
Type: Dev
Assignee: Agent
Status: Done
Branch: develop
Notes: Fixes BUG-112 — branding was previously hardcoded; getDashboardMeta() now falls back to package.json name only when config is absent
```

```
TASK-008-004-003 (US-008-004): Add audio alert and browser notification system to generated dashboard — distinct tones for phase-complete, agent-blocked, and bug-opened events
Type: Dev
Assignee: Agent
Status: Done
Branch: develop
Notes: Web Audio API oscillator tones; Notification API with permission prompt; event detection compares previous vs current sdlc-status.json on each poll cycle; tested via docs/alert-test.html
```

```
US-008-005 (EPIC-008): As a pipeline engineer, I want a typed sdlc-status.json schema and an initialiser script, so that any new project can bootstrap a clean dashboard state from agents.config.json in a single command.
Priority: Medium
Estimate: S
Status: Done
Branch: develop
Dependencies: US-008-001
Acceptance Criteria:
  - [x] AC-008-005-001: docs/sdlc-status.json schema captures currentPhase, phases array (each with id, name, status, stories), agents map (each with status, currentTask), and metrics (storiesDone, tasksTotal, testsPassed, coveragePercent, bugsOpen)
  - [x] AC-008-005-002: tools/init-sdlc-status.js generates a valid sdlc-status.json from agents.config.json with all agents initialised to idle and all phases to planned
  - [x] AC-008-005-003: npm run init:status runs the initialiser; subsequent npm run dashboard immediately renders a blank but valid dashboard
```

```
TASK-008-005-001 (US-008-005): Implement tools/init-sdlc-status.js — generates docs/sdlc-status.json from agents.config.json, producing all phases planned and all agents idle
Type: Dev
Assignee: Agent
Status: Done
Branch: develop
Notes: Reads agents.config.json; writes sdlc-status.json; idempotent — safe to re-run; does not overwrite if --no-overwrite flag is passed
```

```
US-008-006 (EPIC-008): As a pipeline engineer, I want a plan visualizer that renders epic and story progress from RELEASE_PLAN.md as a navigable HTML page, so that stakeholders can track delivery status without reading raw markdown.
Priority: Medium
Estimate: M
Status: Done
Branch: develop
Dependencies: None
Acceptance Criteria:
  - [x] AC-008-006-001: tools/generate-plan.js parses RELEASE_PLAN.md and emits a self-contained docs/plan-status.html
  - [x] AC-008-006-002: Plan visualizer shows all epics with story and task counts, grouped by Done / In Progress / To Do
  - [x] AC-008-006-003: Each story row shows its ID, title, status badge, estimate, and linked acceptance criteria completion ratio
  - [x] AC-008-006-004: npm run plan:generate runs a one-shot generation; npm run plan:watch re-generates on RELEASE_PLAN.md changes
  - [x] AC-008-006-005: plan-status.html is fully self-contained — no external CSS, JS, or font dependencies
```

```
TASK-008-006-001 (US-008-006): Implement tools/generate-plan.js — parses RELEASE_PLAN.md fenced blocks, extracts epics/stories/tasks/ACs, and renders docs/plan-status.html with status grouping and progress bars
Type: Dev
Assignee: Agent
Status: Done
Branch: develop
Notes: tools/lib/parse-release-plan.js handles markdown parsing; requires (EPIC-XXXX) in US headers to associate stories; US-0014 intentionally excluded (lacks epic tag)
```

```
US-008-007 (EPIC-008): As a pipeline engineer, I want the SDLC dashboard and plan visualizer to include smart auto-refresh, persistent alert toggles, expanded filter controls, 3D agent card hover, portrait popups, full date timestamps, pill-style buttons, and an epic-inclusive search index, so that the monitoring UI is more interactive and informative.
Priority: Medium
Estimate: S
Status: Done
Branch: feature/session14-tooling-sync
Dependencies: US-008-004, US-008-006
Acceptance Criteria:
  - [x] AC-008-007-001: generate-dashboard.js replaces meta-refresh with a 30s JS setInterval that skips reload when the About modal is open, preventing mid-read dismissal and portrait flicker
  - [x] AC-008-007-002: Alerts button is a proper on/off toggle backed by localStorage key dashboard-alerts-enabled; sendNotification() checks this key before firing
  - [x] AC-008-007-003: NaN% in the per-epic budget table is eliminated — budget.js guards division by zero with epicBudget > 0 check
  - [x] AC-008-007-004: Costs tab scrolls naturally (tab-fill fixed-height constraint removed); #tab-costs .scroll-table has max-height: none; overflow: visible
  - [x] AC-008-007-005: Agent cards gain 3D hover (scale, box-shadow, brightness) and show a fixed-position portrait popup on mouseenter / hide on mouseleave
  - [x] AC-008-007-006: Last refreshed footer shows full date + time (toLocaleString with month/day/year/hour/minute); bug and lesson cards gain story-card-hover class; filter bar shows for lessons and traceability tabs; topbar buttons use pill style; theme toggle shows ☀️ Light / 🌙 Dark text; search index includes epics
```

```
TASK-008-007-001 (US-008-007): Sync session 14 dashboard/visualizer improvements from PlanVisualizer repo into CTC-Mobile-Wishlist tool copies
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/session14-tooling-sync
Notes: Changes applied to tools/generate-dashboard.js, tools/lib/render-html.js, tools/lib/budget.js; new file tools/lib/search-index.js created
```
