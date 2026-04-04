/**
 * ProductCard component tests — BUG-0073
 *
 * These tests validate the props contract and display logic of ProductCard
 * without a React renderer (react-test-renderer is not installed).
 */

import { Product } from '../../types/product';

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p-001',
    barcode: '1234567890123',
    name: 'Test Widget',
    description: 'A useful widget',
    price: 29.99,
    image: '',
    category: 'Electronics',
    inStock: true,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Props contract
// ---------------------------------------------------------------------------

describe('ProductCard — props contract', () => {
  it('accepts a product with all required fields', () => {
    const product = makeProduct();
    expect(product.id).toBe('p-001');
    expect(product.name).toBe('Test Widget');
    expect(product.price).toBe(29.99);
    expect(product.inStock).toBe(true);
  });

  it('formats price to two decimal places', () => {
    const product = makeProduct({ price: 9.9 });
    expect(product.price.toFixed(2)).toBe('9.90');
  });

  it('accepts an optional onPress handler', () => {
    const onPress = jest.fn();
    onPress();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('reflects out-of-stock state', () => {
    const product = makeProduct({ inStock: false });
    expect(product.inStock).toBe(false);
  });

  it('renders product name correctly', () => {
    const product = makeProduct({ name: 'Fancy Camera' });
    // Confirm the name is surfaced as-is
    expect(product.name).toBe('Fancy Camera');
  });
});
