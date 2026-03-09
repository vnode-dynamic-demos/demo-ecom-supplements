'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PromoBanner, HeroBanner, Coupon, GWPOffer, FlashDeal } from '@/types';

export interface FeaturedProductHeroData {
    isActive: boolean;
    productId: string;
    badgeLabel: string;
    heading: string;
    subheading: string;
}

// ─── Default data (what ships in demo mode) ──────────────────────────────────
const DEFAULT_BANNERS: PromoBanner[] = [
    { id: 'b1', tag: 'Limited Time', title: 'Protein Week Sale', subtitle: 'Up to 40% off on Whey Protein', couponCode: 'PROTEIN15', bgGradient: 'from-orange-600 to-red-700', isActive: true, sortOrder: 0 },
    { id: 'b2', tag: 'New Arrivals', title: 'NitroBlast 2.0', subtitle: 'Reformulated for maximum pump', couponCode: 'VNODE10', bgGradient: 'from-blue-700 to-indigo-800', isActive: true, sortOrder: 1 },
    { id: 'b3', tag: 'Bundle Deal', title: 'Stack & Save 25%', subtitle: 'Buy any 2 products & save big', couponCode: 'HYPER25', bgGradient: 'from-emerald-700 to-teal-800', isActive: true, sortOrder: 2 },
];

const DEFAULT_HERO: HeroBanner[] = [
    { id: 'h1', imageUrl: '/banners/protein-sale.png', linkUrl: '/products?category=cat-protein', isActive: true, sortOrder: 0 },
    { id: 'h2', imageUrl: '/banners/health-sale.png', linkUrl: '/products?goal=health', isActive: true, sortOrder: 1 },
];

const DEFAULT_COUPONS: Coupon[] = [
    { id: 'c1', code: 'VNODE10', type: 'percent', value: 10, label: '10% Off Sitewide', usedCount: 847, maxUses: 5000, isActive: true },
    { id: 'c2', code: 'WELCOME20', type: 'percent', value: 20, label: '20% Off First Order', usedCount: 312, maxUses: 1000, isActive: true },
    { id: 'c3', code: 'FLAT200', type: 'flat', value: 200, label: '₹200 Off on ₹1500+', usedCount: 198, minOrder: 1500, isActive: true },
    { id: 'c4', code: 'PROTEIN15', type: 'percent', value: 15, label: '15% Off on Protein', usedCount: 423, maxUses: 2000, isActive: true },
    { id: 'c5', code: 'HYPER25', type: 'percent', value: 25, label: '25% Mega Offer', usedCount: 91, maxUses: 500, isActive: false },
];

const DEFAULT_GWP: GWPOffer[] = [
    { id: 'g1', name: 'Buy 2kg Whey → Free Creatine', triggerProductId: '1', triggerMinQty: 1, rewardProductId: '3', rewardQty: 1, isActive: true },
];

const DEFAULT_FLASH: FlashDeal[] = [
    { id: 'f1', productId: '1', salePrice: 4199, startsAt: new Date().toISOString(), endsAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), isActive: true },
    { id: 'f2', productId: '2', salePrice: 1999, startsAt: new Date().toISOString(), endsAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), isActive: true },
    { id: 'f3', productId: '3', salePrice: 1499, startsAt: new Date().toISOString(), endsAt: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), isActive: true },
];

// ─── Store ──────────────────────────────────────────────────────────────────
interface AdminStore {
    heroBanners: HeroBanner[];
    banners: PromoBanner[];
    coupons: Coupon[];
    gwpOffers: GWPOffer[];
    flashDeals: FlashDeal[];
    featuredProductHero: FeaturedProductHeroData;

    // Featured Hero actions
    updateFeaturedProductHero: (updates: Partial<FeaturedProductHeroData>) => void;

    // Banner actions
    addBanner: (b: Omit<PromoBanner, 'id' | 'sortOrder'>) => void;
    updateBanner: (id: string, updates: Partial<PromoBanner>) => void;
    deleteBanner: (id: string) => void;
    toggleBanner: (id: string) => void;
    reorderBanners: (ids: string[]) => void;

    // Hero banner actions
    addHeroBanner: (b: Omit<HeroBanner, 'id' | 'sortOrder'>) => void;
    updateHeroBanner: (id: string, updates: Partial<HeroBanner>) => void;
    deleteHeroBanner: (id: string) => void;
    toggleHeroBanner: (id: string) => void;
    reorderHeroBanners: (ids: string[]) => void;

    // Coupon actions
    addCoupon: (c: Omit<Coupon, 'id' | 'usedCount'>) => void;
    updateCoupon: (id: string, updates: Partial<Coupon>) => void;
    deleteCoupon: (id: string) => void;
    toggleCoupon: (id: string) => void;

