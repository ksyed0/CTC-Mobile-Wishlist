import { Wishlist, WishlistItem, SharedContact } from '../types/wishlist';
import { StorageKeys, getItem, setItem, removeItem } from '../utils/storage';

async function loadWishlists(): Promise<Wishlist[]> {
  try {
    const stored = await getItem<Wishlist[]>(StorageKeys.WISHLISTS);
    return stored ?? [];
  } catch (error) {
    console.error('[wishlistService] loadWishlists error:', error);
    return [];
  }
}

async function saveWishlists(wishlists: Wishlist[]): Promise<void> {
  try {
    await setItem(StorageKeys.WISHLISTS, wishlists);
  } catch (error) {
    console.error('[wishlistService] saveWishlists error:', error);
    throw new Error('[wishlistService] Failed to persist wishlists');
  }
}

function generateId(): string {
  return `wl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const wishlistService = {
  /**
   * Return all wishlists owned by the given user.
   */
  async getWishlists(userId: string): Promise<Wishlist[]> {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('[wishlistService] getWishlists: userId must be a non-empty string');
    }
    const all = await loadWishlists();
    return all.filter((w) => w.ownerId === userId);
  },

  /**
   * Return all wishlists that have been shared with the given user (US-005-001).
   * Used in the share/claim demo flow.
   */
  async getSharedWishlists(userId: string): Promise<Wishlist[]> {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('[wishlistService] getSharedWishlists: userId must be a non-empty string');
    }
    const all = await loadWishlists();
    return all.filter((w) => w.sharedWith.some((s) => s.contactId === userId));
  },

  /**
   * Return a single wishlist by id, or null if not found.
   */
  async getWishlistById(id: string): Promise<Wishlist | null> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('[wishlistService] getWishlistById: id must be a non-empty string');
    }
    const all = await loadWishlists();
    return all.find((w) => w.id === id) ?? null;
  },

  /**
   * Create a new wishlist for the given owner (US-004-001).
   */
  async createWishlist(name: string, ownerId: string): Promise<Wishlist> {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new Error('[wishlistService] createWishlist: name must be a non-empty string');
    }
    if (!ownerId || typeof ownerId !== 'string' || ownerId.trim() === '') {
      throw new Error('[wishlistService] createWishlist: ownerId must be a non-empty string');
    }
    const all = await loadWishlists();
    const newWishlist: Wishlist = {
      id: generateId(),
      name: name.trim(),
      ownerId,
      createdAt: new Date().toISOString(),
      items: [],
      sharedWith: [],
    };
    await saveWishlists([...all, newWishlist]);
    return newWishlist;
  },

  /**
   * Permanently delete a wishlist by id.
   * If the id does not exist this is a no-op (idempotent).
   */
  async deleteWishlist(id: string): Promise<void> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('[wishlistService] deleteWishlist: id must be a non-empty string');
    }
    const all = await loadWishlists();
    await saveWishlists(all.filter((w) => w.id !== id));
  },

  /**
   * Add a product to a wishlist (US-004-002).
   *
   * AC-004-002-004: If the productId already exists in the wishlist this method
   * returns the unchanged wishlist — it never creates a duplicate entry.
   *
   * Returns null when the wishlistId is not found.
   */
  async addItem(wishlistId: string, productId: string): Promise<Wishlist | null> {
    if (!wishlistId || typeof wishlistId !== 'string' || wishlistId.trim() === '') {
      throw new Error('[wishlistService] addItem: wishlistId must be a non-empty string');
    }
    if (!productId || typeof productId !== 'string' || productId.trim() === '') {
      throw new Error('[wishlistService] addItem: productId must be a non-empty string');
    }

    const all = await loadWishlists();
    const idx = all.findIndex((w) => w.id === wishlistId);
    if (idx === -1) return null;

    const wishlist = all[idx];

    // AC-004-002-004: guard against duplicates — return early without persisting
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

  /**
   * Remove an item from a wishlist.
   * If the productId is not in the wishlist this is a no-op.
   * Returns null when the wishlistId is not found.
   */
  async removeItem(wishlistId: string, productId: string): Promise<Wishlist | null> {
    if (!wishlistId || typeof wishlistId !== 'string' || wishlistId.trim() === '') {
      throw new Error('[wishlistService] removeItem: wishlistId must be a non-empty string');
    }
    if (!productId || typeof productId !== 'string' || productId.trim() === '') {
      throw new Error('[wishlistService] removeItem: productId must be a non-empty string');
    }

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

  /**
   * Share a wishlist with one or more contacts (US-005-001).
   * Already-shared contacts are silently de-duplicated.
   * Returns null when the wishlistId is not found.
   */
  async shareWishlist(wishlistId: string, contacts: SharedContact[]): Promise<Wishlist | null> {
    if (!wishlistId || typeof wishlistId !== 'string' || wishlistId.trim() === '') {
      throw new Error('[wishlistService] shareWishlist: wishlistId must be a non-empty string');
    }
    if (!Array.isArray(contacts)) {
      throw new Error('[wishlistService] shareWishlist: contacts must be an array');
    }

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

  /**
   * Claim a wishlist item on behalf of a contact (US-005-003).
   * Only claims items whose claimedBy is currently null — already-claimed
   * items are left unchanged so a second caller cannot override a claim.
   * Returns null when the wishlistId is not found.
   */
  async claimItem(wishlistId: string, productId: string, claimerId: string): Promise<Wishlist | null> {
    if (!wishlistId || typeof wishlistId !== 'string' || wishlistId.trim() === '') {
      throw new Error('[wishlistService] claimItem: wishlistId must be a non-empty string');
    }
    if (!productId || typeof productId !== 'string' || productId.trim() === '') {
      throw new Error('[wishlistService] claimItem: productId must be a non-empty string');
    }
    if (!claimerId || typeof claimerId !== 'string' || claimerId.trim() === '') {
      throw new Error('[wishlistService] claimItem: claimerId must be a non-empty string');
    }

    const all = await loadWishlists();
    const idx = all.findIndex((w) => w.id === wishlistId);
    if (idx === -1) return null;

    const wishlist = all[idx];
    const updated: Wishlist = {
      ...wishlist,
      items: wishlist.items.map((item) =>
        item.productId === productId && item.claimedBy === null ? { ...item, claimedBy: claimerId } : item,
      ),
    };
    const updatedAll = [...all];
    updatedAll[idx] = updated;
    await saveWishlists(updatedAll);
    return updated;
  },

  /**
   * Remove a claim from a wishlist item (US-005-003).
   * Returns null when the wishlistId is not found.
   */
  async unclaimItem(wishlistId: string, productId: string): Promise<Wishlist | null> {
    if (!wishlistId || typeof wishlistId !== 'string' || wishlistId.trim() === '') {
      throw new Error('[wishlistService] unclaimItem: wishlistId must be a non-empty string');
    }
    if (!productId || typeof productId !== 'string' || productId.trim() === '') {
      throw new Error('[wishlistService] unclaimItem: productId must be a non-empty string');
    }

    const all = await loadWishlists();
    const idx = all.findIndex((w) => w.id === wishlistId);
    if (idx === -1) return null;

    const wishlist = all[idx];
    const updated: Wishlist = {
      ...wishlist,
      items: wishlist.items.map((item) => (item.productId === productId ? { ...item, claimedBy: null } : item)),
    };
    const updatedAll = [...all];
    updatedAll[idx] = updated;
    await saveWishlists(updatedAll);
    return updated;
  },

  /**
   * Set or clear the note on a wishlist item (US-007-001).
   * Passing empty string clears the note (sets null).
   * No-op when wishlistId or productId is not found.
   */
  async updateItemNote(wishlistId: string, productId: string, note: string): Promise<void> {
    const all = await loadWishlists();
    const idx = all.findIndex((w) => w.id === wishlistId);
    if (idx === -1) return;
    const wishlist = all[idx];
    const updated: Wishlist = {
      ...wishlist,
      items: wishlist.items.map((item) =>
        item.productId === productId ? { ...item, note: note.trim() === '' ? null : note.trim() } : item,
      ),
    };
    const updatedAll = [...all];
    updatedAll[idx] = updated;
    await saveWishlists(updatedAll);
  },

  /**
   * Rename a wishlist (US-007-004).
   * No-op when wishlistId is not found or newName trims to empty.
   */
  async renameWishlist(wishlistId: string, newName: string): Promise<void> {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const all = await loadWishlists();
    const idx = all.findIndex((w) => w.id === wishlistId);
    if (idx === -1) return;
    const updatedAll = [...all];
    updatedAll[idx] = { ...all[idx], name: trimmed };
    await saveWishlists(updatedAll);
  },

  /**
   * Clear all wishlists and recent scans from storage (US-007-003 demo reset).
   */
  async resetDemoData(): Promise<void> {
    await Promise.all([removeItem(StorageKeys.WISHLISTS), removeItem(StorageKeys.RECENT_SCANS)]);
  },

  /**
   * Toggle the showClaimers flag on a wishlist (US-007-006).
   * No-op when wishlistId is not found.
   */
  async setShowClaimers(wishlistId: string, show: boolean): Promise<void> {
    const all = await loadWishlists();
    const idx = all.findIndex((w) => w.id === wishlistId);
    if (idx === -1) return;
    const updatedAll = [...all];
    updatedAll[idx] = { ...all[idx], showClaimers: show };
    await saveWishlists(updatedAll);
  },

  /**
   * Set the privacy level on a wishlist (US-007-009).
   * No-op when wishlistId is not found.
   */
  async setPrivacy(wishlistId: string, privacy: 'private' | 'contacts' | 'public'): Promise<void> {
    const all = await loadWishlists();
    const idx = all.findIndex((w) => w.id === wishlistId);
    if (idx === -1) return;
    const updatedAll = [...all];
    updatedAll[idx] = { ...all[idx], privacy };
    await saveWishlists(updatedAll);
  },
};
