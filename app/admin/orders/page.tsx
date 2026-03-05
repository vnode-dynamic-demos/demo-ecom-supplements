'use client';
import { useState } from 'react';
import { Search, Package, CheckCircle, Truck, Clock, XCircle, MapPin } from 'lucide-react';
import type { OrderStatus } from '@/types';

const MOCK_ORDERS = [
    {
        id: 'VN20260001', customer: 'Rohan Sharma',
        items: [{ name: 'HyperWhey Pro 2kg Chocolate', qty: 1 }],
        total: 3199, status: 'shipped' as OrderStatus, city: 'Mumbai, MH',
        date: '2026-02-28T10:30:00', awb: 'DELHIVERY9182736',
    },
    {
        id: 'VN20260002', customer: 'Priya Nair',
        items: [{ name: 'NitroBlast Blue Raspberry 300g', qty: 2 }, { name: 'PureCre 250g', qty: 1, free: true }],
        total: 3598, status: 'confirmed' as OrderStatus, city: 'Bangalore, KA',
        date: '2026-02-28T14:20:00', awb: null,
    },
    {
        id: 'VN20260003', customer: 'Arjun Mehta',
        items: [{ name: 'HyperWhey Pro 1kg Vanilla', qty: 2 }],
        total: 4998, status: 'delivered' as OrderStatus, city: 'Delhi, DL',
        date: '2026-02-25T09:00:00', awb: 'BLUEDART1234567',
    },
    {
        id: 'VN20260004', customer: 'Sneha Patel',
        items: [{ name: 'PureCre 500g Unflavored', qty: 1 }],
        total: 1249, status: 'pending' as OrderStatus, city: 'Ahmedabad, GJ',
        date: '2026-03-01T16:45:00', awb: null,
    },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; icon: typeof Package; textColor: string; badgeCls: string; barColor: string }> = {
    pending: { label: 'Pending', icon: Clock, textColor: 'text-yellow-700', badgeCls: 'bg-yellow-100 text-yellow-700', barColor: 'bg-yellow-400' },
    confirmed: { label: 'Confirmed', icon: CheckCircle, textColor: 'text-blue-700', badgeCls: 'bg-blue-100   text-blue-700', barColor: 'bg-blue-500' },
    packed: { label: 'Packed', icon: Package, textColor: 'text-orange-700', badgeCls: 'bg-orange-100 text-orange-700', barColor: 'bg-orange-400' },
    shipped: { label: 'Shipped', icon: Truck, textColor: 'text-purple-700', badgeCls: 'bg-purple-100 text-purple-700', barColor: 'bg-purple-500' },
    out_for_delivery: { label: 'Out for Delivery', icon: Truck, textColor: 'text-indigo-700', badgeCls: 'bg-indigo-100 text-indigo-700', barColor: 'bg-indigo-500' },
    delivered: { label: 'Delivered', icon: CheckCircle, textColor: 'text-green-700', badgeCls: 'bg-green-100  text-green-700', barColor: 'bg-green-500' },
    cancelled: { label: 'Cancelled', icon: XCircle, textColor: 'text-red-700', badgeCls: 'bg-red-100    text-red-700', barColor: 'bg-red-400' },
    refunded: { label: 'Refunded', icon: XCircle, textColor: 'text-gray-700', badgeCls: 'bg-gray-100   text-gray-700', barColor: 'bg-gray-400' },
};

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];

export default function OrdersAdminPage() {
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

    const filtered = orders.filter(o =>
        (filter === 'all' || o.status === filter) &&
        (o.id.includes(search.toUpperCase()) || o.customer.toLowerCase().includes(search.toLowerCase()))
    );

    const updateStatus = (orderId: string, status: OrderStatus) =>
        setOrders(os => os.map(o => o.id === orderId ? { ...o, status } : o));

    const statusCounts = Object.fromEntries(
        STATUS_FLOW.map(s => [s, orders.filter(o => o.status === s).length])
    ) as Record<OrderStatus, number>;

    return (
        <div className="p-6 space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-gray-900">Order Manager</h1>
                <p className="text-gray-400 text-sm mt-0.5">View and update order statuses — customers see changes immediately in their tracking page</p>
            </div>

            {/* Status filter pills */}
            <div className="flex flex-wrap gap-2">
                {(['all', ...STATUS_FLOW] as const).map(s => {
                    const cfg = s === 'all' ? null : STATUS_CONFIG[s];
                    const count = s === 'all' ? orders.length : statusCounts[s];
                    return (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${filter === s
                                    ? 'bg-[#1a237e] text-white border-transparent'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#1a237e] hover:text-[#1a237e]'
                                }`}>
                            {s === 'all' ? `All (${count})` : `${cfg!.label} (${count})`}
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e] transition-all"
                    placeholder="Search by Order ID or Customer Name" />
            </div>

            {/* Orders list */}
            <div className="space-y-4">
                {filtered.map(order => {
                    const cfg = STATUS_CONFIG[order.status];
                    const Icon = cfg.icon;
                    const currentIdx = STATUS_FLOW.indexOf(order.status);

                    return (
                        <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-5">
                                {/* Order header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-mono font-black text-gray-900 text-lg">#{order.id}</span>
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${cfg.badgeCls}`}>
                                                <Icon className="w-3.5 h-3.5" /> {cfg.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-400 text-xs">
                                            <span>{order.customer}</span>
                                            <span>·</span>
                                            <MapPin className="w-3 h-3" /><span>{order.city}</span>
                                            <span>·</span>
                                            <span>{new Date(order.date).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                                        </div>
                                    </div>
                                    <span className="text-gray-900 font-black text-xl">₹{order.total.toLocaleString('en-IN')}</span>
                                </div>

                                {/* Items */}
                                <div className="text-gray-500 text-xs mb-4 space-y-0.5">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span>• {item.qty}× {item.name}</span>
                                            {(item as { free?: boolean }).free && (
                                                <span className="bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded text-[10px]">FREE 🎁</span>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* AWB */}
                                {order.awb && (
                                    <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 inline-flex items-center gap-2 mb-4">
                                        <Truck className="w-3.5 h-3.5 text-purple-500" />
                                        <span className="text-gray-600 text-xs font-mono">{order.awb}</span>
                                    </div>
                                )}

                                {/* Progress bar */}
                                <div className="flex items-center gap-1 mb-4">
                                    {STATUS_FLOW.map((s, i) => (
                                        <div key={s} className="flex items-center gap-1 flex-1">
                                            <div className={`h-1.5 flex-1 rounded-full transition-all ${i <= currentIdx ? 'bg-[#1a237e]' : 'bg-gray-100'}`} />
                                        </div>
                                    ))}
                                </div>

                                {/* Status buttons */}
                                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-gray-400 text-xs font-semibold py-1 self-center">Update to:</span>
                                        {STATUS_FLOW.slice(currentIdx + 1).map(s => (
                                            <button key={s} onClick={() => updateStatus(order.id, s)}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all hover:scale-105 ${STATUS_CONFIG[s].badgeCls}`}>
                                                Mark {STATUS_CONFIG[s].label} →
                                            </button>
                                        ))}
                                        <button onClick={() => updateStatus(order.id, 'cancelled')}
                                            className="text-xs font-bold px-3 py-1.5 rounded-lg border bg-red-50 border-red-200 text-red-600 transition-all hover:scale-105">
                                            Cancel ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        <Package className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                        <p className="font-semibold">No orders found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
