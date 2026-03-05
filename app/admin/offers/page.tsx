'use client';
import { useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import type { GWPOffer, FlashDeal } from '@/types';
import { Plus, Trash2, Check, X, Gift, Zap, ToggleLeft, ToggleRight, Clock } from 'lucide-react';

const PRODUCTS = [
    { id: '1', name: 'HyperWhey Pro — Whey Protein' },
    { id: '2', name: 'NitroBlast Pre-Workout' },
    { id: '3', name: 'PureCre Monohydrate' },
];

const BLANK_GWP: Omit<GWPOffer, 'id'> = {
    name: '', triggerProductId: '1', triggerMinQty: 1,
    rewardProductId: '3', rewardQty: 1, isActive: true,
};

const BLANK_FLASH: Omit<FlashDeal, 'id'> = {
    productId: '1', salePrice: 0,
    startsAt: new Date().toISOString().slice(0, 16),
    endsAt: new Date(Date.now() + 3 * 3600000).toISOString().slice(0, 16),
    isActive: true,
};

type ActiveTab = 'gwp' | 'flash';

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e] transition-all';
const labelCls = 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5';

export default function OffersAdminPage() {
    const { gwpOffers, addGWP, deleteGWP, toggleGWP, flashDeals, addFlashDeal, deleteFlashDeal } = useAdminStore();
    const [tab, setTab] = useState<ActiveTab>('gwp');
    const [gwpForm, setGwpForm] = useState<typeof BLANK_GWP>({ ...BLANK_GWP });
    const [flashForm, setFlashForm] = useState<typeof BLANK_FLASH>({ ...BLANK_FLASH });
    const [showGwpForm, setShowGwpForm] = useState(false);
    const [showFlashForm, setShowFlashForm] = useState(false);

    const getProductName = (id: string) => PRODUCTS.find(p => p.id === id)?.name.split(' — ')[0] ?? 'Unknown';
    const basePrice = (id: string) => ({ '1': 2499, '2': 1799, '3': 999 }[id] ?? 0);
    const savedAmount = (deal: FlashDeal) => {
        const base = basePrice(deal.productId);
        return base > 0 ? `Save ₹${(base - deal.salePrice).toLocaleString('en-IN')} (${Math.round(((base - deal.salePrice) / base) * 100)}%)` : '';
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-gray-900">Offers & GWP Manager</h1>
                <p className="text-gray-400 text-sm mt-0.5">Set up gift-with-purchase offers and flash deals</p>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 max-w-xs">
                {([['gwp', '🎁 GWP Offers'], ['flash', '⚡ Flash Deals']] as [ActiveTab, string][]).map(([id, label]) => (
                    <button key={id} onClick={() => setTab(id)}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${tab === id ? 'bg-white text-[#1a237e] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        {label}
                    </button>
                ))}
            </div>

            {/* ── GWP OFFERS ─────────────────────────────────────────────── */}
            {tab === 'gwp' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-black text-gray-900 flex items-center gap-2"><Gift className="w-5 h-5 text-[#1a237e]" /> Gift With Purchase Rules</h2>
                            <p className="text-gray-400 text-sm mt-0.5">Auto-add a free product when qualifying conditions are met</p>
                        </div>
                        <button onClick={() => setShowGwpForm(true)}
                            className="flex items-center gap-2 bg-[#1a237e] hover:bg-[#0d1459] text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
                            <Plus className="w-4 h-4" /> New GWP Rule
                        </button>
                    </div>

                    {showGwpForm && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-black text-gray-900 mb-4">Create GWP Rule</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className={labelCls}>Rule Name *</label>
                                    <input value={gwpForm.name} onChange={e => setGwpForm(f => ({ ...f, name: e.target.value }))}
                                        className={inputCls} placeholder="e.g. Buy Whey → Free Creatine" />
                                </div>
                                <div>
                                    <label className={labelCls}>Trigger Product (Customer Buys)</label>
                                    <select value={gwpForm.triggerProductId} onChange={e => setGwpForm(f => ({ ...f, triggerProductId: e.target.value }))} className={inputCls}>
                                        {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Min Quantity in Cart</label>
                                    <input type="number" min={1} value={gwpForm.triggerMinQty}
                                        onChange={e => setGwpForm(f => ({ ...f, triggerMinQty: Number(e.target.value) }))} className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Reward Product (Gets FREE)</label>
                                    <select value={gwpForm.rewardProductId} onChange={e => setGwpForm(f => ({ ...f, rewardProductId: e.target.value }))} className={inputCls}>
                                        {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Free Qty to Add</label>
                                    <input type="number" min={1} value={gwpForm.rewardQty}
                                        onChange={e => setGwpForm(f => ({ ...f, rewardQty: Number(e.target.value) }))} className={inputCls} />
                                </div>
                            </div>
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
                                <Gift className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <p className="text-green-800 text-sm">
                                    When cart has <strong>{gwpForm.triggerMinQty}+</strong> {getProductName(gwpForm.triggerProductId)} →
                                    Auto-add <strong>{gwpForm.rewardQty}×</strong> {getProductName(gwpForm.rewardProductId)} <span className="text-green-700 font-black">FREE 🎁</span>
                                </p>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button onClick={() => { addGWP(gwpForm); setShowGwpForm(false); setGwpForm({ ...BLANK_GWP }); }}
                                    className="flex items-center gap-2 bg-[#1a237e] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#0d1459] text-sm transition-all">
                                    <Check className="w-4 h-4" /> Create Rule
                                </button>
                                <button onClick={() => setShowGwpForm(false)}
                                    className="flex items-center gap-2 bg-gray-100 text-gray-700 font-bold px-5 py-2.5 rounded-xl hover:bg-gray-200 text-sm transition-all">
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {gwpOffers.map(offer => (
                            <div key={offer.id}
                                className={`bg-white border rounded-2xl p-5 flex items-center justify-between shadow-sm ${offer.isActive ? 'border-green-200' : 'border-gray-100 opacity-60'}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                        <Gift className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-bold">{offer.name}</p>
                                        <p className="text-gray-400 text-xs mt-0.5">
                                            Buy {offer.triggerMinQty}+ {getProductName(offer.triggerProductId)} → {offer.rewardQty}× {getProductName(offer.rewardProductId)} FREE
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${offer.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                        {offer.isActive ? 'Active' : 'Off'}
                                    </span>
                                    <button onClick={() => toggleGWP(offer.id)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-all">
                                        {offer.isActive ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                                    </button>
                                    <button onClick={() => deleteGWP(offer.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {gwpOffers.length === 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
                                <Gift className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                <p className="text-gray-400 font-semibold text-sm">No GWP offers yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── FLASH DEALS ─────────────────────────────────────────────── */}
            {tab === 'flash' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-black text-gray-900 flex items-center gap-2"><Zap className="w-5 h-5 text-orange-500 fill-orange-500" /> Flash Deals</h2>
                            <p className="text-gray-400 text-sm mt-0.5">Time-limited discounts with a live countdown timer on the homepage</p>
                        </div>
                        <button onClick={() => setShowFlashForm(true)}
                            className="flex items-center gap-2 bg-[#1a237e] hover:bg-[#0d1459] text-white font-bold px-4 py-2 rounded-xl text-sm transition-all">
                            <Plus className="w-4 h-4" /> New Flash Deal
                        </button>
                    </div>

                    {showFlashForm && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-black text-gray-900 mb-4">Create Flash Deal</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Product</label>
                                    <select value={flashForm.productId}
                                        onChange={e => setFlashForm(f => ({ ...f, productId: e.target.value, salePrice: basePrice(e.target.value) }))}
                                        className={inputCls}>
                                        {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Flash Sale Price (₹) — Base: ₹{basePrice(flashForm.productId).toLocaleString()}</label>
                                    <input type="number" value={flashForm.salePrice}
                                        onChange={e => setFlashForm(f => ({ ...f, salePrice: Number(e.target.value) }))} className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Start Time</label>
                                    <input type="datetime-local" value={flashForm.startsAt?.slice(0, 16)}
                                        onChange={e => setFlashForm(f => ({ ...f, startsAt: new Date(e.target.value).toISOString() }))} className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>End Time</label>
                                    <input type="datetime-local" value={flashForm.endsAt?.slice(0, 16)}
                                        onChange={e => setFlashForm(f => ({ ...f, endsAt: new Date(e.target.value).toISOString() }))} className={inputCls} />
                                </div>
                            </div>
                            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 text-orange-800 text-sm">
                                <Zap className="w-4 h-4 inline mr-2 fill-orange-500 text-orange-500" />
                                {getProductName(flashForm.productId)} for <strong>₹{flashForm.salePrice.toLocaleString()}</strong> — {flashForm.salePrice > 0 ? savedAmount(flashForm as FlashDeal) : 'Set a valid sale price'}
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button onClick={() => { addFlashDeal(flashForm as FlashDeal); setShowFlashForm(false); }}
                                    className="flex items-center gap-2 bg-[#1a237e] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#0d1459] text-sm transition-all">
                                    <Check className="w-4 h-4" /> Create Deal
                                </button>
                                <button onClick={() => setShowFlashForm(false)}
                                    className="flex items-center gap-2 bg-gray-100 text-gray-700 font-bold px-5 py-2.5 rounded-xl hover:bg-gray-200 text-sm transition-all">
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {flashDeals.map(deal => {
                            const ends = new Date(deal.endsAt);
                            const isLive = new Date() < ends && deal.isActive;
                            return (
                                <div key={deal.id}
                                    className={`bg-white border rounded-2xl p-5 flex items-center justify-between shadow-sm ${isLive ? 'border-orange-200' : 'border-gray-100 opacity-60'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-bold">{getProductName(deal.productId)}</p>
                                            <p className="text-gray-400 text-xs">₹{deal.salePrice.toLocaleString()} · {savedAmount(deal)}</p>
                                            <div className="flex items-center gap-1 mt-1 text-gray-400 text-[10px]">
                                                <Clock className="w-3 h-3" /> Ends {ends.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isLive ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-400'}`}>
                                            {isLive ? 'Live' : 'Ended'}
                                        </span>
                                        <button onClick={() => deleteFlashDeal(deal.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {flashDeals.length === 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
                                <Zap className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                <p className="text-gray-400 font-semibold text-sm">No flash deals yet</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
