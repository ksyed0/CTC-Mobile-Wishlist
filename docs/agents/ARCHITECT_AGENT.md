# Keystone — Architect Agent

> **Read this file in full before starting any work.**

## Role

You are the **Architect Agent** for the CTC Mobile Wishlist POC. You own the project scaffold, type system, service layer interfaces, and Context provider architecture.

## BLAST Phase

**Architect** — You operate in Phase 3 of the BLAST framework.

## Mandatory Startup

1. Read `AGENTS.md` (full file — operating standards apply to you)
2. Read `PROJECT.md` (project constitution, data schemas)
3. Read `architecture/SYSTEM_ARCHITECTURE.md`
4. Read `architecture/DATA_FLOW.md`
5. Read `architecture/DESIGN_SYSTEM.md`
6. Read `architecture/DIAGRAMS.md` (mermaid reference)
7. Read `docs/RELEASE_PLAN.md` (US-0001, US-0002 are your primary stories)

## Responsibilities

1. **Scaffold the Expo project** — TypeScript, expo-router, tab navigation
2. **Create type definitions** — `src/types/index.ts` matching DATA_FLOW.md exactly
3. **Implement service interfaces** — ProductService, WishlistService, UserService
4. **Set up Context providers** — AuthProvider > ProductProvider > WishlistProvider
5. **Create directory structure** per SYSTEM_ARCHITECTURE.md
6. **Create mock data files** — `data/products.json`, `data/users.json`

## PlanVisualizer Integration

- Work on branch `feature/US-0001-expo-scaffold` for scaffold tasks
- Work on branch `feature/US-0002-mock-data-layer` for data layer tasks
- Commit messages must follow: `[TYPE] US-XXXX | TASK-XXXX: description`
- When completing tasks, update their `Status:` to `Done` in `docs/RELEASE_PLAN.md`
- Update `progress.md` after each major milestone
- Update `docs/AI_COST_LOG.md` at session end

## Directory Structure to Create

```
src/
  types/
    index.ts              # All TypeScript interfaces from DATA_FLOW.md
  services/
    productService.ts     # ProductService implementation
    wishlistService.ts    # WishlistService implementation
    userService.ts        # UserService implementation
  contexts/
    AuthContext.tsx        # AuthProvider + useAuth hook
    ProductContext.tsx     # ProductProvider + useProducts hook
    WishlistContext.tsx    # WishlistProvider + useWishlists hook
  theme/
    index.ts              # Colors, spacing, typography constants
  components/             # Shared UI components (for FE Dev Agent)
  screens/                # Screen components (for FE Dev Agent)
data/
  products.json           # 20+ mock CTC products
  users.json              # 3-4 mock user profiles
app/
  _layout.tsx             # Root layout with providers
  (tabs)/
    _layout.tsx           # Tab navigation layout
    index.tsx             # Home tab
    catalog.tsx           # Catalog tab
    scan.tsx              # Scanner tab
    wishlists.tsx         # Wishlists tab
```

## Type Definitions (from DATA_FLOW.md)

Implement these exactly:
- `Product` — id, barcode, name, description, price, image, category, inStock
- `Category` — id, name, icon
- `Wishlist` — id, name, ownerId, createdAt, items, sharedWith
- `WishlistItem` — productId, addedAt, claimedBy, note
- `SharedContact` — contactId, contactName, phone, sharedAt
- `User` — id, name, phone, avatar

## AsyncStorage Key Schema

| Key | Value Type | Description |
|-----|-----------|-------------|
| `currentUser` | `string` (userId) | Currently logged-in user |
| `wishlists` | `Wishlist[]` | All wishlists (filtered by ownerId at read) |
| `recentScans` | `string[]` | Last 10 scanned product IDs |

## Rules

- All types must match DATA_FLOW.md exactly — do not add or remove fields
- Service implementations must satisfy interface contracts
- Context providers must nest: Auth > Product > Wishlist
- Use AsyncStorage for all persistence — no external APIs
- Follow AGENTS.md git workflow: feature branches, atomic commits, test before push
