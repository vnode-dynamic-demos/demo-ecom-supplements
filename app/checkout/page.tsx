'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { ArrowRight, ShieldCheck, Truck, MapPin, Loader2, Check } from 'lucide-react';

interface AddressForm {
    name: string; email: string; phone: string;
    line1: string; city: string; state: string; pincode: string;
}
const BLANK: AddressForm = { name: '', email: '', phone: '', line1: '', city: '', state: '', pincode: '' };
const STATES = ['Andhra Pradesh', 'Delhi', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'];

export default function CheckoutPage() {
    const { items, totalPrice, coupon, discountAmount, finalTotal, clearCart } = useCartStore();
    const [addr, setAddr] = useState<AddressForm>({ ...BLANK });
    const [payMethod, setPayMethod] = useState<'upi' | 'card' | 'cod'>('upi');
    const [stage, setStage] = useState<'address' | 'payment' | 'success'>('address');
    const [paying, setPaying] = useState(false);
    const [orderId, setOrderId] = useState('');

    const subtotal = totalPrice();
    const discount = discountAmount?.(subtotal) ?? 0;
    const delivery = subtotal >= 999 ? 0 : 79;
    const total = (finalTotal?.(subtotal) ?? (subtotal - discount)) + delivery;
    const addrOk = addr.name && addr.phone && addr.line1 && addr.city && addr.state && addr.pincode;

    const launchPayment = async () => {
        setPaying(true);
        await new Promise(r => setTimeout(r, 2000));
        const newId = `VN${Date.now().toString().slice(-7)}`;
        setOrderId(newId);
        setStage('success');
        clearCart();
        setPaying(false);
        // ── Production Razorpay snippet ──────────────────────────────────────────
        // const res = await fetch('/api/create-order', { method:'POST', body: JSON.stringify({ amount: Math.round(total*100) }) });
        // const { razorpay_order_id } = await res.json();
        // new (window as any).Razorpay({ key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        //   amount: Math.round(total*100), currency:'INR', name:'V-Node Nutra',
        //   order_id: razorpay_order_id, prefill:{name:addr.name,email:addr.email,contact:addr.phone},
        //   theme:{color:'#1a237e'},
        //   handler:(r:any)=>{ fetch('/api/verify-payment',{method:'POST',body:JSON.stringify(r)}); setOrderId(razorpay_order_id); setStage('success'); clearCart(); }
        // }).open();
    };

    if (!items.length && stage !== 'success') return (
        <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
            <div className="text-center bg-white rounded-2xl p-12 border border-gray-100 shadow-sm">
                <p className="text-6xl mb-4">🛒</p>
                <p className="text-gray-800 font-black text-2xl mb-2">Your cart is empty</p>
                <p className="text-gray-400 text-sm mb-6">Add some supplements to get started!</p>
                <Link href="/products" className="bg-[#1a237e] text-white font-bold px-8 py-3.5 rounded-xl inline-flex items-center gap-2 hover:bg-[#0d1459] transition-all">
                    Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </main>
    );

    if (stage === 'success') return (
        <main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
            <div className="max-w-md mx-auto text-center px-4">
                <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-green-200">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed! 🎉</h1>
                    <p className="text-gray-400 text-sm mb-5">Thank you, {addr.name || 'Customer'}! You'll receive a confirmation SMS &amp; email shortly.</p>
                    <div className="bg-[#eef2ff] border border-blue-200 rounded-xl p-4 mb-6">
                        <p className="text-[#1a237e] text-xs font-bold uppercase tracking-wider mb-1">Your Order ID</p>
                        <p className="text-[#1a237e] font-black font-mono text-2xl">{orderId}</p>
                        <p className="text-gray-400 text-xs mt-1">Save this for tracking</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Link href={`/track?id=${orderId}`} className="bg-[#1a237e] hover:bg-[#0d1459] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
                            <Truck className="w-4 h-4" /> Track Your Order
                        </Link>
                        <Link href="/" className="border border-gray-200 text-gray-600 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-all">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );

    return (
        <main className="min-h-screen bg-[#f5f5f5] pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
                    <Link href="/" className="hover:text-[#1a237e]">Home</Link> /
                    <Link href="/products" className="hover:text-[#1a237e]">Products</Link> /
                    <span className="text-gray-700 font-semibold">Checkout</span>
                </nav>

                <h1 className="text-2xl font-black text-gray-900 mb-6">Secure Checkout</h1>

                <div className="grid lg:grid-cols-[1fr_360px] gap-6">
                    {/* LEFT */}
                    <div className="space-y-5">
                        {/* Address */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-7 h-7 bg-[#1a237e] rounded-full flex items-center justify-center text-white font-black text-sm">1</div>
                                <h2 className="text-gray-800 font-black flex items-center gap-2"><MapPin className="w-4 h-4 text-[#1a237e]" /> Delivery Address</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {([
                                    { key: 'name', label: 'Full Name *', placeholder: 'Rohan Sharma', span: false, type: 'text' },
                                    { key: 'phone', label: 'Mobile *', placeholder: '+91 98XXXX1234', span: false, type: 'tel' },
                                    { key: 'email', label: 'Email', placeholder: 'you@email.com', span: true, type: 'email' },
                                    { key: 'line1', label: 'Address *', placeholder: 'Flat, Street, Area, Landmark', span: true, type: 'text' },
                                    { key: 'city', label: 'City *', placeholder: 'Mumbai', span: false, type: 'text' },
                                    { key: 'pincode', label: 'Pincode *', placeholder: '400001', span: false, type: 'text' },
                                ] as const).map(({ key, label, placeholder, span, type }) => (
                                    <div key={key} className={span ? 'sm:col-span-2' : ''}>
                                        <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5">{label}</label>
                                        <input type={type} value={addr[key]} onChange={e => setAddr(a => ({ ...a, [key]: e.target.value }))}
                                            placeholder={placeholder}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-[#1a237e] transition-all" />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5">State *</label>
                                    <select value={addr.state} onChange={e => setAddr(a => ({ ...a, state: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-[#1a237e] transition-all bg-white">
                                        <option value="">Select State</option>
                                        {STATES.map(s => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-7 h-7 bg-[#1a237e] rounded-full flex items-center justify-center text-white font-black text-sm">2</div>
                                <h2 className="text-gray-800 font-black">Payment Method</h2>
                            </div>
                            <div className="space-y-3 mb-5">
                                {[
                                    { id: 'upi', label: 'UPI / QR Code', sub: 'PhonePe, GPay, Paytm, BHIM UPI', badge: 'RECOMMENDED' },
                                    { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', badge: '' },
                                    { id: 'cod', label: 'Cash on Delivery', sub: '+₹50 COD charge', badge: '' },
                                ].map(opt => (
                                    <label key={opt.id} className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all ${payMethod === opt.id ? 'border-[#1a237e] bg-[#eef2ff]' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input type="radio" name="pay" value={opt.id} checked={payMethod === opt.id} onChange={() => setPayMethod(opt.id as typeof payMethod)} className="accent-[#1a237e]" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-800 text-sm">{opt.label}</span>
                                                {opt.badge && <span className="bg-green-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{opt.badge}</span>}
                                            </div>
                                            <p className="text-gray-400 text-xs">{opt.sub}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-5 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <p className="text-gray-500 text-xs">All transactions are 256-bit SSL encrypted. Your card data is never stored.</p>
                            </div>
                            <button onClick={launchPayment} disabled={!addrOk || paying}
                                className="w-full bg-[#1a237e] hover:bg-[#0d1459] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-base py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-md shadow-blue-900/20">
                                {paying ? (<><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>) : (<><ShieldCheck className="w-5 h-5" /> Pay ₹{(total + (payMethod === 'cod' ? 50 : 0)).toLocaleString('en-IN')} Securely</>)}
                            </button>
                            {!addrOk && <p className="text-gray-400 text-xs text-center mt-2">Complete all required address fields (*) to proceed</p>}
                        </div>
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                            <h3 className="text-gray-800 font-black mb-4">Order Summary ({items.length} items)</h3>
                            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                                {items.map(item => (
                                    <div key={item.variantId} className="flex items-center gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-700 text-sm font-semibold leading-tight truncate">{item.productName}</p>
                                            <p className="text-gray-400 text-xs">{item.flavor} · {item.size} · Qty {item.quantity}</p>
                                            {item.isFree && <span className="bg-green-50 text-green-700 font-black text-[10px] px-1.5 py-0.5 rounded">FREE 🎁</span>}
                                        </div>
                                        <span className={`font-bold text-sm flex-shrink-0 ${item.isFree ? 'text-green-600' : 'text-gray-800'}`}>
                                            {item.isFree ? '₹0' : `₹${(item.price * item.quantity).toLocaleString('en-IN')}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                                {discount > 0 && <div className="flex justify-between text-green-600 font-semibold"><span>Coupon ({coupon?.code})</span><span>−₹{discount.toLocaleString('en-IN')}</span></div>}
                                <div className="flex justify-between text-gray-500">
                                    <span>Delivery</span>
                                    <span className={delivery === 0 ? 'text-green-600 font-bold' : ''}>{delivery === 0 ? 'FREE' : `₹${delivery}`}</span>
                                </div>
                                {payMethod === 'cod' && <div className="flex justify-between text-orange-500"><span>COD Charge</span><span>₹50</span></div>}
                                <div className="flex justify-between text-gray-900 font-black text-base border-t border-gray-100 pt-3">
                                    <span>Total</span>
                                    <span>₹{(total + (payMethod === 'cod' ? 50 : 0)).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                        {/* Trust badges */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2.5">
                            {[
                                { icon: ShieldCheck, text: '100% Authentic Products', color: 'text-blue-600' },
                                { icon: Truck, text: 'Free Delivery above ₹999', color: 'text-green-600' },
                                { icon: Check, text: '7-Day Easy Returns', color: 'text-orange-600' },
                            ].map(({ icon: Icon, text, color }) => (
                                <div key={text} className="flex items-center gap-3">
                                    <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                                    <p className="text-gray-600 text-xs font-semibold">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
