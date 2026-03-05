'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Product } from '@/types';
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
        <Link href={`/product/${product.slug || product.id}`} className="group block">
            <div className="product-card bg-white rounded-xl border border-gray-100 overflow-hidden h-full flex flex-col">

                {/* Image area */}
                <div className="relative bg-gray-50 aspect-square overflow-hidden">
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
                    <h3 className="text-gray-800 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#1a237e] transition-colors">
                        {product.name}
                    </h3>

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
                        {hasVariants && (
                            <button
                                onClick={e => { e.preventDefault(); }}
                                className="px-2.5 py-2 rounded-lg border border-[#1a237e] text-[#1a237e] text-xs font-bold hover:bg-[#f0f4ff] transition-all flex items-center gap-0.5 whitespace-nowrap"
                            >
                                2 Options <ChevronDown className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
