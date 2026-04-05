/**
 * Unit tests for wishlistService
 *
 * Coverage targets:
 *   US-0007  TASK-0013 — CRUD: create / get / delete wishlist
 *   US-0008  TASK-0014 — addItem / removeItem
 *   AC-0042             — duplicate item guard in addItem
 *   US-0010  TASK-0017 — shareWishlist / getSharedWishlists
 *   US-0012  TASK-0019 — claimItem / unclaimItem
 *   Error cases         — invalid args / not-found ids
 */

// AsyncStorage is mapped to the manual mock via jest.config.js moduleNameMapper
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wishlistService } from '../../services/wishlistService';
import { Wishlist, SharedContact } from '../../types/wishlist';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const AS = AsyncStorage as unknown as {
  __reset: () => void;
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
};

/** Seed AsyncStorage with an array of wishlists */
async function seedWishlists(wishlists: Wishlist[]): Promise<void> {
  await AsyncStorage.setItem('wishlists', JSON.stringify(wishlists));
}

function makeWishlist(overrides: Partial<Wishlist> = {}): Wishlist {
  return {
    id: 'wl-test-001',
    name: 'Test Wishlist',
    ownerId: 'user-001',
    createdAt: '2026-01-01T00:00:00.000Z',
    items: [],
    sharedWith: [],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  AS.__reset();
});

// ---------------------------------------------------------------------------
// getWishlists
// ---------------------------------------------------------------------------
describe('wishlistService.getWishlists', () => {
  it('returns wishlists owned by the specified user', async () => {
    await seedWishlists([
      makeWishlist({ id: 'wl-1', ownerId: 'user-001' }),
      makeWishlist({ id: 'wl-2', ownerId: 'user-002' }),
    ]);
    const result = await wishlistService.getWishlists('user-001');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('wl-1');
  });

  it('returns an empty array when the user has no wishlists', async () => {
    await seedWishlists([makeWishlist({ ownerId: 'user-002' })]);
    const result = await wishlistService.getWishlists('user-001');
    expect(result).toEqual([]);
  });

  it('returns an empty array when storage is empty', async () => {
    const result = await wishlistService.getWishlists('user-001');
    expect(result).toEqual([]);
  });

  it('throws when userId is empty', async () => {
    await expect(wishlistService.getWishlists('')).rejects.toThrow(/userId must be a non-empty string/);
  });
});

// ---------------------------------------------------------------------------
// getSharedWishlists (US-0010)
// ---------------------------------------------------------------------------
describe('wishlistService.getSharedWishlists', () => {
  const contact: SharedContact = {
    contactId: 'user-002',
    contactName: 'Bob',
    phone: '416-555-0102',
    sharedAt: '2026-01-02T00:00:00.000Z',
  };

  it('returns wishlists shared with the user', async () => {
    await seedWishlists([
      makeWishlist({ id: 'wl-alice', ownerId: 'user-001', sharedWith: [contact] }),
      makeWishlist({ id: 'wl-alice-2', ownerId: 'user-001', sharedWith: [] }),
    ]);
    const result = await wishlistService.getSharedWishlists('user-002');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('wl-alice');
  });

  it('returns empty array when no wishlists are shared with the user', async () => {
    await seedWishlists([makeWishlist({ ownerId: 'user-001', sharedWith: [] })]);
    const result = await wishlistService.getSharedWishlists('user-002');
    expect(result).toEqual([]);
  });

  it('throws when userId is empty', async () => {
    await expect(wishlistService.getSharedWishlists('')).rejects.toThrow(/userId must be a non-empty string/);
  });
});

// ---------------------------------------------------------------------------
// getWishlistById
// ---------------------------------------------------------------------------
describe('wishlistService.getWishlistById', () => {
  it('returns the wishlist when found', async () => {
    const wl = makeWishlist({ id: 'wl-abc' });
    await seedWishlists([wl]);
    const result = await wishlistService.getWishlistById('wl-abc');
    expect(result).not.toBeNull();
    expect(result!.id).toBe('wl-abc');
  });

  it('returns null when wishlist is not found', async () => {
    await seedWishlists([makeWishlist()]);
    const result = await wishlistService.getWishlistById('wl-not-exist');
    expect(result).toBeNull();
  });

  it('throws when id is empty', async () => {
    await expect(wishlistService.getWishlistById('')).rejects.toThrow(/id must be a non-empty string/);
  });
});

