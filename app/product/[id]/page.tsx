import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById, getProductVariants } from '@/lib/products';
import ProductClient from './ProductClient';
import ReviewSection from '@/components/product/ReviewSection';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) return { title: 'Product Not Found | V-Node Nutra' };
    return {
        title: `${product.name} | V-Node Nutra`,
        description: product.description ?? `Buy ${product.name} at the best price in India.`,
        openGraph: {
            title: product.name,
            description: product.description ?? '',
            images: product.image_url ? [{ url: product.image_url }] : [],
            type: 'website',
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) notFound();
    const variants = await getProductVariants(product.id);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description ?? '',
        image: product.image_url ?? '',
        sku: product.id,
        brand: { '@type': 'Brand', name: product.brand?.name ?? 'V-Node Nutra' },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.review_count,
            bestRating: 5,
            worstRating: 1,
        },
    };

    return (
        <main className="min-h-screen bg-[#f5f5f5]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* PDP – full HyugaLife-style layout (breadcrumb inside ProductClient) */}
            <ProductClient product={product} variants={variants} />

            {/* Customer Reviews */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <ReviewSection productId={product.id} reviews={[]} />
            </div>
        </main>
    );
}
