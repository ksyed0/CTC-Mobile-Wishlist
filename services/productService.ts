import { Product, Category } from '../types/product';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';

const products: Product[] = productsData as Product[];
const categories: Category[] = categoriesData as Category[];

export const productService = {
  /**
   * Return all products, optionally filtered by category id.
   * Returns an empty array when the category matches nothing — never throws.
   */
  async getProducts(category?: string): Promise<Product[]> {
    try {
      if (!category) {
        return products;
      }
      return products.filter((p) => p.category === category);
    } catch (error) {
      console.error('[productService] getProducts error:', error);
      return [];
    }
  },

  /**
   * Return a single product by its id, or null if not found.
   * Throws a structured error only when the id argument is falsy.
   */
  async getProductById(id: string): Promise<Product | null> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('[productService] getProductById: id must be a non-empty string');
    }
    try {
      return products.find((p) => p.id === id) ?? null;
    } catch (error) {
      console.error('[productService] getProductById error:', error);
      return null;
    }
  },

  /**
   * Look up a product by its EAN barcode string.
   * Returns null for any barcode that has no matching product (AC-0019).
   * Returns the matching product for a recognised barcode (AC-0041).
   */
  async getByBarcode(barcode: string): Promise<Product | null> {
    if (!barcode || typeof barcode !== 'string' || barcode.trim() === '') {
      throw new Error('[productService] getByBarcode: barcode must be a non-empty string');
    }
    try {
      return products.find((p) => p.barcode === barcode) ?? null;
    } catch (error) {
      console.error('[productService] getByBarcode error:', error);
      return null;
    }
  },

  /**
   * Full-text search across product name and description.
   * Returns an empty array for blank queries or no matches — never throws.
   */
  async search(query: string): Promise<Product[]> {
    if (!query || typeof query !== 'string') {
      return [];
    }
    const trimmed = query.trim();
    if (trimmed === '') {
      return [];
    }
    try {
      const lower = trimmed.toLowerCase();
      return products.filter(
        (p) => p.name.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower),
      );
    } catch (error) {
      console.error('[productService] search error:', error);
      return [];
    }
  },

  /**
   * Return the full list of product categories.
   */
  async getCategories(): Promise<Category[]> {
    try {
      return categories;
    } catch (error) {
      console.error('[productService] getCategories error:', error);
      return [];
    }
  },
};
