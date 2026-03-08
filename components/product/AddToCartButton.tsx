'use client';

import { useCartStore } from '@/store/cartStore';
import type { ProductVariant, Product } from '@/types';
import { ShoppingCart, Loader2, Check } from 'lucide-react';
import { useState, useRef } from 'react';

interface AddToCartButtonProps {
    product: Product;
    selectedVariant: ProductVariant | null;
    finalPrice: number;
}

export default function AddToCartButton({ product, selectedVariant, finalPrice }: AddToCartButtonProps) {
    const { addItem, openCart } = useCartStore();
    const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');
    // Ref-based guard prevents double-add from React StrictMode double-invoke or rapid clicks
    const inflightRef = useRef(false);

    const handleAddToCart = async () => {
        if (!selectedVariant || selectedVariant.stock === 0) return;
        if (inflightRef.current) return; // Already processing — ignore duplicate call
        inflightRef.current = true;

        setState('loading');
        await new Promise((r) => setTimeout(r, 350));

        addItem({
            variantId: selectedVariant.id,
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            imageUrl: product.image_url,
            flavor: selectedVariant.flavor,
            size: selectedVariant.size,
            price: finalPrice,
            maxStock: selectedVariant.stock,
        });

        setState('success');
        openCart();
        inflightRef.current = false;
        setTimeout(() => setState('idle'), 2000);
    };

    const outOfStock = !selectedVariant || selectedVariant.stock === 0;

    return (
        <button
            id="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={state === 'loading' || outOfStock}
            className={`
        relative w-full py-4 px-8 rounded-xl font-bold text-lg tracking-wide
        transition-all duration-300 flex items-center justify-center gap-3
        ${outOfStock
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : state === 'success'
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-[0.98]'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-400 hover:to-red-400 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98]'}
      `}
        >
            {state === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : state === 'success' ? (
                <><Check className="w-5 h-5" /> Added to Cart!</>
            ) : (
                <><ShoppingCart className="w-5 h-5" />{outOfStock ? 'Out of Stock' : 'Add to Cart'}</>
            )}
        </button>
    );
}
