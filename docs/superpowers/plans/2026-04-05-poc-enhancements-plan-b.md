# POC Enhancements — Plan B Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add five medium-effort enhancements: tab badge for unseen shared wishlists, claimer reveal toggle, mock restock and price-drop alert buttons, and three-tier wishlist privacy levels.

**Architecture:** Wishlist type is extended with two optional fields (`showClaimers`, `privacy`) — missing fields default gracefully so existing data requires no migration. All new state flows through WishlistContext. Tab badge uses a per-user AsyncStorage key to track seen shared wishlist IDs. Privacy and claimer reveal controls live in the wishlist detail header. Alert buttons are UI-only (no persistence).

**Tech Stack:** React Native, TypeScript, AsyncStorage, Expo Router, `@expo/vector-icons` (MaterialIcons), `Clipboard` from `@react-native-clipboard/clipboard` (or `expo-clipboard`)

**Spec:** `docs/superpowers/specs/2026-04-05-poc-enhancements-plan-b-design.md`

---

## Task 1: Extend Wishlist type

**Files:**

- Modify: `types/wishlist.ts`

- [ ] **Step 1: Add `showClaimers` and `privacy` optional fields**

```ts
// types/wishlist.ts — replace the Wishlist interface
export interface Wishlist {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  items: WishlistItem[];
  sharedWith: SharedContact[];
  showClaimers?: boolean; // US-007-006 — default false when absent
  privacy?: 'private' | 'contacts' | 'public'; // US-007-009 — default 'contacts' when absent
}
```

No data migration is needed. Both fields are optional; existing wishlists without them behave as if `showClaimers = false` and `privacy = 'contacts'`.

- [ ] **Step 2: Run full test suite to verify no regressions**

```bash
cd /Users/Kamal_Syed/Projects/CTC-Mobile-Wishlist
npm test -- --watchAll=false
```

Expected: PASS — optional fields don't break existing usage

- [ ] **Step 3: Commit**

```bash
git add types/wishlist.ts
git commit -m "feat(US-007-006,US-007-009): extend Wishlist type with showClaimers and privacy fields"
```

---

## Task 2: wishlistService — setShowClaimers, setPrivacy + StorageKeys

**Files:**

- Modify: `utils/storage.ts`
- Modify: `services/wishlistService.ts`
- Modify: `tests/services/wishlistService.test.ts`

- [ ] **Step 1: Write failing tests**

Add to the bottom of `tests/services/wishlistService.test.ts`:

```ts
// ---------------------------------------------------------------------------
// setShowClaimers — US-007-006
// ---------------------------------------------------------------------------
describe('wishlistService.setShowClaimers', () => {
  it('sets showClaimers to true', async () => {
    await seedWishlists([makeWishlist()]);
    await wishlistService.setShowClaimers('wl-test-001', true);
    const updated = await wishlistService.getWishlistById('wl-test-001');
    expect(updated?.showClaimers).toBe(true);
  });

  it('sets showClaimers to false', async () => {
    await seedWishlists([makeWishlist({ showClaimers: true })]);
    await wishlistService.setShowClaimers('wl-test-001', false);
    const updated = await wishlistService.getWishlistById('wl-test-001');
    expect(updated?.showClaimers).toBe(false);
  });

  it('does nothing when wishlist id is not found', async () => {
    await seedWishlists([makeWishlist()]);
    await wishlistService.setShowClaimers('nonexistent', true);
    const wl = await wishlistService.getWishlistById('wl-test-001');
    expect(wl?.showClaimers).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// setPrivacy — US-007-009
// ---------------------------------------------------------------------------
describe('wishlistService.setPrivacy', () => {
  it('sets privacy to private', async () => {
    await seedWishlists([makeWishlist()]);
    await wishlistService.setPrivacy('wl-test-001', 'private');
    const updated = await wishlistService.getWishlistById('wl-test-001');
    expect(updated?.privacy).toBe('private');
  });

  it('sets privacy to public', async () => {
    await seedWishlists([makeWishlist()]);
    await wishlistService.setPrivacy('wl-test-001', 'public');
    const updated = await wishlistService.getWishlistById('wl-test-001');
    expect(updated?.privacy).toBe('public');
  });

  it('does nothing when wishlist id is not found', async () => {
    await seedWishlists([makeWishlist()]);
    await wishlistService.setPrivacy('nonexistent', 'private');
    const wl = await wishlistService.getWishlistById('wl-test-001');
    expect(wl?.privacy).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test -- --watchAll=false --testPathPattern="wishlistService"
```

