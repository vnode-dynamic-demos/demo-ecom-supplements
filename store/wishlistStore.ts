'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface WishlistStore {
    items: Product[];
    toggle: (product: Product) => void;
    remove: (productId: string) => void;
    isWishlisted: (productId: string) => boolean;
    clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],

            toggle: (product) => {
                const exists = get().items.find(i => i.id === product.id);
                if (exists) {
                    set(s => ({ items: s.items.filter(i => i.id !== product.id) }));
                } else {
                    set(s => ({ items: [...s.items, product] }));
                }
            },

            remove: (productId) => set(s => ({ items: s.items.filter(i => i.id !== productId) })),

            isWishlisted: (productId) => !!get().items.find(i => i.id === productId),

            clear: () => set({ items: [] }),
        }),
        { name: 'vnode-wishlist' }
    )
);
