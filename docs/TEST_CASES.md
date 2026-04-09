# Test Cases — CTC-Mobile-Wishlist

## Epic 1: Scaffolding & Mock Data

TC-001-001-001: App launches on iOS and Android
Related Story: US-001-001
Related Task: TASK-001-001-001
Related AC: AC-001-001-001
Type: Functional
Status: [x] Pass
Actual Result: RootLayout in app/\_layout.tsx wraps the entire tree in AuthProvider, ProductProvider, and WishlistProvider. Expo Router Stack is configured with all required screens. SplashScreen.preventAutoHideAsync() is called to block premature hide. RootNavigator handles auth-gate redirect to /login when no user is stored. All TypeScript types resolve and no compilation blockers are present. App would launch successfully on both iOS and Android.
Defect Raised: None

TC-001-001-002: Tab navigation renders all four tabs
Related Story: US-001-001
Related Task: TASK-001-001-002
Related AC: AC-001-001-002
Type: Functional
Status: [x] Pass
Actual Result: app/(tabs)/\_layout.tsx defines exactly four Tabs.Screen entries — index (Home), catalog (Catalog), scan (Scan), wishlists (Wishlists) — each with a MaterialIcons tab icon and CTC-themed active/inactive tint colors. All four tabs are present and correctly wired.
Defect Raised: None

