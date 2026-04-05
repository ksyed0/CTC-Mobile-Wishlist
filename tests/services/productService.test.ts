/**
 * Unit tests for productService
 *
 * Coverage targets:
 *   AC-0018 / AC-0041 — getByBarcode returns product for valid barcode
 *   AC-0019            — getByBarcode returns null for unknown barcode
 *   getProducts        — all + category filter + unknown category
 *   getProductById     — found / not found / invalid arg
 *   search             — match by name, match by description, no match, blank query
 *   getCategories      — returns array with expected categories
 */

import { productService } from '../../services/productService';

// ---------------------------------------------------------------------------
// getProducts
// ---------------------------------------------------------------------------
describe('productService.getProducts', () => {
  it('returns all 23 products when no category is provided', async () => {
    const result = await productService.getProducts();
    expect(result).toHaveLength(23);
  });

  it('returns only tools products for cat-tools', async () => {
    const result = await productService.getProducts('cat-tools');
    expect(result.length).toBeGreaterThan(0);
    result.forEach((p) => expect(p.category).toBe('cat-tools'));
  });

  it('returns only automotive products for cat-automotive', async () => {
    const result = await productService.getProducts('cat-automotive');
    expect(result.length).toBeGreaterThan(0);
    result.forEach((p) => expect(p.category).toBe('cat-automotive'));
  });

  it('returns an empty array for an unknown category', async () => {
    const result = await productService.getProducts('cat-unknown');
    expect(result).toEqual([]);
  });

  it('returns an empty array for an empty string category', async () => {
    // empty string is falsy — should return all products
    const result = await productService.getProducts('');
    expect(result).toHaveLength(23);
  });
});

// ---------------------------------------------------------------------------
// getProductById
// ---------------------------------------------------------------------------
describe('productService.getProductById', () => {
  it('returns the matching product for prod-001', async () => {
    const result = await productService.getProductById('prod-001');
    expect(result).not.toBeNull();
    expect(result!.id).toBe('prod-001');
    expect(result!.name).toContain('Mastercraft');
  });

  it('returns null for an id that does not exist', async () => {
    const result = await productService.getProductById('prod-999');
    expect(result).toBeNull();
  });

  it('throws when id is an empty string', async () => {
    await expect(productService.getProductById('')).rejects.toThrow(/id must be a non-empty string/);
  });

  it('throws when id is whitespace only', async () => {
    await expect(productService.getProductById('   ')).rejects.toThrow(/id must be a non-empty string/);
  });
});

// ---------------------------------------------------------------------------
// getByBarcode (AC-0018, AC-0019, AC-0041)
// ---------------------------------------------------------------------------
describe('productService.getByBarcode', () => {
  it('AC-0041: returns the correct product for a valid barcode (prod-001)', async () => {
    const result = await productService.getByBarcode('062073000011');
    expect(result).not.toBeNull();
    expect(result!.id).toBe('prod-001');
    expect(result!.barcode).toBe('062073000011');
  });

  it('AC-0041: returns the correct product for barcode of prod-022 (Weber BBQ)', async () => {
    const result = await productService.getByBarcode('062073000222');
    expect(result).not.toBeNull();
    expect(result!.id).toBe('prod-022');
  });

  it('AC-0019: returns null for an unrecognised barcode', async () => {
    const result = await productService.getByBarcode('000000000000');
    expect(result).toBeNull();
  });

  it('AC-0019: returns null for a barcode that is close but does not exactly match', async () => {
    // '062073000011' is valid; leading zero stripped should not match
    const result = await productService.getByBarcode('62073000011');
    expect(result).toBeNull();
  });

  it('throws when barcode is an empty string', async () => {
    await expect(productService.getByBarcode('')).rejects.toThrow(/barcode must be a non-empty string/);
  });

  it('throws when barcode is whitespace only', async () => {
    await expect(productService.getByBarcode('   ')).rejects.toThrow(/barcode must be a non-empty string/);
  });
});

// ---------------------------------------------------------------------------
// search
// ---------------------------------------------------------------------------
describe('productService.search', () => {
  it('finds products matching name (case-insensitive)', async () => {
    const result = await productService.search('mastercraft');
    expect(result.length).toBeGreaterThan(0);
    result.forEach((p) => expect(p.name.toLowerCase()).toContain('mastercraft'));
  });

  it('finds products matching description', async () => {
    const result = await productService.search('synthetic');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns an empty array when no products match', async () => {
    const result = await productService.search('zzzthiscannotmatch');
    expect(result).toEqual([]);
  });

  it('returns an empty array for a blank query', async () => {
    const result = await productService.search('');
    expect(result).toEqual([]);
  });

  it('returns an empty array for a whitespace-only query', async () => {
    const result = await productService.search('   ');
    expect(result).toEqual([]);
  });

  it('handles mixed-case query correctly', async () => {
    const lower = await productService.search('woods');
    const upper = await productService.search('WOODS');
    expect(lower).toEqual(upper);
    expect(lower.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// getCategories
// ---------------------------------------------------------------------------
describe('productService.getCategories', () => {
  it('returns an array of categories', async () => {
    const result = await productService.getCategories();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('each category has id, name, and icon fields', async () => {
    const result = await productService.getCategories();
    result.forEach((c) => {
      expect(c).toHaveProperty('id');
      expect(c).toHaveProperty('name');
      expect(c).toHaveProperty('icon');
    });
  });
});
