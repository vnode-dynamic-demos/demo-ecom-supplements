'use client';

import React, { useState } from 'react';
import type { ProductVariant } from '@/types';
import { cn } from '@/lib/utils';

interface VariantSelectorProps {
    variants: ProductVariant[];
    basePrice: number;
    onVariantChange: (variant: ProductVariant | null, finalPrice: number) => void;
}

export default function VariantSelector({
    variants,
    basePrice,
    onVariantChange,
}: VariantSelectorProps) {
    const flavors = [...new Set(variants.map((v) => v.flavor))];
    const sizes = [...new Set(variants.map((v) => v.size))];

    const [selectedFlavor, setSelectedFlavor] = useState<string>(flavors[0] ?? '');
    const [selectedSize, setSelectedSize] = useState<string>(sizes[0] ?? '');

    const getVariant = (flavor: string, size: string) =>
        variants.find((v) => v.flavor === flavor && v.size === size) ?? null;

    const currentVariant = getVariant(selectedFlavor, selectedSize);
    const finalPrice = basePrice + (currentVariant?.price_adjustment ?? 0);

    const handleFlavorChange = (flavor: string) => {
        setSelectedFlavor(flavor);
        const v = getVariant(flavor, selectedSize);
        onVariantChange(v, basePrice + (v?.price_adjustment ?? 0));
    };

    const handleSizeChange = (size: string) => {
        setSelectedSize(size);
        const v = getVariant(selectedFlavor, size);
        onVariantChange(v, basePrice + (v?.price_adjustment ?? 0));
    };

    // Notify parent of initial selection
    React.useEffect(() => {
        onVariantChange(currentVariant, finalPrice);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isAvailable = (flavor: string, size: string) => {
        const v = getVariant(flavor, size);
        return v ? v.stock > 0 : false;
    };

    return (
        <div className="space-y-5">
            {/* Flavors */}
            <div>
                <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                    Flavor: <span className="text-white normal-case tracking-normal">{selectedFlavor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                    {flavors.map((flavor) => (
                        <button
                            key={flavor}
                            onClick={() => handleFlavorChange(flavor)}
                            className={cn(
                                'px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200',
                                selectedFlavor === flavor
                                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/25'
                                    : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-orange-500 hover:text-orange-400'
                            )}
                        >
                            {flavor}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sizes */}
            <div>
                <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-3">
                    Size: <span className="text-white normal-case tracking-normal">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                        const available = isAvailable(selectedFlavor, size);
                        return (
                            <button
                                key={size}
                                onClick={() => available && handleSizeChange(size)}
                                disabled={!available}
                                className={cn(
                                    'px-5 py-2 rounded-lg text-sm font-semibold border transition-all duration-200',
                                    selectedSize === size
                                        ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/25'
                                        : available
                                            ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-orange-500 hover:text-orange-400'
                                            : 'bg-zinc-900/50 border-zinc-800 text-zinc-600 cursor-not-allowed line-through'
                                )}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Stock label */}
            {currentVariant && (
                <p className={cn('text-sm font-medium', currentVariant.stock > 20 ? 'text-green-400' : currentVariant.stock > 0 ? 'text-yellow-400' : 'text-red-400')}>
                    {currentVariant.stock > 20
                        ? '✓ In Stock'
                        : currentVariant.stock > 0
                            ? `⚠ Only ${currentVariant.stock} left`
                            : '✗ Out of Stock'}
                </p>
            )}
        </div>
    );
}
