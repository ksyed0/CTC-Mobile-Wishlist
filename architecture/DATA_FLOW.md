# Data Flow & Service Layer — CTC Mobile Wishlist

## Service Interface Definitions

All data access is abstracted behind service interfaces. For the POC, implementations use AsyncStorage and bundled JSON. In production, only the implementation changes — the interface contract remains stable.

---

## 1. Product Service

```typescript
interface ProductService {
  // Get all products, optionally filtered by category
  getProducts(category?: string): Promise<Product[]>;
  
  // Get a single product by ID
  getProductById(id: string): Promise<Product | null>;
  
  // Find product by barcode string
  getByBarcode(barcode: string): Promise<Product | null>;
  
  // Search products by name (case-insensitive substring match)
  search(query: string): Promise<Product[]>;
  
  // Get all available categories
  getCategories(): Promise<Category[]>;
}
```

**POC Implementation:** Reads from bundled `data/products.json`. No writes needed — product data is static.

---

## 2. Wishlist Service

```typescript
interface WishlistService {
  // Get all wishlists for the current user
  getWishlists(userId: string): Promise<Wishlist[]>;
  
  // Get wishlists shared with the current user
  getSharedWishlists(userId: string): Promise<Wishlist[]>;
  
  // Get a single wishlist by ID
  getWishlistById(id: string): Promise<Wishlist | null>;
  
  // Create a new wishlist
  createWishlist(name: string, ownerId: string): Promise<Wishlist>;
  
  // Delete a wishlist
  deleteWishlist(id: string): Promise<void>;
  
  // Add a product to a wishlist
  addItem(wishlistId: string, productId: string): Promise<WishlistItem>;
  
  // Remove a product from a wishlist
  removeItem(wishlistId: string, productId: string): Promise<void>;
  
  // Share wishlist with contacts
  shareWishlist(wishlistId: string, contacts: SharedContact[]): Promise<void>;
  
  // Claim an item (as recipient)
  claimItem(wishlistId: string, productId: string, claimerId: string): Promise<void>;
  
  // Unclaim an item
  unclaimItem(wishlistId: string, productId: string): Promise<void>;
}
```

**POC Implementation:** AsyncStorage with key pattern `wishlists:${userId}`. Shared wishlists are simulated by storing `sharedWith` arrays and querying across all users' wishlists.

---

## 3. User Service

```typescript
interface UserService {
  // Get current logged-in user (or guest)
  getCurrentUser(): Promise<User | null>;
  
  // Get all available mock users (for user switcher)
  getMockUsers(): Promise<User[]>;
  
  // Set current user (mock login)
  setCurrentUser(userId: string): Promise<void>;
  
  // Log out (switch to guest)
  logout(): Promise<void>;
  
  // Check if current session is guest
  isGuest(): Promise<boolean>;
}
```

**POC Implementation:** AsyncStorage key `currentUser`. Mock users loaded from `data/users.json`.

---

## 4. Type Definitions

```typescript
interface Product {
  id: string;
  barcode: string;
  name: string;
  description: string;
  price: number;
  image: string;           // require() path for local asset
  category: string;
  inStock: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;            // MaterialCommunityIcons name
}

interface Wishlist {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;       // ISO 8601
  items: WishlistItem[];
  sharedWith: SharedContact[];
}

interface WishlistItem {
  productId: string;
  addedAt: string;         // ISO 8601
  claimedBy: string | null;  // userId of claimer, null if unclaimed
  note: string | null;
}

interface SharedContact {
  contactId: string;
  contactName: string;
  phone: string;
  sharedAt: string;        // ISO 8601
}

interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;          // Local asset path
}
```

---

## 5. AsyncStorage Key Schema

| Key Pattern | Value Type | Description |
|-------------|-----------|-------------|
| `currentUser` | `string` (userId) | Currently logged-in user ID |
| `wishlists` | `Wishlist[]` | All wishlists across all users |
| `recentScans` | `string[]` (productIds) | Last 10 scanned product IDs |

**Note:** For POC simplicity, all wishlists are stored in a single key and filtered by `ownerId` at read time. This avoids key management complexity. Not suitable for production.

---

## 6. Context Provider Structure

```
<AuthProvider>              ← Manages current user state
  <ProductProvider>         ← Loads product catalog once at startup
    <WishlistProvider>      ← Manages wishlists, reloads on user switch
      <App />
    </WishlistProvider>
  </ProductProvider>
</AuthProvider>
```

Each provider exposes state and action functions via `useAuth()`, `useProducts()`, `useWishlists()` hooks.

**Re-render strategy:** WishlistProvider listens to AuthProvider. When user switches, wishlists reload for the new userId. ProductProvider is static (loads once).
