'use client';
import { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import type { PromoBanner } from '@/types';
import { Plus, Trash2, Eye, EyeOff, GripVertical, Edit2, Check, X, Megaphone } from 'lucide-react';

const GRADIENT_OPTIONS = [
    { label: 'Navy → Indigo', value: 'from-[#1a237e] to-indigo-700' },
    { label: 'Orange → Red', value: 'from-orange-500 to-red-600' },
    { label: 'Green → Teal', value: 'from-emerald-600 to-teal-700' },
    { label: 'Purple → Pink', value: 'from-purple-600 to-pink-600' },
    { label: 'Cyan → Blue', value: 'from-cyan-500 to-blue-600' },
];

const BLANK: Omit<PromoBanner, 'id' | 'sortOrder'> = {
    tag: '', title: '', subtitle: '', couponCode: '',
    bgGradient: 'from-[#1a237e] to-indigo-700', isActive: true,
};

export default function BannersAdminPage() {
    const { banners, addBanner, updateBanner, deleteBanner, toggleBanner } = useAdminStore();
    const [form, setForm] = useState<typeof BLANK>({ ...BLANK });
    const [editing, setEditing] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const activeBanners = banners.filter(b => b.isActive).length;
    const inactiveBanners = banners.length - activeBanners;

    const handleSave = () => {
        if (!form.title.trim()) return;
        if (editing) { updateBanner(editing, form); setEditing(null); }
        else { addBanner(form); }
        setForm({ ...BLANK }); setShowForm(false);
    };

    const handleEdit = (b: PromoBanner) => {
        setForm({ tag: b.tag, title: b.title, subtitle: b.subtitle, couponCode: b.couponCode ?? '', bgGradient: b.bgGradient, isActive: b.isActive });
        setEditing(b.id); setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Banner Manager</h1>
                    <p className="text-gray-400 text-sm mt-0.5">Manage homepage promotional banners without touching code</p>
                </div>
                <button onClick={() => { setShowForm(true); setEditing(null); setForm({ ...BLANK }); }}
                    className="flex items-center gap-2 bg-[#1a237e] hover:bg-[#0d1459] text-white font-bold px-5 py-2.5 rounded-xl transition-all">
                    <Plus className="w-4 h-4" /> New Banner
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Banners', value: banners.length, icon: Megaphone, color: 'bg-blue-50 text-blue-600' },
                    { label: 'Active', value: activeBanners, icon: Eye, color: 'bg-green-50 text-green-600' },
                    { label: 'Hidden', value: inactiveBanners, icon: EyeOff, color: 'bg-gray-50 text-gray-400' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <p className="text-2xl font-black text-gray-900">{value}</p>
                        <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* Create/Edit form */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="font-black text-gray-900 text-lg mb-5">{editing ? 'Edit Banner' : 'New Banner'}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {([
                            { label: 'Tag (e.g. "Limited Time")', key: 'tag' },
                            { label: 'Coupon Code (optional)', key: 'couponCode' },
                            { label: 'Title *', key: 'title' },
                            { label: 'Subtitle', key: 'subtitle' },
                        ] as { label: string; key: keyof typeof BLANK }[]).map(({ label, key }) => (
                            <div key={key as string}>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
                                <input
                                    value={(form as Record<string, unknown>)[key as string] as string}
                                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e] transition-all"
                                    placeholder={label}
                                />
                            </div>
                        ))}

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Background Gradient</label>
                            <select value={form.bgGradient} onChange={e => setForm(f => ({ ...f, bgGradient: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e]">
                                {GRADIENT_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Preview</label>
                            <div className={`h-16 rounded-xl bg-gradient-to-br ${form.bgGradient} flex items-center px-5`}>
                                <div>
                                    <p className="text-white/80 text-[10px] font-bold uppercase">{form.tag || 'TAG'}</p>
                                    <p className="text-white font-black text-sm">{form.title || 'Banner Title'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-5">
                        <button onClick={handleSave}
                            className="flex items-center gap-2 bg-[#1a237e] hover:bg-[#0d1459] text-white font-bold px-6 py-2.5 rounded-xl transition-all">
                            <Check className="w-4 h-4" /> {editing ? 'Save Changes' : 'Create Banner'}
                        </button>
                        <button onClick={() => { setShowForm(false); setEditing(null); setForm({ ...BLANK }); }}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-2.5 rounded-xl transition-all">
                            <X className="w-4 h-4" /> Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Banner list */}
            <div className="space-y-3">
                {[...banners].sort((a, b) => a.sortOrder - b.sortOrder).map((banner) => (
                    <div key={banner.id}
                        className={`bg-white rounded-2xl border overflow-hidden flex items-stretch transition-all shadow-sm ${banner.isActive ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
                        {/* Color strip */}
                        <div className={`w-2 bg-gradient-to-b ${banner.bgGradient} flex-shrink-0`} />
                        {/* Drag handle */}
                        <div className="flex items-center px-3 text-gray-300 cursor-grab">
                            <GripVertical className="w-4 h-4" />
                        </div>
                        {/* Content */}
                        <div className="flex-1 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{banner.tag}</span>
                                    <p className="text-gray-900 font-black text-base">{banner.title}</p>
                                    <p className="text-gray-500 text-xs mt-0.5">{banner.subtitle}</p>
                                    {banner.couponCode && (
                                        <span className="inline-block mt-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">
                                            Code: {banner.couponCode}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                        {banner.isActive ? 'Live' : 'Hidden'}
                                    </span>
                                    <button onClick={() => toggleBanner(banner.id)}
                                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all">
                                        {banner.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <button onClick={() => handleEdit(banner)}
                                        className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-[#1a237e] transition-all">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => deleteBanner(banner.id)}
                                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {banners.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                        <Megaphone className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="font-bold text-gray-500">No banners yet</p>
                        <p className="text-xs text-gray-400 mt-1">Create your first banner to show on the homepage</p>
                    </div>
                )}
            </div>
        </div>
    );
}
