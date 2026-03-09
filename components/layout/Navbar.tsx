'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, Search, User, Heart, ChevronDown, Menu, X, Dumbbell } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';

const CATEGORIES = [
    { label: 'Protein', href: '/products?category=protein' },
    { label: 'Pre-Workout', href: '/products?category=preworkout' },
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
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [brandOpen, setBrandOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const brandRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (brandRef.current && !brandRef.current.contains(e.target as Node)) {
                setBrandOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Intelligent Search Auto-complete
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const { getAllProducts } = await import('@/lib/products');
                const products = await getAllProducts();
                const q = searchQuery.toLowerCase();
                const matched = products.filter(p =>
                    p.name.toLowerCase().includes(q) ||
                    (p.brand?.name && p.brand.name.toLowerCase().includes(q))
                ).slice(0, 5); // top 5 results
                setSearchResults(matched);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery]);

    const count = mounted ? totalItems() : 0;

    return (
        <header className={`fixed top-8 left-0 right-0 z-30 transition-all duration-200 ${scrolled ? 'shadow-md' : ''} bg-white border-b border-gray-200`}>

            {/* ── Desktop Row 1: Logo + Search + Actions ─────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden md:block">
                <div className="h-16 flex items-center gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
                        <div className="p-1.5 bg-[#1a237e] rounded-lg group-hover:bg-[#0d1459] transition-colors">
                            <Dumbbell className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-black text-[#1a237e] text-xl tracking-tight">
                                V-Node<span className="text-[#ff6b35]">Nutra</span>
                            </span>
                            <p className="text-[10px] text-gray-400 font-medium leading-none -mt-0.5">300+ Brands · 5000+ Products</p>
                        </div>
                    </Link>

                    {/* Brands dropdown */}
                    <div className="relative" ref={brandRef}>
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

                    {/* Search bar Desktop */}
                    <div className="flex-1 relative" ref={searchRef}>
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onFocus={() => { if (searchQuery.trim().length >= 2) setShowSuggestions(true) }}
                            onChange={e => {
                                setSearch(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && searchQuery.trim() !== '') {
                                    setShowSuggestions(false);
                                    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                                    setSearch('');
                                }
                            }}
                            placeholder="Search for Proteins, Vitamins, Brands..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a237e] focus:bg-white transition-all"
                        />

                        {/* Auto-complete Suggestions Dropdown Desktop */}
                        {showSuggestions && searchQuery.trim().length >= 2 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                {isSearching ? (
                                    <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                                ) : searchResults.length > 0 ? (
                                    <div className="divide-y divide-gray-50">
                                        {searchResults.map(product => (
                                            <Link
                                                key={product.id}
                                                href={`/product/${product.slug || product.id}`}
                                                onClick={() => { setShowSuggestions(false); setSearch(''); }}
                                                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0 relative overflow-hidden">
                                                    {product.image_url && <img src={product.image_url} alt="" className="w-full h-full object-contain p-1" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{product.brand?.name}</p>
                                                </div>
                                                <div className="font-bold text-[#1a237e] text-sm whitespace-nowrap">
                                                    ₹{product.base_price.toLocaleString('en-IN')}
                                                </div>
                                            </Link>
                                        ))}
                                        <button
                                            onClick={() => {
                                                setShowSuggestions(false);
                                                router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                                            }}
                                            className="w-full p-3 text-center text-sm font-bold text-[#1a237e] hover:bg-[#1a237e] hover:text-white transition-colors"
                                        >
                                            View all {searchResults.length} results →
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-sm text-gray-500">No products found matching "{searchQuery}"</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Link href="/account" className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm font-semibold text-gray-700 hover:border-[#1a237e] hover:text-[#1a237e] transition-all">
                            <User className="w-4 h-4" /> Login
                        </Link>
                        <Link href="/wishlist" className="p-2.5 rounded-full border border-gray-200 text-gray-600 hover:border-[#1a237e] hover:text-[#1a237e] transition-all" aria-label="Wishlist">
                            <Heart className="w-4.5 h-4.5" />
                        </Link>
                        <button onClick={toggleCart} className="relative flex items-center gap-1.5 px-3 py-2.5 bg-[#1a237e] hover:bg-[#0d1459] text-white rounded-full text-sm font-semibold transition-all">
                            <ShoppingCart className="w-4 h-4" />
                            <span>Cart</span>
                            {count > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#ff6b35] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce-once">
                                    {count > 9 ? '9+' : count}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile Layout ─────────────────────────────────────────────── */}
            <div className="md:hidden">
                {/* Mobile Top Row: Hamburger, Logo, Cart */}
                <div className="h-14 px-4 flex items-center justify-between gap-4">
                    <button onClick={() => setMobileOpen(o => !o)} className="p-2 -ml-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* Mobile Logo centered */}
                    <Link href="/" className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
                        <div className="p-1 bg-[#1a237e] rounded-md">
                            <Dumbbell className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-black text-[#1a237e] text-lg tracking-tight">
                            V-Node<span className="text-[#ff6b35]">Nutra</span>
                        </span>
                    </Link>

                    {/* Mobile Cart Button */}
                    <button onClick={toggleCart} className="p-2 -mr-2 text-gray-700 relative hover:bg-gray-100 rounded-lg">
                        <ShoppingCart className="w-5 h-5" />
                        {count > 0 && (
                            <span className="absolute top-1 right-0.5 bg-[#ff6b35] text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                {count > 9 ? '9+' : count}
                            </span>
                        )}
                    </button>
                </div>

                {/* Mobile Search Row */}
                <div className="px-4 pb-3">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onFocus={() => { if (searchQuery.trim().length >= 2) setShowSuggestions(true) }}
                            onChange={e => {
                                setSearch(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && searchQuery.trim() !== '') {
                                    setShowSuggestions(false);
                                    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                                    setSearch('');
                                }
                            }}
                            placeholder="Search..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a237e] focus:bg-white"
                        />
                        {/* Auto-complete Mobile */}
                        {showSuggestions && searchQuery.trim().length >= 2 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[60]">
                                {isSearching ? (
                                    <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                                ) : searchResults.length > 0 ? (
                                    <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto">
                                        {searchResults.map(product => (
                                            <Link
                                                key={product.id}
                                                href={`/product/${product.slug || product.id}`}
                                                onClick={() => { setShowSuggestions(false); setSearch(''); }}
                                                className="flex items-center gap-3 p-3 hover:bg-gray-50"
                                            >
                                                <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0 relative overflow-hidden">
                                                    {product.image_url && <img src={product.image_url} alt="" className="w-full h-full object-contain p-1" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{product.brand?.name}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-sm text-gray-500">No results found.</div>
                                )}
                            </div>
                        )}
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
