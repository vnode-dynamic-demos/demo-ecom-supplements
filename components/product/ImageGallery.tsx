'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export interface GalleryImage {
    url: string;
    alt: string;
}

interface ImageGalleryProps {
    images: GalleryImage[];
    productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [active, setActive] = useState(0);
    const [zoomed, setZoomed] = useState(false);

    if (!images || images.length === 0) return null;

    const prev = () => setActive((a) => (a - 1 + images.length) % images.length);
    const next = () => setActive((a) => (a + 1) % images.length);

    return (
        <div className="flex flex-col gap-3">
            {/* Main image */}
            <div
                className={`relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 cursor-zoom-in group ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                onClick={() => setZoomed((z) => !z)}
            >
                <Image
                    src={images[active].url}
                    alt={images[active].alt || productName}
                    fill
                    className={`object-contain p-4 transition-transform duration-500 ${zoomed ? 'scale-125' : 'scale-100 group-hover:scale-105'}`}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Zoom hint */}
                <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4 text-white" />
                </div>

                {/* Navigation arrows (only show if multiple images) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/80 text-white p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/80 text-white p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Dot indicators */}
                {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setActive(i); }}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${i === active ? 'bg-orange-500 w-4' : 'bg-white/40'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`flex-shrink-0 relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === active ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-zinc-800 hover:border-zinc-600'
                                }`}
                        >
                            <Image
                                src={img.url}
                                alt={`${productName} view ${i + 1}`}
                                fill
                                className="object-contain p-1.5"
                                sizes="64px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
