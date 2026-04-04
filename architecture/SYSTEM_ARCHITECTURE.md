# System Architecture — CTC Mobile Wishlist

## Overview

A cross-platform mobile application built with React Native + Expo, designed as a self-contained POC with local data storage. The architecture follows a 3-layer separation per AGENTS.md: Architecture (SOPs), Navigation (routing/state), and Tools (deterministic logic).

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │   Home   │ │ Catalog  │ │   Scan   │ │Wishlists │      │
│  │  Screen  │ │  Screen  │ │  Screen  │ │  Screen  │      │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘      │
│       │             │            │             │             │
│  ┌────┴─────┐ ┌────┴─────┐     │        ┌────┴─────┐      │
│  │ Profile  │ │ Product  │     │        │ Wishlist │      │
│  │ Screen   │ │ Detail   │     │        │  Detail  │      │
│  └──────────┘ └──────────┘     │        └────┬─────┘      │
│                                │             │             │
│                                │        ┌────┴─────┐      │
│                                │        │  Shared  │      │
│                                │        │  View    │      │
│                                │        └──────────┘      │
├─────────────────────────────────────────────────────────────┤
│                     NAVIGATION LAYER                         │
│                                                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │              Expo Router (file-based)             │      │
│  │  (tabs) → _layout.tsx                            │      │
│  │  index.tsx | catalog.tsx | scan.tsx | wishlists/  │      │
│  └──────────────────────────────────────────────────┘      │
│                                                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │          React Context Providers                  │      │
│  │  AuthContext │ WishlistContext │ ProductContext    │      │
│  └──────────────────────────────────────────────────┘      │
├─────────────────────────────────────────────────────────────┤
│                     DATA / SERVICE LAYER                     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Product      │  │  Wishlist     │  │  User        │     │
│  │  Service      │  │  Service      │  │  Service     │     │
│  │              │  │              │  │              │     │
│  │ getProducts()│  │ getWishlists()│  │ getUser()    │     │
│  │ getByBarcode│  │ addItem()    │  │ switchUser() │     │
│  │ search()    │  │ removeItem() │  │ isGuest()    │     │
│  │             │  │ share()      │  │              │     │
│  │             │  │ claimItem()  │  │              │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │              │
│  ┌──────┴─────────────────┴─────────────────┴──────┐      │
│  │              AsyncStorage (local)                │      │
│  │         + Bundled JSON (mock products)           │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
CTC-Mobile-Wishlist/
├── app/                          # Expo Router screens
│   ├── _layout.tsx               # Root layout (providers, theme)
│   ├── (tabs)/                   # Tab navigator
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # Home screen
│   │   ├── catalog.tsx           # Product catalog
│   │   ├── scan.tsx              # Barcode scanner
│   │   └── wishlists.tsx         # Wishlists list
│   ├── product/[id].tsx          # Product detail (dynamic route)
│   ├── wishlist/[id].tsx         # Wishlist detail (dynamic route)
│   ├── wishlist/shared/[id].tsx  # Shared wishlist view
│   └── login.tsx                 # Mock login screen
├── components/                   # Reusable UI components
│   ├── ProductCard.tsx
│   ├── WishlistCard.tsx
│   ├── WishlistItemRow.tsx
│   ├── CategoryChip.tsx
│   ├── EmptyState.tsx
│   ├── PriceTag.tsx
│   └── BarcodeOverlay.tsx
├── contexts/                     # React Context providers
│   ├── AuthContext.tsx
│   ├── WishlistContext.tsx
│   └── ProductContext.tsx
├── services/                     # Data access layer
│   ├── productService.ts
│   ├── wishlistService.ts
│   └── userService.ts
├── data/                         # Mock data
│   ├── products.json
│   ├── users.json
│   └── categories.json
├── assets/                       # Static assets
│   ├── images/
│   │   ├── products/             # Mock product images
│   │   ├── splash.png
│   │   └── icon.png
│   └── fonts/                    # (system fonts — no custom fonts for POC)
├── theme/                        # Design system tokens
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   └── index.ts
├── types/                        # TypeScript type definitions
│   ├── product.ts
│   ├── wishlist.ts
│   └── user.ts
├── utils/                        # Utility functions
│   └── storage.ts                # AsyncStorage wrapper
├── app.json                      # Expo config
├── tsconfig.json
├── package.json
└── babel.config.js
```

---

## Key Design Decisions

### 1. Expo Router (file-based routing)
- **Why:** Zero-config routing, deep linking support, familiar Next.js-like patterns.
- **Trade-off:** Less flexibility than React Navigation for complex nested navigators, but sufficient for POC scope.

### 2. React Context for State (not Redux/Zustand)
- **Why:** POC has simple state needs (current user, wishlists, products). Context avoids dependency bloat.
- **Trade-off:** Would not scale to production with many re-renders. Production should evaluate Zustand or Redux Toolkit.

### 3. AsyncStorage for Persistence
- **Why:** Simplest local KV store for React Native. No native module linking needed with Expo.
- **Trade-off:** Not suitable for large datasets or complex queries. Production would use a real backend or SQLite.

### 4. Service Layer Abstraction
- **Why:** All data access goes through typed service interfaces. When the POC transitions to production, only the service implementations need to change — screens and components remain untouched.
- **Pattern:** Each service exports async functions that return typed data. No direct AsyncStorage calls outside services.

### 5. Mock Auth via Context
- **Why:** A user context provider simulates login state and user identity. Screens conditionally render based on `isGuest` flag.
- **Trade-off:** No token management, no session expiry. Production would integrate with CTC's identity platform.

---

## Data Flow

### Adding a Product to Wishlist (from Catalog)

```
User taps "Add to Wishlist" on ProductDetail
    │
    ▼
ProductDetail calls WishlistContext.addItem(productId, wishlistId)
    │
    ▼
WishlistContext calls wishlistService.addItem(wishlistId, productId)
    │
    ▼
wishlistService reads wishlist from AsyncStorage
    ├── Appends new WishlistItem { productId, addedAt, claimedBy: null }
    └── Writes updated wishlist back to AsyncStorage
    │
    ▼
WishlistContext state updates → UI re-renders with new item
```

### Barcode Scan Flow

```
Camera detects barcode string
    │
    ▼
ScanScreen calls productService.getByBarcode(barcodeValue)
    │
    ├── Match found → Navigate to ProductDetail(productId)
    └── No match → Show "Product not found" toast
```

### Wishlist Sharing Flow (Simulated)

```
User taps "Share" on WishlistDetail
    │
    ▼
expo-contacts picker opens → User selects contacts
    │
    ▼
WishlistContext.shareWishlist(wishlistId, selectedContacts)
    │
    ▼
wishlistService adds contacts to wishlist.sharedWith[]
    │
    ▼
Confirmation toast shown
    │
    ▼
(Simulated) Shared wishlists appear in recipient's "Shared With Me"
    └── POC: Mock this by switching user identity and showing shared lists
```

---

## Platform-Specific Considerations

| Concern | iOS | Android |
|---------|-----|---------|
| Camera permissions | `NSCameraUsageDescription` in Info.plist | `CAMERA` permission in AndroidManifest |
| Contacts permissions | `NSContactsUsageDescription` in Info.plist | `READ_CONTACTS` in AndroidManifest |
| Barcode formats | All standard (EAN-13, UPC-A, QR) via expo-camera | Same |
| Status bar | Dark content, light background | Same |
| Navigation | Native iOS back gesture supported by expo-router | Android hardware back button handled |
| Safe areas | `SafeAreaProvider` wraps all screens | Same |
