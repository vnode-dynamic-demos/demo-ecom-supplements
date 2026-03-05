'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    Package, Tag, Megaphone, Gift, ShoppingCart, BarChart3, Star,
    TrendingUp, Users, DollarSign, ArrowRight, Clock, CheckCircle,
    AlertCircle, Zap
} from 'lucide-react';

const QUICK_ACTIONS = [
    { href: '/admin/banners', icon: Megaphone, label: 'Manage Banners', sub: 'Hero + promotional banners', color: 'bg-purple-50 border-purple-200 text-purple-700' },
    { href: '/admin/coupons', icon: Tag, label: 'Manage Coupons', sub: 'Discount codes & limits', color: 'bg-green-50  border-green-200  text-green-700' },
    { href: '/admin/offers', icon: Gift, label: 'Offers & GWP', sub: 'Gift With Purchase deals', color: 'bg-orange-50 border-orange-200 text-orange-700' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders', sub: 'View & update order status', color: 'bg-blue-50   border-blue-200   text-blue-700' },
    { href: '/admin/products', icon: Package, label: 'Products', sub: 'Add / edit products', color: 'bg-red-50    border-red-200    text-red-700' },
    { href: '/admin/reviews', icon: Star, label: 'Reviews', sub: 'Moderate customer reviews', color: 'bg-amber-50  border-amber-200  text-amber-700' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics', sub: 'Traffic & conversion data', color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
    { href: '/admin/products/new', icon: Zap, label: 'Add Product', sub: 'Create a new product listing', color: 'bg-teal-50   border-teal-200   text-teal-700' },
];

const STATS = [
    { label: 'Total Orders', value: '1,247', sub: '+12% this week', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Revenue (MTD)', value: '₹8.4L', sub: '+23% vs last month', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Coupons', value: '6', sub: '2 expiring soon', icon: Tag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending Orders', value: '34', sub: 'Need processing', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
];

const RECENT_ORDERS = [
    { id: 'ORD-1091', customer: 'Rahul M.', amount: '₹2,499', status: 'pending', items: 'HyperWhey Pro 1kg x1' },
    { id: 'ORD-1090', customer: 'Priya K.', amount: '₹3,798', status: 'confirmed', items: 'NitroBlast 300g x2' },
    { id: 'ORD-1089', customer: 'Arjun S.', amount: '₹999', status: 'shipped', items: 'PureCre 250g x1' },
    { id: 'ORD-1088', customer: 'Sneha R.', amount: '₹5,299', status: 'delivered', items: 'HyperWhey Pro 2kg x1' },
];

const STATUS_CONFIG: Record<string, { color: string; icon: React.ComponentType<{ className?: string }> }> = {
    pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    confirmed: { color: 'bg-blue-100   text-blue-700', icon: CheckCircle },
    shipped: { color: 'bg-purple-100 text-purple-700', icon: TrendingUp },
    delivered: { color: 'bg-green-100  text-green-700', icon: CheckCircle },
};

export default function AdminDashboard() {
    const [time, setTime] = useState('');
    useEffect(() => {
        const update = () => setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
        update();
        const id = setInterval(update, 60000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-600">{time}</p>
                    <p className="text-xs text-gray-400">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {STATS.map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{s.label}</p>
                                <div className={`${s.bg} p-2 rounded-lg`}>
                                    <Icon className={`w-4 h-4 ${s.color}`} />
                                </div>
                            </div>
                            <p className="text-2xl font-black text-gray-900">{s.value}</p>
                            <p className="text-gray-400 text-xs mt-0.5">{s.sub}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick actions */}
            <div className="mb-8">
                <h2 className="text-base font-black text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {QUICK_ACTIONS.map(action => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={action.href}
                                href={action.href}
                                className={`group bg-white border rounded-xl p-4 hover:shadow-md transition-all flex flex-col gap-3 border-gray-100 hover:border-[#1a237e]/30`}
                            >
                                <div className={`${action.color} w-9 h-9 rounded-lg flex items-center justify-center border`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-gray-800 font-bold text-sm">{action.label}</p>
                                    <p className="text-gray-400 text-[11px] mt-0.5 leading-snug">{action.sub}</p>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#1a237e] transition-colors mt-auto" />
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                    <h2 className="font-black text-gray-900">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-xs font-bold text-[#1a237e] hover:underline flex items-center gap-1">
                        View all <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="divide-y divide-gray-50">
                    {RECENT_ORDERS.map(order => {
                        const cfg = STATUS_CONFIG[order.status];
                        const StatusIcon = cfg.icon;
                        return (
                            <div key={order.id} className="flex items-center gap-4 px-5 py-3.5">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-gray-800 text-sm">{order.id}</p>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${cfg.color}`}>
                                            <StatusIcon className="w-2.5 h-2.5" /> {order.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-0.5">{order.customer} · {order.items}</p>
                                </div>
                                <p className="font-black text-gray-900 text-sm flex-shrink-0">{order.amount}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* System info */}
            <div className="mt-6 bg-[#f0f4ff] border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-[#1a237e] flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[#1a237e] font-bold text-sm">Demo Mode — Data stored in localStorage</p>
                        <p className="text-gray-500 text-xs mt-0.5">Banners, coupons, offers and order updates you make here are saved to browser localStorage. Connect Supabase to persist data across sessions.</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-white border border-blue-200 text-[#1a237e] text-[10px] font-bold px-2 py-0.5 rounded-full">✅ Banners Manager</span>
                            <span className="bg-white border border-blue-200 text-[#1a237e] text-[10px] font-bold px-2 py-0.5 rounded-full">✅ Coupons Manager</span>
                            <span className="bg-white border border-blue-200 text-[#1a237e] text-[10px] font-bold px-2 py-0.5 rounded-full">✅ GWP Offers</span>
                            <span className="bg-white border border-blue-200 text-[#1a237e] text-[10px] font-bold px-2 py-0.5 rounded-full">✅ Flash Deals</span>
                            <span className="bg-white border border-blue-200 text-[#1a237e] text-[10px] font-bold px-2 py-0.5 rounded-full">✅ Orders Manager</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
