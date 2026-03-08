-- 1. Insert Brands
INSERT INTO public.brands (name, slug, is_featured, product_count)
VALUES 
  ('V-Node Nutra', 'v-node-nutra', true, 3),
  ('MuscleBlaze', 'muscleblaze', true, 1),
  ('GNC', 'gnc', true, 1),
  ('Optimum Nutrition', 'optimum-nutrition', true, 1),
  ('MyProtein', 'myprotein', true, 1),
  ('Fast&Up', 'fast-up', true, 1),
  ('HK Vitals', 'hk-vitals', true, 0)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Categories
INSERT INTO public.categories (name, slug, description)
VALUES 
  ('Protein', 'protein', 'Whey, Isolate, Casein'),
  ('Pre-Workout', 'pre-workout', 'Energy and Focus'),
  ('Creatine', 'creatine', 'Strength and Power'),
  ('Vitamins', 'vitamins', 'Daily health and wellness'),
  ('Amino Acids', 'amino-acids', 'BCAAs and EAAs'),
  ('Weight Management', 'weight-management', 'Fat burners and mass gainers')
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Products (with subquery lookups to dynamically grab generated brand/category UUIDs)
INSERT INTO public.products (
  name, slug, description, long_description,
  brand_id, category_id,
  base_price, mrp, price_per_unit, image_url, images,
  is_featured, rating, review_count, stock, is_active
)
VALUES
  (
    'HyperWhey Pro — Whey Protein Isolate | 27g Protein | 30 Servings', 'hyperwhey-pro-whey-protein',
    'Cold-filtered whey protein isolate with 27g protein per scoop. NSF certified, mixes instantly. Used by 50,000+ athletes.',
    'HyperWhey Pro is our flagship ultra-premium whey protein isolate.',
    (SELECT id FROM public.brands WHERE slug = 'v-node-nutra'),
    (SELECT id FROM public.categories WHERE slug = 'protein'),
    2499, 3299, '₹83.3/serving', '/products/hyperwhey-pro.png', ARRAY['/products/hyperwhey-pro.png', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop'],
    true, 4.7, 3124, 45, true
  ),
  (
    'NitroBlast Pre-Workout — Max Strength', 'nitroblast-pre-workout',
    'Maximum-strength pre-workout with 300mg caffeine, 6g citrulline malate, and 3.2g beta-alanine.',
    'NitroBlast is not for the faint-hearted.',
    (SELECT id FROM public.brands WHERE slug = 'v-node-nutra'),
    (SELECT id FROM public.categories WHERE slug = 'pre-workout'),
    1799, 2499, null, '/products/nitroblast.png', ARRAY['/products/nitroblast.png', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop'],
    true, 4.5, 1892, 72, true
  ),
  (
    'PureCre Monohydrate — Pharmaceutical Grade', 'purecre-monohydrate',
    '100% pharmaceutical-grade creatine monohydrate with Creapure® certification.',
    'PureCre is the purest form of creatine monohydrate available.',
    (SELECT id FROM public.brands WHERE slug = 'v-node-nutra'),
    (SELECT id FROM public.categories WHERE slug = 'creatine'),
    999, 1299, null, '/products/purecre.png', ARRAY['/products/purecre.png', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop'],
    true, 4.8, 5471, 120, true
  ),
  (
    'MuscleBlaze Gold Whey Protein | 25g Protein | 1kg Chocolate', 'muscleblaze-gold-whey',
    'Lab-certified whey with digestive enzyme blend.',
    '',
    (SELECT id FROM public.brands WHERE slug = 'muscleblaze'),
    (SELECT id FROM public.categories WHERE slug = 'protein'),
    2299, 3199, '₹76.6/serving', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&auto=format&fit=crop'],
    false, 4.6, 8234, 0, true -- OUT OF STOCK TEST
  ),
  (
    'GNC Pro Performance 100% Whey Protein | 24g Protein | 2lb', 'gnc-pro-whey',
    'GNC''s trusted whey blend with 24g protein and 5.5g BCAAs.',
    '',
    (SELECT id FROM public.brands WHERE slug = 'gnc'),
    (SELECT id FROM public.categories WHERE slug = 'protein'),
    3199, 4199, '₹106.6/serving', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop'],
    false, 4.4, 2741, 0, true -- OUT OF STOCK TEST
  ),
  (
    'Optimum Nutrition Gold Standard 100% Whey | 24g Protein | 2lb', 'on-gold-standard-whey',
    'The world''s best-selling whey protein. 24g protein, 5.5g BCAAs.',
    '',
    (SELECT id FROM public.brands WHERE slug = 'optimum-nutrition'),
    (SELECT id FROM public.categories WHERE slug = 'protein'),
    3499, 4799, '₹116.6/serving', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop'],
    true, 4.8, 15203, 12, true
  ),
  (
    'Fast&Up Charge Natural Vitamin C | 1000mg | Effervescent | 20 Tabs', 'fastup-charge-vitamin-c',
    'Natural Vitamin C + Zinc + Echinacea for immunity. Effervescent.',
    '',
    (SELECT id FROM public.brands WHERE slug = 'fast-up'),
    (SELECT id FROM public.categories WHERE slug = 'vitamins'),
    299, 399, '₹15/tab', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop'],
    false, 4.3, 3890, 200, true
  ),
  (
    'MyProtein Impact Whey Isolate | 90% Protein | 25 Servings | Strawberry', 'myprotein-impact-whey-isolate',
    'Instantized whey isolate with 90% protein content per 100g.',
    '',
    (SELECT id FROM public.brands WHERE slug = 'myprotein'),
    (SELECT id FROM public.categories WHERE slug = 'protein'),
    2799, 3799, '₹112/serving', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&auto=format&fit=crop', ARRAY['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&auto=format&fit=crop'],
    false, 4.5, 4231, 67, true
  )
ON CONFLICT (slug) DO UPDATE SET 
  stock = EXCLUDED.stock, 
  images = EXCLUDED.images;
