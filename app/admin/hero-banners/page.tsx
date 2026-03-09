"use client";

import { useAdminStore } from '@/store/adminStore';
import { HeroBanner } from '@/types';
import { useState, useRef } from 'react';
import { Plus, GripVertical, Trash2, Edit2, Check, X, ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function AdminHeroBanners() {
    const { heroBanners, addHeroBanner, updateHeroBanner, deleteHeroBanner, toggleHeroBanner, reorderHeroBanners, featuredProductHero, updateFeaturedProductHero } = useAdminStore();

    // Sorting (simple up/down implementation for now)
    const sortedBanners = [...heroBanners].sort((a, b) => a.sortOrder - b.sortOrder);

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<HeroBanner>>({
        imageUrl: '',
        linkUrl: '',
        isActive: true,
    });

    const handleEdit = (banner: HeroBanner) => {
        setEditingId(banner.id);
        setFormData({
            imageUrl: banner.imageUrl,
            linkUrl: banner.linkUrl,
            isActive: banner.isActive,
        });
        setIsAdding(false);
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsAdding(false);
        setFormData({ imageUrl: '', linkUrl: '', isActive: true });
    };

    const handleSave = () => {
        if (!formData.imageUrl) return alert("Image URL is required");

        if (editingId) {
            updateHeroBanner(editingId, formData as Partial<HeroBanner>);
        } else {
            addHeroBanner({
                imageUrl: formData.imageUrl!,
                linkUrl: formData.linkUrl || '#',
                isActive: formData.isActive ?? true,
            });
        }
        handleCancel();
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newOrder = [...sortedBanners];
        const temp = newOrder[index - 1];
        newOrder[index - 1] = newOrder[index];
        newOrder[index] = temp;

        // Update sortOrder on all items
        reorderHeroBanners(newOrder.map(b => b.id));
    };

    const handleMoveDown = (index: number) => {
        if (index === sortedBanners.length - 1) return;
        const newOrder = [...sortedBanners];
        const temp = newOrder[index + 1];
        newOrder[index + 1] = newOrder[index];
        newOrder[index] = temp;

        // Update sortOrder on all items
        reorderHeroBanners(newOrder.map(b => b.id));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Hero Banners</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage the large scrolling images on the homepage.</p>
                </div>
                {!isAdding && !editingId && (
                    <button
                        onClick={() => { setIsAdding(true); setFormData({ imageUrl: '', linkUrl: '', isActive: true }); }}
                        className="bg-[#1a237e] hover:bg-[#0d1459] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Banner
                    </button>
                )}
            </div>

            {/* Featured Product Hero Config */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Featured Product Hero</h2>
                        <p className="text-sm text-gray-500">The explicit product showcase block that appears below the main carousel.</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                        <input
                            type="checkbox"
                            checked={featuredProductHero?.isActive || false}
                            onChange={(e) => updateFeaturedProductHero({ isActive: e.target.checked })}
                            className="rounded text-[#1a237e] focus:ring-[#1a237e]"
                        />
                        <span className="text-sm text-gray-700 font-bold">Offer is Active</span>
                    </label>
                </div>

                {featuredProductHero?.isActive && (
                    <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-gray-100 mt-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                            <input
                                type="text"
                                value={featuredProductHero.heading}
                                onChange={(e) => updateFeaturedProductHero({ heading: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subheading</label>
                            <input
                                type="text"
                                value={featuredProductHero.subheading}
                                onChange={(e) => updateFeaturedProductHero({ subheading: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Badge Label (Top left)</label>
                            <input
                                type="text"
                                value={featuredProductHero.badgeLabel}
                                onChange={(e) => updateFeaturedProductHero({ badgeLabel: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product ID (To link to)</label>
                            <input
                                type="text"
                                value={featuredProductHero.productId}
                                onChange={(e) => updateFeaturedProductHero({ productId: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] outline-none"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-8 border-t border-gray-100 pt-8 mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Carousel Banners</h2>
                </div>
            </div>

            {/* Editor Form */}
            {(isAdding || editingId) && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">{editingId ? 'Edit Banner' : 'New Banner'}</h2>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="e.g. /banners/sale-bg.jpg or https://..."
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Link URL</label>
                                <input
                                    type="text"
                                    value={formData.linkUrl}
                                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                                    placeholder="e.g. /products?sale=true"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] outline-none"
                                />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="rounded text-[#1a237e] focus:ring-[#1a237e]"
                                />
                                <span className="text-sm text-gray-700">Banner is Active</span>
                            </label>

                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    onClick={handleSave}
                                    className="bg-[#1a237e] hover:bg-[#0d1459] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" /> Save Banner
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            </div>
                        </div>

                        {/* Image Preview */}
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">Preview</label>
                            <div className="w-full aspect-[21/9] bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative flex items-center justify-center">
                                {formData.imageUrl ? (
                                    <Image
                                        src={formData.imageUrl}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            // fallback logic for bad URLs could go here
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="text-gray-400 flex flex-col items-center gap-2">
                                        <ImageIcon className="w-8 h-8 opacity-50" />
                                        <span className="text-xs">No image provided</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <ul className="divide-y divide-gray-100">
                    {sortedBanners.length === 0 ? (
                        <li className="p-8 text-center text-gray-500 text-sm">No hero banners created yet.</li>
                    ) : (
                        sortedBanners.map((banner, index) => (
                            <li key={banner.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">

                                {/* Reorder controls */}
                                <div className="flex flex-col gap-1 items-center justify-center text-gray-400">
                                    <button
                                        onClick={() => handleMoveUp(index)}
                                        disabled={index === 0}
                                        className="hover:text-[#1a237e] disabled:opacity-30 disabled:hover:text-gray-400 p-0.5"
                                    >
                                        ▲
                                    </button>
                                    <button
                                        onClick={() => handleMoveDown(index)}
                                        disabled={index === sortedBanners.length - 1}
                                        className="hover:text-[#1a237e] disabled:opacity-30 disabled:hover:text-gray-400 p-0.5"
                                    >
                                        ▼
                                    </button>
                                </div>

                                <div className="w-32 h-16 bg-gray-100 rounded overflow-hidden relative border border-gray-200 flex-shrink-0">
                                    <Image src={banner.imageUrl} alt="Banner thumbnail" fill className="object-cover" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate flex items-center gap-2">
                                        {banner.imageUrl.split('/').pop()}
                                        {!banner.isActive && (
                                            <span className="bg-red-100 text-red-700 text-[10px] uppercase font-black px-2 py-0.5 rounded-full">Inactive</span>
                                        )}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">Links to: {banner.linkUrl}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleHeroBanner(banner.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${banner.isActive
                                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {banner.isActive ? 'Active' : 'Hidden'}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(banner)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this banner?')) {
                                                deleteHeroBanner(banner.id);
                                            }
                                        }}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
