# Design Spec: POC Enhancements — Plan B (Medium Effort)

**Date:** 2026-04-05  
**Status:** Approved  
**Features:** Tab Badge (#5), Claimer Reveal (#7), Restock & Price-Drop Alerts (#8/#9), Privacy Levels (#10)  
**Epic:** EPIC-007

---

## Context

Five medium-effort enhancements that build on top of the existing sharing, wishlist, and product-detail flows. They introduce new state keys, new UI controls, and mock notification logic, while staying fully within the local/offline POC architecture. None require a backend.

---

## Feature 5 — Unseen Shared Wishlist Tab Badge (US-007-005)

### Purpose

Surface a numeric badge on the Wishlists tab icon when the current user has shared wishlists they haven't yet viewed, so they know something new arrived.

### State

**New AsyncStorage key:** `StorageKeys.SEEN_SHARED_IDS` — stores a JSON array of wishlist IDs that the current user has already viewed in the "Shared with Me" section.

**New context value in `WishlistContext`:** `unseenSharedCount: number`

Logic:

```
sharedWishlists = wishlists filtered to those not owned by currentUser
unseenSharedCount = sharedWishlists.filter(w => !seenIds.includes(w.id)).length
```

When the user opens a shared wishlist (`app/wishlist/shared/[id].tsx`), add its ID to `seenIds` and persist. `unseenSharedCount` recomputes automatically.

### UI

`app/(tabs)/_layout.tsx` — Wishlists tab:

```tsx
tabBarBadge={unseenSharedCount > 0 ? unseenSharedCount : undefined}
```

`tabBarBadge` accepts a number; Expo Router renders it as a red pill on the tab icon. Setting it to `undefined` removes the badge.

### Behaviour Notes

- Badge resets for the **current user only** — switching users recalculates from that user's `seenIds`
- The badge does not appear for wishlists the user owns (only received wishlists)
- `seenIds` is stored per-user: key is `SEEN_SHARED_IDS_${userId}` to avoid cross-user bleed

### Acceptance Criteria

- AC-007-005-001: Wishlists tab shows a numeric badge when there are unseen shared wishlists
- AC-007-005-002: Opening a shared wishlist removes it from the unseen count
- AC-007-005-003: Badge disappears when all shared wishlists have been viewed
- AC-007-005-004: Switching users shows the correct badge count for the new user

---

## Feature 7 — Claimer Reveal Toggle (US-007-006)

### Purpose

Let the wishlist owner optionally see who claimed each item — useful after an event when the "surprise" is no longer needed. Off by default.

### Data

**Wishlist type extension:**

```ts
interface Wishlist {
  // ... existing fields
  showClaimers?: boolean; // default: false
}
```

No migration needed — missing field is treated as `false`.

**New service method:** `wishlistService.setShowClaimers(wishlistId: string, show: boolean): Promise<void>`

Reads wishlist, sets `showClaimers`, writes back.

### UI — `app/wishlist/[id].tsx` (owner view only)

A toggle row in the wishlist detail header section, below the item count/shared-with subtitle:

```
[Show who claimed items]    [toggle]
```

- Toggle uses `Switch` (React Native built-in) with `trackColor={{ true: '#D52B1E' }}`
- Initial state from `wishlist.showClaimers ?? false`
- On change: call `setShowClaimers()`, update local state immediately (optimistic)
- The toggle row is only rendered when the user is the owner (not in `shared/[id].tsx`)

### Claimer Display

When `showClaimers = true`, each item in the owner's `WishlistItemRow` that has `claimedBy` set shows: `"Claimed by [name]"` resolved from `wishlist.sharedWith` array:

```ts
const claimer = wishlist.sharedWith.find((c) => c.contactId === item.claimedBy);
const claimerName = claimer?.contactName ?? item.claimedBy;
```

Render as a small green subtitle: `"✓ Claimed by Bob"` (font-size 11, color `#2E7D32`)

When `showClaimers = false` (default), render only `"✓ Claimed"` with no name — existing behaviour.

### Acceptance Criteria

- AC-007-006-001: Owner's wishlist detail shows a "Show who claimed items" toggle in the header
- AC-007-006-002: Toggle defaults to off; "Claimed" items show no name
- AC-007-006-003: When toggled on, claimed items show "Claimed by [contact name]"
- AC-007-006-004: Toggle state persists across app restarts (stored in wishlist record)
- AC-007-006-005: Recipients never see the toggle; their view is read-only

---

## Feature 8 & 9 — Restock & Price-Drop Alerts (US-007-007 / US-007-008)

### Purpose

Mock "notify me" buttons on the product detail screen. These are UI-only — no real notification infrastructure. Confirmations are shown via `Alert.alert()`.

### UI — `app/product/[id].tsx`

Two additional buttons rendered below the primary CTAs (Add to Wishlist / Add to Cart):

**Restock Alert button (US-007-007 — "Back in Stock"):**

- Shown when `product.inStock === false` only
- Label: `"🔔 Notify me when back in stock"`
- Style: outlined button (border `#ccc`, text `#666`, font-size 13)
- On tap: `Alert.alert("Restock Alert Set", "We'll notify you when this item is back in stock.")`

**Price-Drop Alert button (US-007-008 — "Price Drop"):**

- Always visible regardless of stock status
- Label: `"🔔 Notify me if price drops"`
- Style: same outlined style as restock button
- On tap: `Alert.alert("Price Drop Alert Set", "We'll notify you if the price drops on this item.")`

### Layout Order (bottom of product detail screen)

```
[♥ Add to Wishlist]            ← primary CTA (red, full-width)
[🛒 Add to Cart]               ← secondary CTA (outlined red)
[🔔 Notify me when back in stock]   ← only if out of stock
[🔔 Notify me if price drops]       ← always visible
```

No state is persisted — each tap is a fresh one-time confirmation dialog. This is intentional for the POC; real alert management would require a backend.

### Acceptance Criteria

- AC-007-007-001: "Notify me when back in stock" button appears only when `product.inStock === false`
- AC-007-007-002: Tapping the restock button shows an Alert confirmation (no navigation)
- AC-007-008-001: "Notify me if price drops" button is always visible on the product detail screen
- AC-007-008-002: Tapping the price-drop button shows an Alert confirmation (no navigation)
- AC-007-008-003: Both buttons use an outlined (non-primary) style to avoid competing with the main CTAs

---

## Feature 10 — Privacy Levels (US-007-009)

### Purpose

Give wishlist owners control over who can see their wishlist. Three tiers: Private (owner only), Contacts (shareable with specific people — current behaviour), and Public link (mock deep link).

### Data

**Wishlist type extension:**

```ts
interface Wishlist {
  // ... existing fields
  privacy?: 'private' | 'contacts' | 'public'; // default: 'contacts'
}
```

No migration needed — missing field treated as `'contacts'` (preserves existing behaviour).

**New service method:** `wishlistService.setPrivacy(wishlistId: string, privacy: 'private' | 'contacts' | 'public'): Promise<void>`

### UI — `app/wishlist/[id].tsx` (owner view)

A "Privacy" row in the wishlist detail header, showing the current setting and a chevron. Tapping opens a `BottomSheetInput`-style picker (reuse the bottom sheet modal pattern, but render three selectable rows instead of a text input).

**Picker rows:**

| Icon | Label         | Subtitle                       |
| ---- | ------------- | ------------------------------ |
| 🔒   | Private       | Only you can see this wishlist |
| 👥   | Contacts only | Share with specific people     |
| 🔗   | Public link   | Anyone with the link can view  |

Selected row has `border: 1.5px solid #D52B1E` and `background: #fff5f5`.

**Behaviour per setting:**

- `'private'`: Share button is hidden/disabled with tooltip "Set to Contacts or Public to share"
- `'contacts'`: Existing share behaviour unchanged
- `'public'`: A "Copy Link" button appears below the privacy row; tapping copies a mock deep link (`ctcwishlist://shared/[wishlistId]`) to the clipboard via `Clipboard.setStringAsync()` and shows an `Alert.alert("Link Copied", "ctcwishlist://shared/[id]")`

**In shared/[id].tsx:** No change — the recipient's view is unaffected by privacy (if they have access, they can view).

**In wishlists.tsx — "Shared with Me" section:** Private wishlists are never surfaced to other users (filtered out when building the shared section). This is already implied by the data model since a private wishlist should not have been shared in the first place — no additional filtering logic needed if we gate the Share button.

### Acceptance Criteria

- AC-007-009-001: Wishlist detail header shows the current privacy setting
- AC-007-009-002: Tapping the privacy row opens a 3-option picker sheet
- AC-007-009-003: Setting to "Private" hides the Share button
- AC-007-009-004: Setting to "Public link" shows a "Copy Link" button that copies a mock deep link
- AC-007-009-005: Privacy setting persists across app restarts

---

## Architecture Notes

- Plan B features are independent of Plan A (can be built in any order after Plan A ships)
- `BottomSheetInput` from Plan A is reused for the Privacy Levels picker (extend to support a `mode="picker"` variant, or create a thin `PrivacyPickerSheet` wrapper)
- All state changes are optimistic — update React context state immediately, then persist async
- No new npm dependencies required

---

## Files to Create

| File   | Purpose                                |
| ------ | -------------------------------------- |
| (none) | All changes additive to existing files |

## Files to Modify

| File                             | Change                                                        |
| -------------------------------- | ------------------------------------------------------------- |
| `types/index.ts` (or equivalent) | Add `showClaimers?`, `privacy?` to `Wishlist` type            |
| `services/wishlistService.ts`    | Add `setShowClaimers`, `setPrivacy`                           |
| `contexts/WishlistContext.tsx`   | Expose new methods; add `unseenSharedCount` + `seenIds` logic |
| `services/storageKeys.ts`        | Add `SEEN_SHARED_IDS` key                                     |
| `app/(tabs)/_layout.tsx`         | Add `tabBarBadge` to Wishlists tab                            |
| `app/wishlist/shared/[id].tsx`   | Mark wishlist as seen on mount                                |
| `app/wishlist/[id].tsx`          | Add claimer reveal toggle; add privacy row + picker           |
| `components/WishlistItemRow.tsx` | Render claimer name when `showClaimers` is true               |
| `app/product/[id].tsx`           | Add restock + price-drop alert buttons                        |
