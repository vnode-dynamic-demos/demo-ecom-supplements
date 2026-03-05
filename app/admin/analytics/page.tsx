'use client';
import { useState } from 'react';
import {
    BarChart3, TrendingUp, ShoppingCart, Users, Package,
    ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

// TODO: Replace mock data with real Supabase queries:
// const { data } = await supabase.from('orders').select('total, created_at, status');

const STATS = [
    { label: 'Total Revenue', value: '₹4,82,300', change: '+18%', up: true, icon: TrendingUp, color: 'bg-green-50  text-green-600' },
    { label: 'Orders (Month)', value: '1,247', change: '+12%', up: true, icon: ShoppingCart, color: 'bg-blue-50   text-blue-600' },
    { label: 'New Customers', value: '384', change: '+9%', up: true, icon: Users, color: 'bg-purple-50 text-purple-600' },
    { label: 'Avg Order Value', value: '₹2,186', change: '-3%', up: false, icon: Package, color: 'bg-orange-50 text-orange-600' },
];

const MONTHLY = [
    { month: 'Sep', revenue: 38000 },
    { month: 'Oct', revenue: 52000 },
    { month: 'Nov', revenue: 71000 },
    { month: 'Dec', revenue: 94000 },
    { month: 'Jan', revenue: 81000 },
    { month: 'Feb', revenue: 110000 },
];
const MAX_REV = Math.max(...MONTHLY.map(m => m.revenue));

const TOP_PRODUCTS = [
    { name: 'HyperWhey Pro 2kg', sales: 312, revenue: '₹7,79,688' },
    { name: 'NitroBlast Pre-Workout', sales: 189, revenue: '₹3,40,011' },
    { name: 'PureCre Monohydrate', sales: 547, revenue: '₹5,46,453' },
    { name: 'Omega Multivitamin', sales: 223, revenue: '₹2,45,300' },
];

export default function AdminAnalyticsPage() {
    const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Analytics</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Sales performance overview</p>
                </div>
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                    {(['7d', '30d', '90d'] as const).map(r => (
                        <button key={r} onClick={() => setRange(r)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${range === r ? 'bg-white text-[#1a237e] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Demo banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                📊 <strong>Demo data</strong> — connect to Supabase to see real revenue, orders, and customer stats.
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map(({ label, value, change, up, icon: Icon, color }) => (
                    <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-black text-gray-900">{value}</p>
                        <p className="text-xs font-semibold text-gray-700 mt-0.5">{label}</p>
                        <div className={`flex items-center gap-1 mt-1 text-xs font-bold ${up ? 'text-green-600' : 'text-red-500'}`}>
                            {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {change} vs last month
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue Chart (CSS bar chart) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-[#1a237e]" />
                    <h2 className="font-black text-gray-900">Monthly Revenue</h2>
                </div>
                <div className="flex items-end gap-3 h-40">
                    {MONTHLY.map(({ month, revenue }) => (
                        <div key={month} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-xs text-gray-500 font-semibold">
                                ₹{(revenue / 1000).toFixed(0)}k
                            </span>
                            <div className="w-full bg-[#1a237e] rounded-t-lg transition-all"
                                style={{ height: `${(revenue / MAX_REV) * 100}%` }} />
                            <span className="text-xs text-gray-500 font-bold">{month}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-black text-gray-900 mb-4">Top Products</h2>
                <div className="space-y-3">
                    {TOP_PRODUCTS.map((p, i) => (
                        <div key={p.name} className="flex items-center gap-4">
                            <span className="w-6 h-6 bg-[#1a237e] text-white rounded-full text-xs font-black flex items-center justify-center flex-shrink-0">
                                {i + 1}
                            </span>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
                                <p className="text-xs text-gray-400">{p.sales} units sold</p>
                            </div>
                            <span className="font-black text-gray-900 text-sm">{p.revenue}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
