import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Wishlist, SharedContact } from '../types/wishlist';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

interface WishlistContextValue {
  wishlists: Wishlist[];
  sharedWishlists: Wishlist[];
  isLoading: boolean;
  createWishlist: (name: string) => Promise<Wishlist | null>;
  deleteWishlist: (id: string) => Promise<void>;
  addItem: (wishlistId: string, productId: string) => Promise<void>;
  removeItem: (wishlistId: string, productId: string) => Promise<void>;
  shareWishlist: (wishlistId: string, contacts: SharedContact[]) => Promise<void>;
  claimItem: (wishlistId: string, productId: string) => Promise<void>;
  unclaimItem: (wishlistId: string, productId: string) => Promise<void>;
  getWishlistById: (id: string) => Promise<Wishlist | null>;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [sharedWishlists, setSharedWishlists] = useState<Wishlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    if (!currentUser || currentUser.id === 'guest') {
      setWishlists([]);
      setSharedWishlists([]);
      return;
    }
    setIsLoading(true);
    try {
      const [owned, shared] = await Promise.all([
        wishlistService.getWishlists(currentUser.id),
        wishlistService.getSharedWishlists(currentUser.id),
      ]);
      setWishlists(owned);
      setSharedWishlists(shared);
    } catch (error) {
      console.error('[WishlistContext] Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    load();
  }, [load]);

  async function createWishlist(name: string): Promise<Wishlist | null> {
    if (!currentUser || currentUser.id === 'guest') return null;
    const newWishlist = await wishlistService.createWishlist(name, currentUser.id);
    setWishlists((prev) => [...prev, newWishlist]);
    return newWishlist;
  }

  async function deleteWishlist(id: string): Promise<void> {
    await wishlistService.deleteWishlist(id);
    setWishlists((prev) => prev.filter((w) => w.id !== id));
  }

  async function addItem(wishlistId: string, productId: string): Promise<void> {
    const updated = await wishlistService.addItem(wishlistId, productId);
    if (updated) {
      setWishlists((prev) => prev.map((w) => (w.id === wishlistId ? updated : w)));
    }
  }

  async function removeItem(wishlistId: string, productId: string): Promise<void> {
    const updated = await wishlistService.removeItem(wishlistId, productId);
    if (updated) {
      setWishlists((prev) => prev.map((w) => (w.id === wishlistId ? updated : w)));
    }
  }

  async function shareWishlist(wishlistId: string, contacts: SharedContact[]): Promise<void> {
    const updated = await wishlistService.shareWishlist(wishlistId, contacts);
    if (updated) {
      setWishlists((prev) => prev.map((w) => (w.id === wishlistId ? updated : w)));
    }
  }

  async function claimItem(wishlistId: string, productId: string): Promise<void> {
    if (!currentUser) return;
    const updated = await wishlistService.claimItem(wishlistId, productId, currentUser.id);
    if (updated) {
      setSharedWishlists((prev) => prev.map((w) => (w.id === wishlistId ? updated : w)));
    }
  }

  async function unclaimItem(wishlistId: string, productId: string): Promise<void> {
    const updated = await wishlistService.unclaimItem(wishlistId, productId);
    if (updated) {
      setSharedWishlists((prev) => prev.map((w) => (w.id === wishlistId ? updated : w)));
    }
  }

  async function getWishlistById(id: string): Promise<Wishlist | null> {
    return wishlistService.getWishlistById(id);
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlists,
        sharedWishlists,
        isLoading,
        createWishlist,
        deleteWishlist,
        addItem,
        removeItem,
        shareWishlist,
        claimItem,
        unclaimItem,
        getWishlistById,
        refresh: load,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlists(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlists must be used within a WishlistProvider');
  }
  return ctx;
}
