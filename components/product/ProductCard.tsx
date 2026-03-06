'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Product, ProductVariant } from '@/types';
import { Star, Heart, ShoppingCart, Truck, ChevronDown, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

function StarRating({ rating, count }: { rating: number; count: number }) {
    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className={`w-3 h-3 ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                ))}
            </div>
            <span className="text-amber-600 text-xs font-bold">{rating.toFixed(1)}</span>
            <span className="text-gray-400 text-xs">({count.toLocaleString()})</span>
        </div>
    );
}

const DELIVERY_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
function getDeliveryDate() {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return `${DELIVERY_DAYS[d.getDay()]}, ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem, openCart } = useCartStore();
    const { toggle, isWishlisted } = useWishlistStore();
    const [adding, setAdding] = useState(false);
    const [showVariants, setShowVariants] = useState(false);
    const [loadingVariants, setLoadingVariants] = useState(false);
    const [variants, setVariants] = useState<ProductVariant[]>([]);
    const wishlisted = isWishlisted(product.id);

    const discountPct = product.mrp
        ? Math.round(((product.mrp - product.base_price) / product.mrp) * 100)
        : null;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (adding) return;
        setAdding(true);
        await new Promise(r => setTimeout(r, 300));
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
        setTimeout(() => setAdding(false), 1500);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        toggle(product);
    };

    const hasVariants = true; // In demo, always show "2 Options" CTA variant

    return (
        <div className={`product-card group flex flex-col h-full bg-white rounded-xl border border-gray-100 transition-all ${showVariants ? 'relative z-50' : 'relative z-0'}`}>

            {/* Image area */}
            <div className="relative bg-gray-50 aspect-square overflow-hidden rounded-t-[11px]">
                <Link href={`/product/${product.slug || product.id}`} className="block w-full h-full">
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-contain p-3 group-hover:scale-105 transition-transform duration-400"
                            sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-20 h-20 bg-gray-200 rounded-full" />
                        </div>
                    )}
                </Link>

                {/* Top left: cert badge */}
                {product.certifications && product.certifications.length > 0 && (
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className="cert-badge">{product.certifications[0]} ✓</span>
                    </div>
                )}

                {/* Top right: discount + wishlist */}
                <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end">
                    {discountPct && (
                        <span className="bg-[#1a237e] text-white text-[11px] font-black px-2 py-0.5 rounded">
                            {discountPct}% OFF
                        </span>
                    )}
                </div>

                {/* Wishlist heart */}
                <button
                    onClick={handleWishlist}
                    className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white shadow border border-gray-100 hover:border-red-300 transition-all opacity-0 group-hover:opacity-100"
                >
                    <Heart className={`w-3.5 h-3.5 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>

                {/* Social proof overlay */}
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-0.5 flex items-center gap-1 text-[10px] text-gray-600 font-semibold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    🔥 500+ bought recently
                </div>
            </div>

            {/* Body */}
            <div className="p-3 flex-1 flex flex-col gap-1.5">
                {/* Brand */}
                {product.brand && (
                    <p className="text-[11px] font-semibold text-[#1a237e] uppercase tracking-wide">{product.brand.name}</p>
                )}

                {/* Title */}
                <Link href={`/product/${product.slug || product.id}`} className="block">
                    <h3 className="text-gray-800 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#1a237e] transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <StarRating rating={product.rating} count={product.review_count} />

                {/* Price */}
                <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-gray-900 font-black text-lg">
                        ₹{product.base_price.toLocaleString('en-IN')}
                    </span>
                    {product.price_per_unit && (
                        <span className="text-gray-400 text-[11px]">({product.price_per_unit})</span>
                    )}
                </div>
                {product.mrp && (
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                        {discountPct && (
                            <span className="text-green-600 text-xs font-bold">{discountPct}% OFF</span>
                        )}
                    </div>
                )}

                {/* Delivery */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                    <Truck className="w-3.5 h-3.5 text-[#1a237e]" />
                    <span>Get it by <span className="font-semibold text-gray-700">{getDeliveryDate()}</span></span>
                </div>

                {/* Authentic */}
                <div className="flex items-center gap-1 text-[11px] text-green-700 font-semibold">
                    <ShieldCheck className="w-3 h-3" /> 100% Authentic
                </div>

                {/* CTA buttons */}
                <div className="mt-auto pt-2 flex gap-2">
                    <button
                        onClick={handleAddToCart}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${adding
                            ? 'bg-green-500 text-white'
                            : 'bg-[#1a237e] hover:bg-[#0d1459] text-white'
                            }`}
                    >
                        {adding
                            ? '✓ Added!'
                            : <><ShoppingCart className="w-3.5 h-3.5" /> Add to cart</>
                        }
                    </button>

                    <div className="relative">
                        <button
                            onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (showVariants) {
                                    setShowVariants(false);
                                    return;
                                }
                                setLoadingVariants(true);
                                setShowVariants(true);
                                const { getProductVariants } = await import('@/lib/products');
                                const v = await getProductVariants(product.id, product.slug);
                                setVariants(v);
                                setLoadingVariants(false);
                            }}
                            className="px-2.5 py-2 rounded-lg border border-[#1a237e] text-[#1a237e] text-xs font-bold hover:bg-[#f0f4ff] transition-all flex items-center gap-0.5 whitespace-nowrap h-full bg-white"
                        >
                            Options <ChevronDown className={`w-3 h-3 transition-transform ${showVariants ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {showVariants && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowVariants(false); }} />
                                <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-20 overflow-hidden" onClick={e => e.preventDefault()}>
                                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Select Variant</span>
                                        <button onClick={() => setShowVariants(false)} className="text-gray-400 hover:text-gray-600">×</button>
                                    </div>
                                    <div className="max-h-48 overflow-y-auto p-2 scrollbar-thin">
                                        {loadingVariants ? (
                                            <div className="py-4 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                                                <span className="w-3 h-3 border-2 border-gray-300 border-t-[#1a237e] rounded-full animate-spin" /> Loading...
                                            </div>
                                        ) : variants.length === 0 ? (
                                            <div className="py-4 text-center text-xs text-red-500">Out of stock</div>
                                        ) : (
                                            <div className="space-y-1">
                                                {variants.map(v => (
                                                    <button
                                                        key={v.id}
                                                        onClick={async (e) => {
                                                            e.preventDefault();
                                                            if (v.stock <= 0) return;
                                                            setShowVariants(false);
                                                            setAdding(true);
                                                            await new Promise(r => setTimeout(r, 300));
                                                            addItem({
                                                                variantId: v.id,
                                                                productId: product.id,
                                                                productName: product.name,
                                                                productSlug: product.slug,
                                                                imageUrl: product.image_url,
                                                                flavor: v.flavor,
                                                                size: v.size,
                                                                price: product.base_price + v.price_adjustment,
                                                            });
                                                            openCart();
                                                            setTimeout(() => setAdding(false), 1500);
                                                        }}
                                                        disabled={v.stock <= 0}
                                                        className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex flex-col gap-0.5 ${v.stock > 0 ? 'hover:bg-[#f0f4ff] hover:text-[#1a237e]' : 'opacity-50 cursor-not-allowed bg-gray-50'}`}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <span className="font-bold">{v.flavor}</span>
                                                            <span className="font-bold whitespace-nowrap">₹{(product.base_price + v.price_adjustment).toLocaleString('en-IN')}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-[10px] text-gray-500">
                                                            <span>{v.size}</span>
                                                            {v.stock <= 0 ? (
                                                                <span className="text-red-500 font-semibold">Out of stock</span>
                                                            ) : v.stock < 10 ? (
                                                                <span className="text-orange-500 font-semibold">Only {v.stock} left</span>
                                                            ) : null}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
