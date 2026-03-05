'use client';

import { useState, useMemo } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, X } from 'lucide-react';
import type { Product } from '@/types';

// ── Mock multi-brand product catalog ────────────────────────────────────────
const ALL_PRODUCTS: Product[] = [
    {
        id: '1', name: 'HyperWhey Pro Whey Protein Isolate | 27g Protein | 30 Servings', slug: 'hyperwhey-pro-whey-protein',
        description: 'Cold-filtered whey protein isolate with 27g protein per scoop.', category_id: 'cat-protein', brand_id: 'b-vnodenutra',
        base_price: 2499, mrp: 3299, price_per_unit: '₹83.3/serving', image_url: '/products/hyperwhey-pro.png',
        is_featured: true, rating: 4.7, review_count: 3124, badges: ['BEST SELLER'], certifications: ['INFORMED SPORT'],
        highlights: ['27g Protein per scoop', 'Zero added sugar', 'Instantized formula', '30 servings'],
        best_before: 'Dec 2026', stock: 45,
        brand: { id: 'b-vnodenutra', name: 'V-Node Nutra', slug: 'v-node-nutra', is_featured: true },
        created_at: '', updated_at: '',
    },
    {
        id: '2', name: 'NitroBlast Pre-Workout Max Strength | 300mg Caffeine | 20 Servings', slug: 'nitroblast-pre-workout',
        description: '300mg caffeine, 6g citrulline malate, 3.2g beta-alanine.', category_id: 'cat-preworkout', brand_id: 'b-vnodenutra',
        base_price: 1799, mrp: 2499, price_per_unit: '₹90/serving', image_url: '/products/nitroblast.png',
        is_featured: true, rating: 4.5, review_count: 1892, badges: ['MAX STRENGTH'], certifications: ['FSSAI'],
        highlights: ['300mg Caffeine Anhydrous', '6g Citrulline Malate', '3.2g Beta-Alanine', '20 servings'],
        best_before: 'Mar 2027', stock: 72,
        brand: { id: 'b-vnodenutra', name: 'V-Node Nutra', slug: 'v-node-nutra', is_featured: true },
        created_at: '', updated_at: '',
    },
    {
        id: '3', name: 'PureCre Creatine Monohydrate Creapure® | 60 Servings | Unflavored', slug: 'purecre-monohydrate',
        description: '100% Creapure® certified pharmaceutical-grade creatine.', category_id: 'cat-creatine', brand_id: 'b-vnodenutra',
        base_price: 999, mrp: 1299, price_per_unit: '₹16.7/serving', image_url: '/products/purecre.png',
        is_featured: true, rating: 4.8, review_count: 5471, badges: ['CREAPURE®'], certifications: ['HEAVY METALS TESTED'],
        highlights: ['Creapure® Certified', '5000mg per serving', '60 servings', 'Unflavored'],
        best_before: 'Jun 2027', stock: 120,
        brand: { id: 'b-vnodenutra', name: 'V-Node Nutra', slug: 'v-node-nutra', is_featured: true },
        created_at: '', updated_at: '',
    },
    {
        id: '4', name: 'MuscleBlaze Gold Whey Protein | 25g Protein | 1kg Chocolate', slug: 'muscleblaze-gold-whey',
        description: 'Lab-certified whey with digestive enzyme blend.', category_id: 'cat-protein', brand_id: 'b-muscleblaze',
        base_price: 2299, mrp: 3199, price_per_unit: '₹76.6/serving', image_url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&auto=format&fit=crop',
        is_featured: false, rating: 4.6, review_count: 8234, badges: ['LAB TESTED'], certifications: ['HEAVY METALS TESTED'],
        highlights: ['25g Protein', 'DigeGen enzyme blend', '30 servings', 'Chocolate flavour'],
        best_before: 'Sep 2026', stock: 89,
        brand: { id: 'b-muscleblaze', name: 'MuscleBlaze', slug: 'muscleblaze', is_featured: true },
        created_at: '', updated_at: '',
    },
    {
        id: '5', name: 'GNC Pro Performance 100% Whey Protein | 24g Protein | 2lb', slug: 'gnc-pro-whey',
        description: 'GNC\'s trusted whey blend with 24g protein and 5.5g BCAAs.', category_id: 'cat-protein', brand_id: 'b-gnc',
        base_price: 3199, mrp: 4199, price_per_unit: '₹106.6/serving', image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop',
        is_featured: false, rating: 4.4, review_count: 2741, badges: ['GNC CERTIFIED'], certifications: ['NSF'],
        highlights: ['24g Protein', '5.5g BCAAs', 'NSF Certified', 'No artificial sweeteners'],
        best_before: 'Aug 2026', stock: 34,
        brand: { id: 'b-gnc', name: 'GNC', slug: 'gnc', is_featured: true },
        created_at: '', updated_at: '',
    },
    {
        id: '6', name: 'Optimum Nutrition Gold Standard 100% Whey | 24g Protein | 2lb', slug: 'on-gold-standard-whey',
        description: 'The world\'s best-selling whey protein. 24g protein, 5.5g BCAAs.', category_id: 'cat-protein', brand_id: 'b-on',
        base_price: 3499, mrp: 4799, price_per_unit: '₹116.6/serving', image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop',
        is_featured: true, rating: 4.8, review_count: 15203, badges: ['WORLD #1', 'BEST SELLER'], certifications: ['INFORMED SPORT'],
        highlights: ['Whey Isolate primary source', '24g protein', 'No fillers', '30 servings'],
        best_before: 'Nov 2026', stock: 12,
        brand: { id: 'b-on', name: 'Optimum Nutrition', slug: 'optimum-nutrition', is_featured: true },
        created_at: '', updated_at: '',
    },
    {
        id: '7', name: 'Fast&Up Charge Natural Vitamin C | 1000mg | Effervescent | 20 Tabs', slug: 'fastup-charge-vitamin-c',
        description: 'Natural Vitamin C + Zinc + Echinacea for immunity. Effervescent.', category_id: 'cat-vitamins', brand_id: 'b-fastup',
        base_price: 299, mrp: 399, price_per_unit: '₹15/tab', image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop',
        is_featured: false, rating: 4.3, review_count: 3890, badges: ['NATURAL'], certifications: ['FSSAI'],
        highlights: ['1000mg Natural Vitamin C', 'Added Zinc & Echinacea', 'Effervescent formula', '20 tablets'],
        best_before: 'Jan 2027', stock: 200,
        brand: { id: 'b-fastup', name: 'Fast&Up', slug: 'fast-up', is_featured: true },
        created_at: '', updated_at: '',
    },
    {
        id: '8', name: 'MyProtein Impact Whey Isolate | 90% Protein | 25 Servings | Strawberry', slug: 'myprotein-impact-whey-isolate',
        description: 'Instantized whey isolate with 90% protein content per 100g.', category_id: 'cat-protein', brand_id: 'b-myprotein',
        base_price: 2799, mrp: 3799, price_per_unit: '₹112/serving', image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&auto=format&fit=crop',
        is_featured: false, rating: 4.5, review_count: 4231, badges: ['ISOLATE'], certifications: ['INFORMED SPORT'],
        highlights: ['90% protein content', '25 servings', 'Instantized', 'Strawberry flavour'],
        best_before: 'Oct 2026', stock: 67,
        brand: { id: 'b-myprotein', name: 'MyProtein', slug: 'myprotein', is_featured: true },
        created_at: '', updated_at: '',
    },
];

