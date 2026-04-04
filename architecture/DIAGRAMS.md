# Architecture Diagrams — CTC Mobile Wishlist

Visual diagrams of the system architecture, data flows, navigation, and user journeys using Mermaid syntax.

---

## 1. System Architecture Overview

A layered view of the application showing how the Presentation Layer (screens), Navigation Layer (Expo Router and Context providers), and Data/Service Layer (services and AsyncStorage) are organized and connected.

```mermaid
graph TD
    subgraph Presentation["Presentation Layer"]
        Home["Home Screen"]
        Catalog["Catalog Screen"]
        Scan["Scan Screen"]
        Wishlists["Wishlists Screen"]
        ProductDetail["Product Detail Screen"]
        WishlistDetail["Wishlist Detail Screen"]
        SharedView["Shared Wishlist View"]
        Profile["Profile / Login Screen"]
    end

    subgraph Navigation["Navigation Layer"]
        Router["Expo Router<br/>(file-based routing)"]
        subgraph Contexts["React Context Providers"]
            AuthCtx["AuthContext<br/>useAuth()"]
            ProductCtx["ProductContext<br/>useProducts()"]
            WishlistCtx["WishlistContext<br/>useWishlists()"]
        end
    end

    subgraph DataLayer["Data / Service Layer"]
        ProductSvc["ProductService"]
        WishlistSvc["WishlistService"]
        UserSvc["UserService"]
        subgraph Storage["Local Storage"]
            AsyncStorage["AsyncStorage"]
            MockJSON["Bundled JSON<br/>(products, users, categories)"]
        end
    end

    Home & Catalog & Scan & Wishlists & ProductDetail & WishlistDetail & SharedView & Profile --> Router
    Router --> AuthCtx
    Router --> ProductCtx
    Router --> WishlistCtx

    AuthCtx --> UserSvc
    ProductCtx --> ProductSvc
    WishlistCtx --> WishlistSvc

    ProductSvc --> MockJSON
    WishlistSvc --> AsyncStorage
    UserSvc --> AsyncStorage
    UserSvc --> MockJSON
```

---

## 2. Data Flow Diagram

How data flows from user interactions through Context providers to services and ultimately to local storage, and how state updates propagate back to the UI.

```mermaid
flowchart LR
    User((User)) -->|tap / input| Screen["Screen Component"]
    Screen -->|calls action| Context["Context Provider<br/>(Auth / Product / Wishlist)"]
    Context -->|delegates to| Service["Service Layer<br/>(productService / wishlistService / userService)"]
    Service -->|read/write| AS["AsyncStorage"]
    Service -->|read| JSON["Bundled JSON"]

    AS -->|returns data| Service
    JSON -->|returns data| Service
    Service -->|returns result| Context
    Context -->|updates state| Screen
    Screen -->|re-renders| User
```

---

## 3. Navigation Flow

Screen-to-screen navigation paths through the app. The four main tabs are the primary entry points, with modal and stack screens accessible from each.

```mermaid
graph TD
    subgraph TabBar["Tab Navigator"]
        HomeTab["Home<br/>(tabs)/index"]
        CatalogTab["Catalog<br/>(tabs)/catalog"]
        ScanTab["Scan<br/>(tabs)/scan"]
        WishlistsTab["Wishlists<br/>(tabs)/wishlists"]
    end

    HomeTab -->|"tap product"| ProductDetail["product/[id]<br/>Product Detail"]
    HomeTab -->|"tap wishlist card"| WishlistDetail["wishlist/[id]<br/>Wishlist Detail"]
    HomeTab -->|"tap avatar"| Profile["login<br/>Profile / Login"]
    HomeTab -->|"tap recently scanned"| ProductDetail

    CatalogTab -->|"tap product card"| ProductDetail
    CatalogTab -->|"search + select"| ProductDetail

    ScanTab -->|"barcode match found"| ProductDetail
    ScanTab -->|"enter manually"| CatalogTab

    WishlistsTab -->|"tap wishlist"| WishlistDetail
    WishlistsTab -->|"tap shared wishlist"| SharedView["wishlist/shared/[id]<br/>Shared Wishlist View"]

    ProductDetail -->|"Add to Wishlist"| WishlistDetail
    WishlistDetail -->|"Share"| ShareFlow["Contact Picker<br/>(expo-contacts)"]
    WishlistDetail -->|"tap item"| ProductDetail
    SharedView -->|"tap item"| ProductDetail
    SharedView -->|"I'll Get This"| SharedView

    Profile -->|"switch user"| HomeTab
    Profile -->|"logout"| HomeTab

    style TabBar fill:#D52B1E,color:#fff
```

