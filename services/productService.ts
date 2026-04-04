import { Product, Category } from '../types/product';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';

const products: Product[] = productsData as Product[];
const categories: Category[] = categoriesData as Category[];

export const productService = {
  async getProducts(category?: string): Promise<Product[]> {
    if (!category) {
      return products;
    }
    return products.filter((p) => p.category === category);
  },

  async getProductById(id: string): Promise<Product | null> {
    return products.find((p) => p.id === id) ?? null;
  },

  async getByBarcode(barcode: string): Promise<Product | null> {
    return products.find((p) => p.barcode === barcode) ?? null;
  },

  async search(query: string): Promise<Product[]> {
    const lower = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
    );
  },

  async getCategories(): Promise<Category[]> {
    return categories;
  },
};