const BRANDS = [...new Set(ALL_PRODUCTS.map(p => p.brand?.name).filter(Boolean))] as string[];
const CATEGORIES = [
    { label: 'Protein', value: 'cat-protein' },
    { label: 'Pre-Workout', value: 'cat-preworkout' },
    { label: 'Creatine', value: 'cat-creatine' },
    { label: 'Vitamins', value: 'cat-vitamins' },
];

type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

interface FilterState {
    brands: string[];
    categories: string[];
    priceMax: number;
    minRating: number;
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-100 py-4">
            <button onClick={() => setOpen(o => !o)} className="flex items-center justify-between w-full mb-2">
                <span className="font-bold text-gray-800 text-sm">{title}</span>
                {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {open && children}
        </div>
    );
}

export default function ProductsListingPage() {
    const [sort, setSort] = useState<SortKey>('recommended');
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<FilterState>({ brands: [], categories: [], priceMax: 10000, minRating: 0 });
    const [mobileSidebar, setMobileSidebar] = useState(false);

    const toggleBrand = (b: string) =>
        setFilters(f => ({ ...f, brands: f.brands.includes(b) ? f.brands.filter(x => x !== b) : [...f.brands, b] }));
    const toggleCategory = (c: string) =>
        setFilters(f => ({ ...f, categories: f.categories.includes(c) ? f.categories.filter(x => x !== c) : [...f.categories, c] }));
    const clearFilters = () => setFilters({ brands: [], categories: [], priceMax: 10000, minRating: 0 });

    const filtered = useMemo(() => {
        let result = ALL_PRODUCTS;
        if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.name.toLowerCase().includes(search.toLowerCase()));
        if (filters.brands.length) result = result.filter(p => filters.brands.includes(p.brand?.name ?? ''));
        if (filters.categories.length) result = result.filter(p => filters.categories.includes(p.category_id ?? ''));
        result = result.filter(p => p.base_price <= filters.priceMax && p.rating >= filters.minRating);
        return result;
    }, [search, filters]);

    const sorted = useMemo(() => {
        const arr = [...filtered];
        if (sort === 'price-asc') arr.sort((a, b) => a.base_price - b.base_price);
        if (sort === 'price-desc') arr.sort((a, b) => b.base_price - a.base_price);
        if (sort === 'rating') arr.sort((a, b) => b.rating - a.rating);
        return arr;
    }, [filtered, sort]);

    const activeFilterCount = filters.brands.length + filters.categories.length + (filters.minRating > 0 ? 1 : 0);

    const SidebarContent = () => (
        <div className="space-y-0">
            <FilterSection title="Brand">
                <div className="relative mb-2">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input placeholder="Search by Brand" className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:border-[#1a237e]" />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {BRANDS.map(brand => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.brands.includes(brand)}
                                onChange={() => toggleBrand(brand)}
                                className="rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]"
                            />
                            <span className="text-sm text-gray-700">{brand}</span>
                            <span className="ml-auto text-xs text-gray-400">({ALL_PRODUCTS.filter(p => p.brand?.name === brand).length})</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Category">
                <div className="space-y-2">
                    {CATEGORIES.map(cat => (
                        <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.categories.includes(cat.value)}
                                onChange={() => toggleCategory(cat.value)}
                                className="rounded border-gray-300 text-[#1a237e] focus:ring-[#1a237e]"
                            />
                            <span className="text-sm text-gray-700">{cat.label}</span>
                            <span className="ml-auto text-xs text-gray-400">({ALL_PRODUCTS.filter(p => p.category_id === cat.value).length})</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            <FilterSection title="Price Range" defaultOpen={false}>
                <div className="px-1">
                    <input
                        type="range" min={500} max={10000} step={100}
                        value={filters.priceMax}
                        onChange={e => setFilters(f => ({ ...f, priceMax: Number(e.target.value) }))}
                        className="w-full accent-[#1a237e]"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>₹500</span><span className="font-semibold text-gray-800">Up to ₹{filters.priceMax.toLocaleString('en-IN')}</span><span>₹10,000</span>
                    </div>
                </div>
            </FilterSection>

            <FilterSection title="Minimum Rating" defaultOpen={false}>
                <div className="space-y-1.5">
                    {[4, 3, 2].map(r => (
                        <label key={r} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                checked={filters.minRating === r}
                                onChange={() => setFilters(f => ({ ...f, minRating: r }))}
                                className="text-[#1a237e]"
                            />
                            <span className="text-sm text-amber-500 font-semibold">{r}★</span>
                            <span className="text-xs text-gray-500">& above</span>
                        </label>
                    ))}
                </div>
            </FilterSection>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumb */}
            <nav className="text-xs text-gray-500 mb-4">
                <span className="hover:text-[#1a237e] cursor-pointer">Home</span>
                <span className="mx-2">›</span>
                <span className="font-semibold text-gray-800">All Products</span>
            </nav>

            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Sports Nutrition & Supplements</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Showing <strong className="text-gray-800">{sorted.length} results</strong> from 300+ brands</p>
                </div>
                <div className="hidden md:flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                    <select
                        value={sort}
                        onChange={e => setSort(e.target.value as SortKey)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#1a237e] bg-white"
                    >
                        <option value="recommended">Recommended</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating">Customer Rating</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>
            </div>

            {/* Mobile filter bar */}
            <div className="md:hidden flex gap-2 mb-4">
                <button onClick={() => setMobileSidebar(true)} className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-2.5 text-sm font-semibold text-gray-700 bg-white">
                    <SlidersHorizontal className="w-4 h-4" /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>
                <select value={sort} onChange={e => setSort(e.target.value as SortKey)} className="flex-1 border border-gray-200 rounded-lg px-3 text-sm font-semibold text-gray-700 bg-white focus:outline-none">
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price ↑</option>
                    <option value="price-desc">Price ↓</option>
                    <option value="rating">Rating</option>
                </select>
            </div>

            {/* Active filters */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {filters.brands.map(b => (
                        <span key={b} className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-[#1a237e] text-xs font-semibold px-2.5 py-1 rounded-full">
                            {b} <X className="w-3 h-3 cursor-pointer" onClick={() => toggleBrand(b)} />
                        </span>
                    ))}
                    {filters.categories.map(c => (
                        <span key={c} className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-[#1a237e] text-xs font-semibold px-2.5 py-1 rounded-full">
                            {CATEGORIES.find(x => x.value === c)?.label} <X className="w-3 h-3 cursor-pointer" onClick={() => toggleCategory(c)} />
                        </span>
                    ))}
                    <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:underline">Clear all</button>
                </div>
            )}

            <div className="flex gap-6">
                {/* Sidebar — desktop */}
                <aside className="hidden md:block w-52 flex-shrink-0">
                    <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-36">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-black text-gray-900">Filters</h2>
                            {activeFilterCount > 0 && (
                                <button onClick={clearFilters} className="text-xs font-bold text-red-500 hover:underline">Clear ({activeFilterCount})</button>
                            )}
                        </div>
                        <SidebarContent />
                    </div>
                </aside>

                {/* Product grid */}
                <div className="flex-1 min-w-0">
                    {/* Inline search */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search within results..."
                            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#1a237e]"
                        />
                    </div>

                    {sorted.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-5xl mb-4">🔍</p>
                            <p className="text-gray-700 font-bold text-lg">No products found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                            <button onClick={clearFilters} className="mt-4 px-6 py-2.5 bg-[#1a237e] text-white rounded-lg text-sm font-bold hover:bg-[#0d1459] transition-all">Clear Filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {sorted.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* People Also Bought */}
                    <div className="mt-10 bg-white rounded-xl border border-gray-100 p-5">
                        <h3 className="font-black text-gray-900 text-base mb-4">People Also Bought:</h3>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {ALL_PRODUCTS.slice(0, 4).map(p => (
                                <div key={p.id} className="flex-shrink-0 w-28 cursor-pointer group">
                                    <div className="relative w-28 h-28 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden mb-2">
                                        {p.image_url && (
                                            <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-700 font-semibold line-clamp-2 leading-tight">{p.name.split('|')[0]}</p>
                                    <p className="text-xs font-black text-gray-900 mt-0.5">₹{p.base_price.toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar overlay */}
            {mobileSidebar && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebar(false)} />
                    <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto p-5 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-black text-gray-900 text-lg">Filters</h2>
                            <button onClick={() => setMobileSidebar(false)} className="p-1.5 rounded-lg border border-gray-200">
                                <X className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                        <SidebarContent />
                        <button onClick={() => setMobileSidebar(false)} className="w-full mt-4 py-3 bg-[#1a237e] text-white font-bold rounded-xl">
                            Show {sorted.length} Products
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