Expected: FAIL — `setShowClaimers` and `setPrivacy` not defined

- [ ] **Step 3: Add the two service methods to `services/wishlistService.ts`**

Add after `resetDemoData` (or at the end of the `wishlistService` object, before the closing `}`):

```ts
  /**
   * Toggle the showClaimers flag on a wishlist (US-007-006).
   * No-op when wishlistId is not found.
   */
  async setShowClaimers(wishlistId: string, show: boolean): Promise<void> {
    const all = await loadWishlists();
    const idx = all.findIndex((w) => w.id === wishlistId);
    if (idx === -1) return;
    const updatedAll = [...all];
    updatedAll[idx] = { ...all[idx], showClaimers: show };
    await saveWishlists(updatedAll);
  },

  /**
   * Set the privacy level on a wishlist (US-007-009).
   * No-op when wishlistId is not found.
   */
  async setPrivacy(wishlistId: string, privacy: 'private' | 'contacts' | 'public'): Promise<void> {
    const all = await loadWishlists();
    const idx = all.findIndex((w) => w.id === wishlistId);
    if (idx === -1) return;
    const updatedAll = [...all];
    updatedAll[idx] = { ...all[idx], privacy };
    await saveWishlists(updatedAll);
  },
```

- [ ] **Step 4: Run tests**

```bash
npm test -- --watchAll=false --testPathPattern="wishlistService"
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add services/wishlistService.ts utils/storage.ts tests/services/wishlistService.test.ts
git commit -m "feat(US-007-006,US-007-009): add setShowClaimers and setPrivacy to wishlistService"
```

---

## Task 3: WishlistContext — unseenSharedCount, markWishlistSeen, new methods

**Files:**

- Modify: `contexts/WishlistContext.tsx`

- [ ] **Step 1: Add unseenSharedCount, markWishlistSeen, setShowClaimers, setPrivacy**

Add these imports to `contexts/WishlistContext.tsx`:

```ts
import { getItem, setItem, StorageKeys } from '../utils/storage';
```

