import { getSupabaseClient } from './supabase';
import type { Product, ProductVariant, Brand } from '@/types';

// ─── Mock brands ─────────────────────────────────────────────────────────────
export const MOCK_BRANDS: Brand[] = [
    { id: 'b-vnodenutra', name: 'V-Node Nutra', slug: 'v-node-nutra', is_featured: true, product_count: 3 },
    { id: 'b-muscleblaze', name: 'MuscleBlaze', slug: 'muscleblaze', is_featured: true, product_count: 12 },
    { id: 'b-gnc', name: 'GNC', slug: 'gnc', is_featured: true, product_count: 8 },
    { id: 'b-on', name: 'Optimum Nutrition', slug: 'optimum-nutrition', is_featured: true, product_count: 6 },
    { id: 'b-myprotein', name: 'MyProtein', slug: 'myprotein', is_featured: true, product_count: 10 },
    { id: 'b-fastup', name: 'Fast&Up', slug: 'fast-up', is_featured: true, product_count: 9 },
    { id: 'b-hkvitals', name: 'HK Vitals', slug: 'hk-vitals', is_featured: true, product_count: 4 },
];

const BRAND_VNODENUTRA = MOCK_BRANDS[0];

// ─── Mock data for when Supabase is not configured ──────────────────────────
const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'HyperWhey Pro — Whey Protein Isolate | 27g Protein | 30 Servings',
        slug: 'hyperwhey-pro-whey-protein',
        description: 'Cold-filtered whey protein isolate with 27g protein per scoop. NSF certified, mixes instantly. Used by 50,000+ athletes.',
        long_description: `HyperWhey Pro is our flagship ultra-premium whey protein isolate, engineered for serious athletes who demand the absolute best.\n\nCold-filtration preserves bioactive proteins — immunoglobulins, lactoferrin, and growth factors — while achieving <1g fat and <1g carb per serving. Every batch is tested at NABL-accredited labs.`,
        category_id: 'cat-protein',
        brand_id: 'b-vnodenutra',
        brand: BRAND_VNODENUTRA,
        base_price: 2499,
        mrp: 3299,
        price_per_unit: '₹83.3/serving',
        image_url: '/products/hyperwhey-pro.png',
        images: [
            { url: '/products/hyperwhey-pro.png', alt: 'HyperWhey Pro Front' },
            { url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop', alt: 'HyperWhey Pro Lifestyle' },
            { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop', alt: 'HyperWhey Pro Preparation' },
            { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop', alt: 'HyperWhey Pro Nutrition' },
        ],
        is_featured: true,
        rating: 4.7,
        review_count: 3124,
        badges: ['BEST SELLER', '27g PROTEIN', 'INFORMED SPORT'],
        certifications: ['INFORMED SPORT', 'NSF', 'FSSAI'],
        highlights: ['27g Pure Protein per scoop', 'Zero added sugar', 'Microfiltration process', 'DigeZyme® Enzyme Complex', 'Informed Sport Certified', '30 servings'],
        ingredients: 'Whey Protein Isolate (Milk), Cocoa Powder, Natural Flavors, Soy Lecithin, Stevia Leaf Extract, DigeZyme® Multi-Enzyme Complex',
        best_before: 'Dec 2026',
        stock: 45,
        nutrition: {
            servingSize: '33g (1 scoop)',
            servingsPerContainer: 30,
            facts: [
                { name: 'Calories', amount: 120, unit: '', bold: true },
                { name: 'Total Fat', amount: 0.5, unit: 'g', dailyValuePct: 1, bold: true },
                { name: 'Saturated Fat', amount: 0.2, unit: 'g', dailyValuePct: 1, indent: true },
                { name: 'Trans Fat', amount: 0, unit: 'g', indent: true },
                { name: 'Cholesterol', amount: 40, unit: 'mg', dailyValuePct: 13, bold: true },
                { name: 'Sodium', amount: 115, unit: 'mg', dailyValuePct: 5, bold: true },
                { name: 'Total Carb.', amount: 2, unit: 'g', dailyValuePct: 1, bold: true },
                { name: 'Dietary Fiber', amount: 0, unit: 'g', dailyValuePct: 0, indent: true },
                { name: 'Total Sugars', amount: 1, unit: 'g', indent: true },
                { name: 'Protein', amount: 27, unit: 'g', dailyValuePct: 54, bold: true },
                { name: 'Leucine (BCAA)', amount: 3.2, unit: 'g', indent: true },
                { name: 'Isoleucine', amount: 1.5, unit: 'g', indent: true },
                { name: 'Valine', amount: 1.4, unit: 'g', indent: true },
            ],
        },
        benefits: [
            { icon: '💪', title: '27g Pure Protein Per Scoop', description: 'Cold-filtered isolate delivers 27g of rapidly absorbing protein to fuel muscle growth and repair.' },
            { icon: '🔬', title: 'NSF & FSSAI Certified', description: 'Every batch independently verified for purity, label accuracy, and absence of banned substances.' },
            { icon: '⚡', title: 'Fast Absorption Formula', description: 'Microfiltration + DigeZyme® enzyme complex ensures rapid gastric emptying for optimal post-workout MPS.' },
            { icon: '🏆', title: 'Informed Sport Tested', description: 'Safe for competitive athletes. Zero banned substances. Certificate of Analysis available on request.' },
            { icon: '🌿', title: 'Naturally Sweetened', description: 'Sweetened with Stevia leaf extract. No aspartame, no sucralose. Clean label, zero compromise.' },
            { icon: '🥛', title: 'Instant Mixability', description: 'Lecithin-enhanced formula mixes instantly with a spoon — no chalky texture, no clumping, ever.' },
        ],
        how_to_use: [
            'Add 1 scoop (33g) to 200–250ml of cold water or milk',
            'Shake vigorously for 20–30 seconds until fully dissolved',
            'Consume within 30 minutes after your workout for best results',
            'On rest days, take 1 serving in the morning as a protein boost',
            'Stack with PureCre Creatine pre-workout for maximum gains',
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'NitroBlast Pre-Workout — Max Strength',
        slug: 'nitroblast-pre-workout',
        description: 'Maximum-strength pre-workout with 300mg caffeine, 6g citrulline malate, and 3.2g beta-alanine. Delivers savage pumps and laser focus from rep 1 to rep 100.',
        long_description: `NitroBlast is not for the faint-hearted. Engineered for elite performance, each serving delivers a clinical-dose pre-workout matrix tested to the highest standards.

**Key Ingredients & Why They Work:**
- **300mg Caffeine Anhydrous** — Proven to increase muscular endurance, power output, and mental acuity
- **6g L-Citrulline Malate (2:1)** — Elevates nitric oxide levels for massive vasodilation and insane muscle pumps  
- **3.2g Beta-Alanine** — Delays lactic acid buildup, extending time-to-fatigue by up to 22%
- **2.5g Betaine Anhydrous** — Increases power output and hydration inside muscle cells
- **200mg L-Tyrosine** — Combats mental fatigue for sustained focus through the toughest sessions

**The Tingle is Real:**
The beta-alanine tingles tell you it's working. Most users feel the full effect within 20–30 minutes.`,
        category_id: 'cat-2',
        base_price: 1799,
        mrp: 2499,
        image_url: '/products/nitroblast.png',
        images: [
            { url: '/products/nitroblast.png', alt: 'NitroBlast Pre-Workout Front' },
            { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop', alt: 'NitroBlast Gym Lifestyle' },
        ],
        is_featured: true,
        rating: 4.5,
        review_count: 1892,
        badges: ['300mg CAFFEINE', 'NEW FORMULA'],
        nutrition: {
            servingSize: '15g (1 scoop)',
            servingsPerContainer: 20,
            facts: [
                { name: 'Calories', amount: 15, unit: '', bold: true },
                { name: 'Total Carb.', amount: 2, unit: 'g', dailyValuePct: 1, bold: true },
                { name: 'Sodium', amount: 85, unit: 'mg', dailyValuePct: 4, bold: true },
                { name: 'Caffeine Anhydrous', amount: 300, unit: 'mg', bold: true },
                { name: 'L-Citrulline Malate', amount: 6000, unit: 'mg', bold: true },
                { name: 'Beta-Alanine', amount: 3200, unit: 'mg', bold: true },
                { name: 'Betaine Anhydrous', amount: 2500, unit: 'mg', bold: true },
                { name: 'L-Tyrosine', amount: 200, unit: 'mg', bold: true },
            ],
        },
        benefits: [
            { icon: '🚀', title: 'Explosive Energy & Focus', description: '300mg caffeine + L-Tyrosine synergy for laser-sharp focus and energy that lasts the entire session.' },
            { icon: '💉', title: 'Skin-Splitting Pumps', description: '6g Citrulline Malate maximises nitric oxide production for vasodilation and full-muscle pump.' },
            { icon: '🏋️', title: 'Extended Endurance', description: '3.2g Beta-Alanine reduces lactic acid accumulation — more reps, more sets, more results.' },
            { icon: '⏱️', title: 'Rapid Onset', description: 'Formulated for fast gastric absorption — feel the effects within 20–25 minutes of consumption.' },
        ],
        how_to_use: [
            'Assess tolerance: Start with half a scoop (7.5g) in 200ml water',
            'After 2 weeks, progress to a full scoop (15g) with 250ml cold water',
            'Consume 20–30 minutes before training',
            'Do NOT combine with other caffeine sources on the same day',
            'Cycle off for 4 weeks after every 8 weeks of use',
            'Not recommended for persons under 18, pregnant, or with heart conditions',
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'PureCre Monohydrate — Pharmaceutical Grade',
        slug: 'purecre-monohydrate',
        description: '100% pharmaceutical-grade creatine monohydrate with Creapure® certification. Clinically proven to boost strength, power output, and muscle volume. 60 servings.',
        long_description: `PureCre is the purest form of creatine monohydrate available, manufactured by AlzChem in Germany under the Creapure® trademark — the global gold standard for creatine quality.

**Why Creatine Works (The Science):**
Creatine replenishes phosphocreatine in muscles, enabling faster ATP regeneration during high-intensity exercise. Over 500 peer-reviewed studies confirm: creatine monohydrate increases peak power by 5–15%, enhances muscle volume via cell volumisation, and accelerates recovery between sets.

**Creapure® Certified — Why It Matters:**
Generic creatine can contain contaminants like dihydrotriazine (DHT), a potential carcinogen. Creapure® undergoes independent HPL chromatography analysis to guarantee 99.99% pure creatine. You pay for purity.

**The V-Node Advantage:**
We skip the flavouring, fillers, and marketing fluff. PureCre is creatine monohydrate — nothing added, nothing hidden. Mix it into anything. It dissolves completely and tastes like nothing.`,
        category_id: 'cat-1',
        base_price: 999,
        mrp: 1299,
        image_url: '/products/purecre.png',
        images: [
            { url: '/products/purecre.png', alt: 'PureCre Creatine Container' },
            { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop', alt: 'PureCre Gym Usage' },
        ],
        is_featured: true,
        rating: 4.8,
        review_count: 5471,
        badges: ['CREAPURE®', '#1 CREATINE'],
        nutrition: {
            servingSize: '5g (1 level scoop)',
            servingsPerContainer: 60,
            facts: [
                { name: 'Calories', amount: 0, unit: '', bold: true },
                { name: 'Total Fat', amount: 0, unit: 'g', bold: true },
                { name: 'Total Carbohydrates', amount: 0, unit: 'g', bold: true },
                { name: 'Protein', amount: 0, unit: 'g', bold: true },
                { name: 'Creatine Monohydrate', amount: 5000, unit: 'mg', bold: true },
                { name: '  (Creapure® Certified)', amount: '', unit: '', indent: true },
            ],
        },
        benefits: [
            { icon: '⚡', title: '5–15% Strength Increase', description: 'Over 500 clinical studies confirm creatine monohydrate significantly increases peak power output.' },
            { icon: '💧', title: 'Cell Volumisation', description: 'Draws water into muscle cells, increasing muscle volume and creating an anabolic environment.' },
            { icon: '🔄', title: 'Faster Recovery', description: 'Restores phosphocreatine levels between sets, enabling more volume and faster inter-set recovery.' },
            { icon: '🏅', title: 'Creapure® Certified', description: '99.99% pharmaceutical-grade purity. No DHT contaminants. Made in Germany. Lab-tested every batch.' },
            { icon: '🌍', title: 'Unflavoured & Versatile', description: 'Completely tasteless and odourless. Mix into protein shakes, water, juice — anything you like.' },
            { icon: '📊', title: 'Most Researched Supplement', description: 'Creatine monohydrate has more peer-reviewed evidence behind it than any other sports supplement.' },
        ],
        how_to_use: [
            'Loading phase (optional, week 1): 20g/day split into 4 servings for 5–7 days',
            'Maintenance: 1 scoop (5g) daily — timing does not significantly matter',
            'Mix with 250ml water, juice, or protein shake — it is completely tasteless',
            'Take consistently every day, including rest days, for best results',
            'Combine with HyperWhey Pro post-workout for maximum muscle-building synergy',
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

const MOCK_VARIANTS: Record<string, ProductVariant[]> = {
    '1': [
        { id: 'v1', product_id: '1', flavor: 'Chocolate Fudge', size: '1kg (2.2lb)', price_adjustment: 0, stock: 150, sku: 'HWP-CHO-1KG', created_at: '' },
        { id: 'v2', product_id: '1', flavor: 'Chocolate Fudge', size: '2kg (4.4lb)', price_adjustment: 700, stock: 90, sku: 'HWP-CHO-2KG', created_at: '' },
        { id: 'v3', product_id: '1', flavor: 'Vanilla Ice Cream', size: '1kg (2.2lb)', price_adjustment: 0, stock: 120, sku: 'HWP-VAN-1KG', created_at: '' },
        { id: 'v4', product_id: '1', flavor: 'Vanilla Ice Cream', size: '2kg (4.4lb)', price_adjustment: 700, stock: 60, sku: 'HWP-VAN-2KG', created_at: '' },
        { id: 'v5', product_id: '1', flavor: 'Strawberry Bliss', size: '1kg (2.2lb)', price_adjustment: 100, stock: 80, sku: 'HWP-STR-1KG', created_at: '' },
    ],
    '2': [
        { id: 'v6', product_id: '2', flavor: 'Blue Raspberry', size: '300g (0.66lb)', price_adjustment: 0, stock: 200, sku: 'NBL-BLU-300G', created_at: '' },
        { id: 'v7', product_id: '2', flavor: 'Watermelon', size: '300g (0.66lb)', price_adjustment: 0, stock: 150, sku: 'NBL-WAT-300G', created_at: '' },
        { id: 'v8', product_id: '2', flavor: 'Blue Raspberry', size: '600g (1.32lb)', price_adjustment: 500, stock: 100, sku: 'NBL-BLU-600G', created_at: '' },
    ],
    '3': [
        { id: 'v9', product_id: '3', flavor: 'Unflavored', size: '250g (0.55lb)', price_adjustment: 0, stock: 300, sku: 'PCR-UNF-250G', created_at: '' },
        { id: 'v10', product_id: '3', flavor: 'Unflavored', size: '500g (1.1lb)', price_adjustment: 250, stock: 200, sku: 'PCR-UNF-500G', created_at: '' },
    ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const isSupabaseConfigured = () =>
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL';

// ─── Fetch featured products ─────────────────────────────────────────────────
export async function getFeaturedProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured()) return MOCK_PRODUCTS;
    const { data, error } = await getSupabaseClient()!
        .from('products').select('*, category:categories(*)').eq('is_featured', true).order('created_at', { ascending: false });
    if (error) { console.error('[getFeaturedProducts]', error.message); return MOCK_PRODUCTS; }
    return data ?? MOCK_PRODUCTS;
}

// ─── Fetch all products ───────────────────────────────────────────────────────
export async function getAllProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured()) return MOCK_PRODUCTS;
    const { data, error } = await getSupabaseClient()!
        .from('products').select('*, category:categories(*)').order('created_at', { ascending: false });
    if (error) { console.error('[getAllProducts]', error.message); return MOCK_PRODUCTS; }
    return data ?? MOCK_PRODUCTS;
}

// ─── Fetch product by ID or slug ─────────────────────────────────────────────
export async function getProductById(idOrSlug: string): Promise<Product | null> {
    if (!isSupabaseConfigured()) {
        return MOCK_PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null;
    }
    const { data, error } = await getSupabaseClient()!
        .from('products').select('*, category:categories(*)').or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`).single();
    if (error) { console.error('[getProductById]', error.message); return MOCK_PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null; }
    return data;
}

// ─── Slug → mock product ID mapping (for variant fallback) ───────────────────
const SLUG_TO_MOCK_ID: Record<string, string> = {
    'hyperwhey-pro-whey-protein': '1',
    'nitroblast-pre-workout': '2',
    'purecre-monohydrate': '3',
};

// ─── Fetch variants for a product ────────────────────────────────────────────
export async function getProductVariants(productId: string, productSlug?: string): Promise<ProductVariant[]> {
    if (!isSupabaseConfigured()) {
        // In mock mode, productId IS the mock ID ('1', '2', '3')
        return MOCK_VARIANTS[productId] ?? [];
    }
    const { data, error } = await getSupabaseClient()!
        .from('product_variants').select('*').eq('product_id', productId).order('flavor, size');
    if (error) { console.error('[getProductVariants]', error.message); return MOCK_VARIANTS[productId] ?? []; }

    // If Supabase connected but no variants in DB yet (schema not run),
    // fall back to mock variants using slug mapping so the page still works.
    if (!data || data.length === 0) {
        const mockKey = productSlug ? SLUG_TO_MOCK_ID[productSlug] : undefined;
        return mockKey ? MOCK_VARIANTS[mockKey] : [];
    }

    return data;
}

// ─── Fetch all product IDs (for generateStaticParams) ────────────────────────
export async function getAllProductIds(): Promise<{ id: string }[]> {
    if (!isSupabaseConfigured()) return MOCK_PRODUCTS.map((p) => ({ id: p.id }));
    const { data, error } = await getSupabaseClient()!.from('products').select('id');
    if (error) return MOCK_PRODUCTS.map((p) => ({ id: p.id }));
    return data ?? [];
}
