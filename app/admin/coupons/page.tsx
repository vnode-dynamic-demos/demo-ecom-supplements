'use client';
import { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import type { Coupon } from '@/types';
import { Plus, Trash2, Check, X, ToggleLeft, ToggleRight, Tag } from 'lucide-react';

const BLANK: Omit<Coupon, 'id' | 'usedCount'> = {
    code: '', type: 'percent', value: 10, label: '',
    minOrder: undefined, maxUses: undefined, expiresAt: undefined,
    isActive: true,
};

export default function CouponsAdminPage() {
    const { coupons, addCoupon, deleteCoupon, toggleCoupon } = useAdminStore();
    const [form, setForm] = useState<typeof BLANK>({ ...BLANK });
    const [showForm, setShowForm] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        if (!form.code.trim() || !form.label.trim()) return;
        addCoupon({ ...form, code: form.code.toUpperCase() });
        setForm({ ...BLANK }); setShowForm(false);
        setSaved(true); setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Coupon Manager</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Create and manage discount codes — no developer needed</p>
                </div>
                <button onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-[#1a237e] hover:bg-[#0d1459] text-white font-bold px-5 py-2.5 rounded-xl transition-all">
                    <Plus className="w-4 h-4" /> New Coupon
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: coupons.length, color: 'bg-blue-50   text-blue-600' },
                    { label: 'Active', value: coupons.filter(c => c.isActive).length, color: 'bg-green-50  text-green-600' },
                    { label: 'Total Uses', value: coupons.reduce((s, c) => s + c.usedCount, 0), color: 'bg-orange-50 text-orange-600' },
                    { label: 'Sitewide', value: coupons.filter(c => !c.productSpecific?.length).length, color: 'bg-purple-50 text-purple-600' },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                            <Tag className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-black text-gray-900">{value}</p>
                        <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* Create form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-black text-gray-900 text-lg mb-5">Create New Coupon</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Code *</label>
                            <input value={form.code}
                                onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono tracking-widest uppercase focus:outline-none focus:border-[#1a237e]"
                                placeholder="e.g. SUMMER30" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Label (shown to customer) *</label>
                            <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e]"
                                placeholder="e.g. 30% Summer Sale" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
                            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as 'percent' | 'flat' }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e]">
                                <option value="percent">Percentage (%)</option>
                                <option value="flat">Flat Amount (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                {form.type === 'percent' ? 'Discount %' : 'Discount ₹'} *
                            </label>
                            <input type="number" value={form.value}
                                onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e]"
                                min={1} max={form.type === 'percent' ? 100 : undefined} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Min Order (₹) optional</label>
                            <input type="number" value={form.minOrder ?? ''}
                                onChange={e => setForm(f => ({ ...f, minOrder: e.target.value ? Number(e.target.value) : undefined }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e]" placeholder="e.g. 1500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Max Uses optional</label>
                            <input type="number" value={form.maxUses ?? ''}
                                onChange={e => setForm(f => ({ ...f, maxUses: e.target.value ? Number(e.target.value) : undefined }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e]" placeholder="e.g. 500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Expiry Date optional</label>
                            <input type="date" value={form.expiresAt?.split('T')[0] ?? ''}
                                onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e]" />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 inline-flex items-center gap-3">
                        <Tag className="w-4 h-4 text-[#1a237e]" />
                        <div>
                            <p className="text-[#1a237e] font-black text-sm">{form.code || 'CODE'}</p>
                            <p className="text-gray-500 text-xs">{form.label || 'Label'} • {form.type === 'percent' ? `${form.value}%` : `₹${form.value}`} off{form.minOrder ? ` on ₹${form.minOrder}+` : ''}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-5">
                        <button onClick={handleSave}
                            className="flex items-center gap-2 bg-[#1a237e] hover:bg-[#0d1459] text-white font-bold px-6 py-2.5 rounded-xl transition-all">
                            <Check className="w-4 h-4" /> {saved ? 'Saved!' : 'Create Coupon'}
                        </button>
                        <button onClick={() => setShowForm(false)}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-2.5 rounded-xl transition-all">
                            <X className="w-4 h-4" /> Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Coupon table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                            {['Code', 'Discount', 'Min Order', 'Max Uses', 'Used', 'Expires', 'Status', 'Actions'].map(h => (
                                <th key={h} className="text-gray-500 text-xs font-bold uppercase tracking-wider text-left px-5 py-3.5">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {coupons.map(c => (
                            <tr key={c.id} className={`hover:bg-gray-50 transition-colors ${!c.isActive ? 'opacity-50' : ''}`}>
                                <td className="px-5 py-4">
                                    <span className="font-mono font-black text-gray-900 tracking-wider">{c.code}</span>
                                    <p className="text-gray-400 text-xs mt-0.5">{c.label}</p>
                                </td>
                                <td className="px-5 py-4">
                                    <span className="bg-green-100 text-green-700 font-bold text-xs px-2 py-1 rounded-lg">
                                        {c.type === 'percent' ? `${c.value}%` : `₹${c.value}`} off
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-gray-500">{c.minOrder ? `₹${c.minOrder}` : '—'}</td>
                                <td className="px-5 py-4 text-gray-500">{c.maxUses?.toLocaleString() ?? '∞'}</td>
                                <td className="px-5 py-4">
                                    <div>
                                        <span className="text-gray-900 font-semibold">{c.usedCount.toLocaleString()}</span>
                                        {c.maxUses && (
                                            <div className="w-16 h-1.5 bg-gray-100 rounded mt-1 overflow-hidden">
                                                <div className="h-full bg-[#1a237e] rounded" style={{ width: `${Math.min((c.usedCount / c.maxUses) * 100, 100)}%` }} />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-gray-500 text-xs">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-IN') : '∞'}</td>
                                <td className="px-5 py-4">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                        {c.isActive ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => toggleCoupon(c.id)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all">
                                            {c.isActive ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
                                        </button>
                                        <button onClick={() => deleteCoupon(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr><td colSpan={8} className="text-center py-12 text-gray-400">No coupons yet. Create your first coupon.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
