'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, ChevronDown, Layers, Save } from 'lucide-react';
import type { ProductVariant } from '@/types';
import { getProductVariants } from '@/lib/products';
import { getSupabaseClient } from '@/lib/supabase';

interface Product {
    id: string; name: string; brand: string; category: string;
    price: number; mrp: number; stock: number; sku: string; rating: number;
    slug?: string;
}

const INITIAL: Product[] = [
    { id: '1', name: 'HyperWhey Pro — Whey Protein Isolate', brand: 'V-Node Nutra', category: 'Protein', price: 2499, mrp: 3299, stock: 45, sku: 'HWP-CHO-1KG', rating: 4.7 },
    { id: '2', name: 'NitroBlast Pre-Workout Max Strength', brand: 'V-Node Nutra', category: 'Pre-Workout', price: 1799, mrp: 2499, stock: 110, sku: 'NBL-WAT-300G', rating: 4.5 },
    { id: '3', name: 'PureCre Creatine Monohydrate', brand: 'V-Node Nutra', category: 'Creatine', price: 999, mrp: 1299, stock: 0, sku: 'PCR-UNF-250G', rating: 4.9 },
];

const CATEGORIES = ['Protein', 'Pre-Workout', 'Creatine', 'Vitamins', 'Amino Acids', 'Weight Management'];

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>(INITIAL);
    const [search, setSearch] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // ── Variant Stock Management State ───────────────────────────────────────
    const [expandedVariantStats, setExpandedVariantStats] = useState<Record<string, ProductVariant[]>>({});
    const [originalVariantStats, setOriginalVariantStats] = useState<Record<string, ProductVariant[]>>({});
    const [updatingStock, setUpdatingStock] = useState<string | null>(null);

    const loadVariants = async (productId: string, productSlug?: string) => {
        if (expandedVariantStats[productId]) {
            // Toggle off
            setExpandedVariantStats(prev => {
                const next = { ...prev };
                delete next[productId];
                return next;
            });
            return;
        }

        const variants = await getProductVariants(productId, productSlug);
        setExpandedVariantStats(prev => ({ ...prev, [productId]: variants }));
        // Deep copy for original state tracking
        setOriginalVariantStats(prev => ({ ...prev, [productId]: JSON.parse(JSON.stringify(variants)) }));
    };

    const handleStockChange = (productId: string, variantId: string, newStock: number) => {
        setExpandedVariantStats(prev => ({
            ...prev,
            [productId]: prev[productId].map(v => v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v)
        }));
    };

    const hasUnsavedChanges = (productId: string) => {
        const current = expandedVariantStats[productId];
        const original = originalVariantStats[productId];
        if (!current || !original) return false;
        return current.some((v, i) => v.stock !== original[i].stock);
    };

    const saveVariantStock = async (productId: string) => {
        setUpdatingStock(productId);
        const variants = expandedVariantStats[productId];
        const supabase = getSupabaseClient();

        if (!supabase) {
            // Mock mode saving — just update local UI state
            await new Promise(r => setTimeout(r, 800));
            setOriginalVariantStats(prev => ({ ...prev, [productId]: JSON.parse(JSON.stringify(variants)) }));
            setUpdatingStock(null);
            return;
        }

        // Real Supabase save
        let hasError = false;
        for (const v of variants) {
            const originalV = originalVariantStats[productId]?.find(ov => ov.id === v.id);
            if (originalV && originalV.stock !== v.stock) {
                const { error } = await supabase.from('product_variants').update({ stock: v.stock }).eq('id', v.id);
                if (error) {
                    console.error('[saveVariantStock]', error);
                    hasError = true;
                }
            }
        }

        if (!hasError) {
            setOriginalVariantStats(prev => ({ ...prev, [productId]: JSON.parse(JSON.stringify(variants)) }));
        } else {
            alert('Failed to save some stock updates. Check console.');
        }

        setUpdatingStock(null);
    };

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id: string) => {
        setProducts(p => p.filter(x => x.id !== id));
        setDeleteId(null);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Products</h1>
                    <p className="text-gray-400 text-sm mt-0.5">{products.length} total products in catalog</p>
                </div>
                <Link href="/admin/products/new"
                    className="bg-[#1a237e] hover:bg-[#0d1459] text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm transition-all shadow-md shadow-blue-900/20">
                    <Plus className="w-4 h-4" /> Add Product
                </Link>
            </div>

            {/* Search + Filters */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5 flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, category, SKU..."
                        className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#1a237e] transition-all" />
                </div>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#1a237e]">
                    <option value="">All Categories</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#1a237e]">
                    <option>All Stock</option>
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                </select>
            </div>

            {/* Delete confirmation modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="font-black text-gray-900">Delete Product?</h3>
                        </div>
                        <p className="text-gray-500 text-sm mb-5">This will permanently remove the product from the catalog. This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-all text-sm">Cancel</button>
                            <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-all text-sm">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Product table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                {['Product', 'Category', 'SKU', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center">
                                        <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-gray-400 text-sm">No products found</p>
                                    </td>
                                </tr>
                            ) : filtered.map(product => {
                                const totalStock = expandedVariantStats[product.id]
                                    ? expandedVariantStats[product.id].reduce((sum: number, v: ProductVariant) => sum + v.stock, 0)
                                    : product.stock;

                                return (
                                    <React.Fragment key={product.id}>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <p className="font-bold text-gray-800 text-sm leading-snug max-w-[220px] line-clamp-2">{product.name}</p>
                                                <p className="text-gray-400 text-xs mt-0.5">{product.brand}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="bg-[#eef2ff] text-[#1a237e] text-[11px] font-bold px-2 py-0.5 rounded-full">{product.category}</span>
                                            </td>
                                            <td className="px-4 py-4 font-mono text-xs text-gray-500">{product.sku}</td>
                                            <td className="px-4 py-4">
                                                <p className="font-black text-gray-800 text-sm">₹{product.price.toLocaleString('en-IN')}</p>
                                                <p className="text-gray-400 text-xs line-through">₹{product.mrp.toLocaleString('en-IN')}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => loadVariants(product.id, product.slug)}
                                                    className="flex items-center gap-1.5 hover:bg-gray-100 px-2 py-1 rounded"
                                                >
                                                    {totalStock === 0
                                                        ? <span className="bg-red-100 text-red-600 text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap">Out of Stock</span>
                                                        : totalStock < 20
                                                            ? <span className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap">Low: {totalStock}</span>
                                                            : <span className="bg-green-100 text-green-700 text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap">{totalStock} units</span>
                                                    }
                                                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${expandedVariantStats[product.id] ? 'rotate-180' : ''}`} />
                                                </button>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="flex items-center gap-1 text-amber-500 font-bold text-sm">⭐ {product.rating}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/products/${product.id}/edit`}
                                                        className="flex items-center gap-1.5 text-xs font-bold text-[#1a237e] border border-[#1a237e]/30 px-2.5 py-1.5 rounded-lg hover:bg-[#eef2ff] transition-all">
                                                        <Edit className="w-3 h-3" /> Edit
                                                    </Link>
                                                    <button onClick={() => setDeleteId(product.id)}
                                                        className="flex items-center gap-1.5 text-xs font-bold text-red-500 border border-red-200 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-all">
                                                        <Trash2 className="w-3 h-3" /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {expandedVariantStats[product.id] && (
                                            <tr className="bg-gray-50 border-t border-gray-100">
                                                <td colSpan={7} className="px-8 py-4">
                                                    <form onSubmit={e => e.preventDefault()}>
                                                        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                                                    <Layers className="w-4 h-4 text-[#1a237e]" /> Variant Stock Management
                                                                </h4>
                                                                {updatingStock === product.id ? (
                                                                    <span className="flex items-center gap-2 text-xs font-bold text-[#1a237e]">
                                                                        <span className="w-3 h-3 border-2 border-gray-300 border-t-[#1a237e] rounded-full animate-spin" /> Saving...
                                                                    </span>
                                                                ) : hasUnsavedChanges(product.id) ? (
                                                                    <button
                                                                        type="button" // important to prevent Next.js form submission redirect
                                                                        onClick={() => saveVariantStock(product.id)}
                                                                        className="bg-[#1a237e] hover:bg-[#0d1459] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-all shadow-sm"
                                                                    >
                                                                        <Save className="w-3 h-3" /> Save Changes
                                                                    </button>
                                                                ) : null}
                                                            </div>
                                                            <div className="space-y-2">
                                                                {expandedVariantStats[product.id].map(v => (
                                                                    <div key={v.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#1a237e]/30 transition-colors">
                                                                        <div className="flex items-center gap-4 flex-1">
                                                                            <span className="text-sm font-semibold text-gray-800 min-w-[120px]">{v.flavor}</span>
                                                                            <span className="text-xs font-bold bg-white text-gray-500 border border-gray-200 px-2 py-0.5 rounded shadow-sm">{v.size}</span>
                                                                            <span className="text-xs text-gray-400 font-mono ml-auto mr-4">{v.sku}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="text-xs font-medium text-gray-500">Stock:</span>
                                                                            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 w-24">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleStockChange(product.id, v.id, v.stock - 1)}
                                                                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded transition-colors"
                                                                                >-</button>
                                                                                <input
                                                                                    type="number"
                                                                                    value={v.stock}
                                                                                    onChange={(e) => handleStockChange(product.id, v.id, parseInt(e.target.value) || 0)}
                                                                                    className="w-8 text-center text-sm font-bold text-gray-800 outline-none p-0 hide-arrows"
                                                                                />
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleStockChange(product.id, v.id, v.stock + 1)}
                                                                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded transition-colors"
                                                                                >+</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </form>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}
