import { Wishlist } from '../types/wishlist';
import { Product } from '../types/product';

/**
 * Calculate the total price of all items in a wishlist.
 *
 * AC-0027: The total price is the sum of the prices of every product whose
 * productId appears in the wishlist.  Products not found in the catalogue
 * contribute $0 so a partial catalogue never crashes the calculation.
 *
 * @param wishlist  The wishlist whose items should be summed.
 * @param products  Full product catalogue used for price look-up.
 * @returns         Total price rounded to two decimal places.
 */
export function getTotalPrice(wishlist: Wishlist, products: Product[]): number {
  const productMap = new Map<string, number>(products.map((p) => [p.id, p.price]));

  const raw = wishlist.items.reduce((sum, item) => {
    const price = productMap.get(item.productId) ?? 0;
    return sum + price;
  }, 0);

  // Round to two decimal places to avoid floating-point drift
  return Math.round(raw * 100) / 100;
}
