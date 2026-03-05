'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    User, Package, Heart, MapPin, Lock, LogOut, ChevronRight,
    Edit3, CheckCircle, Clock, Truck, ShieldCheck, Star, ArrowRight
} from 'lucide-react';

interface Session { name: string; email: string; loggedIn: boolean }

const MOCK_ORDERS = [
    { id: 'VN20260001', date: '28 Feb 2026', status: 'shipped', total: 3199, items: 'HyperWhey Pro 2kg' },
    { id: 'VN20260002', date: '28 Feb 2026', status: 'confirmed', total: 3598, items: 'NitroBlast 300g ×2 + Free PureCre' },
    { id: 'VN20260003', date: '01 Mar 2026', status: 'delivered', total: 2499, items: 'HyperWhey Pro 1kg' },
];

const STATUS_CONFIG: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
    pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, label: 'Order Placed' },
    confirmed: { color: 'bg-blue-100   text-blue-700', icon: CheckCircle, label: 'Confirmed' },
    packed: { color: 'bg-purple-100 text-purple-700', icon: Package, label: 'Packed' },
    shipped: { color: 'bg-orange-100 text-orange-700', icon: Truck, label: 'On the Way' },
    delivered: { color: 'bg-green-100  text-green-700', icon: CheckCircle, label: 'Delivered' },
};