// ---------------------------------------------------------------------------
// createWishlist (US-0007)
// ---------------------------------------------------------------------------
describe('wishlistService.createWishlist', () => {
  it('creates a wishlist and returns it with generated id and ISO date', async () => {
    const result = await wishlistService.createWishlist('Birthday Gifts', 'user-001');
    expect(result.name).toBe('Birthday Gifts');
    expect(result.ownerId).toBe('user-001');
    expect(result.id).toMatch(/^wl-/);
    expect(result.items).toEqual([]);
    expect(result.sharedWith).toEqual([]);
    expect(result.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('persists the new wishlist so subsequent reads include it', async () => {
    await wishlistService.createWishlist('List 1', 'user-001');
    await wishlistService.createWishlist('List 2', 'user-001');
    const all = await wishlistService.getWishlists('user-001');
    expect(all).toHaveLength(2);
  });

  it('trims whitespace from the name', async () => {
    const result = await wishlistService.createWishlist('  Trimmed  ', 'user-001');
    expect(result.name).toBe('Trimmed');
  });

  it('throws when name is empty', async () => {
    await expect(wishlistService.createWishlist('', 'user-001')).rejects.toThrow(/name must be a non-empty string/);
  });

  it('throws when ownerId is empty', async () => {
    await expect(wishlistService.createWishlist('List', '')).rejects.toThrow(/ownerId must be a non-empty string/);
  });
});

// ---------------------------------------------------------------------------
// deleteWishlist (US-0007)
// ---------------------------------------------------------------------------
describe('wishlistService.deleteWishlist', () => {
  it('removes the wishlist from storage', async () => {
    await seedWishlists([makeWishlist({ id: 'wl-del' }), makeWishlist({ id: 'wl-keep' })]);
    await wishlistService.deleteWishlist('wl-del');
    const remaining = await wishlistService.getWishlistById('wl-del');
    expect(remaining).toBeNull();
  });

  it('is a no-op when the id does not exist', async () => {
    await seedWishlists([makeWishlist({ id: 'wl-stay' })]);
    await expect(wishlistService.deleteWishlist('wl-not-exist')).resolves.toBeUndefined();
    const result = await wishlistService.getWishlistById('wl-stay');
    expect(result).not.toBeNull();
  });

  it('throws when id is empty', async () => {
    await expect(wishlistService.deleteWishlist('')).rejects.toThrow(/id must be a non-empty string/);
  });
});

// ---------------------------------------------------------------------------
// addItem (US-0008, AC-0042)
// ---------------------------------------------------------------------------
describe('wishlistService.addItem', () => {
  it('adds an item and returns the updated wishlist', async () => {
    await seedWishlists([makeWishlist({ id: 'wl-add' })]);
    const result = await wishlistService.addItem('wl-add', 'prod-001');
    expect(result).not.toBeNull();
    expect(result!.items).toHaveLength(1);
    expect(result!.items[0].productId).toBe('prod-001');
    expect(result!.items[0].claimedBy).toBeNull();
    expect(result!.items[0].note).toBeNull();
    expect(result!.items[0].addedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('AC-0042: returns unchanged wishlist without adding duplicate', async () => {
    await seedWishlists([
      makeWishlist({
        id: 'wl-dup',
        items: [{ productId: 'prod-001', addedAt: '2026-01-01T00:00:00.000Z', claimedBy: null, note: null }],
      }),
    ]);
    const result = await wishlistService.addItem('wl-dup', 'prod-001');
    expect(result).not.toBeNull();
    // Item count must still be 1
    expect(result!.items).toHaveLength(1);
    // setItem should NOT have been called again (storage unchanged)
    const setItemCallsBefore = (AsyncStorage.setItem as jest.Mock).mock.calls.length;
    await wishlistService.addItem('wl-dup', 'prod-001');
    const setItemCallsAfter = (AsyncStorage.setItem as jest.Mock).mock.calls.length;
    expect(setItemCallsAfter).toBe(setItemCallsBefore);
  });

  it('returns null when wishlist is not found', async () => {
    const result = await wishlistService.addItem('wl-missing', 'prod-001');
    expect(result).toBeNull();
  });

  it('throws when wishlistId is empty', async () => {
    await expect(wishlistService.addItem('', 'prod-001')).rejects.toThrow(/wishlistId must be a non-empty string/);
  });

  it('throws when productId is empty', async () => {
    await expect(wishlistService.addItem('wl-001', '')).rejects.toThrow(/productId must be a non-empty string/);
  });
});

// ---------------------------------------------------------------------------
// removeItem (US-0008)
// ---------------------------------------------------------------------------
describe('wishlistService.removeItem', () => {
  it('removes an existing item from the wishlist', async () => {
    await seedWishlists([
      makeWishlist({
        id: 'wl-rm',
        items: [
          { productId: 'prod-001', addedAt: '2026-01-01T00:00:00.000Z', claimedBy: null, note: null },
          { productId: 'prod-002', addedAt: '2026-01-01T00:00:00.000Z', claimedBy: null, note: null },
        ],
      }),
    ]);
    const result = await wishlistService.removeItem('wl-rm', 'prod-001');
    expect(result).not.toBeNull();
    expect(result!.items).toHaveLength(1);
    expect(result!.items[0].productId).toBe('prod-002');
  });

  it('is a no-op when productId is not in the wishlist', async () => {
    await seedWishlists([makeWishlist({ id: 'wl-noitem' })]);
    const result = await wishlistService.removeItem('wl-noitem', 'prod-999');
    expect(result).not.toBeNull();
    expect(result!.items).toHaveLength(0);
  });

  it('returns null when wishlist is not found', async () => {
    const result = await wishlistService.removeItem('wl-missing', 'prod-001');
    expect(result).toBeNull();
  });

  it('throws when wishlistId is empty', async () => {
    await expect(wishlistService.removeItem('', 'prod-001')).rejects.toThrow(/wishlistId must be a non-empty string/);
  });

  it('throws when productId is empty', async () => {
    await expect(wishlistService.removeItem('wl-001', '')).rejects.toThrow(/productId must be a non-empty string/);
  });
});

// ---------------------------------------------------------------------------
// shareWishlist (US-0010)
// ---------------------------------------------------------------------------
describe('wishlistService.shareWishlist', () => {
  const bob: SharedContact = {
    contactId: 'user-002',
    contactName: 'Bob',
    phone: '416-555-0102',
    sharedAt: '2026-01-02T00:00:00.000Z',
  };
  const carol: SharedContact = {
    contactId: 'user-003',
    contactName: 'Carol',
    phone: '416-555-0103',
    sharedAt: '2026-01-02T00:00:00.000Z',
  };

  it('adds new contacts to sharedWith', async () => {
    await seedWishlists([makeWishlist({ id: 'wl-share' })]);
    const result = await wishlistService.shareWishlist('wl-share', [bob]);
    expect(result).not.toBeNull();
    expect(result!.sharedWith).toHaveLength(1);
    expect(result!.sharedWith[0].contactId).toBe('user-002');
  });

  it('does not duplicate contacts already in sharedWith', async () => {
    await seedWishlists([makeWishlist({ id: 'wl-share-dup', sharedWith: [bob] })]);
    const result = await wishlistService.shareWishlist('wl-share-dup', [bob, carol]);
    expect(result).not.toBeNull();
    // bob was already there; only carol is new
    expect(result!.sharedWith).toHaveLength(2);
  });

  it('returns null when wishlist is not found', async () => {
    const result = await wishlistService.shareWishlist('wl-missing', [bob]);
    expect(result).toBeNull();
  });

  it('accepts an empty contacts array (no-op share)', async () => {
    await seedWishlists([makeWishlist({ id: 'wl-noshare' })]);
    const result = await wishlistService.shareWishlist('wl-noshare', []);
    expect(result).not.toBeNull();
    expect(result!.sharedWith).toHaveLength(0);
  });

  it('throws when wishlistId is empty', async () => {
    await expect(wishlistService.shareWishlist('', [bob])).rejects.toThrow(/wishlistId must be a non-empty string/);
  });

  it('throws when contacts is not an array', async () => {
    await expect(wishlistService.shareWishlist('wl-x', null as unknown as SharedContact[])).rejects.toThrow(
      /contacts must be an array/,
    );
  });
});

// ---------------------------------------------------------------------------
// claimItem (US-0012)
// ---------------------------------------------------------------------------
describe('wishlistService.claimItem', () => {
  it('sets claimedBy on an unclaimed item', async () => {
    await seedWishlists([
      makeWishlist({
        id: 'wl-claim',
        items: [{ productId: 'prod-001', addedAt: '2026-01-01T00:00:00.000Z', claimedBy: null, note: null }],
      }),
    ]);
    const result = await wishlistService.claimItem('wl-claim', 'prod-001', 'user-002');
    expect(result).not.toBeNull();
    expect(result!.items[0].claimedBy).toBe('user-002');
  });

  it('does not override a claim that already exists', async () => {
    await seedWishlists([
      makeWishlist({
        id: 'wl-already-claimed',
        items: [
          {
            productId: 'prod-001',
            addedAt: '2026-01-01T00:00:00.000Z',
            claimedBy: 'user-002',
            note: null,
          },
        ],
      }),
    ]);
    const result = await wishlistService.claimItem('wl-already-claimed', 'prod-001', 'user-003');
    expect(result).not.toBeNull();
    // Original claimer must remain
    expect(result!.items[0].claimedBy).toBe('user-002');
  });

  it('returns null when wishlist is not found', async () => {
    const result = await wishlistService.claimItem('wl-missing', 'prod-001', 'user-002');
    expect(result).toBeNull();
  });

  it('throws when wishlistId is empty', async () => {
    await expect(wishlistService.claimItem('', 'prod-001', 'user-002')).rejects.toThrow(
      /wishlistId must be a non-empty string/,
    );
  });

  it('throws when productId is empty', async () => {
    await expect(wishlistService.claimItem('wl-1', '', 'user-002')).rejects.toThrow(
      /productId must be a non-empty string/,
    );
  });

  it('throws when claimerId is empty', async () => {
    await expect(wishlistService.claimItem('wl-1', 'prod-001', '')).rejects.toThrow(
      /claimerId must be a non-empty string/,
    );
  });
});

// ---------------------------------------------------------------------------
// Error path coverage — loadWishlists catch branch (getItem rejection)
// ---------------------------------------------------------------------------
describe('wishlistService error paths', () => {
  it('getWishlists returns empty array when storage read throws', async () => {
    // storage.getItem swallows the rejection and returns null,
    // so wishlists defaults to [] and filter returns []
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('storage read error'));
    const result = await wishlistService.getWishlists('user-001');
    expect(result).toEqual([]);
  });

  it('getSharedWishlists returns empty array when storage read throws', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('storage read error'));
    const result = await wishlistService.getSharedWishlists('user-001');
    expect(result).toEqual([]);
  });

  it('getWishlistById returns null when storage read throws', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('storage read error'));
    const result = await wishlistService.getWishlistById('wl-any');
    expect(result).toBeNull();
  });

  it('addItem returns null when storage read throws (wishlist not found)', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('storage read error'));
    const result = await wishlistService.addItem('wl-any', 'prod-001');
    expect(result).toBeNull();
  });

  it('deleteWishlist resolves without error when storage read throws', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('storage read error'));
    await expect(wishlistService.deleteWishlist('wl-any')).resolves.toBeUndefined();
  });

  it('removeItem returns null when storage read throws', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('storage read error'));
    const result = await wishlistService.removeItem('wl-any', 'prod-001');
    expect(result).toBeNull();
  });

  it('shareWishlist returns null when storage read throws', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('storage read error'));
    const bob = {
      contactId: 'user-002',
      contactName: 'Bob',
      phone: '416-555-0102',
      sharedAt: '2026-01-02T00:00:00.000Z',
    };
    const result = await wishlistService.shareWishlist('wl-any', [bob]);
    expect(result).toBeNull();
  });

  it('claimItem returns null when storage read throws', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('storage read error'));
    const result = await wishlistService.claimItem('wl-any', 'prod-001', 'user-002');
    expect(result).toBeNull();
  });

  it('unclaimItem returns null when storage read throws', async () => {
    AsyncStorage.getItem.mockRejectedValueOnce(new Error('storage read error'));
    const result = await wishlistService.unclaimItem('wl-any', 'prod-001');
    expect(result).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// unclaimItem (US-0012)
// ---------------------------------------------------------------------------
describe('wishlistService.unclaimItem', () => {
  it('clears claimedBy on a claimed item', async () => {
    await seedWishlists([
      makeWishlist({
        id: 'wl-unclaim',
        items: [
          {
            productId: 'prod-001',
            addedAt: '2026-01-01T00:00:00.000Z',
            claimedBy: 'user-002',
            note: null,
          },
        ],
      }),
    ]);
    const result = await wishlistService.unclaimItem('wl-unclaim', 'prod-001');
    expect(result).not.toBeNull();
    expect(result!.items[0].claimedBy).toBeNull();
  });

  it('is a no-op when item is already unclaimed', async () => {
    await seedWishlists([
      makeWishlist({
        id: 'wl-not-claimed',
        items: [{ productId: 'prod-001', addedAt: '2026-01-01T00:00:00.000Z', claimedBy: null, note: null }],
      }),
    ]);
    const result = await wishlistService.unclaimItem('wl-not-claimed', 'prod-001');
    expect(result!.items[0].claimedBy).toBeNull();
  });

  it('returns null when wishlist is not found', async () => {
    const result = await wishlistService.unclaimItem('wl-missing', 'prod-001');
    expect(result).toBeNull();
  });

  it('throws when wishlistId is empty', async () => {
    await expect(wishlistService.unclaimItem('', 'prod-001')).rejects.toThrow(/wishlistId must be a non-empty string/);
  });

  it('throws when productId is empty', async () => {
    await expect(wishlistService.unclaimItem('wl-1', '')).rejects.toThrow(/productId must be a non-empty string/);
  });
});
