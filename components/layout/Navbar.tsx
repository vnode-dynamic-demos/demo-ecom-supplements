'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, Search, User, Heart, ChevronDown, Menu, X, Dumbbell } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
    { label: 'Protein', href: '/products?category=protein' },
    { label: 'Pre-Workout', href: '/products?category=pre-workout' },
    { label: 'Creatine', href: '/products?category=creatine' },
    { label: 'Vitamins', href: '/products?category=vitamins' },
    { label: 'Weight Management', href: '/products?category=weight-management' },
    { label: 'Amino Acids', href: '/products?category=amino-acids' },
    { label: 'Ayurvedic', href: '/products?category=ayurvedic' },
    { label: 'Fitness Accessories', href: '/products?category=accessories' },
];

const BRANDS_PREVIEW = [
    'MuscleBlaze', 'GNC', 'MyProtein', 'Optimum Nutrition',
    'Fast&Up', 'Carbamide Forte', 'HK Vitals', 'Nutrabay',
];

export default function Navbar() {
    const router = useRouter();
    const { toggleCart, totalItems } = useCartStore();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearch] = useState('');
    const [brandOpen, setBrandOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const brandRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (brandRef.current && !brandRef.current.contains(e.target as Node)) setBrandOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const count = mounted ? totalItems() : 0;

    return (
        <header className={`fixed top-8 left-0 right-0 z-30 transition-all duration-200 ${scrolled ? 'shadow-md' : ''} bg-white border-b border-gray-200`}>

            {/* ── Row 1: Logo + Search + Actions ─────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center gap-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
                        <div className="p-1.5 bg-[#1a237e] rounded-lg group-hover:bg-[#0d1459] transition-colors">
                            <Dumbbell className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-black text-[#1a237e] text-xl tracking-tight">
                                V-Node<span className="text-[#ff6b35]">Nutra</span>
                            </span>
                            <p className="text-[10px] text-gray-400 font-medium leading-none -mt-0.5">300+ Brands · 5000+ Products</p>
                        </div>
                    </Link>

                    {/* Brands dropdown */}
                    <div className="relative hidden md:block" ref={brandRef}>
                        <button
                            onClick={() => setBrandOpen(b => !b)}
                            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:border-[#1a237e] hover:text-[#1a237e] transition-all"
                        >
                            Brands <ChevronDown className={`w-3.5 h-3.5 transition-transform ${brandOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {brandOpen && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-56 z-50">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Top Brands</p>
                                <div className="space-y-2">
                                    {BRANDS_PREVIEW.map(b => (
                                        <Link
                                            key={b}
                                            href={`/brands/${b.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                                            className="block text-sm text-gray-700 hover:text-[#1a237e] hover:font-semibold transition-all"
                                            onClick={() => setBrandOpen(false)}
                                        >
                                            {b}
                                        </Link>
                                    ))}
                                </div>
                                <Link href="/brands" onClick={() => setBrandOpen(false)} className="block mt-3 pt-3 border-t border-gray-100 text-xs font-bold text-[#1a237e] hover:underline">
                                    View all brands →
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Search bar */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && searchQuery.trim() !== '') {
                                    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                                    setSearch(''); // Optional: clear search after submission
                                    setMobileOpen(false); // Close mobile menu if open
                                }
                            }}
                            placeholder="Search for Proteins, Vitamins, Brands..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Login */}
                        <Link
                            href="/account"
                            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[#1a237e] hover:text-[#1a237e] transition-all"
                        >
                            <User className="w-4 h-4" /> Login
                        </Link>

                        {/* Wishlist */}
                        <Link
                            href="/wishlist"
                            className="hidden md:flex p-2.5 rounded-full border border-gray-200 text-gray-600 hover:border-[#1a237e] hover:text-[#1a237e] transition-all"
                            aria-label="Wishlist"
                        >
                            <Heart className="w-4.5 h-4.5" />
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={toggleCart}
                            className="relative flex items-center gap-1.5 px-3 py-2.5 bg-[#1a237e] hover:bg-[#0d1459] text-white rounded-full text-sm font-semibold transition-all"
                            aria-label="Cart"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="hidden sm:inline">Cart</span>
                            {count > 0 && (
                                <span className="bg-[#ff6b35] text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce-once">
                                    {count > 9 ? '9+' : count}
                                </span>
                            )}
                        </button>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(o => !o)}
                            className="md:hidden p-2 rounded-lg border border-gray-200 text-gray-600"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Row 2: Category nav ─────────────────────────────────────── */}
            <div className="border-t border-gray-100 bg-white hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
                        {CATEGORIES.map(cat => (
                            <Link
                                key={cat.href}
                                href={cat.href}
                                className="flex-shrink-0 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-[#1a237e] hover:bg-[#f0f4ff] border-b-2 border-transparent hover:border-[#1a237e] transition-all whitespace-nowrap"
                            >
                                {cat.label}
                            </Link>
                        ))}
                        <div className="ml-auto flex-shrink-0">
                            <Link
                                href="/products?sale=true"
                                className="flex items-center gap-1 px-4 py-2.5 text-sm font-bold text-white bg-[#ff6b35] hover:bg-[#e55a24] transition-all"
                            >
                                🔥 OFFERS
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-2">
                    {CATEGORIES.map(cat => (
                        <Link
                            key={cat.href}
                            href={cat.href}
                            onClick={() => setMobileOpen(false)}
                            className="block py-2 text-sm font-medium text-gray-700 hover:text-[#1a237e] border-b border-gray-50"
                        >
                            {cat.label}
                        </Link>
                    ))}
                    <div className="flex gap-3 pt-2">
                        <Link href="/account" className="flex-1 py-2 text-center text-sm font-semibold border border-gray-200 rounded-lg text-gray-700">Login</Link>
                        <Link href="/wishlist" className="flex-1 py-2 text-center text-sm font-semibold border border-gray-200 rounded-lg text-gray-700">Wishlist</Link>
                    </div>
                </div>
            )}
        </header>
    );
}