    // GWP actions
    addGWP: (g: Omit<GWPOffer, 'id'>) => void;
    updateGWP: (id: string, updates: Partial<GWPOffer>) => void;
    deleteGWP: (id: string) => void;
    toggleGWP: (id: string) => void;

    // Flash deal actions
    addFlashDeal: (f: Omit<FlashDeal, 'id'>) => void;
    updateFlashDeal: (id: string, updates: Partial<FlashDeal>) => void;
    deleteFlashDeal: (id: string) => void;
}

const uid = () => Math.random().toString(36).slice(2, 9);

export const useAdminStore = create<AdminStore>()(
    persist(
        (set, get) => ({
            heroBanners: DEFAULT_HERO,
            banners: DEFAULT_BANNERS,
            coupons: DEFAULT_COUPONS,
            gwpOffers: DEFAULT_GWP,
            flashDeals: DEFAULT_FLASH,
            featuredProductHero: {
                isActive: true,
                productId: '1', // HyperWhey Pro
                badgeLabel: 'FSSAI & NSF Certified',
                heading: "World's Best Whey Protein",
                subheading: 'Now in India',
            },

            updateFeaturedProductHero: (updates) => set((s) => ({
                featuredProductHero: { ...s.featuredProductHero, ...updates }
            })),

            addHeroBanner: (b) => set((s) => ({
                heroBanners: [...s.heroBanners, { ...b, id: uid(), sortOrder: s.heroBanners.length }],
            })),
            updateHeroBanner: (id, updates) => set((s) => ({
                heroBanners: s.heroBanners.map((b) => b.id === id ? { ...b, ...updates } : b),
            })),
            deleteHeroBanner: (id) => set((s) => ({ heroBanners: s.heroBanners.filter((b) => b.id !== id) })),
            toggleHeroBanner: (id) => set((s) => ({
                heroBanners: s.heroBanners.map((b) => b.id === id ? { ...b, isActive: !b.isActive } : b),
            })),
            reorderHeroBanners: (ids) => set((s) => ({
                heroBanners: ids.map((id, i) => ({ ...s.heroBanners.find((b) => b.id === id)!, sortOrder: i })),
            })),

            addBanner: (b) => set((s) => ({
                banners: [...s.banners, { ...b, id: uid(), sortOrder: s.banners.length }],
            })),
            updateBanner: (id, updates) => set((s) => ({
                banners: s.banners.map((b) => b.id === id ? { ...b, ...updates } : b),
            })),
            deleteBanner: (id) => set((s) => ({ banners: s.banners.filter((b) => b.id !== id) })),
            toggleBanner: (id) => set((s) => ({
                banners: s.banners.map((b) => b.id === id ? { ...b, isActive: !b.isActive } : b),
            })),
            reorderBanners: (ids) => set((s) => ({
                banners: ids.map((id, i) => ({ ...s.banners.find((b) => b.id === id)!, sortOrder: i })),
            })),

            addCoupon: (c) => set((s) => ({
                coupons: [...s.coupons, { ...c, id: uid(), usedCount: 0 }],
            })),
            updateCoupon: (id, u) => set((s) => ({
                coupons: s.coupons.map((c) => c.id === id ? { ...c, ...u } : c),
            })),
            deleteCoupon: (id) => set((s) => ({ coupons: s.coupons.filter((c) => c.id !== id) })),
            toggleCoupon: (id) => set((s) => ({
                coupons: s.coupons.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c),
            })),

            addGWP: (g) => set((s) => ({ gwpOffers: [...s.gwpOffers, { ...g, id: uid() }] })),
            updateGWP: (id, u) => set((s) => ({
                gwpOffers: s.gwpOffers.map((g) => g.id === id ? { ...g, ...u } : g),
            })),
            deleteGWP: (id) => set((s) => ({ gwpOffers: s.gwpOffers.filter((g) => g.id !== id) })),
            toggleGWP: (id) => set((s) => ({
                gwpOffers: s.gwpOffers.map((g) => g.id === id ? { ...g, isActive: !g.isActive } : g),
            })),

            addFlashDeal: (f) => set((s) => ({ flashDeals: [...s.flashDeals, { ...f, id: uid() }] })),
            updateFlashDeal: (id, u) => set((s) => ({
                flashDeals: s.flashDeals.map((f) => f.id === id ? { ...f, ...u } : f),
            })),
            deleteFlashDeal: (id) => set((s) => ({ flashDeals: s.flashDeals.filter((f) => f.id !== id) })),
        }),
        { name: 'vnode-admin' }
    )
);
