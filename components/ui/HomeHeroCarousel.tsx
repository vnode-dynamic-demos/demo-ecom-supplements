"use client";

import { useAdminStore } from '@/store/adminStore';
import { Carousel } from '@/components/ui/Carousel';
import { FeaturedProductHero } from '@/components/ui/FeaturedProductHero';
import Link from 'next/link';

export function HomeHeroCarousel() {
    const { heroBanners, featuredProductHero } = useAdminStore();
    const activeHeroes = heroBanners.filter(b => b.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

    if (!activeHeroes.length) return null;

    return (
        <div className="bg-white border-b border-gray-100 pb-6 pt-2 sm:pt-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Carousel autoPlay loop showArrows showDots align="center" className="rounded-xl sm:rounded-2xl overflow-hidden shadow-sm bg-gray-50">
                    {featuredProductHero?.isActive && (
                        <div className="min-w-0 flex-[0_0_100%] aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] relative select-none bg-white rounded-xl sm:rounded-2xl overflow-hidden">
                            <FeaturedProductHero />
                        </div>
                    )}
                    {activeHeroes.map((slide: any) => {
                        const imgSrc = slide.imageUrl.startsWith('/') ? `${slide.imageUrl}?v=${Date.now()}` : slide.imageUrl;
                        return (
                            <div key={slide.id} className="w-full relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden">
                                <Link href={slide.linkUrl} className="block w-full h-full relative">
                                    <img
                                        src={imgSrc}
                                        alt="Promotional Banner"
                                        className="absolute inset-0 w-full h-full object-contain sm:object-cover object-center"
                                    />
                                </Link>
                            </div>
                        );
                    })}
                </Carousel>
            </div>
        </div>
    );
}