(If `getItem`, `setItem`, and `StorageKeys` aren't already imported, add them.)

Update the `WishlistContextValue` interface:

```ts
// Add to WishlistContextValue:
unseenSharedCount: number;
markWishlistSeen: (wishlistId: string) => Promise<void>;
setShowClaimers: (wishlistId: string, show: boolean) => Promise<void>;
setPrivacy: (wishlistId: string, privacy: 'private' | 'contacts' | 'public') => Promise<void>;
```

Inside `WishlistProvider`, add state for seen IDs:

```ts
const [seenSharedIds, setSeenSharedIds] = useState<string[]>([]);
```

Compute `unseenSharedCount` using `useMemo`:

```ts
import { useMemo } from 'react'; // add to existing React import
```

```ts
const unseenSharedCount = useMemo(() => {
  const seenSet = new Set(seenSharedIds);
  return sharedWishlists.filter((w) => !seenSet.has(w.id)).length;
}, [sharedWishlists, seenSharedIds]);
```

Load seen IDs when the user changes (add to the `load` callback):

```ts
const load = useCallback(async () => {
  if (!currentUser || currentUser.id === 'guest') {
    setWishlists([]);
    setSharedWishlists([]);
    setSeenSharedIds([]);
    return;
  }
  setIsLoading(true);
  try {
    const [owned, shared, seen] = await Promise.all([
      wishlistService.getWishlists(currentUser.id),
      wishlistService.getSharedWishlists(currentUser.id),
      getItem<string[]>(`${StorageKeys.SEEN_SHARED_IDS_PREFIX}${currentUser.id}`),
    ]);
    setWishlists(owned);
    setSharedWishlists(shared);
    setSeenSharedIds(seen ?? []);
  } catch (error) {
    console.error('[WishlistContext] Load error:', error);
  } finally {
    setIsLoading(false);
  }
}, [currentUser]);
```

Add the four new functions inside `WishlistProvider`:

```ts
async function markWishlistSeen(wishlistId: string): Promise<void> {
  if (!currentUser || currentUser.id === 'guest') return;
  const updated = [...new Set([...seenSharedIds, wishlistId])];
  setSeenSharedIds(updated);
  await setItem(`${StorageKeys.SEEN_SHARED_IDS_PREFIX}${currentUser.id}`, updated);
}

async function setShowClaimers(wishlistId: string, show: boolean): Promise<void> {
  await wishlistService.setShowClaimers(wishlistId, show);
  setWishlists((prev) => prev.map((w) => (w.id === wishlistId ? { ...w, showClaimers: show } : w)));
}

async function setPrivacy(wishlistId: string, privacy: 'private' | 'contacts' | 'public'): Promise<void> {
  await wishlistService.setPrivacy(wishlistId, privacy);
  setWishlists((prev) => prev.map((w) => (w.id === wishlistId ? { ...w, privacy } : w)));
}
```

Add them to the context `value` object:

```ts
unseenSharedCount,
markWishlistSeen,
setShowClaimers,
setPrivacy,
```

- [ ] **Step 2: Run full test suite**

```bash
npm test -- --watchAll=false
```

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add contexts/WishlistContext.tsx
git commit -m "feat(US-007-005,US-007-006,US-007-009): add unseenSharedCount, markWishlistSeen, setShowClaimers, setPrivacy to WishlistContext"
```

---

## Task 4: Tab badge for unseen shared wishlists

**Files:**

- Modify: `app/(tabs)/_layout.tsx`
- Modify: `app/wishlist/shared/[id].tsx`

- [ ] **Step 1: Add badge to Wishlists tab in `app/(tabs)/_layout.tsx`**

Add imports:

```ts
import { useWishlists } from '../../contexts/WishlistContext';
```

Inside `TabLayout`, call the hook:

```ts
const { unseenSharedCount } = useWishlists();
```

Update the Wishlists tab screen options:

```tsx
<Tabs.Screen
  name="wishlists"
  options={{
    title: 'Wishlists',
    tabBarIcon: ({ color, size }) => <MaterialIcons name="favorite" size={size} color={color} />,
    tabBarBadge: unseenSharedCount > 0 ? unseenSharedCount : undefined,
  }}
/>
```

- [ ] **Step 2: Mark wishlist as seen when opened in `app/wishlist/shared/[id].tsx`**

Add to `useWishlists()` destructure:

```ts
const { getWishlistById, claimItem, markWishlistSeen } = useWishlists();
```

In the `useEffect` where the wishlist is loaded, call `markWishlistSeen` after the wishlist is fetched:

```ts
useEffect(() => {
  if (id) {
    getWishlistById(id).then((w) => {
      setWishlist(w);
      setIsLoading(false);
      if (w) {
        markWishlistSeen(id);
      }
    });
  }
}, [id]);
```

- [ ] **Step 3: Run full test suite**

```bash
npm test -- --watchAll=false
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add app/(tabs)/_layout.tsx app/wishlist/shared/[id].tsx
git commit -m "feat(US-007-005): tab badge shows unseen shared wishlist count; clears when opened"
```

---

## Task 5: Claimer Reveal toggle

**Files:**

- Modify: `app/wishlist/[id].tsx`

- [ ] **Step 1: Add setShowClaimers to the context destructure**

In `app/wishlist/[id].tsx`, update the `useWishlists()` destructure:

```ts
const { getWishlistById, removeItem, shareWishlist, updateItemNote, renameWishlist, setShowClaimers } = useWishlists();
```

Add a local toggle handler after `handleRenameSave`:

```ts
async function handleToggleClaimers(value: boolean) {
  if (!wishlist) return;
  await setShowClaimers(wishlist.id, value);
  setWishlist((prev) => (prev ? { ...prev, showClaimers: value } : prev));
}
```

- [ ] **Step 2: Add the toggle row to the wishlist header (owner-only)**

Add `Switch` to the React Native imports at the top of the file:

```ts
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  Switch,
} from 'react-native';
```

Inside the header `View` (after the `headerMeta` Text and before the end of `headerText`), add:

```tsx
{
  isOwner && (
    <View style={styles.claimerToggleRow}>
      <Text style={styles.claimerToggleLabel}>Show who claimed items</Text>
      <Switch
        value={wishlist.showClaimers ?? false}
        onValueChange={handleToggleClaimers}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.white}
      />
    </View>
  );
}
```

Add styles:

```ts
claimerToggleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: spacing.sm,
  paddingTop: spacing.sm,
  borderTopWidth: 1,
  borderTopColor: colors.border,
},
claimerToggleLabel: {
  fontSize: typography.fontSize.sm,
  color: colors.textSecondary,
},
```

- [ ] **Step 3: Pass claimerName to WishlistItemRow when showClaimers is on**

In the `renderItem` FlatList in `app/wishlist/[id].tsx`, the `WishlistItemRow` call already has `isOwner`. Update it:

```tsx
<WishlistItemRow
  item={item}
  productName={productName}
  productPrice={product?.price}
  productImage={product?.image}
  isOwner={isOwner}
  note={item.note}
  onNotePress={() => setNoteSheet({ productId: item.productId, currentNote: item.note })}
  claimerName={
    isOwner && (wishlist.showClaimers ?? false) && item.claimedBy
      ? (wishlist.sharedWith.find((c) => c.contactId === item.claimedBy)?.contactName ?? item.claimedBy)
      : undefined
  }
