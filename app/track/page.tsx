'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Phone, RefreshCw } from 'lucide-react';
import type { OrderStatus } from '@/types';

// ─── Mock order lookup ────────────────────────────────────────────────────────
const MOCK_ORDERS: Record<string, {
    id: string; customer: string; phone: string;
    status: OrderStatus; address: string;
    items: { name: string; qty: number; price: number; free?: boolean }[];
    total: number;
    awb?: string;
    carrier?: string;
    timeline: { status: OrderStatus; time: string; note: string }[];
}> = {
    'VN20260001': {
        id: 'VN20260001', customer: 'Rohan Sharma', phone: '+91 98XXXX1234',
        status: 'shipped', address: 'Flat 4B, Nexus Tower, Andheri West, Mumbai - 400053',
        items: [{ name: 'HyperWhey Pro 2kg Chocolate Fudge', qty: 1, price: 3199 }],
        total: 3199, awb: 'DELHIVERY9182736', carrier: 'Delhivery',
        timeline: [
            { status: 'pending', time: '28 Feb, 10:31 AM', note: 'Order placed successfully. Payment confirmed.' },
            { status: 'confirmed', time: '28 Feb, 11:00 AM', note: 'Order confirmed and forwarded to warehouse.' },
            { status: 'packed', time: '28 Feb, 2:30 PM', note: 'Order packed and quality-checked.' },
            { status: 'shipped', time: '28 Feb, 5:00 PM', note: 'Picked up by Delhivery. AWB: DELHIVERY9182736' },
        ],
    },
    'VN20260002': {
        id: 'VN20260002', customer: 'Priya Nair', phone: '+91 87XXXX5678',
        status: 'confirmed', address: 'House 12, Koramangala 6th Block, Bangalore - 560095',
        items: [
            { name: 'NitroBlast Blue Raspberry 300g', qty: 2, price: 3598 },
            { name: 'PureCre 250g Unflavored', qty: 1, price: 0, free: true },
        ],
        total: 3598,
        timeline: [
            { status: 'pending', time: '28 Feb, 2:20 PM', note: 'Order placed. Payment verified via UPI.' },
            { status: 'confirmed', time: '28 Feb, 3:30 PM', note: 'Confirmed. 🎁 Free PureCre Creatine added to shipment!' },
        ],
    },
    'VN20260004': {
        id: 'VN20260004', customer: 'Sneha Patel', phone: '+91 76XXXX9012',
        status: 'pending', address: 'Shop No. 7, Navrangpura, Ahmedabad - 380009',
        items: [{ name: 'PureCre 500g Unflavored', qty: 1, price: 1249 }],
        total: 1249,
        timeline: [
            { status: 'pending', time: '01 Mar, 4:45 PM', note: 'Order placed. Processing payment.' },
        ],
    },
};

