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
    ChevronDown, ChevronUp, Clock, Tag, BadgeCheck, CreditCard, TrendingUp
} from 'lucide-react';

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
        <div className="border-b last:border-0 border-gray-100">
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
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumb */}
            <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1.5 flex-wrap">
                <Link href="/" className="hover:text-[#1a237e] transition-colors">Home</Link>
                <span>›</span>
                <Link href="/products" className="hover:text-[#1a237e] transition-colors">Sports Nutrition</Link>
                <span>›</span>
                {product.brand && <Link href={`/brands/${product.brand.slug}`} className="hover:text-[#1a237e] transition-colors">{product.brand.name}</Link>}
                {product.brand && <span>›</span>}
                <span className="text-gray-900 font-semibold line-clamp-1">{product.name}</span>
            </nav>

            {/* 100% Authentic trust bar */}
            <div className="trust-bar flex items-center justify-around py-3 px-4 mb-6 rounded-xl border border-gray-100 bg-white shadow-sm">
                {[
                    { icon: ShieldCheck, label: '100% AUTHENTIC', sub: 'Sourced from brands' },
                    { icon: Truck, label: 'FREE SHIPPING', sub: 'On orders above ₹999' },
                    { icon: RotateCcw, label: 'EASY RETURNS', sub: 'Simple & easy exchanges' },
                    { icon: Users, label: '2 LAKH+ CUSTOMERS', sub: 'Happy customers, India' },
                ].map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-[#1a237e] flex-shrink-0" />
                        <div className="hidden sm:block">
                            <p className="text-gray-900 font-black text-[11px] uppercase tracking-wide">{label}</p>
                            <p className="text-gray-500 text-[11px] font-medium">{sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main PDP Grid - Hyugalife Professional Split Layout */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative">

                {/* ── Left Column: Sticky Vertical Gallery & Main Image ── */}
                <div className="lg:sticky lg:top-28 flex flex-col-reverse lg:flex-row gap-4 w-full lg:w-[45%] xl:w-[50%] flex-shrink-0 z-20">
                    {/* Thumbnails Strip */}
                    <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide w-full lg:w-auto">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`relative w-[60px] h-[60px] lg:w-[72px] lg:h-[72px] rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white ${i === activeImage ? 'border-[#1a237e] shadow-md' : 'border-gray-100 hover:border-gray-300'}`}
                            >
                                <Image src={img.url} alt={`View ${i + 1}`} fill className="object-contain p-1.5" sizes="80px" />
                            </button>
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="relative w-full aspect-[4/3] lg:aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex-1">
                        {/* "Lowest ₹ in India" badge (if discounted heavily) */}
                        {(discountPct ?? 0) > 15 && (
                            <div className="absolute top-4 left-0 bg-amber-100 text-amber-900 text-[11px] font-black tracking-wide px-3 py-1 rounded-r-lg z-10 shadow-sm">
                                ✅ Lowest ₹ In India
                            </div>
                        )}
                        <Image
                            src={images[activeImage]?.url ?? ''}
                            alt={images[activeImage]?.alt ?? product.name}
                            fill
                            className="object-contain p-8 lg:p-12 transition-all duration-300"
                            priority
                            sizes="(max-width: 1024px) 100vw, 600px"
                        />

                        {/* Social proof badge */}
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm">
                            <TrendingUp className="w-4 h-4 text-[#1a237e]" />
                            <span className="text-[#1a237e] text-xs font-bold tracking-tight">500+ also bought this recently</span>
                        </div>

                        {/* Wishlist + Share */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                            <button onClick={() => toggle(product)} className="p-2.5 bg-white border border-gray-100 rounded-full shadow-sm hover:bg-gray-50 transition-all group">
                                <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${isWishlisted(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                            </button>
                            <button className="p-2.5 bg-white border border-gray-100 rounded-full shadow-sm text-gray-400 hover:text-[#1a237e] hover:bg-gray-50 transition-all group">
                                <Share2 className="w-5 h-5 group-hover:scale-110" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Right Column: Product Details & Accordions ── */}
                <div className="w-full lg:w-[55%] xl:w-[50%] flex flex-col gap-5 pb-20">

                    {/* Title & Brand */}
                    <div className="border-b border-gray-100 pb-5">
                        <h1 className="text-gray-900 font-black text-2xl lg:text-3xl leading-snug mb-3">{product.name}</h1>

                        <div className="flex items-center justify-between flex-wrap gap-4">
                            {product.brand && (
                                <Link href={`/brands/${product.brand.slug}`} className="text-[#1a237e] text-sm font-semibold hover:underline inline-flex items-center gap-1">
                                    Visit the <strong>{product.brand.name}</strong> store →
                                </Link>
                            )}
                            <div className="flex items-center gap-4">
                                <StarRating rating={product.rating} count={product.review_count} />
                                {product.best_before && (
                                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                        <Clock className="w-3.5 h-3.5" /> Best before {product.best_before}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Price & Delivery Details */}
                    <div>
                        <div className="flex items-baseline gap-3 mb-1">
                            <span className="text-[32px] font-black text-gray-900 leading-none tracking-tight">₹{finalPrice.toLocaleString('en-IN')}</span>
                            {product.price_per_unit && (
                                <span className="text-gray-500 text-sm font-medium">({product.price_per_unit})</span>
                            )}
                            {discountPct && (
                                <span className="bg-[#4d7c0f] text-white text-[11px] font-black px-2 py-0.5 rounded tracking-wide">{discountPct}% OFF</span>
                            )}
                        </div>
                        {mrpFinal && (
                            <div className="flex items-center gap-2 text-sm mt-1">
                                <span className="text-gray-400 line-through decoration-gray-300">₹{mrpFinal.toLocaleString('en-IN')}</span>
                                <span className="text-gray-500">(Incl. of all taxes)</span>
                            </div>
                        )}
                        {savings > 0 && <p className="text-green-600 font-bold text-sm mt-1.5">You save ₹{savings.toLocaleString('en-IN')}</p>}

                        {/* Delivery Check */}
                        <div className="flex items-start gap-2 text-sm font-medium text-[#1a237e] bg-indigo-50/50 p-3 rounded-xl w-full max-w-sm mt-4 border border-indigo-100">
                            <Truck className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-700" />
                            <div className="flex-1">
                                {pincodeResult ? (
                                    <span className="text-indigo-900">{pincodeResult}</span>
                                ) : (
                                    <span>Get it in 2-4 hours <span className="underline cursor-pointer ml-1 text-indigo-700 hover:text-indigo-900">Change PIN</span></span>
                                )}
                                <div className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        value={pincode}
                                        onChange={e => { setPincode(e.target.value.replace(/\D/g, '').slice(0, 6)); setPincodeResult(null); }}
                                        placeholder="Enter Pincode"
                                        maxLength={6}
                                        className="w-32 border border-indigo-200 rounded-md px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#1a237e] focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <button onClick={checkPincode} className="px-3 py-1.5 bg-[#1a237e] text-white text-xs font-bold rounded-md hover:bg-indigo-900 transition-all shadow-sm">Check</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Extra 5% off coupon strip */}
                    <div className="border border-orange-200 bg-[#fff8eb] rounded-xl overflow-hidden relative shadow-sm">
                        <div className="p-4 md:p-5">
                            <div className="flex items-center justify-between mb-3 border-b border-orange-200/60 pb-3">
                                <span className="bg-[#ff6b35] text-white text-[11px] font-black px-2 py-0.5 rounded tracking-wide flex items-center gap-1.5">
                                    <Tag className="w-3 h-3" /> EXTRA 5% OFF
                                </span>
                                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Limited Offer</span>
                            </div>

                            <div className="flex justify-between items-center gap-4">
                                <div>
                                    <p className="text-gray-900 text-sm font-bold">Get it at <span className="text-lg text-[#1a237e]">₹{Math.round(finalPrice * 0.95).toLocaleString('en-IN')}!</span></p>
                                    <p className="text-gray-600 text-xs mt-0.5">Save an extra ₹{Math.round(finalPrice * 0.05)} on this order</p>
                                </div>
                                <button className="bg-[#1a237e] text-white px-5 py-2.5 text-sm font-bold rounded-lg hover:bg-[#0d1459] transition-colors whitespace-nowrap shadow-sm">Apply</button>
                            </div>
                            <div className="mt-3.5 pt-3.5 border-t border-orange-200/50 flex justify-between items-center text-xs">
                                <div className="border border-dashed border-gray-400 bg-white/80 px-2.5 py-1 font-mono text-gray-700 rounded font-bold tracking-wide">VNODE10</div>
                                <Link href="#" className="text-[#1a237e] font-semibold hover:underline flex items-center gap-1">Read more <ChevronDown className="w-3" /></Link>
                            </div>
                        </div>
                    </div>

                    {/* EMI */}
                    <div className="flex items-center justify-between text-sm border border-emerald-200 bg-emerald-50/40 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-emerald-700" />
                            <span className="text-gray-700"><strong className="text-gray-900 font-black">₹{Math.round(finalPrice / 3).toLocaleString('en-IN')}/month</strong> via EMI</span>
                        </div>
                        <span className="text-xs font-bold text-[#1a237e] hover:underline cursor-pointer">Details</span>
                    </div>

                    {/* Variant selector */}
                    <div>
                        <VariantSelector variants={variants} basePrice={product.base_price} onVariantChange={setSelectedVariant} />
                        {product.stock && product.stock < 50 && (
                            <div className="flex items-center gap-2 text-sm text-red-600 font-bold mt-3">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                Hurry, only {product.stock} left in stock!
                            </div>
                        )}
                    </div>

                    {/* Add to Cart (Sticky on mobile, inline on desktop) */}
                    <div className="sticky bottom-0 left-0 right-0 p-4 lg:p-0 bg-white lg:bg-transparent border-t lg:border-t-0 border-gray-200 z-30 -mx-4 sm:mx-0 mt-2">
                        <AddToCartButton product={product} selectedVariant={selectedVariant} finalPrice={finalPrice} />
                    </div>

                    {/* ── Accordion Information Sections ── */}
                    <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-sm mt-4 relative z-10">
                        <Accordion title="Product Description" defaultOpen={true} icon={<span className="text-base grayscale opacity-80">📝</span>}>
                            <p className="text-gray-600 px-2 pb-2 leading-relaxed">{product.long_description || product.description}</p>
                        </Accordion>

                        {product.how_to_use && product.how_to_use.length > 0 && (
                            <Accordion title="How to Use" icon={<span className="text-base grayscale opacity-80">🥤</span>}>
                                <ol className="space-y-3 mt-2 px-2 pb-2">
                                    {product.how_to_use.map((step, i) => (
                                        <li key={i} className="flex gap-3 text-gray-600">
                                            <span className="w-5 h-5 rounded-full bg-[#1a237e]/10 text-[#1a237e] flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">{i + 1}</span>
                                            <span className="leading-relaxed">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </Accordion>
                        )}

                        {product.nutrition && (
                            <Accordion title="Nutrition Facts" icon={<span className="text-base grayscale opacity-80">📊</span>}>
                                <div className="px-2 pb-2">
                                    <NutritionFacts
                                        servingSize={product.nutrition.servingSize}
                                        servingsPerContainer={product.nutrition.servingsPerContainer}
                                        facts={product.nutrition.facts}
                                    />
                                </div>
                            </Accordion>
                        )}

                        {product.ingredients && (
                            <Accordion title="Ingredients" icon={<span className="text-base grayscale opacity-80">🧪</span>}>
                                <p className="text-gray-600 px-2 pb-2 leading-relaxed">{product.ingredients}</p>
                            </Accordion>
                        )}

                        {product.certifications && product.certifications.length > 0 && (
                            <Accordion title="Certifications & Highlights" icon={<span className="text-base grayscale opacity-80">✨</span>}>
                                <div className="flex flex-wrap gap-2 px-2 pb-2 mt-1">
                                    {product.certifications.map(c => (
                                        <span key={c} className="flex items-center gap-1.5 bg-green-50 text-green-800 text-xs font-bold px-2.5 py-1.5 rounded-md border border-green-200">
                                            <BadgeCheck className="w-3.5 h-3.5 text-green-600" /> {c}
                                        </span>
                                    ))}
                                    {product.highlights?.map(h => (
                                        <span key={h} className="flex items-center gap-1 bg-gray-50 text-gray-700 text-xs font-bold px-2.5 py-1.5 rounded-md border border-gray-200">
                                            • {h}
                                        </span>
                                    ))}
                                </div>
                            </Accordion>
                        )}

                        <Accordion title="Additional Information" icon={<span className="text-base grayscale opacity-80">📋</span>}>
                            <div className="grid grid-cols-2 gap-y-3 text-sm border border-gray-100 rounded-xl p-4 bg-gray-50/50 m-2">
                                <div className="flex flex-col"><span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">FSSAI License</span><span className="font-black text-gray-800">10018022XXXXXXX</span></div>
                                <div className="flex flex-col"><span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Manufacturer</span><span className="font-bold text-gray-800">V-Node Pvt. Ltd.</span></div>
                                <div className="col-span-2 flex flex-col"><span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Address</span><span className="font-medium text-gray-800">Mumbai, Maharashtra, India</span></div>
                                <div className="col-span-2 flex flex-col"><span className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Country of Origin</span><span className="font-medium text-gray-800">India</span></div>
                            </div>
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    );
}
