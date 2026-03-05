'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Tag, Ticket, CheckCircle, AlertCircle, Gift } from 'lucide-react';

export default function CartSlideout() {
    const {
        items, isOpen, closeCart, removeItem, updateQuantity,
        totalPrice, totalItems, coupon, applyCoupon, removeCoupon,
        discountAmount, finalTotal,
    } = useCartStore();

    const [couponInput, setCouponInput] = useState('');
    const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null);
    const [applying, setApplying] = useState(false);

    const subtotal = totalPrice();

    const handleApplyCoupon = async () => {
        setApplying(true);
        await new Promise((r) => setTimeout(r, 400));
        const result = applyCoupon(couponInput, subtotal);
        setCouponMsg({ text: result.message, ok: result.success });
        if (result.success) setCouponInput('');
        setApplying(false);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={closeCart}
                className={`fixed inset-0 bg-black/65 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-gray-200 z-50
          flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-black text-gray-900 flex items-center gap-2.5">
                        <ShoppingBag className="text-[#1a237e] w-5 h-5" />
                        My Cart
                        {totalItems() > 0 && (
                            <span className="bg-[#1a237e] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {totalItems()} items
                            </span>
                        )}
                    </h2>
                    <button
                        onClick={closeCart}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Free shipping progress */}
                {subtotal > 0 && subtotal < 999 && (
                    <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
                        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                            <span>Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for <span className="text-green-600 font-semibold">FREE delivery</span></span>
                            <span>{Math.round((subtotal / 999) * 100)}%</span>
                        </div>
                        <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#1a237e] to-green-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                )}
                {subtotal >= 999 && (
                    <div className="px-6 py-2 bg-green-50 border-b border-green-200 text-xs text-green-700 font-semibold">
                        🎉 You qualify for FREE delivery!
                    </div>
                )}

                {/* GWP teaser: shows when HyperWhey not in cart */}
                {/* Uses productSlug (stable for both mock IDs and Supabase UUIDs) */}
                {!items.find(i => i.productSlug === 'hyperwhey-pro-whey-protein') && (
                    <div className="mx-4 mt-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
                        <Gift className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div>
                            <p className="text-green-700 font-bold text-xs">🎁 FREE Creatine Offer!</p>
                            <p className="text-gray-500 text-[11px] leading-tight">Add HyperWhey Pro to unlock a FREE PureCre Creatine (₹999 value)</p>
                        </div>
                    </div>
                )}
                {items.find(i => i.productSlug === 'hyperwhey-pro-whey-protein') && (
                    <div className="mx-4 mt-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-3">
                        <Gift className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        <p className="text-orange-700 font-bold text-xs">✅ GWP Unlocked! FREE PureCre added to your order at checkout 🎁</p>
                    </div>
                )}

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
                            <ShoppingBag className="w-16 h-16 text-gray-200" />
                            <p className="text-gray-400 text-lg font-semibold">Your cart is empty</p>
                            <p className="text-gray-400 text-sm">Add some supplements to get started!</p>
                            <div className="mt-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-center">
                                <p className="text-[#1a237e] text-xs font-bold">🎁 Use code VNODE10 for 10% off!</p>
                            </div>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.variantId}
                                className="flex gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100 group"
                            >
                                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-gray-100">
                                    {item.imageUrl ? (
                                        <Image src={item.imageUrl} alt={item.productName} fill className="object-contain p-1" sizes="80px" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 rounded-lg" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">{item.productName}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">{item.flavor} · {item.size}</p>
                                    <p className="text-[#1a237e] font-black text-sm mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors">
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-gray-800 font-bold w-6 text-center text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors">
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                <button onClick={() => removeItem(item.variantId)} className="opacity-0 group-hover:opacity-100 self-start p-1 rounded-md hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-zinc-800 px-6 py-5 space-y-4">
                        {/* Coupon input */}
                        {!coupon ? (
                            <div>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input
                                            value={couponInput}
                                            onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponMsg(null); }}
                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                            placeholder="Enter coupon code"
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-orange-500/60 transition-all uppercase tracking-wider"
                                        />
                                    </div>
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={!couponInput.trim() || applying}
                                        className="px-4 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-all"
                                    >
                                        {applying ? '...' : 'Apply'}
                                    </button>
                                </div>
                                {couponMsg && (
                                    <p className={`flex items-center gap-1.5 text-xs mt-2 font-medium ${couponMsg.ok ? 'text-green-400' : 'text-red-400'}`}>
                                        {couponMsg.ok ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                        {couponMsg.text}
                                    </p>
                                )}
                                <p className="text-zinc-600 text-xs mt-1.5">Try: VNODE10, WELCOME20, FLAT200, PROTEIN15</p>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-green-400" />
                                    <div>
                                        <p className="text-green-400 text-sm font-bold">{coupon.code}</p>
                                        <p className="text-zinc-400 text-xs">{coupon.label}</p>
                                    </div>
                                </div>
                                <button onClick={removeCoupon} className="text-zinc-500 hover:text-red-400 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Price breakdown */}
                        <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between text-zinc-400">
                                <span>Subtotal ({totalItems()} items)</span>
                                <span>₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            {coupon && (
                                <div className="flex justify-between text-green-400 font-medium">
                                    <span>Discount ({coupon.code})</span>
                                    <span>−₹{discountAmount(subtotal).toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-zinc-400">
                                <span>Delivery</span>
                                <span className={subtotal >= 999 ? 'text-green-400 font-medium' : ''}>
                                    {subtotal >= 999 ? 'FREE' : '₹99'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                                <span className="text-white font-bold text-lg">Total</span>
                                <span className="text-white font-black text-2xl">
                                    ₹{finalTotal(subtotal).toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-orange-500/25 text-base"
                        >
                            Proceed to Checkout <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
