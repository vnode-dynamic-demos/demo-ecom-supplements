-- =============================================
-- V-Node Dynamics: Supplement E-Commerce Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CATEGORIES
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PRODUCTS
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  base_price  NUMERIC(10, 2) NOT NULL,
  image_url   TEXT,           -- Public URL from Supabase Storage
  is_featured BOOLEAN DEFAULT FALSE,
  rating      NUMERIC(3, 2) DEFAULT 4.5,
  review_count INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PRODUCT VARIANTS
-- =============================================
CREATE TABLE IF NOT EXISTS product_variants (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id       UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  flavor           TEXT NOT NULL,           -- e.g. "Chocolate Fudge", "Vanilla Ice Cream"
  size             TEXT NOT NULL,           -- e.g. "1kg", "2kg", "5lbs"
  price_adjustment NUMERIC(10, 2) DEFAULT 0, -- Added to base_price
  stock            INT NOT NULL DEFAULT 0,
  sku              TEXT UNIQUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, flavor, size)
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Public read access (storefront)
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Public can read products"
  ON products FOR SELECT USING (true);

CREATE POLICY "Public can read product_variants"
  ON product_variants FOR SELECT USING (true);

-- =============================================
-- SEED DATA — Demo Supplements
-- =============================================
INSERT INTO categories (name, slug) VALUES
  ('Protein',      'protein'),
  ('Pre-Workout',  'pre-workout'),
  ('Vitamins',     'vitamins')
ON CONFLICT (slug) DO NOTHING;

-- Product 1: Whey Protein
INSERT INTO products (name, slug, description, category_id, base_price, image_url, is_featured, rating, review_count)
SELECT
  'HyperWhey Pro — Whey Protein',
  'hyperwhey-pro-whey-protein',
  'Cold-filtered, microfiltered whey protein isolate with 27g protein per scoop. Mixes instantly, zero clumping. Ideal for lean muscle gain and post-workout recovery.',
  c.id,
  2499.00,
  'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop',
  TRUE,
  4.7,
  312
FROM categories c WHERE c.slug = 'protein'
ON CONFLICT (slug) DO NOTHING;

-- Product 2: Pre-Workout
INSERT INTO products (name, slug, description, category_id, base_price, image_url, is_featured, rating, review_count)
SELECT
  'NitroBlast Pre-Workout',
  'nitroblast-pre-workout',
  'Maximum-strength pre-workout with 300mg caffeine, 6g citrulline malate, and beta-alanine. Delivers savage pumps and laser focus from rep 1 to rep 100.',
  c.id,
  1799.00,
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop',
  TRUE,
  4.5,
  189
FROM categories c WHERE c.slug = 'pre-workout'
ON CONFLICT (slug) DO NOTHING;

-- Product 3: Creatine
INSERT INTO products (name, slug, description, category_id, base_price, image_url, is_featured, rating, review_count)
SELECT
  'PureCre Monohydrate',
  'purecre-monohydrate',
  '100% pharmaceutical-grade creatine monohydrate. Clinically proven to boost strength, power, and muscle volume. 5g per serving, unflavored and ultra-fine.',
  c.id,
  999.00,
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop',
  TRUE,
  4.8,
  547
FROM categories c WHERE c.slug = 'protein'
ON CONFLICT (slug) DO NOTHING;

-- Variants: HyperWhey Pro
INSERT INTO product_variants (product_id, flavor, size, price_adjustment, stock, sku)
SELECT p.id, 'Chocolate Fudge', '1kg',  0,    150, 'HWP-CHO-1KG'  FROM products p WHERE p.slug = 'hyperwhey-pro-whey-protein' ON CONFLICT DO NOTHING;
INSERT INTO product_variants (product_id, flavor, size, price_adjustment, stock, sku)
SELECT p.id, 'Chocolate Fudge', '2kg',  700,  90,  'HWP-CHO-2KG'  FROM products p WHERE p.slug = 'hyperwhey-pro-whey-protein' ON CONFLICT DO NOTHING;
INSERT INTO product_variants (product_id, flavor, size, price_adjustment, stock, sku)
SELECT p.id, 'Vanilla Ice Cream', '1kg', 0,   120, 'HWP-VAN-1KG'  FROM products p WHERE p.slug = 'hyperwhey-pro-whey-protein' ON CONFLICT DO NOTHING;
INSERT INTO product_variants (product_id, flavor, size, price_adjustment, stock, sku)
SELECT p.id, 'Vanilla Ice Cream', '2kg', 700, 60,  'HWP-VAN-2KG'  FROM products p WHERE p.slug = 'hyperwhey-pro-whey-protein' ON CONFLICT DO NOTHING;
INSERT INTO product_variants (product_id, flavor, size, price_adjustment, stock, sku)
SELECT p.id, 'Strawberry Bliss', '1kg', 100,  80,  'HWP-STR-1KG'  FROM products p WHERE p.slug = 'hyperwhey-pro-whey-protein' ON CONFLICT DO NOTHING;

-- Variants: NitroBlast
INSERT INTO product_variants (product_id, flavor, size, price_adjustment, stock, sku)
SELECT p.id, 'Blue Raspberry', '300g',  0,   200, 'NBL-BLU-300G' FROM products p WHERE p.slug = 'nitroblast-pre-workout' ON CONFLICT DO NOTHING;
INSERT INTO product_variants (product_id, flavor, size, price_adjustment, stock, sku)
SELECT p.id, 'Watermelon',     '300g',  0,   150, 'NBL-WAT-300G' FROM products p WHERE p.slug = 'nitroblast-pre-workout' ON CONFLICT DO NOTHING;
INSERT INTO product_variants (product_id, flavor, size, price_adjustment, stock, sku)
SELECT p.id, 'Blue Raspberry', '600g',  500, 100, 'NBL-BLU-600G' FROM products p WHERE p.slug = 'nitroblast-pre-workout' ON CONFLICT DO NOTHING;

-- Variants: PureCre
INSERT INTO product_variants (product_id, flavor, size, price_adjustment, stock, sku)
SELECT p.id, 'Unflavored', '250g', 0,   300, 'PCR-UNF-250G' FROM products p WHERE p.slug = 'purecre-monohydrate' ON CONFLICT DO NOTHING;
INSERT INTO product_variants (product_id, flavor, size, price_adjustment, stock, sku)
SELECT p.id, 'Unflavored', '500g', 250, 200, 'PCR-UNF-500G' FROM products p WHERE p.slug = 'purecre-monohydrate' ON CONFLICT DO NOTHING;
