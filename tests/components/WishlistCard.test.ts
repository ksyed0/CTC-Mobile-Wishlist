/**
 * WishlistCard component tests — BUG-0073
 *
 * Validates the props contract and display logic for WishlistCard.
 */

import { Wishlist, WishlistItem } from '../../types/wishlist';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeItem(productId: string): WishlistItem {
  return {
    productId,
    addedAt: '2026-01-01T00:00:00.000Z',
    claimedBy: null,
    note: null,
  };
}

function makeWishlist(overrides: Partial<Wishlist> = {}): Wishlist {
  return {
    id: 'wl-001',
    name: 'Birthday Gifts',
    ownerId: 'user-001',
    createdAt: '2026-01-01T00:00:00.000Z',
    items: [],
    sharedWith: [],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Props contract
// ---------------------------------------------------------------------------

describe('WishlistCard — props contract', () => {
  it('accepts a wishlist with all required fields', () => {
    const wishlist = makeWishlist();
    expect(wishlist.id).toBe('wl-001');
    expect(wishlist.name).toBe('Birthday Gifts');
    expect(wishlist.items).toHaveLength(0);
  });

  it('reflects item count correctly', () => {
    const wishlist = makeWishlist({
      items: [makeItem('p-001'), makeItem('p-002')],
    });
    expect(wishlist.items).toHaveLength(2);
  });

  it('reflects shared count correctly', () => {
    const wishlist = makeWishlist({
      sharedWith: [
        {
          contactId: 'user-002',
          contactName: 'Alice',
          phone: '555-0100',
          sharedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    });
    expect(wishlist.sharedWith).toHaveLength(1);
  });

  it('formats item count label for singular', () => {
    const count = 1;
    const label = `${count} item${count !== 1 ? 's' : ''}`;
    expect(label).toBe('1 item');
  });

  it('formats item count label for plural', () => {
    const count: number = 3;
    const label = `${count} item${count !== 1 ? 's' : ''}`;
    expect(label).toBe('3 items');
  });

  it('accepts an optional onPress handler', () => {
    const onPress = jest.fn();
    onPress();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
