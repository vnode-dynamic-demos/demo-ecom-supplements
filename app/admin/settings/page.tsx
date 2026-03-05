'use client';
import { useState } from 'react';
import { Save, Eye, EyeOff, Store, CreditCard, Truck, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState<'store' | 'payment' | 'shipping' | 'security'>('store');
    const [saved, setSaved] = useState(false);

    const [store, setStore] = useState({
        storeName: 'V-Node Nutra',
        tagline: "India's #1 Multi-Brand Nutrition Store",
        email: 'support@vnodenutra.com',
        phone: '+91 98XXXX1234',
        address: 'Mumbai, Maharashtra',
        freeDelivery: '999',
        codCharge: '50',
    });

    const [security, setSecurity] = useState({ currentPw: '', newPw: '', confirmPw: '' });
    const [showPw, setShowPw] = useState(false);

    const handleSave = () => {
        // TODO: Save to Supabase settings table or environment variables
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const TABS = [
        { id: 'store', label: 'Store Info', icon: Store },
        { id: 'payment', label: 'Payment', icon: CreditCard },
        { id: 'shipping', label: 'Shipping', icon: Truck },
        { id: 'security', label: 'Security', icon: Shield },
    ] as const;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Settings</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Manage your store configuration</p>
                </div>
                <button onClick={handleSave}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${saved ? 'bg-green-500 text-white' : 'bg-[#1a237e] hover:bg-[#0d1459] text-white'}`}>
                    <Save className="w-4 h-4" />
                    {saved ? '✓ Saved!' : 'Save Changes'}
                </button>
            </div>

            <div className="flex gap-6">
                {/* Sidebar tabs */}
                <div className="w-44 flex-shrink-0 space-y-1">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActiveTab(id)}
                            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${activeTab === id ? 'bg-[#1a237e] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                    {/* Store Info */}
                    {activeTab === 'store' && (
                        <div className="space-y-5">
                            <h2 className="font-black text-gray-900 text-lg border-b border-gray-100 pb-3">Store Information</h2>
                            {[
                                { label: 'Store Name', key: 'storeName' as const },
                                { label: 'Tagline', key: 'tagline' as const },
                                { label: 'Support Email', key: 'email' as const },
                                { label: 'Phone Number', key: 'phone' as const },
                                { label: 'Address', key: 'address' as const },
                            ].map(({ label, key }) => (
                                <div key={key}>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                                    <input value={store[key]} onChange={e => setStore(s => ({ ...s, [key]: e.target.value }))}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e] transition-all" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Payment */}
                    {activeTab === 'payment' && (
                        <div className="space-y-5">
                            <h2 className="font-black text-gray-900 text-lg border-b border-gray-100 pb-3">Payment Settings</h2>
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                                <p className="font-bold mb-1">⚡ Razorpay Integration</p>
                                <p>API keys are managed via environment variables in <code className="bg-blue-100 px-1 rounded">.env.local</code>. Do not store them here. See <strong>docs/SETUP.md</strong> for instructions.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">COD Charge (₹)</label>
                                <input value={store.codCharge} onChange={e => setStore(s => ({ ...s, codCharge: e.target.value }))} type="number"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e]" />
                                <p className="text-xs text-gray-400 mt-1">Extra fee charged for Cash on Delivery orders</p>
                            </div>
                        </div>
                    )}

                    {/* Shipping */}
                    {activeTab === 'shipping' && (
                        <div className="space-y-5">
                            <h2 className="font-black text-gray-900 text-lg border-b border-gray-100 pb-3">Shipping Settings</h2>
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                                <p className="font-bold mb-1">🚚 Shiprocket Integration</p>
                                <p>Shipping credentials are managed via <code className="bg-blue-100 px-1 rounded">.env.local</code>. See <strong>docs/SETUP.md</strong> for integration steps.</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Free Delivery Above (₹)</label>
                                <input value={store.freeDelivery} onChange={e => setStore(s => ({ ...s, freeDelivery: e.target.value }))} type="number"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e]" />
                                <p className="text-xs text-gray-400 mt-1">Orders above this value get free delivery</p>
                            </div>
                        </div>
                    )}

                    {/* Security / Change Password */}
                    {activeTab === 'security' && (
                        <div className="space-y-5">
                            <h2 className="font-black text-gray-900 text-lg border-b border-gray-100 pb-3">Change Admin Password</h2>
                            <p className="text-sm text-gray-500">
                                Update the admin account password. Once connected to Supabase Auth, this will call <code className="bg-gray-100 px-1 rounded">supabase.auth.updateUser()</code>.
                            </p>
                            {[
                                { label: 'Current Password', key: 'currentPw' as const },
                                { label: 'New Password', key: 'newPw' as const },
                                { label: 'Confirm Password', key: 'confirmPw' as const },
                            ].map(({ label, key }) => (
                                <div key={key}>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                                    <div className="relative">
                                        <input type={showPw ? 'text' : 'password'} value={security[key]}
                                            onChange={e => setSecurity(s => ({ ...s, [key]: e.target.value }))}
                                            placeholder="••••••••"
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:border-[#1a237e]" />
                                        {key === 'currentPw' && (
                                            <button type="button" onClick={() => setShowPw(p => !p)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    if (security.newPw !== security.confirmPw) { alert('Passwords do not match'); return; }
                                    // TODO: await supabase.auth.updateUser({ password: security.newPw });
                                    alert('Password update: wire to Supabase auth.updateUser()');
                                }}
                                className="bg-[#1a237e] hover:bg-[#0d1459] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
                                Update Password
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
