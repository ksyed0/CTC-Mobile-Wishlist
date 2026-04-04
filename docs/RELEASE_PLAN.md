# Release Plan — CTC-Mobile-Wishlist

## MVP — Core Wishlist POC

---

### Epic 1: Project Scaffolding & Mock Data

```
EPIC-0001: Project Scaffolding & Mock Data Layer
Description: Set up the Expo project with navigation, theming, and local mock data for products and users
Release Target: MVP
Status: Planned
Dependencies: None
```

```
US-0001 (EPIC-0001): As a developer, I want an Expo project scaffold with tab navigation and Canadian Tire theming, so that all screens have a consistent structure.
Priority: High
Estimate: M
Status: Planned
Branch: feature/US-0001-expo-scaffold
Dependencies: None
Acceptance Criteria:
  - [ ] AC-0001: Expo project initializes and runs on iOS and Android simulators
  - [ ] AC-0002: Tab navigation with Home, Catalog, Scan, Wishlists tabs is functional
  - [ ] AC-0003: Canadian Tire brand colours (#D52B1E, #333, #FFF) and system fonts are applied globally
  - [ ] AC-0004: App displays a splash screen with Canadian Tire branding on launch
```

```
TASK-0001 (US-0001): Initialize Expo project with TypeScript template and expo-router
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0001-expo-scaffold
Notes: Use expo-router for file-based navigation
```

```
TASK-0002 (US-0001): Create tab layout with Home, Catalog, Scan, Wishlists screens
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0001-expo-scaffold
Notes: Use Material Design Icons via @expo/vector-icons
```

```
TASK-0003 (US-0001): Define global theme (colours, spacing, typography) and apply to app
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0001-expo-scaffold
Notes: Canadian Tire red #D52B1E as primary, system fonts
```

```
US-0002 (EPIC-0001): As a developer, I want a local mock data layer with products and user profiles, so that the app can function without a backend.
Priority: High
Estimate: M
Status: Planned
Branch: feature/US-0002-mock-data
Dependencies: US-0001
Acceptance Criteria:
  - [ ] AC-0005: At least 20 mock products exist with name, price, barcode, image, and category
  - [ ] AC-0006: Mock product images are bundled as local assets
  - [ ] AC-0007: A mock user profile is available for simulated login
  - [ ] AC-0008: Data access layer abstracts storage so it could be swapped later
```

```
TASK-0004 (US-0002): Create mock product catalog JSON with 20+ products across 4+ categories
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0001-expo-scaffold
Notes: Include realistic Canadian Tire product names, prices, barcodes
```

```
TASK-0005 (US-0002): Bundle placeholder product images as local assets
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0001-expo-scaffold
Notes: Use placeholder images sized for mobile (300x300). Using "placeholder" string — real images in Phase 3.
```

```
TASK-0006 (US-0002): Implement data access layer using AsyncStorage with typed interfaces
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0001-expo-scaffold
Notes: Abstract behind service interface for future swapability
```

---

### Epic 2: Product Catalog Browsing

```
EPIC-0002: Product Catalog Browsing
Description: Allow users to browse, search, and view products from the mock catalog
Release Target: MVP
Status: Planned
Dependencies: EPIC-0001
```

```
US-0003 (EPIC-0002): As a shopper, I want to browse products by category, so that I can discover items I want to add to my wishlist.
Priority: High
Estimate: M
Status: Done
Branch: feature/US-0003-catalog-browse
Dependencies: US-0002
Acceptance Criteria:
  - [ ] AC-0009: Catalog screen displays product categories as filterable tabs or chips
  - [ ] AC-0010: Products display as cards showing image, name, and price
  - [ ] AC-0011: Tapping a product card navigates to the product detail screen
```

```
TASK-0007 (US-0003): Build catalog screen with category filter chips and product grid
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: Search bar, category chips, FlatList 2-col grid, EmptyState — all implemented
```

```
US-0004 (EPIC-0002): As a shopper, I want to view product details and add the product to a wishlist, so that I can save items I'm interested in.
Priority: High
Estimate: S
Status: Done
Branch: feature/US-0004-product-detail
Dependencies: US-0003
Acceptance Criteria:
  - [ ] AC-0012: Product detail screen shows image, name, description, price, and stock status
  - [ ] AC-0013: An "Add to Wishlist" button is visible and functional
  - [ ] AC-0014: Tapping "Add to Wishlist" shows a picker if multiple wishlists exist, or adds to default
```

