'use client';

import React from 'react';
import type { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { Carousel } from '@/components/ui/Carousel';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ProductShelfProps {
    title: string;
    subtitle?: string;
    products: Product[];
    viewAllLink?: string;
    className?: string;
    cardClassName?: string;
}

export default function ProductShelf({
    title,
    subtitle,
    products,
    viewAllLink,
    className = '',
    cardClassName = ''
}: ProductShelfProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className={`py-8 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-end justify-between mb-5">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-gray-900">{title}</h2>
                        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
                    </div>
                    {viewAllLink && (
                        <Link href={viewAllLink} className="text-[#1a237e] font-bold text-sm flex items-center gap-1 hover:underline shrink-0">
                            View All <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    )}
                </div>

                {/* Carousel */}
                <Carousel
                    loop={false}
                    dragFree={true}
                    showDots={false}
                    showArrows={true}
                    align="start"
                    className="-mx-2"
                    // On mobile, show ~1.5 cards. Tablet ~2.5 cards. Desktop ~4 cards.
                    slideClassName={`flex-[0_0_65%] sm:flex-[0_0_40%] md:flex-[0_0_30%] lg:flex-[0_0_22%] min-w-0 pl-4 py-2 ${cardClassName}`}
                >
                    {products.map(product => (
                        <div key={product.id} className="h-full">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </Carousel>
            </div>
        </section>
    );
}