---

## 4. Service Layer Class Diagram

Interfaces for the three services that form the data access layer. All data operations go through these typed interfaces, allowing the implementation to be swapped from local storage to a real backend without changing screens or components.

```mermaid
classDiagram
    class ProductService {
        +getProducts(category?: string) Promise~Product[]~
        +getProductById(id: string) Promise~Product | null~
        +getByBarcode(barcode: string) Promise~Product | null~
        +search(query: string) Promise~Product[]~
        +getCategories() Promise~Category[]~
    }

    class WishlistService {
        +getWishlists(userId: string) Promise~Wishlist[]~
        +getSharedWishlists(userId: string) Promise~Wishlist[]~
        +getWishlistById(id: string) Promise~Wishlist | null~
        +createWishlist(name: string, ownerId: string) Promise~Wishlist~
        +deleteWishlist(id: string) Promise~void~
        +addItem(wishlistId: string, productId: string) Promise~WishlistItem~
        +removeItem(wishlistId: string, productId: string) Promise~void~
        +shareWishlist(wishlistId: string, contacts: SharedContact[]) Promise~void~
        +claimItem(wishlistId: string, productId: string, claimerId: string) Promise~void~
        +unclaimItem(wishlistId: string, productId: string) Promise~void~
    }

    class UserService {
        +getCurrentUser() Promise~User | null~
        +getMockUsers() Promise~User[]~
        +setCurrentUser(userId: string) Promise~void~
        +logout() Promise~void~
        +isGuest() Promise~boolean~
    }

    class Product {
        +string id
        +string barcode
        +string name
        +string description
        +number price
        +string image
        +string category
        +boolean inStock
    }

    class Wishlist {
        +string id
        +string name
        +string ownerId
        +string createdAt
        +WishlistItem[] items
        +SharedContact[] sharedWith
    }

    class WishlistItem {
        +string productId
        +string addedAt
        +string|null claimedBy
        +string|null note
    }

    class SharedContact {
        +string contactId
        +string contactName
        +string phone
        +string sharedAt
    }

    class User {
        +string id
        +string name
        +string phone
        +string avatar
    }

    class Category {
        +string id
        +string name
        +string icon
    }

    ProductService --> Product : returns
    ProductService --> Category : returns
    WishlistService --> Wishlist : returns
    WishlistService --> WishlistItem : returns
    Wishlist *-- WishlistItem : contains
    Wishlist *-- SharedContact : contains
    UserService --> User : returns
```

---

## 5. Context Provider Hierarchy

The nesting order of React Context providers around the application root. AuthProvider sits outermost so that user identity is available to all inner providers. WishlistProvider is innermost because it depends on both auth state and product data.

```mermaid
graph TD
    Root["App Root<br/>app/_layout.tsx"] --> AuthProvider
    AuthProvider["AuthProvider<br/>manages current user state<br/>exposes useAuth()"]
    AuthProvider --> ProductProvider
    ProductProvider["ProductProvider<br/>loads product catalog once at startup<br/>exposes useProducts()"]
    ProductProvider --> WishlistProvider
    WishlistProvider["WishlistProvider<br/>manages wishlists, reloads on user switch<br/>exposes useWishlists()"]
    WishlistProvider --> TabLayout["Tab Layout<br/>app/(tabs)/_layout.tsx"]
    TabLayout --> Screens["Screen Components"]

    WishlistProvider -.->|"listens to user changes"| AuthProvider
    ProductProvider -.->|"static, loads once"| ProductProvider

    style AuthProvider fill:#D52B1E,color:#fff
    style ProductProvider fill:#1565C0,color:#fff
    style WishlistProvider fill:#2E7D32,color:#fff
```

