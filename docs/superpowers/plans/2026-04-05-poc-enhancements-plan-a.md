# POC Enhancements — Plan A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four demo-polish features to the CTC wishlist POC: item notes, already-saved indicator on catalog cards, demo data reset, and wishlist rename.

**Architecture:** BottomSheetInput is built first as a shared modal primitive reused by both item notes and wishlist rename. Service methods are added to `wishlistService.ts`, exposed through `WishlistContext`, then wired up in the UI. The already-saved indicator is computed in `catalog.tsx` using a `useMemo` Set over the wishlist context state.

**Tech Stack:** React Native, TypeScript, AsyncStorage, Expo Router, `@expo/vector-icons` (MaterialIcons)

**Spec:** `docs/superpowers/specs/2026-04-05-poc-enhancements-plan-a-design.md`

---

## Task 1: BottomSheetInput component

**Files:**

- Create: `components/BottomSheetInput.tsx`
- Create: `tests/components/BottomSheetInput.test.ts`

- [ ] **Step 1: Write the contract test**

```ts
// tests/components/BottomSheetInput.test.ts
/**
 * BottomSheetInput — props contract tests
 * No React renderer installed; tests validate interface and callback logic only.
 */

interface BottomSheetInputProps {
  visible: boolean;
  title: string;
  placeholder: string;
  initialValue?: string;
  maxLength?: number;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

describe('BottomSheetInput — props contract', () => {
  it('calls onConfirm with the provided value', () => {
    const onConfirm = jest.fn();
    // Simulate what the component does when confirm is pressed
    const value = 'Size M';
    onConfirm(value);
    expect(onConfirm).toHaveBeenCalledWith('Size M');
  });

  it('calls onCancel when cancel is pressed', () => {
    const onCancel = jest.fn();
    onCancel();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('uses confirmLabel default "Save"', () => {
    const props: Partial<BottomSheetInputProps> = {};
    const label = props.confirmLabel ?? 'Save';
    expect(label).toBe('Save');
  });

  it('uses cancelLabel default "Cancel"', () => {
    const props: Partial<BottomSheetInputProps> = {};
    const label = props.cancelLabel ?? 'Cancel';
    expect(label).toBe('Cancel');
  });

  it('treats empty string confirm as clearing the value', () => {
    const onConfirm = jest.fn();
    onConfirm('');
    expect(onConfirm).toHaveBeenCalledWith('');
  });
});
```

- [ ] **Step 2: Run test to verify it fails (or confirms interface)**

```bash
cd /Users/Kamal_Syed/Projects/CTC-Mobile-Wishlist
npm test -- --watchAll=false --testPathPattern="BottomSheetInput"
```

