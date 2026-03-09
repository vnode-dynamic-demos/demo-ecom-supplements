'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Star, CheckCircle } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

export function FeaturedProductHero() {
    const { featuredProductHero } = useAdminStore();

    if (!featuredProductHero?.isActive) return null;

    return (
        <div className="w-full h-full bg-white flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden">
            <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6 items-center w-full h-full max-w-6xl mx-auto">

                {/* Left side: Text & CTA */}
                <div className="flex flex-col items-start pt-4 sm:pt-10 pb-4">
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full mb-4 relative group border border-indigo-100/50">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {featuredProductHero?.badgeLabel || 'FSSAI & NSF Certified'}
                    </div>

                    <p className="text-gray-900 font-bold mb-0.5 sm:mb-2 text-[10px] sm:text-base">HyperWhey Pro</p>

                    <h1 className="text-sm sm:text-3xl lg:text-4xl font-black text-gray-900 leading-[1.1] mb-0.5 sm:mb-2 tracking-tight">
                        {featuredProductHero?.heading || "World's Best Whey Protein"}
                    </h1>

                    <p className="text-[11px] sm:text-lg lg:text-xl text-[#1a237e] font-bold mb-1 sm:mb-3 leading-tight">
                        {featuredProductHero?.subheading || "Now in India"}
                    </p>

                    <p className="hidden md:block text-sm text-gray-500 mb-6 font-medium">
                        27g Protein · Zero Sugar · 30 Servings
                    </p>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-6">
                        <Link
                            href="/product/1"
                            className="bg-[#1a237e] hover:bg-[#0d1459] text-white px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-sm font-bold flex items-center gap-1 sm:gap-2 transition-all shadow-lg shadow-indigo-200"
                        >
                            Shop <span className="hidden sm:inline">Now — ₹2,499</span> <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
                        </Link>

                        <div className="hidden sm:block bg-[#e53935] text-white px-2.5 py-1 rounded-lg font-black text-xs tracking-wide">
                            24% OFF
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-xs font-semibold text-gray-500 pt-3 border-t border-gray-100 w-full relative">
                        <div className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-blue-500" /> 5000+ Products</div>
                        <div className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-blue-500" /> 300+ Brands</div>
                        <div className="flex items-center gap-1 hidden sm:flex"><span className="w-1 h-1 rounded-full bg-blue-500" /> Free Delivery ₹999+</div>
                    </div>
                </div>

                {/* Right side: Product Imagery */}
                <div className="relative h-28 sm:h-full min-h-[100px] sm:min-h-[140px] w-full rounded-2xl bg-[#f4f7ff] flex items-center justify-center p-1 sm:p-4 group">

                    {/* Rating Badge (Top Right) */}
                    <div className="hidden sm:flex absolute top-4 right-4 lg:top-6 lg:right-6 bg-white shadow-xl shadow-blue-900/5 rounded-xl p-2 lg:p-3 flex-col items-center gap-0.5 z-10 border border-gray-100">
                        <span className="text-xs font-black text-gray-500 uppercase tracking-wider mb-0.5">Rating</span>
                        <div className="flex items-center gap-1 text-[#f59e0b] font-black text-xl">
                            4.7 <Star className="w-5 h-5 fill-current" />
                        </div>
                        <span className="text-[10px] text-gray-400 font-semibold">3,124 reviews</span>
                    </div>

                    {/* Product Image */}
                    <div className="relative w-full h-full max-w-[320px] mx-auto filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105">
                        <Image
                            src="/products/hyperwhey-pro.png"
                            alt="HyperWhey Pro Presentation"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Lab Tested Badge (Bottom Left) */}
                    <div className="hidden sm:flex absolute bottom-4 left-4 lg:bottom-6 lg:left-6 bg-white shadow-xl shadow-blue-900/5 rounded-xl px-3 py-2 lg:px-4 lg:py-3 items-center gap-2 lg:gap-3 z-10 border border-gray-100">
                        <div className="bg-green-50 p-1 lg:p-1.5 rounded-lg text-green-600">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-900 font-bold text-sm">Lab Tested</span>
                            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Authentic Pick</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
