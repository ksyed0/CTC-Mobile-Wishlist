export interface WishlistItem {
  productId: string;
  addedAt: string;
  claimedBy: string | null;
  note: string | null;
}

export interface SharedContact {
  contactId: string;
  contactName: string;
  phone: string;
  sharedAt: string;
}

export interface Wishlist {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  items: WishlistItem[];
  sharedWith: SharedContact[];
  showClaimers?: boolean; // US-0021 — default false when absent
  privacy?: 'private' | 'contacts' | 'public'; // US-0024 — default 'contacts' when absent
}