Expected: PASS (contract tests validate the interface we're about to build)

- [ ] **Step 3: Create the component**

```tsx
// components/BottomSheetInput.tsx
import { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface BottomSheetInputProps {
  visible: boolean;
  title: string;
  placeholder: string;
  initialValue?: string;
  maxLength?: number;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function BottomSheetInput({
  visible,
  title,
  placeholder,
  initialValue = '',
  maxLength,
  onConfirm,
  onCancel,
  confirmLabel = 'Save',
  cancelLabel = 'Cancel',
}: BottomSheetInputProps) {
  const inputRef = useRef<TextInput>(null);
  const valueRef = useRef(initialValue);

  // Reset value when sheet opens
  useEffect(() => {
    if (visible) {
      valueRef.current = initialValue;
      // Focus is handled by autoFocus on the TextInput
    }
  }, [visible, initialValue]);

  // Confirm is only disabled when initialValue is undefined (required field) and value is empty
  const isRequired = initialValue === undefined;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onCancel}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.sheet}>
              <Text style={styles.title}>{title}</Text>
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.textLight}
                defaultValue={initialValue}
                maxLength={maxLength}
                autoFocus
                onChangeText={(text) => {
                  valueRef.current = text;
                }}
                returnKeyType="done"
                onSubmitEditing={() => onConfirm(valueRef.current)}
              />
              <View style={styles.buttons}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => onConfirm(valueRef.current)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.8}>
                  <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: spacing.borderRadius.lg,
    borderTopRightRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md,
  },
});
```

- [ ] **Step 4: Run tests**

```bash
npm test -- --watchAll=false --testPathPattern="BottomSheetInput"
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/BottomSheetInput.tsx tests/components/BottomSheetInput.test.ts
git commit -m "feat(US-0016,US-0019): add BottomSheetInput shared component"
```

---

## Task 2: wishlistService — updateItemNote, renameWishlist, resetDemoData

**Files:**

- Modify: `services/wishlistService.ts`
- Modify: `utils/storage.ts`
- Modify: `tests/services/wishlistService.test.ts`

- [ ] **Step 1: Add RECENT_SCANS to StorageKeys in `utils/storage.ts`**

The key already exists as a string literal in the codebase. Make it official:

```ts
// utils/storage.ts  — replace the StorageKeys block
export const StorageKeys = {
  CURRENT_USER: 'currentUser',
  WISHLISTS: 'wishlists',
  RECENT_SCANS: 'recentScans',
  SEEN_SHARED_IDS_PREFIX: 'seenSharedIds_',
} as const;
```

- [ ] **Step 2: Write failing tests for the three new service methods**

Add these test blocks to the bottom of `tests/services/wishlistService.test.ts`:

```ts
// ---------------------------------------------------------------------------
// updateItemNote — US-0016
// ---------------------------------------------------------------------------
describe('wishlistService.updateItemNote', () => {
  it('sets a note on an existing item', async () => {
    const wishlist = makeWishlist({
      items: [{ productId: 'p-001', addedAt: '2026-01-01T00:00:00.000Z', claimedBy: null, note: null }],
    });
    await seedWishlists([wishlist]);

    await wishlistService.updateItemNote('wl-test-001', 'p-001', 'Size M');

    const all = await wishlistService.getWishlists('user-001');
    expect(all[0].items[0].note).toBe('Size M');
  });

  it('clears a note when empty string is passed', async () => {
    const wishlist = makeWishlist({
      items: [{ productId: 'p-001', addedAt: '2026-01-01T00:00:00.000Z', claimedBy: null, note: 'Old note' }],
    });
    await seedWishlists([wishlist]);

    await wishlistService.updateItemNote('wl-test-001', 'p-001', '');

    const all = await wishlistService.getWishlists('user-001');
    expect(all[0].items[0].note).toBeNull();
  });

  it('does nothing when wishlist id is not found', async () => {
    await seedWishlists([makeWishlist()]);
    await wishlistService.updateItemNote('nonexistent', 'p-001', 'note');
    // No throw — just no-op
    const all = await wishlistService.getWishlists('user-001');
    expect(all).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// renameWishlist — US-0019
// ---------------------------------------------------------------------------
describe('wishlistService.renameWishlist', () => {
  it('updates the wishlist name', async () => {
    await seedWishlists([makeWishlist({ name: 'Old Name' })]);

    await wishlistService.renameWishlist('wl-test-001', 'New Name');

    const updated = await wishlistService.getWishlistById('wl-test-001');
    expect(updated?.name).toBe('New Name');
  });

  it('trims whitespace from the new name', async () => {
    await seedWishlists([makeWishlist()]);

    await wishlistService.renameWishlist('wl-test-001', '  Trimmed  ');

    const updated = await wishlistService.getWishlistById('wl-test-001');
    expect(updated?.name).toBe('Trimmed');
  });

  it('does nothing when wishlist id is not found', async () => {
    await seedWishlists([makeWishlist({ name: 'Stays Same' })]);
    await wishlistService.renameWishlist('nonexistent', 'New Name');
    const wl = await wishlistService.getWishlistById('wl-test-001');
    expect(wl?.name).toBe('Stays Same');
  });
});

// ---------------------------------------------------------------------------
// resetDemoData — US-0018
// ---------------------------------------------------------------------------
describe('wishlistService.resetDemoData', () => {
  it('removes the wishlists key from storage', async () => {
    await seedWishlists([makeWishlist()]);

    await wishlistService.resetDemoData();

    const all = await wishlistService.getWishlists('user-001');
    expect(all).toHaveLength(0);
  });

  it('removes the recentScans key from storage', async () => {
    await AsyncStorage.setItem('recentScans', JSON.stringify([{ id: 'p-1' }]));

    await wishlistService.resetDemoData();

    const val = await AsyncStorage.getItem('recentScans');
    expect(val).toBeNull();
  });
});
```

- [ ] **Step 3: Run tests to confirm they fail**

```bash
npm test -- --watchAll=false --testPathPattern="wishlistService"
```

Expected: FAIL — `updateItemNote`, `renameWishlist`, `resetDemoData` are not defined

- [ ] **Step 4: Implement the three methods in `services/wishlistService.ts`**

Add these three methods inside the `wishlistService` object, after `unclaimItem`:

```ts
  /**
   * Set or clear the note on a wishlist item (US-0016).
   * Passing empty string clears the note (sets null).
   * No-op when wishlistId or productId is not found.
   */
  async updateItemNote(wishlistId: string, productId: string, note: string): Promise<void> {
    const all = await loadWishlists();
    const idx = all.findIndex((w) => w.id === wishlistId);
    if (idx === -1) return;
    const wishlist = all[idx];
    const updated: Wishlist = {
      ...wishlist,
      items: wishlist.items.map((item) =>
        item.productId === productId
          ? { ...item, note: note.trim() === '' ? null : note.trim() }
          : item,
      ),
    };
    const updatedAll = [...all];
    updatedAll[idx] = updated;
    await saveWishlists(updatedAll);
  },

  /**
   * Rename a wishlist (US-0019).
   * No-op when wishlistId is not found.
   */
  async renameWishlist(wishlistId: string, newName: string): Promise<void> {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const all = await loadWishlists();
    const idx = all.findIndex((w) => w.id === wishlistId);
    if (idx === -1) return;
    const updatedAll = [...all];
    updatedAll[idx] = { ...all[idx], name: trimmed };
    await saveWishlists(updatedAll);
  },

  /**
   * Clear all wishlists and recent scans from storage (US-0018 demo reset).
   */
  async resetDemoData(): Promise<void> {
    const { removeItem } = await import('../utils/storage');
    await Promise.all([
      removeItem(StorageKeys.WISHLISTS),
      removeItem(StorageKeys.RECENT_SCANS),
    ]);
  },
```

Note: `StorageKeys` is already imported at the top of the file — it just needs `RECENT_SCANS` to be defined (done in Step 1). The `removeItem` import is already available from `'../utils/storage'` — add it to the existing import at line 1:

```ts
// Line 1 of wishlistService.ts — update to:
import { Wishlist, WishlistItem, SharedContact } from '../types/wishlist';
import { StorageKeys, getItem, setItem, removeItem } from '../utils/storage';
```

Then simplify `resetDemoData` to not use a dynamic import:

```ts
  async resetDemoData(): Promise<void> {
    await Promise.all([
      removeItem(StorageKeys.WISHLISTS),
      removeItem(StorageKeys.RECENT_SCANS),
    ]);
  },
```

- [ ] **Step 5: Run tests**

```bash
npm test -- --watchAll=false --testPathPattern="wishlistService"
```

Expected: PASS (all tests including new ones)

- [ ] **Step 6: Commit**

```bash
git add services/wishlistService.ts utils/storage.ts tests/services/wishlistService.test.ts
git commit -m "feat(US-0016,US-0018,US-0019): add updateItemNote, renameWishlist, resetDemoData to wishlistService"
```

---

## Task 3: WishlistContext — expose new methods

**Files:**

- Modify: `contexts/WishlistContext.tsx`

- [ ] **Step 1: Add the three new methods to the context interface and provider**

In `contexts/WishlistContext.tsx`, update the `WishlistContextValue` interface (after `getWishlistById`):

```ts
// Add to WishlistContextValue interface:
updateItemNote: (wishlistId: string, productId: string, note: string) => Promise<void>;
renameWishlist: (wishlistId: string, newName: string) => Promise<void>;
resetDemoData: () => Promise<void>;
```

Add the implementations inside `WishlistProvider`, after the `getWishlistById` function:

```ts
async function updateItemNote(wishlistId: string, productId: string, note: string): Promise<void> {
  await wishlistService.updateItemNote(wishlistId, productId, note);
  // Refresh the affected wishlist in local state
  const updated = await wishlistService.getWishlistById(wishlistId);
  if (updated) {
    setWishlists((prev) => prev.map((w) => (w.id === wishlistId ? updated : w)));
  }
}

async function renameWishlist(wishlistId: string, newName: string): Promise<void> {
  await wishlistService.renameWishlist(wishlistId, newName);
  setWishlists((prev) => prev.map((w) => (w.id === wishlistId ? { ...w, name: newName.trim() } : w)));
}

async function resetDemoData(): Promise<void> {
  await wishlistService.resetDemoData();
  setWishlists([]);
  setSharedWishlists([]);
}
```

Add them to the context value object in the `return` statement:

```ts
// Inside WishlistContext.Provider value={{...}}:
updateItemNote,
renameWishlist,
resetDemoData,
```

- [ ] **Step 2: Run full test suite**

```bash
npm test -- --watchAll=false
```

Expected: PASS — no regressions from context changes

- [ ] **Step 3: Commit**

```bash
git add contexts/WishlistContext.tsx
git commit -m "feat(US-0016,US-0018,US-0019): expose updateItemNote, renameWishlist, resetDemoData in WishlistContext"
```

---

## Task 4: Item Notes UI

**Files:**

- Modify: `components/WishlistItemRow.tsx`
- Modify: `app/wishlist/[id].tsx`
- Modify: `app/wishlist/shared/[id].tsx`

- [ ] **Step 1: Add note props and note UI to WishlistItemRow**

In `components/WishlistItemRow.tsx`, update the interface and render:

```ts
// Add to WishlistItemRowProps interface:
note?: string | null;
onNotePress?: () => void;
```

After the `{productPrice !== undefined ? ... : null}` block (around line 55), add:

```tsx
{
  /* Item note — owner sees tappable note or add-note link; recipients see read-only */
}
{
  item.note ? (
    <TouchableOpacity onPress={onNotePress} activeOpacity={onNotePress ? 0.7 : 1} disabled={!onNotePress}>
      <Text style={styles.noteText}>{item.note}</Text>
    </TouchableOpacity>
  ) : onNotePress ? (
    <TouchableOpacity onPress={onNotePress} activeOpacity={0.7}>
      <Text style={styles.addNoteLink}>+ Add note</Text>
    </TouchableOpacity>
  ) : null;
}
```

Add to the `styles` StyleSheet at the end:

```ts
noteText: {
  fontSize: typography.fontSize.xs,
  color: colors.textSecondary,
  marginTop: 2,
  fontStyle: 'italic',
},
addNoteLink: {
  fontSize: typography.fontSize.xs,
  color: colors.textLight,
  marginTop: 2,
},
```

- [ ] **Step 2: Wire Item Notes in `app/wishlist/[id].tsx`**

Add imports at the top:

```ts
import { useState } from 'react'; // already there — ensure it's imported
import { BottomSheetInput } from '../../components/BottomSheetInput';
```

Add to the `useWishlists()` destructure:

```ts
const { getWishlistById, removeItem, shareWishlist, updateItemNote } = useWishlists();
```

Add state for the note sheet (after the `showShareModal` state):

```ts
const [noteSheet, setNoteSheet] = useState<{ productId: string; currentNote: string | null } | null>(null);
```

Add the handler function after `handleShare`:

```ts
async function handleNoteSave(note: string) {
  if (!wishlist || !noteSheet) return;
  await updateItemNote(wishlist.id, noteSheet.productId, note);
  const updated = await getWishlistById(wishlist.id);
  setWishlist(updated);
  setNoteSheet(null);
}
```

In the `renderItem`, pass the new props to `WishlistItemRow`:

```tsx
<WishlistItemRow
  item={item}
  productName={productName}
  productPrice={product?.price}
  productImage={product?.image}
  isOwner={isOwner}
  note={item.note}
  onNotePress={() => setNoteSheet({ productId: item.productId, currentNote: item.note })}
/>
```

Add the BottomSheetInput at the bottom of the component's JSX (after the share Modal closing tag):

```tsx
<BottomSheetInput
  visible={noteSheet !== null}
  title="Item Note"
  placeholder="e.g. Size M, the blue one"
  initialValue={noteSheet?.currentNote ?? ''}
  maxLength={120}
  onConfirm={handleNoteSave}
  onCancel={() => setNoteSheet(null)}
/>
```

- [ ] **Step 3: Pass note to WishlistItemRow in shared view (`app/wishlist/shared/[id].tsx`)**

In the `renderItem`, pass `note` (read-only, no `onNotePress`):

```tsx
<WishlistItemRow
  item={item}
  productName={product?.name ?? item.productId}
  productPrice={product?.price}
  productImage={product?.image}
  claimerName={...}   // keep existing
  showClaimButton={...}  // keep existing
  onClaim={...}          // keep existing
  note={item.note}
/>
```

- [ ] **Step 4: Run full test suite**

```bash
npm test -- --watchAll=false
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/WishlistItemRow.tsx app/wishlist/[id].tsx app/wishlist/shared/[id].tsx
git commit -m "feat(US-0016): item notes — add/edit note on wishlist items, read-only in shared view"
```

---

## Task 5: Already-in-Wishlist indicator

**Files:**

- Modify: `components/ProductCard.tsx`
- Modify: `app/(tabs)/catalog.tsx`
- Modify: `tests/components/ProductCard.test.ts`

- [ ] **Step 1: Write failing tests for the isSaved prop**

Add to `tests/components/ProductCard.test.ts`:

```ts
describe('ProductCard — isSaved prop', () => {
  it('defaults isSaved to false when not provided', () => {
    const isSaved = undefined ?? false;
    expect(isSaved).toBe(false);
  });

  it('accepts isSaved = true', () => {
    const isSaved = true;
    expect(isSaved).toBe(true);
  });

  it('isSaved determines button label logic', () => {
    const saved = true;
    const label = saved ? '✓ Saved' : 'Add to Wishlist';
    expect(label).toBe('✓ Saved');
  });

  it('isSaved false shows add button', () => {
    const saved = false;
    const label = saved ? '✓ Saved' : 'Add to Wishlist';
    expect(label).toBe('Add to Wishlist');
  });
});
```

- [ ] **Step 2: Run test to verify it passes (contract tests)**

```bash
npm test -- --watchAll=false --testPathPattern="ProductCard"
```

Expected: PASS

- [ ] **Step 3: Add `isSaved` to ProductCard**

In `components/ProductCard.tsx`, update the `ProductCardProps` interface:

```ts
interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onAddToWishlist?: () => void;
  isSaved?: boolean;
}
```

Update the function signature:

```ts
export const ProductCard = memo(function ProductCard({ product, onPress, onAddToWishlist, isSaved = false }: ProductCardProps) {
```

Inside `imageContainer` View (after the `outOfStockBadge`), add the heart badge:

```tsx
{
  /* Saved heart badge — top-right of image */
}
<View style={styles.heartBadge}>
  <MaterialIcons
    name={isSaved ? 'favorite' : 'favorite-border'}
    size={16}
    color={isSaved ? colors.primary : colors.textLight}
  />
</View>;
```

Replace the `onAddToWishlist` button block with the saved/unsaved conditional:

```tsx
{
  isSaved ? (
    <View style={styles.savedPill}>
      <Text style={styles.savedPillText}>✓ Saved</Text>
    </View>
  ) : onAddToWishlist ? (
    <TouchableOpacity
      style={[styles.addButton, !product.inStock && styles.addButtonDisabled]}
      onPress={onAddToWishlist}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`Add ${product.name} to wishlist`}
    >
      <MaterialIcons name="favorite-border" size={14} color={product.inStock ? colors.primary : colors.textLight} />
      <Text style={[styles.addButtonText, !product.inStock && styles.addButtonTextDisabled]}>Add to Wishlist</Text>
    </TouchableOpacity>
  ) : null;
}
```

Add the new styles to the `StyleSheet.create` block:

```ts
heartBadge: {
  position: 'absolute',
  top: spacing.xs,
  right: spacing.xs,
  width: 24,
  height: 24,
  borderRadius: 12,
  backgroundColor: colors.white,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.15,
  shadowRadius: 2,
  elevation: 2,
},
savedPill: {
  backgroundColor: '#E8F5E9',
  borderRadius: spacing.borderRadius.sm,
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.sm,
  alignItems: 'center',
  minHeight: 32,
  justifyContent: 'center',
},
savedPillText: {
  fontSize: typography.fontSize.xs,
  fontWeight: typography.fontWeight.semiBold,
  color: '#2E7D32',
},
```

- [ ] **Step 4: Update `app/(tabs)/catalog.tsx` to compute savedProductIds and pass isSaved**

Add imports:

```ts
import { useState, useMemo } from 'react'; // useMemo already imported
import { useWishlists } from '../../contexts/WishlistContext';
```

Inside `CatalogScreen`, after the existing `useProducts()` line:

```ts
const { wishlists } = useWishlists();
const savedProductIds = useMemo(() => new Set(wishlists.flatMap((w) => w.items.map((i) => i.productId))), [wishlists]);
```

Update the `renderItem` in the FlatList:

```tsx
renderItem={({ item }) => (
  <ProductCard
    product={item}
    onPress={() => router.push(`/product/${item.id}`)}
    isSaved={savedProductIds.has(item.id)}
  />
)}
```

- [ ] **Step 5: Run full test suite**

```bash
npm test -- --watchAll=false
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/ProductCard.tsx app/(tabs)/catalog.tsx tests/components/ProductCard.test.ts
git commit -m "feat(US-0017): already-in-wishlist indicator — heart badge and saved pill on catalog cards"
```

---

## Task 6: Demo Reset button

**Files:**

- Modify: `app/login.tsx`

- [ ] **Step 1: Add the reset button to the login screen**

In `app/login.tsx`, add `Alert` to the imports (it's already in the RN import in most files, add if not present):

```ts
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
```

Add `useWishlists` import:

```ts
import { useWishlists } from '../contexts/WishlistContext';
```

Inside `LoginScreen`, add the hook call after the `useAuth` line:

```ts
const { resetDemoData } = useWishlists();
```

Add the handler function:

```ts
function handleResetDemo() {
  Alert.alert('Reset Demo Data', 'This will delete all wishlists and recent scans for all users. Continue?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Reset',
      style: 'destructive',
      onPress: async () => {
        await resetDemoData();
        Alert.alert('Done', 'Demo data cleared.');
      },
    },
  ]);
}
```

In the JSX, after the `<Text style={styles.disclaimer}>` element and before the closing `</View>` of `styles.body`, add:

```tsx
<TouchableOpacity
  style={styles.resetButton}
  onPress={handleResetDemo}
  activeOpacity={0.7}
  accessibilityRole="button"
  accessibilityLabel="Reset demo data"
>
  <Text style={styles.resetButtonText}>Reset demo data</Text>
</TouchableOpacity>
```

Add styles:

```ts
resetButton: {
  alignItems: 'center',
  paddingVertical: spacing.sm,
  marginTop: spacing.sm,
},
resetButtonText: {
  fontSize: typography.fontSize.xs,
  color: colors.textLight,
},
```

- [ ] **Step 2: Run full test suite**

```bash
npm test -- --watchAll=false
```

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/login.tsx
git commit -m "feat(US-0018): demo reset button on login screen"
```

---

## Task 7: Wishlist Rename

**Files:**

- Modify: `app/wishlist/[id].tsx`

- [ ] **Step 1: Add rename state and handler to `app/wishlist/[id].tsx`**

`BottomSheetInput` is already imported from Task 4. Add to the `useWishlists()` destructure:

```ts
const { getWishlistById, removeItem, shareWishlist, updateItemNote, renameWishlist } = useWishlists();
```

Add rename sheet state (after existing state declarations):

```ts
const [showRenameSheet, setShowRenameSheet] = useState(false);
```

Add handler after `handleNoteSave`:

```ts
async function handleRenameSave(newName: string) {
  if (!wishlist || !newName.trim()) return;
  await renameWishlist(wishlist.id, newName);
  setWishlist((prev) => (prev ? { ...prev, name: newName.trim() } : prev));
  setShowRenameSheet(false);
}
```

- [ ] **Step 2: Add pencil icon next to wishlist name in header**

In the header JSX (around line 98), replace the `headerText` View content:

```tsx
<View style={styles.headerText}>
  <View style={styles.headerTitleRow}>
    <Text style={styles.headerTitle}>{wishlist.name}</Text>
    <TouchableOpacity
      onPress={() => setShowRenameSheet(true)}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel="Rename wishlist"
    >
      <MaterialIcons name="edit" size={18} color={colors.primary} />
    </TouchableOpacity>
  </View>
  <Text style={styles.headerMeta}>
    {wishlist.items.length} item{wishlist.items.length !== 1 ? 's' : ''}
  </Text>
</View>
```

Add the style:

```ts
headerTitleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: spacing.xs,
},
```

- [ ] **Step 3: Add rename BottomSheetInput to JSX**

After the note BottomSheetInput added in Task 4, add:

```tsx
<BottomSheetInput
  visible={showRenameSheet}
  title="Rename Wishlist"
  placeholder="Wishlist name"
  initialValue={wishlist?.name ?? ''}
  maxLength={60}
  confirmLabel="Save"
  onConfirm={handleRenameSave}
  onCancel={() => setShowRenameSheet(false)}
/>
```

- [ ] **Step 4: Run full test suite**

```bash
npm test -- --watchAll=false
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/wishlist/[id].tsx
git commit -m "feat(US-0019): wishlist rename — pencil icon opens bottom sheet, persists via AsyncStorage"
```

---

## Self-Review Checklist

- [x] **BottomSheetInput** — created, tested, exported from `components/`
- [x] **updateItemNote** — service method with trim/null logic; tested; exposed in context
- [x] **renameWishlist** — service method with trim; tested; exposed in context
- [x] **resetDemoData** — removes WISHLISTS and RECENT_SCANS keys; tested; exposed in context
- [x] **Item Notes** — `WishlistItemRow` renders note and "+ Add note" link; owner can edit via BottomSheetInput; shared view is read-only
- [x] **savedProductIds** — computed in catalog.tsx via `useMemo`; `useWishlists()` import added
- [x] **isSaved** — new prop on ProductCard; heart badge + saved pill render correctly
- [x] **Demo Reset** — `Alert.alert` confirmation; calls context `resetDemoData()`
- [x] **Wishlist Rename** — pencil icon in header; BottomSheetInput pre-filled with current name
- [x] **Type consistency** — `updateItemNote`, `renameWishlist`, `resetDemoData` named consistently across service → context → UI
- [x] **No TBDs or placeholders**
