'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
    children: React.ReactNode;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showArrows?: boolean;
    showDots?: boolean;
    loop?: boolean;
    dragFree?: boolean;
    align?: 'start' | 'center' | 'end';
    className?: string;     // Wrapper container class
    slideClassName?: string; // Class applied to individual slide wrappers
}

export function Carousel({
    children,
    autoPlay = false,
    autoPlayInterval = 4000,
    showArrows = true,
    showDots = true,
    loop = true,
    dragFree = false,
    align = 'start',
    className = '',
    slideClassName = 'flex-[0_0_100%] min-w-0'
}: CarouselProps) {
    const plugins = autoPlay ? [Autoplay({ delay: autoPlayInterval, stopOnInteraction: true })] : [];

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop,
        dragFree,
        align,
        containScroll: 'trimSnaps'
    }, plugins);

    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setPrevBtnEnabled(emblaApi.canScrollPrev());
        setNextBtnEnabled(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div className={`relative ${className}`}>
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y flex-row">
                    {React.Children.map(children, (child, index) => (
                        <div key={index} className={slideClassName}>
                            {child}
                        </div>
                    ))}
                </div>
            </div>

            {/* Arrows */}
            {showArrows && (
                <>
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 shadow-md backdrop-blur text-gray-800 rounded-full flex items-center justify-center hover:bg-white transition-all disabled:opacity-0 z-10"
                        onClick={scrollPrev}
                        disabled={!prevBtnEnabled}
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 shadow-md backdrop-blur text-gray-800 rounded-full flex items-center justify-center hover:bg-white transition-all disabled:opacity-0 z-10"
                        onClick={scrollNext}
                        disabled={!nextBtnEnabled}
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Dots */}
            {showDots && scrollSnaps.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                    {scrollSnaps.map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === selectedIndex
                                    ? 'bg-white w-6'
                                    : 'bg-white/50 hover:bg-white/80'
                                }`}
                            onClick={() => scrollTo(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
