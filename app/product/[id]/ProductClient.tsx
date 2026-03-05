'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, ProductVariant } from '@/types';
import AddToCartButton from '@/components/product/AddToCartButton';
import VariantSelector from '@/components/product/VariantSelector';
import NutritionFacts from '@/components/product/NutritionFacts';
import { useWishlistStore } from '@/store/wishlistStore';
import {
    Star, Heart, Share2, Truck, ShieldCheck, RotateCcw, Users,
    ChevronDown, ChevronUp, MapPin, Clock, Tag, BadgeCheck, CreditCard
} from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────────────────────────
function getDeliveryDate(days = 2) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

function StarRating({ rating, count }: { rating: number; count: number }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 bg-amber-500 px-2 py-0.5 rounded text-white text-sm font-bold">
                {rating.toFixed(1)} <Star className="w-3.5 h-3.5 fill-white ml-0.5" />
            </div>
            <span className="text-[#1a237e] text-sm font-semibold underline cursor-pointer">
                {count.toLocaleString()} ratings
            </span>
        </div>
    );
}

function Accordion({ title, children, defaultOpen = false, icon }: { title: string; children: React.ReactNode; defaultOpen?: boolean; icon?: React.ReactNode }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-100">
            <button onClick={() => setOpen(o => !o)} className="flex items-center justify-between w-full py-4 px-1 text-left">
                <div className="flex items-center gap-2">
                    {icon && <span className="text-lg">{icon}</span>}
                    <span className="font-bold text-gray-800 text-sm">{title}</span>
                </div>
                {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {open && <div className="pb-4 px-1 text-sm text-gray-600 leading-relaxed">{children}</div>}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
interface ProductClientProps {
    product: Product;
    variants: ProductVariant[];
}

export default function ProductClient({ product, variants }: ProductClientProps) {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(variants[0] ?? null);
    const [activeImage, setActiveImage] = useState(0);
    const [pincode, setPincode] = useState('');
    const [pincodeResult, setPincodeResult] = useState<string | null>(null);
    const { toggle, isWishlisted } = useWishlistStore();

    const finalPrice = selectedVariant
        ? product.base_price + selectedVariant.price_adjustment
        : product.base_price;
    const mrpFinal = product.mrp
        ? product.mrp + (selectedVariant?.price_adjustment ?? 0)
        : null;
    const discountPct = mrpFinal ? Math.round(((mrpFinal - finalPrice) / mrpFinal) * 100) : null;
    const savings = mrpFinal ? mrpFinal - finalPrice : 0;

    const images = product.images && product.images.length > 0
        ? product.images
        : [{ url: product.image_url ?? '', alt: product.name }];

    const checkPincode = () => {
        if (!pincode.match(/^\d{6}$/)) { setPincodeResult('Enter a valid 6-digit pincode'); return; }
        setPincodeResult(`✅ Delivery available — Get by ${getDeliveryDate(3)}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumb */}
            <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap">
                <Link href="/" className="hover:text-[#1a237e]">Home</Link>
                <span>›</span>
                <Link href="/products" className="hover:text-[#1a237e]">Sports Nutrition</Link>
                <span>›</span>
                {product.brand && <Link href={`/brands/${product.brand.slug}`} className="hover:text-[#1a237e]">{product.brand.name}</Link>}
                {product.brand && <span>›</span>}
                <span className="text-gray-700 font-medium line-clamp-1">{product.name}</span>
            </nav>

            {/* 100% Authentic trust bar */}
            <div className="trust-bar flex items-center justify-around py-3 px-4 mb-6 rounded-xl">
                {[
                    { icon: ShieldCheck, label: '100% AUTHENTIC', sub: 'Sourced from brands' },
                    { icon: Truck, label: 'FREE SHIPPING', sub: 'On orders above ₹999' },
                    { icon: RotateCcw, label: 'EASY RETURNS', sub: 'Simple & easy exchanges' },
                    { icon: Users, label: '2 LAKH+ CUSTOMERS', sub: 'Happy customers, India' },
                ].map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-[#1a237e] flex-shrink-0" />
                        <div className="hidden sm:block">
                            <p className="text-gray-800 font-bold text-[11px] uppercase tracking-wide">{label}</p>
                            <p className="text-gray-500 text-[11px]">{sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main PDP grid */}
            <div className="grid lg:grid-cols-[auto,1fr,380px] gap-6 lg:gap-8">

                {/* ── Vertical thumbnail strip ──────────────────────────── */}
                <div className="hidden lg:flex flex-col gap-2">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveImage(i)}
                            className={`relative w-[72px] h-[72px] rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${i === activeImage ? 'border-[#1a237e] shadow-md' : 'border-gray-200 hover:border-gray-400'
                                }`}
                        >
                            <Image src={img.url} alt={`View ${i + 1}`} fill className="object-contain p-1.5" sizes="72px" />
                        </button>
                    ))}
                </div>

                {/* ── Main image ───────────────────────────────────────── */}
                <div className="relative">
                    <div className="relative aspect-square bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                        <Image
                            src={images[activeImage]?.url ?? ''}
                            alt={images[activeImage]?.alt ?? product.name}
                            fill
                            className="object-contain p-6"
                            priority
                            sizes="(max-width: 1024px) 100vw, 45vw"
                        />

                        {/* Social proof badge */}
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                            <span className="text-[#1a237e] text-xs font-bold">📈 500+ also bought this recently</span>
                        </div>

                        {/* Wishlist + Share */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                            <button
                                onClick={() => toggle(product)}
                                className="p-2 bg-white border border-gray-100 rounded-full shadow-sm hover:border-red-300 transition-all"
                            >
                                <Heart className={`w-4 h-4 transition-colors ${isWishlisted(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                            </button>
                            <button className="p-2 bg-white border border-gray-100 rounded-full shadow-sm text-gray-400 hover:text-[#1a237e] transition-all">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile thumbnail strip */}
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1 lg:hidden">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? 'border-[#1a237e]' : 'border-gray-200'
                                    }`}
                            >
                                <Image src={img.url} alt="" fill className="object-contain p-1" sizes="64px" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Right: Product info ──────────────────────────────── */}
                <div className="space-y-4">
                    {/* Brand */}
                    {product.brand && (
                        <Link href={`/brands/${product.brand.slug}`} className="text-[#1a237e] text-sm font-semibold hover:underline inline-flex items-center gap-1">
                            Visit the <strong>{product.brand.name}</strong> store →
                        </Link>
                    )}

                    {/* Title */}
                    <h1 className="text-gray-900 font-black text-xl leading-snug">{product.name}</h1>

                    {/* Rating + best before */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <StarRating rating={product.rating} count={product.review_count} />
                        {product.best_before && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg">
                                <Clock className="w-3.5 h-3.5" /> Best before {product.best_before}
                            </div>
                        )}
                    </div>

                    {/* Certifications */}
                    {product.certifications && product.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {product.certifications.map(c => (
                                <span key={c} className="cert-badge flex items-center gap-1">
                                    <BadgeCheck className="w-3 h-3" /> {c}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Price block */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-baseline gap-3 mb-1">
                            <span className="text-3xl font-black text-gray-900">₹{finalPrice.toLocaleString('en-IN')}</span>
                            {product.price_per_unit && (
                                <span className="text-gray-400 text-sm">({product.price_per_unit})</span>
                            )}
                            {discountPct && (
                                <span className="bg-[#1a237e] text-white text-xs font-black px-2 py-0.5 rounded">{discountPct}% OFF</span>
                            )}
                        </div>
                        {mrpFinal && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-400 line-through">₹{mrpFinal.toLocaleString('en-IN')}</span>
                                <span className="text-gray-500">(Incl. of all taxes)</span>
                            </div>
                        )}
                        {savings > 0 && (
                            <p className="text-green-600 font-semibold text-sm mt-1">You save ₹{savings.toLocaleString('en-IN')}</p>
                        )}
                    </div>

                    {/* Extra 5% off coupon strip */}
                    <div className="coupon-strip flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#ff6b35] text-white text-[10px] font-black px-2 py-1 rounded uppercase">EXTRA 5% OFF</div>
                            <div>
                                <p className="text-gray-800 text-sm font-semibold">Get it at ₹{Math.round(finalPrice * 0.95).toLocaleString('en-IN')}!</p>
                                <p className="text-gray-500 text-xs">Use code <strong className="text-gray-800">VNODE10</strong> at checkout</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">LIMITED OFFER</p>
                    </div>

                    {/* EMI */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                        <CreditCard className="w-4 h-4 text-[#1a237e]" />
                        <span>₹{Math.round(finalPrice / 3).toLocaleString('en-IN')}/month via No-cost EMI</span>
                        <span className="ml-auto text-xs text-[#1a237e] font-semibold cursor-pointer hover:underline">Details</span>
                    </div>

                    {/* Delivery estimate */}
                    <div className="flex items-start gap-2 text-sm">
                        <Truck className="w-4 h-4 text-[#1a237e] mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <span className="text-gray-600">Get it by <strong className="text-gray-800">{getDeliveryDate()}</strong></span>
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    value={pincode}
                                    onChange={e => { setPincode(e.target.value.replace(/\D/g, '').slice(0, 6)); setPincodeResult(null); }}
                                    placeholder="Enter Pincode"
                                    maxLength={6}
                                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-[#1a237e]"
                                />
                                <button onClick={checkPincode} className="px-3 py-1.5 bg-[#1a237e] text-white text-sm font-semibold rounded-lg hover:bg-[#0d1459] transition-all">
                                    Check
                                </button>
                            </div>
                            {pincodeResult && <p className="text-xs mt-1.5 text-gray-600 font-medium">{pincodeResult}</p>}
                        </div>
                    </div>

                    {/* Low stock */}
                    {product.stock && product.stock < 50 && (
                        <div className="flex items-center gap-2 text-sm text-orange-600 font-semibold">
                            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                            Only {product.stock} left in stock
                        </div>
                    )}

                    {/* Variant selector */}
                    <VariantSelector variants={variants} basePrice={product.base_price} onVariantChange={setSelectedVariant} />

                    {/* Add to Cart */}
                    <AddToCartButton product={product} selectedVariant={selectedVariant} finalPrice={finalPrice} />

                    {/* Coupon teaser */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                        <Tag className="w-3.5 h-3.5 text-[#ff6b35]" />
                        <span>Also valid: <span className="font-bold text-gray-700">WELCOME20</span> (20% off first order) | <span className="font-bold text-gray-700">FLAT200</span> (₹200 off on ₹1500+)</span>
                    </div>
                </div>
            </div>

            {/* ── Accordion Information Sections ──────────────────────────── */}
            <div className="mt-10 grid lg:grid-cols-[2fr,1fr] gap-8">
                <div className="bg-white rounded-xl border border-gray-100 px-6 py-2">
                    <Accordion title="How to Use" defaultOpen={true} icon="🥤">
                        {product.how_to_use && product.how_to_use.length > 0 ? (
                            <ol className="space-y-2">
                                {product.how_to_use.map((step, i) => (
                                    <li key={i} className="flex gap-3">
                                        <span className="w-5 h-5 rounded-full bg-[#1a237e] text-white flex items-center justify-center text-[11px] font-black flex-shrink-0 mt-0.5">{i + 1}</span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        ) : <p>Mix 1 scoop with 200-250ml cold water or milk. Shake well. Consume within 30 minutes of workout.</p>}
                    </Accordion>

                    <Accordion title="Description" icon="📝">
                        <p>{product.long_description || product.description}</p>
                    </Accordion>

                    <Accordion title="Highlights" icon="✨">
                        {product.highlights ? (
                            <ul className="space-y-1.5">
                                {product.highlights.map((h, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-[#1a237e] font-bold">•</span> {h}
                                    </li>
                                ))}
                            </ul>
                        ) : <p>See product label for complete list of highlights.</p>}
                    </Accordion>

                    <Accordion title="Product Information" icon="ℹ️">
                        <div className="grid grid-cols-2 gap-y-3 text-sm">
                            {product.brand && <><span className="text-gray-500">Brand</span><span className="font-semibold text-gray-800">{product.brand.name}</span></>}
                            {product.best_before && <><span className="text-gray-500">Best Before</span><span className="font-semibold text-gray-800">{product.best_before}</span></>}
                            {product.category_id && <><span className="text-gray-500">Category</span><span className="font-semibold text-gray-800">{product.category_id.replace('cat-', '').charAt(0).toUpperCase() + product.category_id.replace('cat-', '').slice(1)}</span></>}
                            {product.certifications && <><span className="text-gray-500">Certifications</span><span className="font-semibold text-gray-800">{product.certifications.join(', ')}</span></>}
                            <span className="text-gray-500">Country of Origin</span><span className="font-semibold text-gray-800">India</span>
                        </div>
                    </Accordion>

                    {product.ingredients && (
                        <Accordion title="Ingredients" icon="🧪">
                            <p className="text-gray-600">{product.ingredients}</p>
                        </Accordion>
                    )}

                    <Accordion title="Additional Information" icon="📋">
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <span className="text-gray-500">FSSAI License</span><span className="font-semibold text-gray-800">10018022XXXXXXX</span>
                            <span className="text-gray-500">Manufacturer</span><span className="font-semibold text-gray-800">V-Node Dynamics Pvt. Ltd.</span>
                            <span className="text-gray-500">Address</span><span className="font-semibold text-gray-800">Mumbai, Maharashtra, India</span>
                        </div>
                    </Accordion>
                </div>

                {/* Nutrition panel (right column) */}
                {product.nutrition && (
                    <div>
                        <h3 className="font-black text-gray-900 text-base mb-3">Nutrition Facts</h3>
                        <NutritionFacts
                            servingSize={product.nutrition.servingSize}
                            servingsPerContainer={product.nutrition.servingsPerContainer}
                            facts={product.nutrition.facts}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
