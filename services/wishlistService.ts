import { Wishlist, WishlistItem, SharedContact } from '../types/wishlist';
import { StorageKeys, getItem, setItem } from '../utils/storage';

async function loadWishlists(): Promise<Wishlist[]> {
  const stored = await getItem<Wishlist[]>(StorageKeys.WISHLISTS);
  return stored ?? [];
}

async function saveWishlists(wishlists: Wishlist[]): Promise<void> {
  await setItem(StorageKeys.WISHLISTS, wishlists);
}

function generateId(): string {
  return `wl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const wishlistService = {
  async getWishlists(userId: string): Promise<Wishlist[]> {
    const all = await loadWishlists();
    return all.filter((w) => w.ownerId === userId);
  },

  async getSharedWishlists(userId: string): Promise<Wishlist[]> {
    const all = await loadWishlists();
    return all.filter((w) =>
      w.sharedWith.some((s) => s.contactId === userId)
    );
  },

  async getWishlistById(id: string): Promise<Wishlist | null> {
    const all = await loadWishlists();
    return all.find((w) => w.id === id) ?? null;
  },

  async createWishlist(name: string, ownerId: string): Promise<Wishlist> {
    const all = await loadWishlists();
    const newWishlist: Wishlist = {
      id: generateId(),
      name,
      ownerId,
      createdAt: new Date().toISOString(),
      items: [],
      sharedWith: [],
    };
    await saveWishlists([...all, newWishlist]);
    return newWishlist;
  },

  async deleteWishlist(id: string): Promise<void> {
    const all = await loadWishlists();
    await saveWishlists(all.filter((w) => w.id !== id));
  },

  async addItem(wishlistId: string, productId: string): Promise<Wishlist | null> {
    const all = await loadWishlists();
    const idx = all.findIndex((w) => w.id === wishlistId);
    if (idx === -1) return null;

    const wishlist = all[idx];
    const alreadyExists = wishlist.items.some((i) => i.productId === productId);
    if (alreadyExists) return wishlist;

    const newItem: WishlistItem = {
      productId,
      addedAt: new Date().toISOString(),
      claimedBy: null,
      note: null,
    };

    const updated: Wishlist = {
      ...wishlist,
      items: [...wishlist.items, newItem],
    };
    const updatedAll = [...all];
    updatedAll[idx] = updated;
    await saveWishlists(updatedAll);
    return updated;
  },

  async removeItem(wishlistId: string, productId: string): Promise<Wishlist | null> {
    const all = await loadWishlists();
    const idx = all.findIndex((w) => w.id === wishlistId);
    if (idx === -1) return null;

    const wishlist = all[idx];
    const updated: Wishlist = {
      ...wishlist,
      items: wishlist.items.filter((i) => i.productId !== productId),
    };
    const updatedAll = [...all];
    updatedAll[idx] = updated;
    await saveWishlists(updatedAll);
    return updated;
  },

  async shareWishlist(
    wishlistId: string,
    contacts: SharedContact[]
  ): Promise<Wishlist | null> {
    const all = await loadWishlists();
    const idx = all.findIndex((w) => w.id === wishlistId);
    if (idx === -1) return null;

    const wishlist = all[idx];
    const existingIds = new Set(wishlist.sharedWith.map((s) => s.contactId));
    const newContacts = contacts.filter((c) => !existingIds.has(c.contactId));

    const updated: Wishlist = {
      ...wishlist,
      sharedWith: [...wishlist.sharedWith, ...newContacts],
    };
    const updatedAll = [...all];
    updatedAll[idx] = updated;
    await saveWishlists(updatedAll);
    return updated;
  },

  async claimItem(
    wishlistId: string,
    productId: string,
    claimerId: string
  ): Promise<Wishlist | null> {
    const all = await loadWishlists();
    const idx = all.findIndex((w) => w.id === wishlistId);
    if (idx === -1) return null;

    const wishlist = all[idx];
    const updated: Wishlist = {
      ...wishlist,
      items: wishlist.items.map((item) =>
        item.productId === productId && item.claimedBy === null
          ? { ...item, claimedBy: claimerId }
          : item
      ),
    };
    const updatedAll = [...all];
    updatedAll[idx] = updated;
    await saveWishlists(updatedAll);
    return updated;
  },

  async unclaimItem(
    wishlistId: string,
    productId: string
  ): Promise<Wishlist | null> {
    const all = await loadWishlists();
    const idx = all.findIndex((w) => w.id === wishlistId);
    if (idx === -1) return null;

    const wishlist = all[idx];
    const updated: Wishlist = {
      ...wishlist,
      items: wishlist.items.map((item) =>
        item.productId === productId ? { ...item, claimedBy: null } : item
      ),
    };
    const updatedAll = [...all];
    updatedAll[idx] = updated;
    await saveWishlists(updatedAll);
    return updated;
  },
};
