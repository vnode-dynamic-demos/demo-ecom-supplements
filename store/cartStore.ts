'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartState } from '@/types';

// ─── Valid demo coupon codes ──────────────────────────────────────────────────
const COUPONS: Record<string, { type: 'percent' | 'flat'; value: number; label: string; min?: number }> = {
    VNODE10: { type: 'percent', value: 10, label: '10% Off Sitewide' },
    WELCOME20: { type: 'percent', value: 20, label: '20% Off First Order' },
    FLAT200: { type: 'flat', value: 200, label: '₹200 Off', min: 1500 },
    PROTEIN15: { type: 'percent', value: 15, label: '15% Off on Protein' },
    HYPER25: { type: 'percent', value: 25, label: '25% Mega Offer' },
};

interface CouponDiscount {
    code: string;
    type: 'percent' | 'flat';
    value: number;
    label: string;
}

interface ExtendedCartState extends CartState {
    coupon: CouponDiscount | null;
    applyCoupon: (code: string, subtotal: number) => { success: boolean; message: string };
    removeCoupon: () => void;
    discountAmount: (subtotal: number) => number;
    finalTotal: (subtotal: number) => number;
}

export const useCartStore = create<ExtendedCartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            coupon: null,

            addItem: (newItem) => {
                const existing = get().items.find((i) => i.variantId === newItem.variantId);
                if (existing) {
                    set((state) => ({
                        items: state.items.map((i) =>
                            i.variantId === newItem.variantId ? { ...i, quantity: i.quantity + 1 } : i
                        ),
                    }));
                } else {
                    set((state) => ({
                        items: [...state.items, { ...newItem, quantity: 1 }],
                    }));
                }
            },

            removeItem: (variantId) =>
                set((state) => ({
                    items: state.items.filter((i) => i.variantId !== variantId),
                })),

            updateQuantity: (variantId, quantity) => {
                if (quantity <= 0) { get().removeItem(variantId); return; }
                set((state) => ({
                    items: state.items.map((i) =>
                        i.variantId === variantId ? { ...i, quantity } : i
                    ),
                }));
            },

            clearCart: () => set({ items: [], coupon: null }),
            toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

            // ─── Coupon logic ───────────────────────────────────────────────────────
            applyCoupon: (code, subtotal) => {
                const normalized = code.trim().toUpperCase();
                const couponDef = COUPONS[normalized];
                if (!couponDef) {
                    return { success: false, message: `"${code}" is not a valid coupon code.` };
                }
                if (couponDef.min && subtotal < couponDef.min) {
                    return { success: false, message: `Minimum cart value of ₹${couponDef.min} required for this coupon.` };
                }
                set({
                    coupon: { code: normalized, type: couponDef.type, value: couponDef.value, label: couponDef.label },
                });
                return { success: true, message: `✓ "${couponDef.label}" applied!` };
            },

            removeCoupon: () => set({ coupon: null }),

            discountAmount: (subtotal) => {
                const coupon = get().coupon;
                if (!coupon) return 0;
                if (coupon.type === 'percent') return Math.round((subtotal * coupon.value) / 100);
                return Math.min(coupon.value, subtotal);
            },

            finalTotal: (subtotal) => {
                const discount = get().discountAmount(subtotal);
                return Math.max(0, subtotal - discount);
            },
        }),
        { name: 'vnode-cart' }
    )
);
