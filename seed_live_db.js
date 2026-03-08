require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error('Missing Supabase keys in .env.local');
const supabase = createClient(supabaseUrl, supabaseKey);

const MOCK_BRANDS = [
    { name: 'V-Node Nutra', slug: 'v-node-nutra' },
    { name: 'MuscleBlaze', slug: 'muscleblaze' },
    { name: 'GNC', slug: 'gnc' },
    { name: 'Optimum Nutrition', slug: 'optimum-nutrition' },
    { name: 'MyProtein', slug: 'myprotein' },
    { name: 'Fast&Up', slug: 'fast-up' },
    { name: 'HK Vitals', slug: 'hk-vitals' },
];

const MOCK_CATEGORIES = [
    { name: 'Protein', slug: 'protein' },
    { name: 'Pre-Workout', slug: 'pre-workout' },
    { name: 'Creatine', slug: 'creatine' },
    { name: 'Vitamins', slug: 'vitamins' },
    { name: 'Amino Acids', slug: 'amino-acids' },
    { name: 'Weight Management', slug: 'weight-management' },
];

const PRE_MAPPED_PRODUCTS = [
    {
        name: 'HyperWhey Pro — Whey Protein Isolate | 27g Protein | 30 Servings', slug: 'hyperwhey-pro-whey-protein',
        description: 'Cold-filtered whey protein isolate with 27g protein per scoop. NSF certified, mixes instantly. Used by 50,000+ athletes.',
        category_name: 'Protein', brand_name: 'V-Node Nutra',
        base_price: 2499, mrp: 3299, price_per_unit: '₹83.3/serving', image_url: '/products/hyperwhey-pro.png',
        images: ['/products/hyperwhey-pro.png', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop'],
        is_featured: true, rating: 4.7, review_count: 3124, stock: 45,
    },
    {
        name: 'NitroBlast Pre-Workout — Max Strength', slug: 'nitroblast-pre-workout',
        description: 'Maximum-strength pre-workout with 300mg caffeine, 6g citrulline malate, and 3.2g beta-alanine.',
        category_name: 'Pre-Workout', brand_name: 'V-Node Nutra',
        base_price: 1799, mrp: 2499, image_url: '/products/nitroblast.png',
        images: ['/products/nitroblast.png', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop'],
        is_featured: true, rating: 4.5, review_count: 1892, stock: 72,
    },
    {
        name: 'PureCre Monohydrate — Pharmaceutical Grade', slug: 'purecre-monohydrate',
        description: '100% pharmaceutical-grade creatine monohydrate with Creapure® certification.',
        category_name: 'Creatine', brand_name: 'V-Node Nutra',
        base_price: 999, mrp: 1299, image_url: '/products/purecre.png',
        images: ['/products/purecre.png', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop'],
        is_featured: true, rating: 4.8, review_count: 5471, stock: 120,
    },
    {
        name: 'MuscleBlaze Gold Whey Protein | 25g Protein | 1kg Chocolate', slug: 'muscleblaze-gold-whey',
        description: 'Lab-certified whey with digestive enzyme blend.', category_name: 'Protein', brand_name: 'MuscleBlaze',
        base_price: 2299, mrp: 3199, price_per_unit: '₹76.6/serving', image_url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&auto=format&fit=crop',
        is_featured: false, rating: 4.6, review_count: 8234, stock: 0, // Out of stock test!
    },
    {
        name: 'GNC Pro Performance 100% Whey Protein | 24g Protein | 2lb', slug: 'gnc-pro-whey',
        description: 'GNC\'s trusted whey blend with 24g protein and 5.5g BCAAs.', category_name: 'Protein', brand_name: 'GNC',
        base_price: 3199, mrp: 4199, price_per_unit: '₹106.6/serving', image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop',
        is_featured: false, rating: 4.4, review_count: 2741, stock: 0, // Out of stock test!
    },
    {
        name: 'Optimum Nutrition Gold Standard 100% Whey | 24g Protein | 2lb', slug: 'on-gold-standard-whey',
        description: 'The world\'s best-selling whey protein. 24g protein, 5.5g BCAAs.', category_name: 'Protein', brand_name: 'Optimum Nutrition',
        base_price: 3499, mrp: 4799, price_per_unit: '₹116.6/serving', image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop',
        is_featured: true, rating: 4.8, review_count: 15203, stock: 12,
    },
    {
        name: 'Fast&Up Charge Natural Vitamin C | 1000mg | Effervescent | 20 Tabs', slug: 'fastup-charge-vitamin-c',
        description: 'Natural Vitamin C + Zinc + Echinacea for immunity. Effervescent.', category_name: 'Vitamins', brand_name: 'Fast&Up',
        base_price: 299, mrp: 399, price_per_unit: '₹15/tab', image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop',
        is_featured: false, rating: 4.3, review_count: 3890, stock: 200,
    },
    {
        name: 'MyProtein Impact Whey Isolate | 90% Protein | 25 Servings | Strawberry', slug: 'myprotein-impact-whey-isolate',
        description: 'Instantized whey isolate with 90% protein content per 100g.', category_name: 'Protein', brand_name: 'MyProtein',
        base_price: 2799, mrp: 3799, price_per_unit: '₹112/serving', image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&auto=format&fit=crop',
        is_featured: false, rating: 4.5, review_count: 4231, stock: 67,
    },
];

async function seed() {
    console.log('Seeding Database...');

    // 1. Insert Brands
    const brandMap = {};
    for (const b of MOCK_BRANDS) {
        const { data, error } = await supabase.from('brands').select('id, name').eq('slug', b.slug).maybeSingle();
        if (data) {
            brandMap[b.name] = data.id;
        } else {
            const { data: ins, error: err } = await supabase.from('brands').insert([b]).select().single();
            if (err) console.error('Brand error', err);
            else brandMap[b.name] = ins.id;
        }
    }
    console.log('Brands linked.');

    // 2. Insert Categories
    const catMap = {};
    for (const c of MOCK_CATEGORIES) {
        const { data, error } = await supabase.from('categories').select('id, name').eq('slug', c.slug).maybeSingle();
        if (data) {
            catMap[c.name] = data.id;
        } else {
            const { data: ins, error: err } = await supabase.from('categories').insert([c]).select().single();
            if (err) console.error('Category error', err);
            else catMap[c.name] = ins.id;
        }
    }
    console.log('Categories linked.');

    // 3. Insert Products
    for (const p of PRE_MAPPED_PRODUCTS) {
        // Attempt to map foreign keys
        const productRow = {
            name: p.name,
            slug: p.slug,
            description: p.description,
            base_price: p.base_price,
            mrp: p.mrp,
            price_per_unit: p.price_per_unit || null,
            image_url: p.image_url,
            images: p.images || [p.image_url],
            is_featured: p.is_featured,
            rating: p.rating,
            review_count: p.review_count,
            stock: p.stock,
            brand_id: brandMap[p.brand_name],
            category_id: catMap[p.category_name],
        };

        const { data, error } = await supabase.from('products').select('id').eq('slug', p.slug).maybeSingle();
        if (data) {
            console.log('Updating product:', p.name);
            await supabase.from('products').update(productRow).eq('id', data.id);
        } else {
            console.log('Inserting product:', p.name);
            const { error: insErr } = await supabase.from('products').insert([productRow]);
            if (insErr) console.error('Product insertion error:', insErr);
        }
    }
    console.log('Products seeded!');
}

seed().catch(console.error);