const TABS = [
    { id: 'orders', icon: Package, label: 'My Orders' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist' },
    { id: 'address', icon: MapPin, label: 'Addresses' },
    { id: 'security', icon: Lock, label: 'Security' },
];

export default function AccountPage() {
    const [session, setSession] = useState<Session | null>(null);
    const [tab, setTab] = useState('orders');
    const [editName, setEditName] = useState(false);
    const [newName, setNewName] = useState('');
    const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
    const [pwMsg, setPwMsg] = useState('');

    useEffect(() => {
        const raw = localStorage.getItem('vnode-customer-session');
        if (raw) {
            const s = JSON.parse(raw) as Session;
            setSession(s);
            setNewName(s.name);
        } else {
            window.location.href = '/login';
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('vnode-customer-session');
        window.location.href = '/';
    };

    const handleNameSave = () => {
        if (!newName.trim()) return;
        const updated = { ...session!, name: newName };
        setSession(updated);
        localStorage.setItem('vnode-customer-session', JSON.stringify(updated));
        setEditName(false);
    };

    const handlePwChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (pwForm.newPw !== pwForm.confirm) { setPwMsg('Passwords do not match.'); return; }
        if (pwForm.newPw.length < 8) { setPwMsg('Minimum 8 characters required.'); return; }
        // Replace with: await supabase.auth.updateUser({ password: pwForm.newPw })
        setPwMsg('✅ Password updated successfully!');
        setPwForm({ current: '', newPw: '', confirm: '' });
    };

    if (!session) return null;

    const initial = session.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    return (
        <main className="min-h-screen bg-[#f5f5f5] py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile header */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-16 h-16 bg-[#1a237e] rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                        {initial}
                    </div>
                    <div className="flex-1">
                        {editName ? (
                            <div className="flex items-center gap-2">
                                <input value={newName} onChange={e => setNewName(e.target.value)}
                                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-gray-800 font-bold text-lg focus:outline-none focus:border-[#1a237e]" />
                                <button onClick={handleNameSave} className="bg-[#1a237e] text-white text-xs font-bold px-3 py-1.5 rounded-lg">Save</button>
                                <button onClick={() => setEditName(false)} className="text-gray-400 text-xs">Cancel</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <h1 className="text-gray-900 font-black text-xl">{session.name}</h1>
                                <button onClick={() => setEditName(true)} className="text-gray-400 hover:text-[#1a237e]">
                                    <Edit3 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                        <p className="text-gray-400 text-sm">{session.email}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <ShieldCheck className="w-2.5 h-2.5" /> Verified Account
                            </span>
                            <span className="bg-[#eef2ff] border border-blue-200 text-[#1a237e] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Star className="w-2.5 h-2.5" /> Loyal Member
                            </span>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-600 text-sm font-semibold transition-colors ml-auto">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>

                <div className="grid lg:grid-cols-[220px_1fr] gap-6">
                    {/* Sidebar tabs */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 h-fit">
                        {TABS.map(t => {
                            const Icon = t.icon;
                            return (
                                <button key={t.id} onClick={() => setTab(t.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === t.id ? 'bg-[#eef2ff] text-[#1a237e]' : 'text-gray-500 hover:bg-gray-50'
                                        }`}>
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    {t.label}
                                    {tab === t.id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Main content */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        {/* Orders tab */}
                        {tab === 'orders' && (
                            <div>
                                <h2 className="font-black text-gray-900 mb-4">My Orders</h2>
                                <div className="space-y-3">
                                    {MOCK_ORDERS.map(order => {
                                        const cfg = STATUS_CONFIG[order.status];
                                        const StatusIcon = cfg.icon;
                                        return (
                                            <div key={order.id} className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-black text-gray-800 font-mono text-sm">#{order.id}</span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${cfg.color}`}>
                                                            <StatusIcon className="w-2.5 h-2.5" /> {cfg.label}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-500 text-xs">{order.items}</p>
                                                    <p className="text-gray-400 text-xs mt-0.5">{order.date}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-black text-gray-900">₹{order.total.toLocaleString('en-IN')}</span>
                                                    <Link href={`/track?id=${order.id}`}
                                                        className="text-[#1a237e] border border-[#1a237e] text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#eef2ff] transition-all flex items-center gap-1">
                                                        <Truck className="w-3 h-3" /> Track
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Wishlist tab */}
                        {tab === 'wishlist' && (
                            <div className="text-center py-8">
                                <Heart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-400 font-semibold mb-4">Manage your wishlist from the main wishlist page</p>
                                <Link href="/wishlist" className="bg-[#1a237e] text-white font-bold px-6 py-2.5 rounded-xl inline-flex items-center gap-2 text-sm hover:bg-[#0d1459] transition-all">
                                    Go to Wishlist <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        )}

                        {/* Addresses tab */}
                        {tab === 'address' && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-black text-gray-900">Saved Addresses</h2>
                                    <button className="bg-[#1a237e] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#0d1459] transition-all">+ Add New</button>
                                </div>
                                <div className="border border-[#1a237e]/20 bg-[#eef2ff] rounded-xl p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="bg-[#1a237e] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">HOME</span>
                                            <p className="font-bold text-gray-800 mt-2">{session.name}</p>
                                            <p className="text-gray-500 text-sm leading-relaxed mt-1">Flat 4B, Nexus Tower, Andheri West<br />Mumbai, Maharashtra – 400053</p>
                                            <p className="text-gray-400 text-xs mt-1">+91 98XXXX1234</p>
                                        </div>
                                        <button className="text-[#1a237e] text-xs font-bold hover:underline">Edit</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security tab */}
                        {tab === 'security' && (
                            <div>
                                <h2 className="font-black text-gray-900 mb-4">Change Password</h2>
                                {pwMsg && (
                                    <div className={`rounded-xl px-4 py-3 mb-4 text-sm font-semibold ${pwMsg.startsWith('✅') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                                        {pwMsg}
                                    </div>
                                )}
                                <form onSubmit={handlePwChange} className="space-y-4 max-w-sm">
                                    {[
                                        { key: 'current', label: 'Current Password' },
                                        { key: 'newPw', label: 'New Password' },
                                        { key: 'confirm', label: 'Confirm New Password' },
                                    ].map(({ key, label }) => (
                                        <div key={key}>
                                            <label className="block text-gray-600 text-xs font-bold uppercase tracking-wider mb-1.5">{label}</label>
                                            <input type="password" value={pwForm[key as keyof typeof pwForm]}
                                                onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1a237e] transition-all" />
                                        </div>
                                    ))}
                                    <button type="submit" className="bg-[#1a237e] text-white font-black px-6 py-3 rounded-xl hover:bg-[#0d1459] transition-all">
                                        Update Password
                                    </button>
                                </form>
                                <hr className="my-6 border-gray-100" />
                                <h3 className="font-bold text-gray-700 mb-3">Danger Zone</h3>
                                <button className="border border-red-200 text-red-500 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-red-50 transition-all">
                                    Delete Account
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