---

## 6. User Journey: Add to Wishlist

Sequence diagram showing two paths for adding a product to a wishlist: browsing the catalog and scanning a barcode. Both paths converge at the Product Detail screen where the user triggers the add action.

```mermaid
sequenceDiagram
    actor User
    participant Catalog as Catalog Screen
    participant Scanner as Scan Screen
    participant PD as Product Detail
    participant WCtx as WishlistContext
    participant WSvc as WishlistService
    participant AS as AsyncStorage

    Note over User,AS: Path A - Browse Catalog
    User->>Catalog: Browse / search products
    Catalog->>User: Display product grid
    User->>Catalog: Tap product card
    Catalog->>PD: Navigate to product/[id]

    Note over User,AS: Path B - Barcode Scan
    User->>Scanner: Point camera at barcode
    Scanner->>Scanner: Detect barcode string
    Scanner->>PD: Match found, navigate to product/[id]

    Note over User,AS: Common Flow - Add to Wishlist
    PD->>User: Show product details + "Add to Wishlist"
    User->>PD: Tap "Add to Wishlist"
    PD->>WCtx: addItem(productId, wishlistId)
    WCtx->>WSvc: addItem(wishlistId, productId)
    WSvc->>AS: Read wishlist by ID
    AS-->>WSvc: Current wishlist data
    WSvc->>WSvc: Append WishlistItem {productId, addedAt, claimedBy: null}
    WSvc->>AS: Write updated wishlist
    AS-->>WSvc: Success
    WSvc-->>WCtx: Return new WishlistItem
    WCtx->>WCtx: Update state
    WCtx-->>PD: State change triggers re-render
    PD->>User: Heart icon pulse animation + confirmation toast
```

---

## 7. User Journey: Share & Fulfill

Sequence diagram for sharing a wishlist with contacts and a recipient viewing and claiming items from the shared wishlist.

```mermaid
sequenceDiagram
    actor Owner
    actor Recipient
    participant WD as Wishlist Detail
    participant Contacts as expo-contacts<br/>Contact Picker
    participant WCtx as WishlistContext
    participant WSvc as WishlistService
    participant AS as AsyncStorage
    participant SV as Shared Wishlist View

    Note over Owner,AS: Phase 1 - Owner Shares Wishlist
    Owner->>WD: Tap "Share" button
    WD->>Contacts: Open contact picker
    Contacts->>Owner: Display device contacts
    Owner->>Contacts: Select one or more contacts
    Contacts-->>WD: Return selected contacts
    WD->>WCtx: shareWishlist(wishlistId, selectedContacts)
    WCtx->>WSvc: shareWishlist(wishlistId, contacts)
    WSvc->>AS: Read wishlist
    AS-->>WSvc: Current wishlist data
    WSvc->>WSvc: Add contacts to sharedWith[]
    WSvc->>AS: Write updated wishlist
    AS-->>WSvc: Success
    WSvc-->>WCtx: Done
    WCtx-->>WD: State updated
    WD->>Owner: Confirmation toast "Shared with 2 people"

    Note over Recipient,SV: Phase 2 - Recipient Views & Claims
    Recipient->>SV: Open shared wishlist from "Shared With Me" tab
    SV->>WCtx: Load shared wishlist
    WCtx->>WSvc: getSharedWishlists(recipientUserId)
    WSvc->>AS: Query wishlists where sharedWith includes recipient
    AS-->>WSvc: Matching wishlists
    WSvc-->>WCtx: Return shared wishlists
    WCtx-->>SV: Display wishlist items with "I'll Get This" buttons

    Recipient->>SV: Tap "I'll Get This" on an item
    SV->>WCtx: claimItem(wishlistId, productId, recipientUserId)
    WCtx->>WSvc: claimItem(wishlistId, productId, claimerId)
    WSvc->>AS: Update item.claimedBy = claimerId
    AS-->>WSvc: Success
    WSvc-->>WCtx: Done
    WCtx-->>SV: State updated
    SV->>Recipient: Item shows "Claimed by [name]", button hidden
```