/>
```

Now update `WishlistItemRow` to use `claimerName` in the owner view too. In `components/WishlistItemRow.tsx`, change the claimed text logic (around line 63):

```tsx
<Text style={styles.claimedText}>{claimerName ? `Claimed by ${claimerName}` : 'Claimed'}</Text>
```

(Remove the `isOwner` check that was forcing "Claimed" without a name — `claimerName` is now only passed when the owner has the toggle on, so the logic is cleaner.)

- [ ] **Step 4: Run full test suite**

```bash
npm test -- --watchAll=false
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/wishlist/[id].tsx components/WishlistItemRow.tsx
git commit -m "feat(US-007-006): claimer reveal toggle in wishlist header; shows contact name when enabled"
```

---

## Task 6: Restock and price-drop alert buttons

**Files:**

- Modify: `app/product/[id].tsx`

- [ ] **Step 1: Add the two alert buttons below the Add to Cart button**

In `app/product/[id].tsx`, the CTAs live inside `<View style={styles.details}>`. After the `addToCartButton` TouchableOpacity closing tag (around line 171), add:

```tsx
{
  /* US-007-007: Restock alert — only when out of stock */
}
{
  !product.inStock && (
    <TouchableOpacity
      style={styles.alertButton}
      onPress={() => Alert.alert('Restock Alert Set', "We'll notify you when this item is back in stock.")}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Notify me when back in stock"
    >
      <MaterialIcons name="notifications-none" size={16} color={colors.textSecondary} />
      <Text style={styles.alertButtonText}>Notify me when back in stock</Text>
    </TouchableOpacity>
  );
}

{
  /* US-007-008: Price-drop alert — always visible */
}
<TouchableOpacity
  style={styles.alertButton}
  onPress={() => Alert.alert('Price Drop Alert Set', "We'll notify you if the price drops on this item.")}
  activeOpacity={0.8}
  accessibilityRole="button"
  accessibilityLabel="Notify me if price drops"
>
  <MaterialIcons name="trending-down" size={16} color={colors.textSecondary} />
  <Text style={styles.alertButtonText}>Notify me if price drops</Text>