```
TASK-0008 (US-0004): Build product detail screen with Add to Wishlist action
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: Image placeholder, price, stock badge, wishlist picker modal, duplicate guard (AC-0042)
```

```
US-0005 (EPIC-0002): As a shopper, I want to search products by name, so that I can quickly find a specific item.
Priority: Medium
Estimate: S
Status: Planned
Branch: feature/US-0005-product-search
Dependencies: US-0003
Acceptance Criteria:
  - [ ] AC-0015: A search bar is visible at the top of the catalog screen
  - [ ] AC-0016: Typing filters the product list in real time by name match
```

```
TASK-0009 (US-0005): Add search bar to catalog screen with real-time filtering
Type: Dev
Assignee: Agent
Status: To Do
Branch: feature/US-0005-product-search
Notes:
```

---

### Epic 3: Barcode Scanning

```
EPIC-0003: Barcode Scanning
Description: Enable users to scan physical product barcodes in-store and add them to wishlists
Release Target: MVP
Status: Planned
Dependencies: EPIC-0001
```

```
US-0006 (EPIC-0003): As an in-store shopper, I want to scan a product barcode with my phone camera, so that I can quickly identify and add the product to my wishlist.
Priority: High
Estimate: M
Status: Done
Branch: feature/US-0006-barcode-scan
Dependencies: US-0002
Acceptance Criteria:
  - [ ] AC-0017: Scan tab opens the camera with a barcode scanning overlay
  - [ ] AC-0018: Scanning a recognized barcode navigates to the matching product detail screen
  - [ ] AC-0019: Scanning an unrecognized barcode shows a "Product not found" message
  - [ ] AC-0020: Camera permission is requested gracefully with an explanation
```

```
TASK-0010 (US-0006): Implement barcode scanner screen using expo-camera
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: Camera permission flow, BarcodeOverlay, manual entry fallback (AC-0043), product lookup
```

```
TASK-0011 (US-0006): Add barcode-to-product lookup logic against mock catalog
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-integration
Notes: productService.getByBarcode() wired in scan.tsx; recent scans saved to AsyncStorage
```

---

### Epic 4: Wishlist Management

```
EPIC-0004: Wishlist Management
Description: Allow users to create, view, edit, and manage multiple wishlists with product items
Release Target: MVP
Status: Planned
Dependencies: EPIC-0001, EPIC-0002
```

```
US-0007 (EPIC-0004): As a shopper, I want to create and name multiple wishlists, so that I can organize items for different occasions.
Priority: High
Estimate: S
Status: Done
Branch: feature/US-0007-create-wishlist
Dependencies: US-0002
Acceptance Criteria:
  - [ ] AC-0021: Wishlists tab shows a list of all wishlists with name and item count
  - [ ] AC-0022: A "Create Wishlist" button opens a dialog to name the new wishlist
  - [ ] AC-0023: Wishlists persist across app restarts via AsyncStorage
```

```
TASK-0012 (US-0007): Build wishlists list screen with create dialog
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: SectionList for My/Shared sections, FAB, create modal, guest prompt
```

```
TASK-0013 (US-0007): Implement wishlist CRUD operations in data access layer
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-integration
Notes: wishlistService fully wired (create/delete/addItem/removeItem/share/claim) via WishlistContext
```

```
US-0008 (EPIC-0004): As a shopper, I want to view a wishlist's items and remove items I no longer want, so that I can keep my wishlist up to date.
Priority: High
Estimate: S
Status: Done
Branch: feature/US-0008-wishlist-detail
Dependencies: US-0007
Acceptance Criteria:
  - [ ] AC-0024: Wishlist detail screen shows all items with image, name, and price
  - [ ] AC-0025: Swipe-to-delete or a remove button removes an item from the wishlist
  - [ ] AC-0026: Empty wishlist shows a friendly empty state with a prompt to add items
```

```
TASK-0014 (US-0008): Build wishlist detail screen with item list and remove action
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: FlatList of WishlistItemRow, remove confirm dialog, EmptyState, price total footer, share modal
```

```
US-0009 (EPIC-0004): As a shopper, I want to see the total value of items in my wishlist, so that I can gauge my spending.
Priority: Low
Estimate: S
Status: Done
Branch: feature/US-0009-wishlist-total
Dependencies: US-0008
Acceptance Criteria:
  - [ ] AC-0027: Wishlist detail screen displays the sum of all item prices at the bottom
```

