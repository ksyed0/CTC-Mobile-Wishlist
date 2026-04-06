# Design Spec: POC Enhancements — Plan A (Quick Wins)

**Date:** 2026-04-05  
**Status:** Approved  
**Features:** Item Notes (#1), Already-in-Wishlist Indicator (#2), Demo Reset (#3), Wishlist Rename (#4)  
**Epic:** EPIC-0007

---

## Context

Four quick-win enhancements to improve demo polish and user experience for the CTC Mobile Wishlist POC. All four share a common UI pattern (bottom sheet input) and touch the existing wishlist + catalog flows. The BottomSheetInput component is introduced as a shared primitive, used by both Item Notes and Wishlist Rename.

---

## Shared Component: BottomSheetInput

**File:** `components/BottomSheetInput.tsx`

A reusable modal bottom sheet containing a single text input. Used by both Item Notes (optional, free-text) and Wishlist Rename (required, pre-filled).

**Props:**

```ts
interface BottomSheetInputProps {
  visible: boolean;
  title: string;
  placeholder: string;
  initialValue?: string;
  maxLength?: number;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  confirmLabel?: string; // default "Save"
  cancelLabel?: string; // default "Cancel"
}
```

**Behaviour:**

- Renders as a `Modal` (transparent, animationType="slide")
- Semi-transparent backdrop; sheet slides up from bottom with `border-top-left-radius: 16px` and `border-top-right-radius: 16px`
- TextInput is auto-focused on open (`autoFocus`)
- Tapping backdrop calls `onCancel`
- Confirm button disabled while input is empty (only enforced when `initialValue` is undefined — i.e. when value is required, such as rename)
- Keyboard avoid: wrap content in `KeyboardAvoidingView` (behavior `"padding"` on iOS, `"height"` on Android)

---

## Feature 1 — Item Notes (US-0016)

### Purpose

Let wishlist owners attach a short contextual note to any item (e.g. "Size M", "The green one"). Recipients see the note read-only.

### Data

`WishlistItem.note: string | null` — already in the schema (`project.md`). No schema change needed.

### Service Method

`wishlistService.updateItemNote(wishlistId: string, productId: string, note: string | null): Promise<void>`

Reads the wishlist from AsyncStorage, finds the matching item by `productId`, sets `item.note`, writes back.

### UI — Owner View (`app/wishlist/[id].tsx`)

- Each `WishlistItemRow` gains an optional `note` prop (string | null) and `onNotePress` callback
- Below the product name/price row: if `note` is set, render it in a muted subtitle style; if no note, render a `"+ Add note"` tappable text link (font-size 12, color `#999`)
- Tapping either opens `BottomSheetInput` (title "Item Note", placeholder "e.g. Size M, the blue one", maxLength 120, initialValue = existing note or "")
- On confirm: call `updateItemNote()`; close sheet; update local state
- On confirm with empty string: treat as note removal (`note = null`)

### UI — Recipient View (`app/wishlist/shared/[id].tsx`)

- `WishlistItemRow` renders the `note` prop (read-only subtitle) if present
- No edit affordance for recipients

### Acceptance Criteria

- AC-0046: Owner can tap "+ Add note" on any item to open a bottom sheet input
- AC-0047: Entering text and tapping Save persists the note via AsyncStorage
- AC-0048: The note is shown as a subtitle below the item name in both owner and shared views
- AC-0049: Owner can edit or clear an existing note by tapping it

---

## Feature 2 — Already-in-Wishlist Indicator (US-0017)

### Purpose

Show at a glance which catalog products have already been saved to any of the current user's wishlists, preventing redundant adds and reducing friction during browsing.

### Logic

In `app/(tabs)/catalog.tsx`:

- Compute `savedProductIds = new Set(wishlists.flatMap(w => w.items.map(i => i.productId)))` via `useMemo`
- Pass `isSaved={savedProductIds.has(product.id)}` prop to each `ProductCard`

`ProductCard` gains an `isSaved?: boolean` prop.

### UI Changes — `components/ProductCard.tsx`

**Heart badge (top-right of image):**

- Always render the heart icon; when `isSaved = true`, use a filled red heart (`MaterialIcons name="favorite"`, color `#D52B1E`); when false, outline (`"favorite-border"`, color `#999`)
- Position: absolute, top 8, right 8, on top of the image container
- Background: small white circle (24×24) with subtle shadow for legibility

**Add to Wishlist button (bottom of card):**

- When `isSaved = true`: render green pill `"✓ Saved"` (background `#E8F5E9`, text `#2E7D32`, non-tappable)
- When `isSaved = false`: render existing "Add to Wishlist" flow unchanged

### Product Detail Screen

The detail screen already prevents duplicate adds via `addItem` duplicate guard (AC-0042). No additional changes needed on that screen — the catalog-level indicator is sufficient.

### Acceptance Criteria

- AC-0050: Products already saved to any wishlist show a filled red heart badge on their catalog card
- AC-0051: Saved products show a green "✓ Saved" pill instead of the add button
- AC-0052: Indicator updates immediately after adding a product to a wishlist (context state drives re-render)

---

## Feature 3 — Demo Reset (US-0018)

### Purpose

Allow the demo presenter to quickly wipe all user-generated data and return the app to a clean state between demos — without restarting the app or simulator.

### UI

A "Reset Demo Data" button on the Login/User-select screen (`app/login.tsx` or equivalent auth screen).

- Style: subtle, not prominent — small text button below the user tiles, color `#999`
- Label: "Reset demo data"
- On tap: show `Alert.alert("Reset Demo Data", "This will delete all wishlists and recent scans for all users. Continue?", [Cancel, Reset])`
- On confirm: call `resetDemoData()` then show a brief `Alert.alert("Done", "Demo data cleared.")` confirmation

### Service Method

`wishlistService.resetDemoData(): Promise<void>`

Removes:

- `AsyncStorage.removeItem(StorageKeys.WISHLISTS)` — all wishlists
- `AsyncStorage.removeItem(StorageKeys.RECENT_SCANS)` — recent scan history
- `AsyncStorage.removeItem(StorageKeys.SEEN_SHARED_IDS)` — tab badge tracking (if present)

Does NOT remove the current logged-in user — presenter stays on the same user after reset.

After completion, the `WishlistContext` re-initializes via its existing `loadWishlists()` effect (triggered because storage is now empty).

### Acceptance Criteria

- AC-0053: A "Reset demo data" button is visible on the login/user-select screen
- AC-0054: Tapping it shows a confirmation dialog before any data is deleted
- AC-0055: After confirming, all wishlists and recent scans are cleared from AsyncStorage
- AC-0056: The app remains on the login screen after reset; no navigation side effects

---

## Feature 4 — Wishlist Rename (US-0019)

### Purpose

Let owners rename a wishlist without deleting and recreating it.

### UI

A pencil icon (`MaterialIcons name="edit"`, size 18, color `#D52B1E`) placed inline next to the wishlist name in the header of `app/wishlist/[id].tsx`.

- Tapping the pencil opens `BottomSheetInput` (title "Rename Wishlist", placeholder "Wishlist name", initialValue = current name, confirmLabel "Save", maxLength 60)
- Save button disabled while input is empty (name is required)
- On confirm: call `renameWishlist()`, close sheet, update header title in local state

### Service Method

`wishlistService.renameWishlist(wishlistId: string, newName: string): Promise<void>`

Reads wishlist from AsyncStorage, sets `wishlist.name = newName`, writes back.

WishlistContext exposes this as `renameWishlist(wishlistId, newName)` — updates both AsyncStorage and in-memory state.

### Acceptance Criteria

- AC-0057: A pencil icon is visible next to the wishlist name in the detail header
- AC-0058: Tapping the pencil opens a pre-filled bottom sheet input
- AC-0059: Saving updates the wishlist name immediately in the header and list views
- AC-0060: The save button is disabled when the name input is empty

---

## Architecture Notes

- `BottomSheetInput` is created first (TASK-0024) as it is a dependency for both Feature 1 and Feature 4
- `wishlistService` and `WishlistContext` are extended incrementally — each feature adds one method
- No new screens — all changes are additive to existing screens
- No new dependencies required

---

## Files to Create

| File                              | Purpose                             |
| --------------------------------- | ----------------------------------- |
| `components/BottomSheetInput.tsx` | Shared bottom sheet input primitive |

## Files to Modify

| File                             | Change                                                           |
| -------------------------------- | ---------------------------------------------------------------- |
| `services/wishlistService.ts`    | Add `updateItemNote`, `renameWishlist`, `resetDemoData`          |
| `contexts/WishlistContext.tsx`   | Expose new service methods; add `resetDemoData`                  |
| `components/WishlistItemRow.tsx` | Add `note` + `onNotePress` props; render note/add-note UI        |
| `app/wishlist/[id].tsx`          | Wire note editing; add pencil icon + BottomSheetInput for rename |
| `app/wishlist/shared/[id].tsx`   | Pass note to WishlistItemRow (read-only)                         |
| `components/ProductCard.tsx`     | Add `isSaved` prop; render heart badge + saved pill              |
| `app/(tabs)/catalog.tsx`         | Compute `savedProductIds` Set; pass `isSaved` to ProductCard     |
| `app/login.tsx` (or auth screen) | Add "Reset demo data" button                                     |
