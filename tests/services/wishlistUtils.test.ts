/**
 * Unit tests for utils/wishlistUtils
 *
 * Coverage targets:
 *   US-004-003 AC-004-003-001 — getTotalPrice: sum product prices in wishlist
 */

import { getTotalPrice } from '../../utils/wishlistUtils';
import { Wishlist } from '../../types/wishlist';
import { Product } from '../../types/product';

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

function makeWishlist(productIds: string[]): Wishlist {
  return {
    id: 'wl-test',
    name: 'Test',
    ownerId: 'user-001',
    createdAt: '2026-01-01T00:00:00.000Z',
    items: productIds.map((id) => ({
      productId: id,
      addedAt: '2026-01-01T00:00:00.000Z',
      claimedBy: null,
      note: null,
    })),
    sharedWith: [],
  };
}

function makeProduct(id: string, price: number): Product {
  return {
    id,
    barcode: `000-${id}`,
    name: `Product ${id}`,
    description: '',
    price,
    image: 'placeholder',
    category: 'cat-test',
    inStock: true,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('getTotalPrice', () => {
  it('AC-004-003-001: returns 0 for an empty wishlist', () => {
    const total = getTotalPrice(makeWishlist([]), [makeProduct('prod-1', 10)]);
    expect(total).toBe(0);
  });

  it('AC-004-003-001: returns the price of a single item', () => {
    const total = getTotalPrice(makeWishlist(['prod-1']), [makeProduct('prod-1', 29.99)]);
    expect(total).toBe(29.99);
  });

  it('AC-004-003-001: sums prices of multiple items', () => {
    const products = [makeProduct('prod-1', 89.99), makeProduct('prod-2', 24.99), makeProduct('prod-3', 14.99)];
    const total = getTotalPrice(makeWishlist(['prod-1', 'prod-2', 'prod-3']), products);
    expect(total).toBe(129.97);
  });

  it('returns 0 for a product that is not in the catalogue', () => {
    const total = getTotalPrice(makeWishlist(['prod-unknown']), [makeProduct('prod-1', 100)]);
    expect(total).toBe(0);
  });

  it('handles a mix of known and unknown products gracefully', () => {
    const products = [makeProduct('prod-1', 50)];
    const total = getTotalPrice(makeWishlist(['prod-1', 'prod-unknown']), products);
    expect(total).toBe(50);
  });

  it('returns 0 when product catalogue is empty', () => {
    const total = getTotalPrice(makeWishlist(['prod-1', 'prod-2']), []);
    expect(total).toBe(0);
  });

  it('rounds to two decimal places', () => {
    // 0.1 + 0.2 in floating point = 0.30000000000000004
    const products = [makeProduct('p1', 0.1), makeProduct('p2', 0.2)];
    const total = getTotalPrice(makeWishlist(['p1', 'p2']), products);
    expect(total).toBe(0.3);
  });

  it('works correctly with real product data values (Mastercraft Drill + Screwdriver)', () => {
    const products = [makeProduct('prod-001', 89.99), makeProduct('prod-002', 24.99)];
    const total = getTotalPrice(makeWishlist(['prod-001', 'prod-002']), products);
    expect(total).toBe(114.98);
  });
});