```
TASK-0015 (US-0009): Add price total to wishlist detail footer
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: getTotalPrice() from wishlistUtils.ts wired in wishlist/[id].tsx footer
```

---

### Epic 5: Wishlist Sharing & Fulfillment

```
EPIC-0005: Wishlist Sharing & Fulfillment
Description: Enable users to share wishlists with phone contacts and let recipients claim items they want to buy
Release Target: MVP
Status: Planned
Dependencies: EPIC-0004
```

```
US-0010 (EPIC-0005): As a shopper, I want to share my wishlist with contacts from my phone, so that friends and family can see what I want.
Priority: High
Estimate: M
Status: Done
Branch: feature/US-0010-share-wishlist
Dependencies: US-0007
Acceptance Criteria:
  - [ ] AC-0028: A "Share" button on the wishlist detail screen opens a contact picker
  - [ ] AC-0029: Selected contacts are added to the wishlist's sharedWith list
  - [ ] AC-0030: A simulated share notification is shown confirming the share action
```

```
TASK-0016 (US-0010): Implement contact picker using expo-contacts
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: Mock contact list used (AC-0044); share modal in wishlist detail with toggle selection
```

```
TASK-0017 (US-0010): Add share flow — select contacts, update wishlist, show confirmation
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: Share modal in wishlist/[id].tsx; uses mockUsers as contacts; confirms with Alert
```

```
US-0011 (EPIC-0005): As a gift buyer (recipient), I want to view a shared wishlist, so that I can see what the person wants.
Priority: High
Estimate: M
Status: Done
Branch: feature/US-0011-shared-view
Dependencies: US-0010
Acceptance Criteria:
  - [ ] AC-0031: A "Shared With Me" section appears on the Wishlists tab showing received wishlists
  - [ ] AC-0032: Tapping a shared wishlist shows items with image, name, price, and claimed status
  - [ ] AC-0033: Items already claimed by another person are visually marked as taken
```

```
TASK-0018 (US-0011): Build shared wishlist view with claimed-status indicators
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: Claimed items greyed out with badge; owner view hides claimer names (AC-0036)
```

```
US-0012 (EPIC-0005): As a gift buyer, I want to claim an item on a shared wishlist, so that others know I intend to buy it and duplicates are avoided.
Priority: High
Estimate: S
Status: Done
Branch: feature/US-0012-claim-item
Dependencies: US-0011
Acceptance Criteria:
  - [ ] AC-0034: An unclaimed item shows a "I'll Get This" button
  - [ ] AC-0035: Claiming an item marks it with the claimer's name and disables the button for others
  - [ ] AC-0036: The wishlist owner cannot see who claimed which item (surprise preserved)
```

```
TASK-0019 (US-0012): Implement claim/unclaim logic and UI for shared wishlist items
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/pixel-screens
Notes: claimItem/unclaimItem via useWishlists(); "I'll Get This" button; unclaim on re-tap
```

---

### Epic 6: Mock Authentication

```
EPIC-0006: Mock Authentication
Description: Simulate login and anonymous browsing modes without real auth infrastructure
Release Target: MVP
Status: Planned
Dependencies: EPIC-0001
```

```
US-0013 (EPIC-0006): As a user, I want to simulate logging in or browsing anonymously, so that the POC can demonstrate both authenticated and guest experiences.
Priority: Medium
Estimate: S
Status: Done
Branch: feature/US-0013-mock-auth
Dependencies: US-0002
Acceptance Criteria:
  - [ ] AC-0037: A mock login screen allows selecting from pre-defined user profiles
  - [ ] AC-0038: A "Continue as Guest" option skips login and limits features (no sharing)
  - [ ] AC-0039: The current user identity is shown in a profile/settings area
  - [ ] AC-0040: Switching users resets the session context to that user's wishlists
```

```
TASK-0020 (US-0013): Build mock login screen with user profile selector and guest mode
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0001-expo-scaffold
Notes: Pre-define 2-3 mock users for demo switching
```

```
TASK-0021 (US-0013): Implement user context provider to propagate identity throughout the app
Type: Dev
Assignee: Agent
Status: Done
Branch: feature/US-0001-expo-scaffold
Notes:
```