---

## 8. Component Hierarchy

Tree diagram of the key reusable UI components from the design system and how they compose within the main screen layouts.

```mermaid
graph TD
    App["App Root (_layout.tsx)"] --> TabLayout["TabLayout<br/>(tabs)/_layout.tsx"]

    TabLayout --> HomeScreen["HomeScreen"]
    TabLayout --> CatalogScreen["CatalogScreen"]
    TabLayout --> ScanScreen["ScanScreen"]
    TabLayout --> WishlistsScreen["WishlistsScreen"]

    HomeScreen --> ProductCard_H["ProductCard<br/>(featured horizontal scroll)"]
    HomeScreen --> WishlistCard_H["WishlistCard<br/>(quick access)"]

    CatalogScreen --> SearchBar["SearchBar"]
    CatalogScreen --> CategoryChip["CategoryChip<br/>(horizontal scroll)"]
    CatalogScreen --> ProductCard_C["ProductCard<br/>(2-column grid)"]

    ScanScreen --> BarcodeOverlay["BarcodeOverlay<br/>(camera frame + scan area)"]

    WishlistsScreen --> SegmentedControl["SegmentedControl<br/>(My / Shared)"]
    WishlistsScreen --> WishlistCard_W["WishlistCard"]
    WishlistsScreen --> EmptyState_W["EmptyState"]

    ProductCard_H --> PriceTag1["PriceTag"]
    ProductCard_C --> PriceTag2["PriceTag"]

    subgraph StackScreens["Stack Screens"]
        ProductDetailScreen["ProductDetail<br/>product/[id].tsx"]
        WishlistDetailScreen["WishlistDetail<br/>wishlist/[id].tsx"]
        SharedWishlistScreen["SharedWishlistView<br/>wishlist/shared/[id].tsx"]
        LoginScreen["Login<br/>login.tsx"]
    end

    ProductDetailScreen --> PriceTag3["PriceTag"]
    ProductDetailScreen --> PrimaryButton_PD["PrimaryButton<br/>(Add to Wishlist)"]

    WishlistDetailScreen --> WishlistItemRow["WishlistItemRow<br/>(swipe to delete)"]
    WishlistDetailScreen --> PrimaryButton_WD["PrimaryButton<br/>(Share)"]
    WishlistDetailScreen --> EmptyState_WD["EmptyState"]

    SharedWishlistScreen --> SharedItemRow["WishlistItemRow<br/>(with claim button)"]
    SharedWishlistScreen --> PrimaryButton_SV["PrimaryButton<br/>(I'll Get This)"]

    WishlistItemRow --> PriceTag4["PriceTag"]
    SharedItemRow --> PriceTag5["PriceTag"]

    style App fill:#D52B1E,color:#fff
    style TabLayout fill:#333,color:#fff
    style StackScreens fill:#F5F5F5,color:#333
```

---

## 9. PR Creation & Review Workflow

How code moves from a dev agent's feature branch through Conductor's PR lifecycle, Lens code review, and CI verification before merging to `develop`.