</TouchableOpacity>;
```

Add styles (add to the existing `StyleSheet.create`):

```ts
alertButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  borderRadius: spacing.borderRadius.md,
  borderWidth: 1,
  borderColor: colors.border,
  gap: spacing.xs,
  marginTop: spacing.sm,
  minHeight: 44,
},
alertButtonText: {
  fontSize: typography.fontSize.sm,
  color: colors.textSecondary,
},
```

- [ ] **Step 2: Run full test suite**

```bash
npm test -- --watchAll=false
```

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/product/[id].tsx
git commit -m "feat(US-007-007,US-007-008): mock restock and price-drop alert buttons on product detail"
```

---

## Task 7: Privacy levels

**Files:**

- Modify: `app/wishlist/[id].tsx`

This task requires `expo-clipboard` for the "Copy Link" action. Check if it's already installed:

```bash
npx expo install expo-clipboard
```

- [ ] **Step 1: Add privacy state and handler**

In `app/wishlist/[id].tsx`, add the import:

```ts
import * as Clipboard from 'expo-clipboard';
```

Add to the `useWishlists()` destructure:

```ts
const { ..., setPrivacy } = useWishlists();
```

Add state for the privacy picker sheet:

```ts
const [showPrivacySheet, setShowPrivacySheet] = useState(false);
```

Add the handler:

```ts
async function handlePrivacyChange(privacy: 'private' | 'contacts' | 'public') {
  if (!wishlist) return;
  await setPrivacy(wishlist.id, privacy);
  setWishlist((prev) => (prev ? { ...prev, privacy } : prev));
  setShowPrivacySheet(false);
}

async function handleCopyLink() {
  if (!wishlist) return;
  const link = `ctcwishlist://shared/${wishlist.id}`;
  await Clipboard.setStringAsync(link);
  Alert.alert('Link Copied', link);
}
```

- [ ] **Step 2: Add privacy row to the wishlist header (owner-only)**

Inside the header, after the claimer toggle row (from Task 5), add:

```tsx
{
  isOwner && (
    <TouchableOpacity
      style={styles.privacyRow}
      onPress={() => setShowPrivacySheet(true)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Change wishlist privacy"
    >
      <MaterialIcons
        name={
          (wishlist.privacy ?? 'contacts') === 'private'
            ? 'lock'
            : (wishlist.privacy ?? 'contacts') === 'public'
              ? 'link'
              : 'group'
        }
        size={16}
        color={colors.textSecondary}
      />
      <Text style={styles.privacyLabel}>
        {(wishlist.privacy ?? 'contacts') === 'private'
          ? 'Private'
          : (wishlist.privacy ?? 'contacts') === 'public'
            ? 'Public link'
            : 'Contacts only'}
      </Text>
      <MaterialIcons name="chevron-right" size={16} color={colors.textLight} />
    </TouchableOpacity>
  );
}

{
  /* Public link copy button */
}
{
  isOwner && (wishlist.privacy ?? 'contacts') === 'public' && (
    <TouchableOpacity style={styles.copyLinkButton} onPress={handleCopyLink} activeOpacity={0.8}>
      <MaterialIcons name="content-copy" size={14} color={colors.primary} />
      <Text style={styles.copyLinkText}>Copy link</Text>
    </TouchableOpacity>
  );
}
```

Add styles:

```ts
privacyRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.xs,
  marginTop: spacing.xs,
},
privacyLabel: {
  flex: 1,
  fontSize: typography.fontSize.sm,
  color: colors.textSecondary,
},
copyLinkButton: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.xs,
  marginTop: spacing.xs,
},
copyLinkText: {
  fontSize: typography.fontSize.sm,
  color: colors.primary,
  fontWeight: typography.fontWeight.semiBold,
},
```

- [ ] **Step 3: Hide Share button when privacy is 'private'**

The share button is rendered around line 104. Wrap it conditionally:

```tsx
{
  (wishlist.privacy ?? 'contacts') !== 'private' && (
    <TouchableOpacity style={styles.shareButton} onPress={() => setShowShareModal(true)}>
      <MaterialIcons name="share" size={20} color={colors.primary} />
      <Text style={styles.shareButtonText}>Share</Text>
    </TouchableOpacity>
  );
}
```

- [ ] **Step 4: Add privacy picker Modal**

After the rename `BottomSheetInput`, add the privacy picker as a Modal (same bottom-sheet pattern):

```tsx
<Modal visible={showPrivacySheet} transparent animationType="slide" onRequestClose={() => setShowPrivacySheet(false)}>
  <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowPrivacySheet(false)}>
    <View style={styles.modalSheet}>
      <Text style={styles.modalTitle}>Wishlist Privacy</Text>
      {(
        [
          {
            value: 'private' as const,
            icon: 'lock' as const,
            label: 'Private',
            subtitle: 'Only you can see this wishlist',
          },
          {
            value: 'contacts' as const,
            icon: 'group' as const,
            label: 'Contacts only',
            subtitle: 'Share with specific people',
          },
          {
            value: 'public' as const,
            icon: 'link' as const,
            label: 'Public link',
            subtitle: 'Anyone with the link can view',
          },
        ] as const
      ).map((option) => {
        const isSelected = (wishlist?.privacy ?? 'contacts') === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.privacyOption, isSelected && styles.privacyOptionSelected]}
            onPress={() => handlePrivacyChange(option.value)}
            activeOpacity={0.75}
          >
            <MaterialIcons name={option.icon} size={22} color={isSelected ? colors.primary : colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.privacyOptionLabel, isSelected && styles.privacyOptionLabelSelected]}>
                {option.label}
              </Text>
              <Text style={styles.privacyOptionSubtitle}>{option.subtitle}</Text>
            </View>
            {isSelected && <MaterialIcons name="check" size={18} color={colors.primary} />}
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={styles.cancelButton} onPress={() => setShowPrivacySheet(false)}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
</Modal>
```

Add the privacy picker styles:

```ts
privacyOption: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.sm,
  padding: spacing.sm,
  borderRadius: spacing.borderRadius.md,
  borderWidth: 1,
  borderColor: colors.border,
  marginBottom: spacing.sm,
},
privacyOptionSelected: {
  borderColor: colors.primary,
  backgroundColor: '#fff5f5',
},
privacyOptionLabel: {
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeight.semiBold,
  color: colors.dark,
},
privacyOptionLabelSelected: {
  color: colors.primary,
},
privacyOptionSubtitle: {
  fontSize: typography.fontSize.xs,
  color: colors.textLight,
  marginTop: 2,
},
```

- [ ] **Step 5: Run full test suite**

```bash
npm test -- --watchAll=false
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/wishlist/[id].tsx
git commit -m "feat(US-007-009): privacy levels — 3-tier picker in wishlist header; public link copy; hides share when private"
```

---

## Self-Review Checklist

- [x] **Type extensions** — `showClaimers?` and `privacy?` are optional; no migration needed for existing data
- [x] **setShowClaimers / setPrivacy** — service methods tested; context exposes them; optimistic state updates in UI
- [x] **unseenSharedCount** — computed via `useMemo` from `sharedWishlists` and `seenSharedIds`; per-user storage key avoids cross-user bleed
- [x] **markWishlistSeen** — called in `shared/[id].tsx` `useEffect` on mount; deduplicates IDs with `new Set`
- [x] **tabBarBadge** — set to `undefined` (not 0) when count is 0, which removes the badge from the tab
- [x] **Claimer Reveal** — toggle only in owner view; `claimerName` derived from `sharedWith` array; fallback to `item.claimedBy` if contact not found
- [x] **WishlistItemRow claimed text** — simplified: shows `claimerName` if provided, "Claimed" otherwise; `isOwner` check removed (caller controls the prop)
- [x] **Alert buttons** — restock button conditional on `!product.inStock`; price-drop always visible; no state persisted
- [x] **Privacy picker** — defaults to `'contacts'` when field absent; Share button hidden when `'private'`; Copy Link only when `'public'`
- [x] **expo-clipboard** — `npx expo install expo-clipboard` step included before use
- [x] **Type consistency** — `setShowClaimers`, `setPrivacy`, `markWishlistSeen`, `unseenSharedCount` named consistently across service → context → UI
- [x] **No TBDs or placeholders**
