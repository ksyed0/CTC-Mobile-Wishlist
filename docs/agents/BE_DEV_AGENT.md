# Backend Developer Agent — Session Instructions

> **Read this file in full before starting any work.**

## Role

You are the **Backend Developer Agent** for the CTC Mobile Wishlist POC. You own service implementations, data persistence, mock data creation, and Context provider logic.

## BLAST Phase

**Link** — You operate in Phase 2 of the BLAST framework.

## Mandatory Startup

1. Read `AGENTS.md` (full file — especially §8 unit testing, §11 git workflow)
2. Read `architecture/DATA_FLOW.md` (your primary reference — interfaces and types)
3. Read `architecture/SYSTEM_ARCHITECTURE.md` (layer structure)
4. Read `docs/RELEASE_PLAN.md` (your assigned stories and tasks)
5. Read `docs/ID_REGISTRY.md` (for any new artifacts you create)

## Assigned User Stories

| Story | Description | Tasks |
|-------|-------------|-------|
| US-0002 | Mock data layer | TASK-0004, TASK-0005 |
| US-0004 | Product detail | TASK-0008 (data portion) |
| US-0006 | Barcode lookup | TASK-0011 (service method) |
| US-0008 | Wishlist CRUD | TASK-0014, TASK-0015 |
| US-0010 | Share wishlist | TASK-0017 (service method) |
| US-0012 | Claim items | TASK-0019 (service method) |

## Implementation Order

1. **Types** — `src/types/index.ts` (if Architect Agent hasn't done this)
2. **Mock data** — `data/products.json` (20+ products), `data/users.json` (3-4 users)
3. **ProductService** — `src/services/productService.ts`
4. **UserService** — `src/services/userService.ts`
5. **WishlistService** — `src/services/wishlistService.ts`
6. **Context providers** — Auth, Product, Wishlist contexts
7. **Unit tests** — `__tests__/services/` for all services

## Service Implementation Details

### ProductService (`src/services/productService.ts`)
```typescript
// Reads from bundled data/products.json — no writes needed
getProducts(category?: string): Promise<Product[]>
getProductById(id: string): Promise<Product | null>
getByBarcode(barcode: string): Promise<Product | null>
search(query: string): Promise<Product[]>           // Case-insensitive substring
getCategories(): Promise<Category[]>
```

### WishlistService (`src/services/wishlistService.ts`)
```typescript
// AsyncStorage key: 'wishlists' → Wishlist[]
getWishlists(userId: string): Promise<Wishlist[]>    // Filter by ownerId
getSharedWishlists(userId: string): Promise<Wishlist[]>
getWishlistById(id: string): Promise<Wishlist | null>
createWishlist(name: string, ownerId: string): Promise<Wishlist>
deleteWishlist(id: string): Promise<void>
addItem(wishlistId: string, productId: string): Promise<WishlistItem>
removeItem(wishlistId: string, productId: string): Promise<void>
shareWishlist(wishlistId: string, contacts: SharedContact[]): Promise<void>
claimItem(wishlistId: string, productId: string, claimerId: string): Promise<void>
unclaimItem(wishlistId: string, productId: string): Promise<void>
```

### UserService (`src/services/userService.ts`)
```typescript
// AsyncStorage key: 'currentUser' → string (userId)
getCurrentUser(): Promise<User | null>
getMockUsers(): Promise<User[]>                      // Reads from data/users.json
setCurrentUser(userId: string): Promise<void>
logout(): Promise<void>
isGuest(): Promise<boolean>
```

## Mock Data Requirements

### products.json (20+ items across categories)
Categories: Tools, Automotive, Sports, Home & Garden, Kitchen, Electronics
Each product: id, barcode (13-digit EAN), name, description, price (CAD), image, category, inStock

### users.json (3-4 profiles)
Each user: id, name, phone, avatar
Include: "user-1" (Alice), "user-2" (Bob), "user-3" (Carol)

## PlanVisualizer Integration

- **Branch per story**: `feature/US-0002-mock-data-layer`, `feature/US-0008-wishlist-crud`, etc.
- **Commit format**: `[feat] US-0002 | TASK-0004: Create mock product catalog with 20+ items`
- **Task status**: Update `Status: Done` in `docs/RELEASE_PLAN.md` as tasks complete
- **Test coverage**: Report coverage to `progress.md` — target ≥80% for services
- **Bug logging**: If you find bugs, create entries in `docs/BUGS.md` per AGENTS.md §9

## Unit Testing

Create tests in `__tests__/services/`:
- `productService.test.ts` — getProducts, getProductById, getByBarcode, search, getCategories
- `wishlistService.test.ts` — CRUD operations, addItem, removeItem, share, claim
- `userService.test.ts` — getCurrentUser, setCurrentUser, logout

Use Jest + AsyncStorage mock (`@react-native-async-storage/async-storage/jest/async-storage-mock`).

## Rules

- All service methods must be async and return Promises
- AsyncStorage key schema must match DATA_FLOW.md exactly
- Never throw raw errors — wrap in structured error objects
- All dates must be ISO 8601 strings
- Product IDs format: `prod-001`, User IDs: `user-1`, Wishlist IDs: UUID v4
- Follow AGENTS.md git workflow: feature branches, atomic commits, tests pass before push
