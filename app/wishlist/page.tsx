'use client';

import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Star } from 'lucide-react';

export default function WishlistPage() {
    const { items, remove, clear } = useWishlistStore();
    const { addItem, openCart } = useCartStore();

    const handleAddToCart = (product: (typeof items)[0]) => {
        addItem({
            variantId: `${product.id}-default`,
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            imageUrl: product.image_url,
            flavor: 'Default',
            size: '1kg',
            price: product.base_price,
        });
        openCart();
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6 fill-red-500 text-red-500" />
                    <h1 className="text-2xl font-black text-gray-900">My Wishlist</h1>
                    {items.length > 0 && (
                        <span className="bg-gray-100 text-gray-600 text-sm font-bold px-3 py-0.5 rounded-full">{items.length} items</span>
                    )}
                </div>
                {items.length > 0 && (
                    <button onClick={clear} className="text-sm text-red-500 hover:text-red-700 font-semibold flex items-center gap-1.5">
                        <Trash2 className="w-3.5 h-3.5" /> Clear All
                    </button>
                )}
            </div>

            {items.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 py-20 text-center">
                    <p className="text-5xl mb-4">💔</p>
                    <h2 className="text-xl font-black text-gray-900 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-400 text-sm mb-6">Browse our catalog and heart the products you love!</p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 bg-[#1a237e] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#0d1459] transition-all"
                    >
                        Shop Now <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(product => {
                        const discountPct = product.mrp
                            ? Math.round(((product.mrp - product.base_price) / product.mrp) * 100)
                            : null;

                        return (
                            <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden product-card">
                                {/* Image */}
                                <Link href={`/product/${product.slug || product.id}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
                                    {product.image_url ? (
                                        <Image
                                            src={product.image_url}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-4 hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100" />
                                    )}
                                    {discountPct && (
                                        <span className="absolute top-2 right-2 bg-[#1a237e] text-white text-[11px] font-black px-2 py-0.5 rounded">
                                            {discountPct}% OFF
                                        </span>
                                    )}
                                </Link>

                                {/* Body */}
                                <div className="p-4">
                                    {product.brand && (
                                        <p className="text-[11px] font-bold text-[#1a237e] uppercase tracking-wide mb-0.5">{product.brand.name}</p>
                                    )}
                                    <Link href={`/product/${product.slug || product.id}`}>
                                        <h3 className="text-gray-800 font-semibold text-sm leading-snug line-clamp-2 hover:text-[#1a237e] transition-colors mb-2">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star key={i} className={`w-3 h-3 ${i <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                                            ))}
                                        </div>
                                        <span className="text-amber-600 text-xs font-bold">{product.rating.toFixed(1)}</span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span className="text-gray-900 font-black text-lg">₹{product.base_price.toLocaleString('en-IN')}</span>
                                        {product.mrp && <span className="text-gray-400 text-xs line-through">₹{product.mrp.toLocaleString('en-IN')}</span>}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="flex-1 bg-[#1a237e] hover:bg-[#0d1459] text-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                                        </button>
                                        <button
                                            onClick={() => remove(product.id)}
                                            className="p-2.5 border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-200 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {items.length > 0 && (
                <div className="mt-8 text-center">
                    <Link href="/products" className="text-[#1a237e] font-semibold text-sm hover:underline flex items-center justify-center gap-1.5">
                        Continue Shopping <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}