```mermaid
sequenceDiagram
    actor DevAgent as Dev Agent<br/>(Forge / Pixel / Keystone)
    participant Branch as Feature Branch<br/>(e.g., feature/US-0001)
    actor Conductor as Conductor<br/>(Delivery Manager)
    actor Lens as Lens<br/>(Code Reviewer)
    participant CI as GitHub Actions CI<br/>(6 jobs)
    participant Develop as develop branch

    DevAgent->>Branch: Commit code changes
    DevAgent->>Branch: git push origin feature/US-0001
    DevAgent->>Conductor: Report: "Code complete on feature/US-0001"

    Conductor->>Develop: Create PR (feature/US-0001 → develop)
    Conductor->>Lens: Spawn Lens to review PR

    Lens->>Branch: Review code, architecture, tests, design system

    alt APPROVE
        Lens->>Conductor: Verdict: APPROVE
        Conductor->>CI: Wait for CI pipeline
        CI->>CI: Lint + Test + Build + Format + Audit + Orchestrator
        alt All checks green
            Conductor->>Develop: Squash and merge
            Conductor->>Branch: Delete feature branch
        else CI failure
            Conductor->>DevAgent: Re-spawn with CI error details
            DevAgent->>Branch: Fix and push
            Conductor->>CI: Re-run CI
        end
    else REQUEST CHANGES
        Lens->>Conductor: Verdict: REQUEST CHANGES (with feedback)
        Conductor->>DevAgent: Re-spawn with Lens feedback
        DevAgent->>Branch: Fix issues and push
        Conductor->>Lens: Re-spawn Lens for re-review
        Note over Lens: Max 1 retry before escalation
    else BLOCK
        Lens->>Conductor: Verdict: BLOCK (security/critical issue)
        Conductor->>Conductor: Halt orchestration
        Conductor->>Conductor: Set phase to "blocked"
        Note over Conductor: Human must intervene
    end
```

---

## 10. CI Pipeline Flow

The 6-job GitHub Actions CI pipeline that runs on every PR to `main` and `develop`. All jobs run in parallel; all must pass before merge.

```mermaid
flowchart LR
    PR["Pull Request<br/>opened / updated"] --> Lint
    PR --> Test
    PR --> Build
    PR --> Orch
    PR --> Format
    PR --> Audit

    subgraph CI["GitHub Actions CI (parallel jobs)"]
        Lint["🔍 Lint<br/>npx eslint ."]
        Test["🧪 Test & Coverage<br/>npm run test:coverage<br/>(80% threshold)"]
        Build["🏗️ Build<br/>npm run build<br/>(avatars → plan → dashboard)"]
        Orch["⚙️ Orchestrator<br/>spawn.js --list-platforms<br/>spawn.js --list-agents"]
        Format["✨ Format<br/>npm run format:check<br/>(Prettier)"]
        Audit["🔒 Audit<br/>npm audit --audit-level=high"]
    end

    Lint --> Gate{All Green?}
    Test --> Gate
    Build --> Gate
    Orch --> Gate
    Format --> Gate
    Audit --> Gate

    Gate -->|Yes| Merge["✅ Ready to Merge"]
    Gate -->|No| Fix["❌ Conductor spawns<br/>agent to fix"]
    Fix --> PR

    style PR fill:#D52B1E,color:#fff
    style Merge fill:#2E7D32,color:#fff
    style Fix fill:#C62828,color:#fff
```

---

## 11. Agent Orchestration & Branch Strategy

How Conductor orchestrates agents across BLAST phases, showing branch creation, parallel work, Lens review gates, and merge points.

