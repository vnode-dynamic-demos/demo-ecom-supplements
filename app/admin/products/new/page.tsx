'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Plus, Trash2, Save, X } from 'lucide-react';
import Image from 'next/image';

const CATEGORIES = ['Protein', 'Pre-Workout', 'Creatine', 'Vitamins', 'Amino Acids', 'Weight Management', 'Mass Gainer', 'Fat Burner'];
const BRANDS = ['V-Node Nutra', 'MuscleBlaze', 'GNC', 'Optimum Nutrition', 'MyProtein', 'Fast&Up', 'HK Vitals', 'Carbamide Forte', 'Nutrabay'];

interface Variant { id: string; flavor: string; size: string; price_adj: number; stock: number; sku: string; }

export default function NewProductPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [form, setForm] = useState({
        name: '', brand: 'V-Node Nutra', category: 'Protein',
        description: '', long_description: '', ingredients: '',
        how_to_use: '', base_price: '', mrp: '', price_per_unit: '',
        certifications: '', highlights: '',
        is_featured: false, is_active: true,
    });

    const [images, setImages] = useState<string[]>([]);
    const [variants, setVariants] = useState<Variant[]>([
        { id: '1', flavor: 'Chocolate Fudge', size: '1kg', price_adj: 0, stock: 50, sku: '' },
    ]);
    const [nutrition, setNutrition] = useState([
        { name: 'Calories', amount: '', unit: '' },
        { name: 'Protein', amount: '', unit: 'g' },
        { name: 'Total Fat', amount: '', unit: 'g' },
        { name: 'Total Carbohydrates', amount: '', unit: 'g' },
    ]);

    const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }));

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        Array.from(e.target.files ?? []).forEach(file => {
            setImages(imgs => [...imgs, URL.createObjectURL(file)]);
        });
    };

    const addVariant = () => setVariants(v => [...v, { id: Date.now().toString(), flavor: '', size: '', price_adj: 0, stock: 0, sku: '' }]);
    const removeVariant = (id: string) => setVariants(v => v.filter(x => x.id !== id));
    const updVariant = (id: string, key: keyof Variant, val: string | number) =>
        setVariants(v => v.map(x => x.id === id ? { ...x, [key]: val } : x));

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 1500));
        // Production: await supabase.from('products').insert({ ...form, variants, images, nutrition_facts: nutrition })
        setSaved(true);
        setSaving(false);
        setTimeout(() => router.push('/admin/products'), 1000);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-all"><ArrowLeft className="w-5 h-5" /></button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Add New Product</h1>
                        <p className="text-gray-400 text-sm">Complete the form to list a new product</p>
                    </div>
                </div>
                <button onClick={handleSave} disabled={saving || saved}
                    className="bg-[#1a237e] hover:bg-[#0d1459] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm transition-all shadow-md">
                    {saving ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        : saved ? '✅ Saved!' : <><Save className="w-4 h-4" /> Save Product</>}
                </button>
            </div>

            <div className="grid lg:grid-cols-[1fr_300px] gap-6">
                <div className="space-y-5">
                    {/* Basic */}
                    <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                        <h2 className="font-black text-gray-800">Basic Information</h2>
                        <div>
                            <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5">Product Name *</label>
                            <input value={form.name} onChange={upd('name')} placeholder="e.g. HyperWhey Pro Chocolate Fudge 1kg"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e]" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5">Brand</label>
                                <select
                                    value={BRANDS.includes(form.brand) ? form.brand : '__CUSTOM__'}
                                    onChange={(e) => {
                                        if (e.target.value === '__CUSTOM__') upd('brand')({ target: { value: '' } } as any);
                                        else upd('brand')(e);
                                    }}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e] bg-white">
                                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                                    <option value="__CUSTOM__" className="font-bold text-[#1a237e]">+ Add New Brand...</option>
                                </select>
                                {!BRANDS.includes(form.brand) && (
                                    <input value={form.brand} onChange={upd('brand')} placeholder="Enter new brand name" autoFocus
                                        className="w-full border border-indigo-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e] bg-indigo-50/30" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5">Category</label>
                                <select
                                    value={CATEGORIES.includes(form.category) ? form.category : '__CUSTOM__'}
                                    onChange={(e) => {
                                        if (e.target.value === '__CUSTOM__') upd('category')({ target: { value: '' } } as any);
                                        else upd('category')(e);
                                    }}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e] bg-white">
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    <option value="__CUSTOM__" className="font-bold text-[#1a237e]">+ Add New Category...</option>
                                </select>
                                {!CATEGORIES.includes(form.category) && (
                                    <input value={form.category} onChange={upd('category')} placeholder="Enter new category name" autoFocus
                                        className="w-full border border-indigo-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e] bg-indigo-50/30" />
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5">Short Description *</label>
                            <textarea value={form.description} onChange={upd('description')} rows={2}
                                placeholder="Brief tagline shown in product cards"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e] resize-none" />
                        </div>
                        <div>
                            <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5">Full Description (PDP)</label>
                            <textarea value={form.long_description} onChange={upd('long_description')} rows={5}
                                placeholder="Detailed description with product background, benefits..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e] resize-none" />
                        </div>
                    </section>

                    {/* Pricing */}
                    <section className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h2 className="font-black text-gray-800 mb-4">Pricing</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { key: 'base_price', label: 'Sale Price (₹) *', placeholder: '2499' },
                                { key: 'mrp', label: 'MRP (₹) *', placeholder: '3299' },
                                { key: 'price_per_unit', label: 'Per Unit Text', placeholder: '₹83/serving' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5">{f.label}</label>
                                    <input value={form[f.key as keyof typeof form] as string} onChange={upd(f.key as keyof typeof form)}
                                        placeholder={f.placeholder}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e]" />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Variants */}
                    <section className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-black text-gray-800">Variants</h2>
                            <button onClick={addVariant} className="text-[#1a237e] text-xs font-bold px-3 py-1.5 border border-[#1a237e]/30 rounded-lg hover:bg-[#eef2ff] flex items-center gap-1.5">
                                <Plus className="w-3.5 h-3.5" /> Add Variant
                            </button>
                        </div>
                        <div className="grid grid-cols-5 gap-2 mb-2">
                            {['Flavor', 'Size', 'Price ±', 'Stock', 'SKU'].map(h => <p key={h} className="text-gray-400 text-[10px] font-bold uppercase tracking-wide">{h}</p>)}
                        </div>
                        {variants.map(v => (
                            <div key={v.id} className="grid grid-cols-5 gap-2 items-center mb-2">
                                <input value={v.flavor} onChange={e => updVariant(v.id, 'flavor', e.target.value)} placeholder="Chocolate"
                                    className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1a237e]" />
                                <input value={v.size} onChange={e => updVariant(v.id, 'size', e.target.value)} placeholder="1kg"
                                    className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1a237e]" />
                                <input type="number" value={v.price_adj} onChange={e => updVariant(v.id, 'price_adj', Number(e.target.value))}
                                    className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1a237e]" />
                                <input type="number" value={v.stock} onChange={e => updVariant(v.id, 'stock', Number(e.target.value))}
                                    className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1a237e]" />
                                <div className="flex gap-1">
                                    <input value={v.sku} onChange={e => updVariant(v.id, 'sku', e.target.value)} placeholder="SKU-001"
                                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1a237e]" />
                                    {variants.length > 1 && <button onClick={() => removeVariant(v.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3" /></button>}
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Nutrition */}
                    <section className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-black text-gray-800">Nutrition Facts</h2>
                            <button onClick={() => setNutrition(n => [...n, { name: '', amount: '', unit: '' }])}
                                className="text-[#1a237e] text-xs font-bold px-3 py-1.5 border border-[#1a237e]/30 rounded-lg hover:bg-[#eef2ff] flex items-center gap-1.5">
                                <Plus className="w-3.5 h-3.5" /> Add Row
                            </button>
                        </div>
                        {nutrition.map((row, i) => (
                            <div key={i} className="grid grid-cols-3 gap-2 mb-2 items-center">
                                <input value={row.name} onChange={e => setNutrition(n => n.map((r, j) => j === i ? { ...r, name: e.target.value } : r))} placeholder="Nutrient"
                                    className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1a237e]" />
                                <input value={row.amount} onChange={e => setNutrition(n => n.map((r, j) => j === i ? { ...r, amount: e.target.value } : r))} placeholder="Amount"
                                    className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1a237e]" />
                                <div className="flex gap-1">
                                    <input value={row.unit} onChange={e => setNutrition(n => n.map((r, j) => j === i ? { ...r, unit: e.target.value } : r))} placeholder="g / mg"
                                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1a237e]" />
                                    <button onClick={() => setNutrition(n => n.filter((_, j) => j !== i))} className="p-1.5 text-red-400 hover:bg-red-50 rounded"><X className="w-3 h-3" /></button>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Details */}
                    <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                        <h2 className="font-black text-gray-800">Additional Details</h2>
                        {[
                            { key: 'how_to_use', label: 'How to Use', rows: 3, placeholder: 'Step 1: Mix 1 scoop with 200ml cold water\nStep 2: Shake for 20-30 seconds' },
                            { key: 'ingredients', label: 'Ingredients', rows: 2, placeholder: 'Whey Protein Isolate, Cocoa Powder...' },
                            { key: 'highlights', label: 'Highlights (comma-separated)', rows: 2, placeholder: '27g Protein, Zero Added Sugar, 30 Servings' },
                            { key: 'certifications', label: 'Certifications (comma-separated)', rows: 1, placeholder: 'FSSAI, NSF, INFORMED SPORT' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5">{f.label}</label>
                                <textarea value={form[f.key as keyof typeof form] as string} onChange={upd(f.key as keyof typeof form)} rows={f.rows} placeholder={f.placeholder}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#1a237e] resize-none" />
                            </div>
                        ))}
                    </section>
                </div>

                {/* Right sidebar */}
                <div className="space-y-5">
                    <section className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h2 className="font-black text-gray-800 mb-3">Product Images</h2>
                        <label className="w-full border-2 border-dashed border-gray-200 rounded-xl py-8 flex flex-col items-center cursor-pointer hover:border-[#1a237e] hover:bg-[#f8f9ff] transition-all">
                            <Upload className="w-8 h-8 text-gray-300 mb-2" />
                            <p className="text-gray-500 font-bold text-sm">Click to upload</p>
                            <p className="text-gray-400 text-xs mt-0.5">JPG, PNG, WebP</p>
                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                        </label>
                        {images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-3">
                                {images.map((src, i) => (
                                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-100">
                                        <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                                        <button onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))}
                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                            <Trash2 className="w-4 h-4 text-white" />
                                        </button>
                                        {i === 0 && <span className="absolute top-1 left-1 bg-[#1a237e] text-white text-[9px] font-bold px-1 rounded">MAIN</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="bg-white rounded-2xl border border-gray-100 p-5">
                        <h2 className="font-black text-gray-800 mb-4">Status</h2>
                        {[
                            { key: 'is_active', label: 'Active in store', desc: 'Customers can discover and purchase' },
                            { key: 'is_featured', label: 'Featured Product', desc: 'Show in Best Sellers on homepage' },
                        ].map(({ key, label, desc }) => (
                            <label key={key} className="flex items-start gap-3 cursor-pointer mb-4 last:mb-0">
                                <div className={`w-10 h-6 rounded-full flex-shrink-0 transition-all cursor-pointer ${form[key as keyof typeof form] ? 'bg-[#1a237e]' : 'bg-gray-200'}`}
                                    onClick={() => setForm(f => ({ ...f, [key]: !f[key as keyof typeof f] }))}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all mt-1 ${form[key as keyof typeof form] ? 'ml-5' : 'ml-1'}`} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700 text-sm">{label}</p>
                                    <p className="text-gray-400 text-xs">{desc}</p>
                                </div>
                            </label>
                        ))}
                    </section>

                    <button onClick={handleSave} disabled={saving || saved}
                        className="w-full bg-[#1a237e] hover:bg-[#0d1459] disabled:opacity-60 text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md">
                        {saving ? <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Saving...</>
                            : saved ? '✅ Product Saved!' : <><Save className="w-4 h-4" /> Save Product</>}
                    </button>
                </div>
            </div >
        </div >
    );
}
