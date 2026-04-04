import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { Product, Category } from '../types/product';
import { productService } from '../services/productService';

interface ProductContextValue {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  filteredProducts: Product[];
  getProductById: (id: string) => Promise<Product | null>;
  getByBarcode: (barcode: string) => Promise<Product | null>;
  search: (query: string) => Promise<Product[]>;
  refresh: () => Promise<void>;
}

const ProductContext = createContext<ProductContextValue | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  async function load() {
    setIsLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      console.error('[ProductContext] Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function getProductById(id: string): Promise<Product | null> {
    return productService.getProductById(id);
  }

  async function getByBarcode(barcode: string): Promise<Product | null> {
    return productService.getByBarcode(barcode);
  }

  async function search(query: string): Promise<Product[]> {
    return productService.search(query);
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        isLoading,
        selectedCategory,
        setSelectedCategory,
        filteredProducts,
        getProductById,
        getByBarcode,
        search,
        refresh: load,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts(): ProductContextValue {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return ctx;
}