```mermaid
gitgraph
    commit id: "Initial setup"
    branch develop
    checkout develop
    commit id: "Project scaffold"

    branch feature/US-0001-expo-scaffold
    checkout feature/US-0001-expo-scaffold
    commit id: "Keystone: scaffold"
    commit id: "Keystone: types + services"
    checkout develop
    merge feature/US-0001-expo-scaffold id: "Lens APPROVE → merge" tag: "Phase 2 ✓"

    branch feature/US-0002-mock-data
    checkout feature/US-0002-mock-data
    commit id: "Forge: mock data + services"

    checkout develop
    branch feature/US-0003-catalog
    checkout feature/US-0003-catalog
    commit id: "Pixel: catalog + nav"

    checkout develop
    merge feature/US-0002-mock-data id: "Lens APPROVE → merge"
    merge feature/US-0003-catalog id: "Lens APPROVE → merge" tag: "Phase 3 ✓"

    branch feature/integration
    checkout feature/integration
    commit id: "Pixel: wire services to screens"
    checkout develop
    merge feature/integration id: "Lens APPROVE → merge" tag: "Phase 4 ✓"

    branch feature/tests
    checkout feature/tests
    commit id: "Circuit: Jest suites"
    commit id: "Sentinel: bug fixes"
    checkout develop
    merge feature/tests id: "Lens APPROVE → merge" tag: "Phase 5 ✓"

    commit id: "Phase 6: polish + demo prep"

    checkout main
    merge develop id: "Release v1.0.0" tag: "v1.0.0"
```

---

## 12. Concurrency Safety — Parallel Agent File Access

Shows how file-lock, atomic-write, and git-safe protect shared state when Forge and Pixel run simultaneously in Phase 3.

```mermaid
sequenceDiagram
    participant Forge as ⚒️ Forge (BE Dev)
    participant Lock as 🔒 file-lock.js
    participant State as 📄 sdlc-status.json
    participant Pixel as 📱 Pixel (FE Dev)
    participant GitSafe as 🔄 git-safe.js
    participant Remote as 🌐 Remote (origin)

    Note over Forge, Pixel: Phase 3 — Parallel Execution

    par Forge updates status
        Forge->>Lock: withLock("sdlc-status.json")
        Lock->>Lock: mkdir (atomic acquire)
        Lock-->>Forge: Lock acquired
        Forge->>State: Read → modify → atomic write
        Forge->>Lock: Release
    and Pixel waits for lock
        Pixel->>Lock: withLock("sdlc-status.json")
        Lock-->>Pixel: Waiting (lock held by Forge)
    end

    Lock-->>Pixel: Lock acquired (Forge released)
    Pixel->>State: Read → modify → atomic write
    Pixel->>Lock: Release

    Note over Forge, Pixel: Both push to separate branches

    par Forge pushes
        Forge->>GitSafe: safePush("feature/forge-services")
        GitSafe->>Remote: git push -u origin feature/forge-services
        Remote-->>GitSafe: OK
        GitSafe-->>Forge: {ok: true, attempts: 1}
    and Pixel pushes (rejected, retries)
        Pixel->>GitSafe: safePush("feature/pixel-catalog")
        GitSafe->>Remote: git push -u origin feature/pixel-catalog
        Remote-->>GitSafe: Rejected (fetch first)
        GitSafe->>Remote: git pull --no-rebase
        Remote-->>GitSafe: Merged
        GitSafe->>Remote: git push (retry)
        Remote-->>GitSafe: OK
        GitSafe-->>Pixel: {ok: true, attempts: 2}
    end

    Note over Forge, Pixel: Conductor checks overlap before merging

    Forge->>GitSafe: checkOverlap("feature/forge-services", "feature/pixel-catalog")
    GitSafe-->>Forge: {overlapping: false, files: []}
    Note right of Forge: Safe to merge both branches sequentially
```

---

## 13. Pre-Commit Hook Flow

Shows how husky + lint-staged intercept `git commit` to auto-format and lint staged files before they reach CI.

```mermaid
flowchart LR
    A["git commit"] --> B["Husky pre-commit hook"]
    B --> C["npx lint-staged"]
    C --> D{"Staged file type?"}
    D -->|"*.js, *.json, *.md, *.yml"| E["prettier --write"]
    D -->|"*.js"| F["eslint --fix"]
    E --> G{"Changes?"}
    F --> G
    G -->|"Files modified"| H["Re-stage modified files"]
    G -->|"No changes"| I["Proceed"]
    H --> I
    I --> J["Commit succeeds ✅"]
```