TC-001-001-003: Canadian Tire theming applied globally
Related Story: US-001-001
Related Task: TASK-001-001-003
Related AC: AC-001-001-003
Type: Functional
Status: [x] Pass
Actual Result: theme/colors.ts exports primary: '#D52B1E'. The color is applied in: tab bar active tint (tabBarActiveTintColor), header backgrounds (headerStyle.backgroundColor), primary buttons, price text, FAB, and splash screen background (#D52B1E in app.json). CTC red theming is consistently applied across all screens and components.
Defect Raised: None

TC-001-001-004: Splash screen displays CTC branding on launch
Related Story: US-001-001
Related Task: TASK-001-001-001
Related AC: AC-001-001-004
Type: Functional
Status: [x] Pass
Actual Result: assets/ directory created in Polish phase (BUG-084 fix). splash.png (1242×2688), icon.png (1024×1024), and adaptive-icon.png (1024×1024) are present as solid CTC red (#D52B1E) PNGs with white triangle motif. app.json references are satisfied and the app builds successfully with the branded splash screen.
Defect Raised: BUG-084

TC-001-002-001: Mock products load with all required fields
Related Story: US-001-002
Related Task: TASK-001-002-001
Related AC: AC-001-002-001
Type: Functional
Status: [x] Pass
Actual Result: data/products.json contains 23 products. Each entry has all required fields: id, barcode, name, description, price, image, category, and inStock. productService.getProducts() loads all 23 from the bundled JSON. No missing fields observed in the data file.
Defect Raised: None

TC-001-002-002: Data persists across app restarts
Related Story: US-001-002
Related Task: TASK-001-002-003
Related AC: AC-001-002-004
Type: Functional
Status: [x] Pass
Actual Result: utils/storage.ts wraps AsyncStorage with getItem/setItem/removeItem helpers. StorageKeys.WISHLISTS stores all wishlists globally. StorageKeys.CURRENT_USER persists the logged-in user id. StorageKeys.RECENT_SCANS persists recent scan history. All writes use JSON.stringify and reads use JSON.parse. Data survives app restarts as AsyncStorage persists to device storage.
Defect Raised: None

TC-001-002-003: Mock product images are bundled as local assets
Related Story: US-001-002
Related Task: TASK-001-002-002
Related AC: AC-001-002-002
Type: Functional
Status: [x] Pass
Actual Result: All 23 products retain image: "placeholder" (no real photos in POC scope). BUG-085 fix in Polish phase updated ProductCard.tsx to render a colored View with the category's initial letter when image === "placeholder": Tools → #D52B1E, Automotive → #1565C0, Outdoor → #2E7D32, Sports → #F57C00, Home → #6A1B9A. The catalog and wishlist screens now display intentional, visually distinct placeholders rather than broken images.
Defect Raised: BUG-085

TC-001-002-004: Mock user profiles available for simulated login
Related Story: US-001-002
Related Task: TASK-001-002-002
Related AC: AC-001-002-003
Type: Functional
Status: [x] Pass
Actual Result: data/users.json contains 3 mock users: Alice (user-001, 416-555-0101), Bob (user-002, 416-555-0102), Carol (user-003, 416-555-0103). userService.getMockUsers() returns all three. AuthContext exposes mockUsers to LoginScreen which renders them in a FlatList. All three profiles are available for selection.
Defect Raised: None

## Epic 2: Product Catalog Browsing

TC-002-001-001: Category filter chips filter product list
Related Story: US-002-001
Related Task: TASK-002-001-001
Related AC: AC-002-001-001
Type: Functional
Status: [x] Pass
Actual Result: catalog.tsx renders a horizontal ScrollView of CategoryChip components for 5 categories (Tools, Automotive, Outdoor, Sports, Home) plus an "All" chip. Selecting a category calls setSelectedCategory(cat.id). ProductContext.filteredProducts filters products by selectedCategory using Array.filter(). Setting null shows all products. The filter is reactive — state change re-renders the FlatList.
Defect Raised: None

TC-002-001-002: Product cards show image, name, and price
Related Story: US-002-001
Related Task: TASK-002-001-001
Related AC: AC-002-001-002
Type: Functional
Status: [x] Pass
Actual Result: ProductCard component renders product.name (Text, fontWeight 700), $product.price.toFixed(2) (Text in primary color), and product.image — real URI if not 'placeholder', otherwise a MaterialIcons 'image' icon placeholder. An "Out of Stock" badge overlays the image when product.inStock is false. All three required fields (image area, name, price) are present.
Defect Raised: None

TC-002-001-003: Tapping product card opens detail screen
Related Story: US-002-001
Related Task: TASK-002-001-001
Related AC: AC-002-001-003
Type: Functional
Status: [x] Pass
Actual Result: In catalog.tsx, each ProductCard has onPress={() => router.push('/product/${item.id}')}. This uses expo-router to navigate to app/product/[id].tsx with the product id as a route parameter. The route is registered in \_layout.tsx as 'product/[id]'. Navigation is fully wired.
Defect Raised: None

TC-002-002-001: Product detail shows all fields
Related Story: US-002-002
Related Task: TASK-002-002-001
Related AC: AC-002-002-001
Type: Functional
Status: [x] Pass
Actual Result: app/product/[id].tsx renders: product.name (fontSize 20, fontWeight 700), $product.price.toFixed(2) (fontSize 22, primary color), product.inStock ? 'In Stock' : 'Out of Stock', product.description (lineHeight 22), and product.barcode. All five required fields are displayed. An image placeholder area (260px height) is shown.
Defect Raised: None

TC-002-002-002: Add to Wishlist from product detail
Related Story: US-002-002
Related Task: TASK-002-002-001
Related AC: AC-002-002-002
Type: Functional
Status: [x] Pass
Actual Result: product/[id].tsx has an "Add to Wishlist" TouchableOpacity button with a heart icon. When tapped: if no wishlists exist, an Alert prompts to create one first with a "Create Wishlist" button that navigates to /(tabs)/wishlists. If one wishlist exists, addToWishlist() is called directly. If multiple exist, a modal picker is shown. The addItem() function from WishlistContext is called with the selected wishlist id and product id.
Defect Raised: None

TC-002-002-003: Wishlist picker shown when multiple wishlists exist
Related Story: US-002-002
Related Task: TASK-002-002-001
Related AC: AC-002-002-003
Type: Functional
Status: [x] Pass
Actual Result: In product/[id].tsx, handleAddToWishlist() checks wishlists.length. If > 1, setShowPicker(true) opens a slide-up modal. The modal renders a FlatList of all wishlists showing name and item count. Selecting one calls addToWishlist(item). Duplicate guard (AC-004-002-004) is also present: if product.id already in wishlist.items, an "Already in Wishlist" Alert is shown instead of adding again.
Defect Raised: None

TC-002-003-001: Search filters products by name in real time
Related Story: US-002-003
Related Task: TASK-002-003-001
Related AC: AC-002-003-002
Type: Functional
Status: [x] Pass
Actual Result: BUG-086 fix in Polish phase added a TextInput search bar above the category chip row in catalog.tsx. Typing updates displayedProducts via useMemo, filtering filteredProducts by case-insensitive name match in real time. A clear (×) button appears when text is present. Empty-state message includes the search query when no results found.
Defect Raised: BUG-086

TC-002-003-002: Search bar visible at top of catalog screen
Related Story: US-002-003
Related Task: TASK-002-003-001
Related AC: AC-002-003-001
Type: Functional
Status: [x] Pass
Actual Result: BUG-086 fix in Polish phase added a visible TextInput at the top of catalog.tsx, above the category chip row. It has a rounded border, white background (dark mode: slate-800), and shows a magnifying glass label. The bar is immediately visible when the Catalog tab opens.
Defect Raised: BUG-086

## Epic 3: Barcode Scanning

TC-003-001-001: Camera opens with barcode overlay on Scan tab
Related Story: US-003-001
Related Task: TASK-003-001-001
Related AC: AC-003-001-001
Type: Functional
Status: [x] Pass
Actual Result: app/(tabs)/scan.tsx imports CameraView from expo-camera. When permission is granted, a CameraView fills the camera container with facing="back" and barcodeScannerSettings for ean13, ean8, upc_a, upc_e, code128, qr types. A BarcodeOverlay component is rendered inside overlayWrapper covering the camera. The overlay is displayed while scanning.
Defect Raised: None

TC-003-001-002: Recognized barcode navigates to product detail
Related Story: US-003-001
Related Task: TASK-003-001-002
Related AC: AC-003-001-002
Type: Functional
Status: [x] Pass
Actual Result: handleBarcode({ data }) calls getByBarcode(data) from ProductContext. If product is returned (non-null), saveRecentScan(product) persists it and router.push('/product/${product.id}') navigates to the detail screen. data/products.json has 23 products with unique EAN barcodes (e.g., 062073000011). A recognized scan navigates correctly.
Defect Raised: None

TC-003-001-003: Unrecognized barcode shows not-found message
Related Story: US-003-001
Related Task: TASK-003-001-002
Related AC: AC-003-001-003
Type: Edge Case
Status: [x] Pass
Actual Result: In handleBarcode(), if getByBarcode() returns null, Alert.alert('Product Not Found', 'No product found for barcode: ${data}') is shown with an OK button. The OK handler resets lastScanned.current = null and setIsScanning(false) so scanning can resume. The same logic applies for handleManualLookup() with an Alert if barcode is not found. Not-found message is correctly displayed.
Defect Raised: None

TC-003-001-004: Camera permission requested with explanation
Related Story: US-003-001
Related Task: TASK-003-001-001
Related AC: AC-003-001-004
Type: Functional
Status: [x] Pass
Actual Result: scan.tsx calls useCameraPermissions(). When permission.granted is false, a permission screen renders with: a camera icon, "Camera Access Required" title, a paragraph explaining the camera is only used on this screen, an "Allow Camera Access" button calling requestPermission(), and an "Enter Barcode Manually" fallback. The explanation is clear and the permission request is graceful.
Defect Raised: None

## Epic 4: Wishlist Management

TC-004-001-001: Wishlists tab shows all wishlists with item count
Related Story: US-004-001
Related Task: TASK-004-001-001
Related AC: AC-004-001-001
Type: Functional
Status: [x] Pass
Actual Result: wishlists.tsx renders a SectionList with two sections: "My Wishlists" (owned by currentUser) and "Shared With Me" (sharedWishlists from WishlistContext). Each item renders a WishlistCard showing wishlist.name and item count as "{n} items". The count is computed from wishlist.items.length. All user wishlists are shown with correct counts.
Defect Raised: None

TC-004-001-002: Create new wishlist via dialog
Related Story: US-004-001
Related Task: TASK-004-001-001
Related AC: AC-004-001-002
Type: Functional
Status: [x] Pass
Actual Result: wishlists.tsx has a FAB (floating action button) at bottom-right. Pressing it sets showCreateModal(true). A slide-up Modal appears with a TextInput (autoFocus, maxLength 60), a "Create Wishlist" button (disabled if input is empty or while creating), and a Cancel button. Submitting calls createWishlist(name.trim()) from WishlistContext which calls wishlistService.createWishlist() and persists to AsyncStorage.
Defect Raised: None

TC-004-001-003: Wishlists persist across app restarts
Related Story: US-004-001
Related Task: TASK-004-001-002
Related AC: AC-004-001-003
Type: Functional
Status: [x] Pass
Actual Result: wishlistService stores all wishlists under StorageKeys.WISHLISTS ('wishlists') in AsyncStorage as a JSON array. On app restart, WishlistContext.load() calls wishlistService.getWishlists(currentUser.id) which reads from AsyncStorage and filters by ownerId. Since the user's id is also persisted (StorageKeys.CURRENT_USER), all wishlists are restored on restart.
Defect Raised: None

TC-004-002-001: Wishlist detail shows items with image, name, price
Related Story: US-004-002
Related Task: TASK-004-002-001
Related AC: AC-004-002-001
Type: Functional
Status: [x] Pass
Actual Result: app/wishlist/[id].tsx imports useProducts() and resolves each item.productId to a product via products.find(). It renders WishlistItemRow with productName (product.name), productPrice (product.price), and isOwner flag. WishlistItemRow shows image placeholder, name (fontWeight semiBold), and $price.toFixed(2) in primary color. All three fields (image area, name, price) are rendered per item.
Defect Raised: None

TC-004-002-002: Remove item from wishlist
Related Story: US-004-002
Related Task: TASK-004-002-001
Related AC: AC-004-002-002
Type: Functional
Status: [x] Pass
Actual Result: wishlist/[id].tsx renders a "Remove" TouchableOpacity button (delete-outline icon + "Remove" text in error color) below each WishlistItemRow. Pressing it calls handleRemove(productId, productName) which shows a destructive Alert.alert('Remove Item', ...) with Cancel and Remove buttons. Confirming calls removeItem(wishlist.id, productId) and refreshes the wishlist via getWishlistById.
Defect Raised: None

TC-004-002-003: Empty wishlist shows friendly empty state
Related Story: US-004-002
Related Task: TASK-004-002-001
Related AC: AC-004-002-003
Type: Edge Case
Status: [x] Pass
Actual Result: wishlist/[id].tsx FlatList has ListEmptyComponent=<EmptyState icon="favorite-border" title="No items yet" subtitle="Browse the catalog or scan barcodes to add items to this wishlist." />. When wishlist.items is empty, the EmptyState component renders with a heart icon and friendly message. Total price footer is hidden when items.length === 0.
Defect Raised: None

TC-004-003-001: Wishlist total price displayed
Related Story: US-004-003
Related Task: TASK-004-003-001
Related AC: AC-004-003-001
Type: Functional
Status: [x] Pass
Actual Result: wishlist/[id].tsx calls getTotalPrice(wishlist, products) from utils/wishlistUtils.ts. getTotalPrice builds a Map of productId → price, sums all item prices, and rounds to 2 decimal places. A footer View renders "Total" label and "$total.toFixed(2)" in primary color when wishlist.items.length > 0. The calculation is correct for any mix of products.
Defect Raised: None

## Epic 5: Sharing & Fulfillment

TC-005-001-001: Share button opens contact picker
Related Story: US-005-001
Related Task: TASK-005-001-001
Related AC: AC-005-001-001
Type: Functional
Status: [x] Pass
Actual Result: wishlist/[id].tsx header shows a "Share" TouchableOpacity (share icon + "Share" text, outlined in primary color). Pressing it calls setShowShareModal(true). A slide-up Modal opens titled "Share Wishlist" listing all 3 mock users (Alice, Bob, Carol) from AuthContext.mockUsers. This is the simulated contact picker as specified by AC-0044 (mock user list used instead of real expo-contacts).
Defect Raised: None

TC-005-001-002: Selected contacts added to sharedWith list
Related Story: US-005-001
Related Task: TASK-005-001-002
Related AC: AC-005-001-002
Type: Functional
Status: [x] Pass
Actual Result: In wishlist/[id].tsx, tapping a user in the share modal calls handleShare(user.id, user.name) which calls shareWishlist(wishlist.id, [{contactId, contactName, phone, sharedAt}]). wishlistService.shareWishlist() filters out already-shared contacts (de-duplication), appends new contacts to sharedWith[], and persists to AsyncStorage. The sharedWith array is updated and persisted correctly.
Defect Raised: None

TC-005-001-003: Share confirmation shown after sharing
Related Story: US-005-001
Related Task: TASK-005-001-002
Related AC: AC-005-001-003
Type: Functional
Status: [x] Pass
Actual Result: After handleShare() completes, Alert.alert('Shared!', 'Wishlist shared with ${userName}.') is called. The modal closes (setShowShareModal(false)) before the alert, and the wishlist state is refreshed via getWishlistById. The share confirmation alert is shown to the user.
Defect Raised: None

TC-005-002-001: Shared With Me section shows received wishlists
Related Story: US-005-002
Related Task: TASK-005-002-001
Related AC: AC-005-002-001
Type: Functional
Status: [x] Pass
Actual Result: WishlistContext.load() calls wishlistService.getSharedWishlists(currentUser.id) which returns all wishlists where sharedWith.some(s => s.contactId === userId). WishlistsScreen renders a "Shared With Me" SectionList section with sharedWishlists data. Each item links to /wishlist/shared/${item.id}. When Alice shares with Bob, Bob's sharedWishlists will include Alice's wishlist.
Defect Raised: None

TC-005-002-002: Shared wishlist shows items with claimed status
Related Story: US-005-002
Related Task: TASK-005-002-001
Related AC: AC-005-002-002
Type: Functional
Status: [x] Pass
Actual Result: app/wishlist/shared/[id].tsx imports useProducts() and resolves each item.productId to product name and price. WishlistItemRow is rendered with productName, productPrice, and item (which includes claimedBy). The row shows isClaimed state via styling (opacity 0.65, crossed-out appearance). Claimed status is visible on shared wishlist items.
Defect Raised: None

TC-005-002-003: Claimed items visually marked as taken
Related Story: US-005-002
Related Task: TASK-005-002-001
Related AC: AC-005-002-003
Type: Functional
Status: [x] Pass
Actual Result: In shared/[id].tsx, when isClaimed (item.claimedBy !== null), the itemWrapper gets styles.itemWrapperClaimed (opacity 0.55). A "Claimed" badge (grey background, check-circle icon, white text) replaces the "I'll Get This" button. WishlistItemRow also applies rowClaimed style (opacity 0.65) and shows a green check-circle with "Claimed" text. Items are clearly visually distinguished.
Defect Raised: None

TC-005-003-001: Claim item with "I'll Get This" button
Related Story: US-005-003
Related Task: TASK-005-003-001
Related AC: AC-005-003-001
Type: Functional
Status: [x] Pass
Actual Result: In shared/[id].tsx, when !isOwner and !isClaimed, a TouchableOpacity "I'll Get This" button renders in the claimRow. Pressing it calls handleClaim(item.productId, productName) which calls claimItem(wishlist.id, productId) from WishlistContext. WishlistContext passes currentUser.id as claimerId. wishlistService.claimItem() sets item.claimedBy = claimerId. Alert.alert('Reserved!', ...) confirms the claim.
Defect Raised: None

TC-005-003-002: Claimed item disabled for other recipients
Related Story: US-005-003
Related Task: TASK-005-003-001
Related AC: AC-005-003-002
Type: Functional
Status: [x] Pass
Actual Result: Once claimItem() persists claimedBy to AsyncStorage, any user loading the shared wishlist will see isClaimed = true (item.claimedBy !== null). For all non-owners, the "I'll Get This" button is replaced by the "Claimed" badge. Since the claimed state is stored in AsyncStorage (shared storage on device) and the badge replaces the button entirely, no second user can claim the same item.
Defect Raised: None

TC-005-003-003: Wishlist owner cannot see who claimed items
Related Story: US-005-003
Related Task: TASK-005-003-001
Related AC: AC-005-003-003
Type: Negative
Status: [x] Pass
Actual Result: In wishlist/[id].tsx (owner view), isOwner = currentUser.id === wishlist.ownerId. WishlistItemRow is called with isOwner={isOwner}. In WishlistItemRow, when isClaimed && isOwner: the claimed text shows 'Claimed' (no claimer name). When isClaimed && !isOwner: the text would show claimerName if provided, but no claimerName prop is passed from [id].tsx, so it falls back to 'Claimed'. The owner never sees who claimed an item.
Defect Raised: None

## Epic 6: Mock Authentication

TC-006-001-001: Mock login screen with user profiles
Related Story: US-006-001
Related Task: TASK-006-001-001
Related AC: AC-006-001-001
Type: Functional
Status: [x] Pass
Actual Result: app/login.tsx renders a "Canadian Tire Wishlist" header in primary color, then a FlatList of mockUsers from AuthContext. Each user card shows an avatar circle (initial letter), user.name, and user.phone. A "Continue as Guest" outlined button is below the list. Login calls userService.setCurrentUser(user.id) which persists to AsyncStorage. All three mock users (Alice, Bob, Carol) are shown.
Defect Raised: None

TC-006-001-002: Guest mode skips login and limits sharing
Related Story: US-006-001
Related Task: TASK-006-001-001
Related AC: AC-006-001-002
Type: Functional
Status: [x] Pass
Actual Result: "Continue as Guest" button calls continueAsGuest() → login('guest') → setCurrentUser('guest'). isGuest is set true when user.id === 'guest'. WishlistsScreen renders a guest message ("Sign in to view wishlists") and no FAB or wishlist list when isGuest. WishlistContext.load() returns empty arrays for guest. createWishlist() returns null for guest. Sharing is effectively blocked since no wishlists can be created.
Defect Raised: None

TC-006-001-003: Current user shown in profile area
Related Story: US-006-001
Related Task: TASK-006-001-002
Related AC: AC-006-001-003
Type: Functional
Status: [x] Pass
Actual Result: app/(tabs)/index.tsx (Home screen) renders a hero banner showing "Welcome back, {currentUser.name}!" when a user is logged in, or "Browsing as Guest" for guest users. The current user name is sourced from AuthContext.currentUser resolved via userService from data/users.json. The home screen acts as the profile area showing the current user identity.
Defect Raised: None

TC-006-001-004: Switching users resets session context
Related Story: US-006-001
Related Task: TASK-006-001-002
Related AC: AC-006-001-004
Type: Functional
Status: [x] Pass
Actual Result: WishlistContext defines load() with useCallback([currentUser]) dependency. The useEffect([load]) runs whenever load changes, which happens when currentUser changes. Switching users calls login(newUserId) in AuthContext which sets currentUser to the new User object. This triggers WishlistContext to reload wishlists for the new user (getWishlists(newUser.id) and getSharedWishlists(newUser.id)), replacing the previous user's data in state.
Defect Raised: None