const STATUS_STEPS: { status: OrderStatus; label: string; icon: typeof Package }[] = [
    { status: 'pending', label: 'Order Placed', icon: Clock },
    { status: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { status: 'packed', label: 'Packed', icon: Package },
    { status: 'shipped', label: 'On the Way', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [result, setResult] = useState<typeof MOCK_ORDERS[string] | null | 'not-found'>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 800)); // Simulated API delay
        const found = MOCK_ORDERS[orderId.trim().toUpperCase()];
        setResult(found ?? 'not-found');
        setLoading(false);
    };

    const currentStep = result && result !== 'not-found'
        ? STATUS_STEPS.findIndex(s => s.status === result.status)
        : -1;

    return (
        <main className="min-h-screen bg-zinc-950 pt-28 pb-20">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/10 rounded-2xl mb-4">
                        <Truck className="w-8 h-8 text-orange-400" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2">Track Your Order</h1>
                    <p className="text-zinc-400">Enter your Order ID to see real-time delivery status</p>
                </div>

                {/* Search box */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                value={orderId}
                                onChange={e => setOrderId(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                placeholder="e.g. VN20260001"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-11 pr-4 py-3.5 text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-orange-500/60 transition-all"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={!orderId.trim() || loading}
                            className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            Track
                        </button>
                    </div>
                    <p className="text-zinc-600 text-xs mt-3 flex items-center gap-1.5">
                        <span>💡</span> Try: <span className="font-mono text-zinc-500">VN20260001</span> or <span className="font-mono text-zinc-500">VN20260002</span>
                    </p>
                </div>

                {/* Not found */}
                {result === 'not-found' && (
                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center">
                        <p className="text-4xl mb-3">🔍</p>
                        <p className="text-white font-bold text-lg mb-1">Order Not Found</p>
                        <p className="text-zinc-400 text-sm">Check your Order ID and try again. Your Order ID was sent via email/SMS after purchase.</p>
                    </div>
                )}

                {/* Order found */}
                {result && result !== 'not-found' && (
                    <div className="space-y-4">
                        {/* Order summary */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Order ID</p>
                                    <p className="text-white font-black font-mono text-lg">#{result.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-zinc-500 text-xs mb-1">Total Paid</p>
                                    <p className="text-white font-black text-xl">₹{result.total.toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            {/* Customer info */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-zinc-800 rounded-xl p-3">
                                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-1">
                                        <Phone className="w-3.5 h-3.5" /> Customer
                                    </div>
                                    <p className="text-white text-sm font-bold">{result.customer}</p>
                                    <p className="text-zinc-500 text-xs">{result.phone}</p>
                                </div>
                                <div className="bg-zinc-800 rounded-xl p-3">
                                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-1">
                                        <MapPin className="w-3.5 h-3.5" /> Delivery Address
                                    </div>
                                    <p className="text-white text-xs leading-relaxed">{result.address}</p>
                                </div>
                            </div>

                            {/* AWB */}
                            {result.awb && (
                                <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl px-4 py-2.5 flex items-center gap-3 mb-4">
                                    <Truck className="w-4 h-4 text-purple-400" />
                                    <div>
                                        <p className="text-purple-300 text-xs font-bold">{result.carrier} · AWB</p>
                                        <p className="text-white font-mono text-sm">{result.awb}</p>
                                    </div>
                                </div>
                            )}

                            {/* Items */}
                            <div className="space-y-2">
                                {result.items.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between bg-zinc-800 rounded-xl px-4 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-zinc-400 text-xs">{item.qty}×</span>
                                            <span className="text-white text-sm">{item.name}</span>
                                            {item.free && (
                                                <span className="bg-green-500/15 text-green-400 font-black text-[10px] px-2 py-0.5 rounded">FREE 🎁</span>
                                            )}
                                        </div>
                                        <span className="text-white font-bold text-sm">
                                            {item.free ? <span className="text-green-400">₹0</span> : `₹${item.price.toLocaleString('en-IN')}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Status tracker */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-white font-bold text-base mb-6">Delivery Status</h3>

                            {/* Visual stepper */}
                            <div className="flex items-center gap-0 mb-8">
                                {STATUS_STEPS.map((step, i) => {
                                    const done = i <= currentStep;
                                    const active = i === currentStep;
                                    const Icon = step.icon;
                                    return (
                                        <div key={step.status} className="flex items-center flex-1 last:flex-none">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${active ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/30 scale-110' :
                                                        done ? 'bg-green-500 border-green-500' :
                                                            'bg-zinc-800 border-zinc-700'
                                                    }`}>
                                                    <Icon className={`w-4 h-4 ${done || active ? 'text-white' : 'text-zinc-600'}`} />
                                                </div>
                                                <p className={`text-[10px] font-bold mt-1.5 text-center leading-tight max-w-[56px] ${active ? 'text-orange-400' : done ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                                    {step.label}
                                                </p>
                                            </div>
                                            {i < STATUS_STEPS.length - 1 && (
                                                <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < currentStep ? 'bg-green-500' : 'bg-zinc-800'}`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Timeline */}
                            <div className="space-y-4">
                                {[...result.timeline].reverse().map((event, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${i === 0 ? 'bg-orange-500' : 'bg-zinc-700'}`} />
                                            {i < result!.timeline.length - 1 && <div className="w-px flex-1 bg-zinc-800 mt-1" />}
                                        </div>
                                        <div className="pb-4">
                                            <p className="text-white text-sm font-semibold">{event.note}</p>
                                            <p className="text-zinc-500 text-xs mt-0.5">{event.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
