# V-Node Nutra — Setup Guide
## Local Dev · Supabase · Firebase / Vercel Deployment

---

## 1️⃣ Run Locally

### Prerequisites
- **Node.js** 18+ → `node -v`
- **npm** 9+ → `npm -v`

### Steps

```powershell
cd D:\Anitgravity\ecommerce-business\demo-ecom-supplements
npm install
npm run dev
```

> If you see **"Port 3000 is in use"** — another `next dev` instance is running.
> Kill it first: open Task Manager → find `node.exe` → End Task. Or run:
> ```powershell
> npx kill-port 3000
> npm run dev
> ```

App runs on **http://localhost:3000** (or 3001/3002/3003 if ports are busy).

### Test URLs

| Portal | URL | Credentials |
|--------|-----|-------------|
| Homepage | `http://localhost:3000` | — |
| Product Listing | `http://localhost:3000/products` | — |
| Customer Login | `http://localhost:3000/login` | `demo@vnodenutra.com` / `Demo@1234` |
| Sign Up | `http://localhost:3000/signup` | Fill the form |
| Forgot Password | `http://localhost:3000/forgot-password` | Any email |
| My Account | `http://localhost:3000/account` | Must be logged in |
| Checkout | `http://localhost:3000/checkout` | Add items to cart first |
| Order Tracking | `http://localhost:3000/track` | Enter `VN20260001` |
| Wishlist | `http://localhost:3000/wishlist` | Heart any product |
| **Admin Panel** | `http://localhost:3000/admin` | `admin` / `vnode@admin` |
| Admin: Products | `http://localhost:3000/admin/products` | — |
| Admin: Add Product | `http://localhost:3000/admin/products/new` | — |
| Admin: Customers | `http://localhost:3000/admin/customers` | — |
| Admin: Banners | `http://localhost:3000/admin/banners` | — |
| Admin: Coupons | `http://localhost:3000/admin/coupons` | — |
| Admin: Orders | `http://localhost:3000/admin/orders` | — |

---

## 2️⃣ Supabase Integration

### Step 1 — Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → Sign up
2. **New Project** → Name: `vnodenutra` → Region: **Southeast Asia (Singapore)**
3. Set a strong database password → Save it

### Step 2 — Get API Keys

Supabase now uses a **new key format** (introduced late 2024). You will see two types:

| Key type | Starts with | Where to find it |
|---|---|---|
| Publishable (replaces anon key) | `sb_publishable_...` | Supabase → **Connect → App Frameworks → .env.local tab** |
| Secret (replaces service_role key) | `sb_secret_...` | Supabase → **Project Settings → API → Secret keys** |

> The old `eyJ...` JWT keys still work too — both formats are supported by `supabase-js`.

**To get the Publishable key:**
1. Supabase Dashboard → top menu click **"Connect"** button
2. Select tab: **App Frameworks**
3. Framework: **Next.js**, Using: **App Router**, With: **supabase-js**
4. Copy the two lines shown under `.env.local` tab

**To get the Secret key:**
1. Supabase Dashboard → left sidebar bottom → **Project Settings** (gear icon)
2. Click **API** in the left sub-menu
3. Scroll to **"Secret keys"** section → copy the `secret` key

### Step 3 — Fill `.env.local`

Create `.env.local` in project root (it's in `.gitignore` — never commit this file):

```env
# ── Supabase ────────────────────────────────────────────
# Copy URL from: Connect → App Frameworks → .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co

# Publishable key (safe in browser) — copy from same screen
# Variable name in code is ANON_KEY but paste the sb_publishable_... value
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxxxxxxxxxxxxx

# Secret key (server only — NEVER add NEXT_PUBLIC_ prefix)
# Copy from: Project Settings → API → Secret keys
SUPABASE_SERVICE_KEY=sb_secret_xxxxxxxxxxxxxxxxxxxxxxxx

# Payment (Razorpay) — add when ready
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxx

# Shipping (Shiprocket) — add when ready
SHIPROCKET_EMAIL=admin@yourdomain.com
SHIPROCKET_PASSWORD=your_password
```

### Step 4 — Run Base Schema

1. Supabase Dashboard → **SQL Editor → New Query**
2. Paste the contents of `supabase/schema.sql`
3. Click **Run (▶)**

### Step 5 — Run Extended Schema (Orders, Reviews, Coupons, Banners)

Paste and run this in a new SQL query:

```sql
-- BRANDS
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE,
  logo_url TEXT, created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);

-- Add columns to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS mrp NUMERIC(10,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS nutrition_facts JSONB DEFAULT '[]';
ALTER TABLE products ADD COLUMN IF NOT EXISTS highlights TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ingredients TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS how_to_use TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS certifications TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_per_unit TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INT DEFAULT 0;

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES auth.users,
  customer_name TEXT, customer_email TEXT, customer_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  delivery_charge NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  address JSONB,
  coupon_code TEXT,
  payment_method TEXT DEFAULT 'razorpay',
  razorpay_payment_id TEXT, razorpay_order_id TEXT,
  status TEXT DEFAULT 'pending',
  awb_code TEXT, carrier TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers see own orders" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Customers create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- ORDER TIMELINE
CREATE TABLE IF NOT EXISTS order_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL, note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE order_timeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read timeline" ON order_timeline FOR SELECT USING (true);

-- REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users,
  author_name TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title TEXT, body TEXT,
  verified BOOLEAN DEFAULT FALSE, helpful INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Auth users submit reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- COUPONS
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'percent',  -- 'percent' | 'flat'
  value NUMERIC(10,2) NOT NULL,
  min_order NUMERIC(10,2) DEFAULT 0,
  max_uses INT DEFAULT NULL,
  uses_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active coupons" ON coupons FOR SELECT USING (is_active = TRUE);

INSERT INTO coupons (code, type, value, min_order, max_uses) VALUES
  ('VNODE10','percent',10,499,1000),
  ('WELCOME20','percent',20,999,500),
  ('FLAT100','flat',100,1499,200)
ON CONFLICT (code) DO NOTHING;

-- BANNERS
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, subtitle TEXT,
  image_url TEXT,
  cta_text TEXT DEFAULT 'Shop Now',
  cta_link TEXT DEFAULT '/products',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (is_active = TRUE);
```

### Step 6 — Auth Settings (2025 Supabase UI)

> ⚠️ Supabase renamed these settings. Old screenshots showing "Settings" tab under Auth are outdated. Use the paths below.

#### 6a — Set Site URL and Redirect URLs

1. Left sidebar → **Authentication**
2. Under Authentication, click **Configuration**
3. Click **URL Configuration**
4. Fill in:
   - **Site URL:** `http://localhost:3003` *(match the port shown in your `npm run dev` terminal — it may not be 3000 if another process is using it)*
   - **Redirect URLs** → click **Add URL** → add each:
     - `http://localhost:3003/**`
     - `http://localhost:3000/**`
     - `https://yourdomain.com/**` *(add when you have a live domain)*
5. Click **Save**

> **Why `/**` at the end?** The wildcard allows Supabase to redirect back to any page after login, e.g. redirecting to the page the user was on before being asked to login.

#### 6b — Configure Email Confirmation

1. Left sidebar → **Authentication → Configuration → Providers**
2. Click **Email** (it should be the first provider listed)
3. You'll see a toggle: **"Confirm email"**
   - **Development:** Toggle **OFF** — so you can sign up and test without checking email
   - **Production (before launch):** Toggle **ON** — customers must verify their email
4. Click **Save**

#### 6c — Full Auth Navigation Map (2025 Supabase UI)

```
Authentication
  ├── Users                      → See all registered customers
  └── Configuration
        ├── URL Configuration    → Site URL + Redirect URLs  ← Step 6a
        ├── Providers
        │     ├── Email          → Enable/disable email auth + confirm toggle  ← Step 6b
        │     └── Google         → Enable Google OAuth (optional)
        ├── Email Templates      → Customise confirmation/reset email content
        └── Rate Limits          → Brute-force protection settings
```

### Step 7 — Storage (Product Images)

1. Supabase → **Storage → New Bucket** → Name: `product-images` → **Public bucket** ✓
2. Run in SQL Editor:

```sql
CREATE POLICY "Admin upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Public view images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
```

---

## 3️⃣ Firebase Deployment (Full Next.js SSR)

### Is Firebase Free? ✅ Yes

| Feature | Firebase Free Tier (Spark Plan) |
|---|---|
| Hosting bandwidth | 10 GB/month free |
| Custom domain | ✅ Free |
| **SSL certificate** | ✅ Free — auto-provisioned, auto-renewed |
| App hosting (SSR/API routes) | Free tier available |
| Overage | Pay-as-you-go only if you exceed free limits |

> For a new or small store, **you will not exceed the free tier**. Firebase automatically provisions and renews your SSL certificate when you connect a custom domain — you don't need to buy or configure one.

---

> ⚠️ You need **Firebase App Hosting** (not plain Firebase Hosting) to run Next.js API routes (`app/api/*`). Plain Firebase Hosting only serves static files.

### Step 1 — Create a Google Account / Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project**
3. Name: `vnodenutra-store` (or any name)
4. Disable Google Analytics if you don't need it → **Create project**
5. Wait ~30 seconds for project creation

### Step 2 — Install Firebase CLI

```powershell
# Install globally (run once)
npm install -g firebase-tools

# Verify install
firebase --version

# Log in to your Google account
firebase login
# This opens a browser — sign in with your Google account → Allow
```

### Step 3 — Enable App Hosting & Initialize

```powershell
# Navigate to your project folder first
cd D:\Anitgravity\ecommerce-business\demo-ecom-supplements

# Enable the App Hosting web framework experiment
firebase experiments:enable webframeworks

# Initialize Firebase in your project
firebase init hosting
```

When prompted:
- **Which Firebase project?** → Select `vnodenutra-store`
- **Detected Next.js codebase. Set up App Hosting?** → `Yes`
- **Region?** → `asia-east1` (Taiwan — closest available to India; `asia-south1` Mumbai is not listed in App Hosting)
- **Deploy automatically on git push?** → `No` (we'll deploy manually for now)

### Step 4 — Verify `firebase.json` Was Created

Check the file created in your project root (do not change the region):

```json
{
  "hosting": {
    "source": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "frameworksBackend": { "region": "asia-east1" }
  }
}
```

> ⚠️ Do NOT change the region to `asia-south1` — it is not supported by Firebase App Hosting and will cause a deploy error. `asia-east1` (Taiwan) is the correct closest region.

### Step 5 — First Deploy (Demo Mode — No Env Vars Needed Yet)

> 💡 **Deploy order: get the site live first, add real Supabase/Razorpay keys second.**
>
> | What to do | When |
> |---|---|
> | `npm run build` + `firebase deploy` | Now — confirm the site is live |
> | Create `apphosting.yaml` with real keys | After confirming deploy works |
> | Add secret keys via Firebase CLI | When ready to go live with real data |
> | Connect custom domain | Last step |

The site will deploy in **demo mode** (mock products, no real orders). This is fine to
confirm the hosting is working before wiring up your Supabase project.

```powershell
# Build the production Next.js bundle
npm run build

# Deploy to Firebase (works immediately, no apphosting.yaml needed yet)
firebase deploy --only hosting
```

Deployment takes 2–5 minutes. When done you'll see:
```
✔  Deploy complete!
Hosting URL: https://vnodenutra-store.web.app
```

Open that URL — your store is live. 🎉

### Step 6 — Connect Real Supabase + Razorpay Keys (when ready)

Once you've confirmed the site loads, create `apphosting.yaml` in your project root:

```yaml
# apphosting.yaml — public env vars only (safe to commit)
env:
  - variable: NEXT_PUBLIC_SUPABASE_URL
    value: https://xxxxxxxxxxxx.supabase.co

  - variable: NEXT_PUBLIC_SUPABASE_ANON_KEY
    value: sb_publishable_xxxxxxxxxxxxxxxx

  - variable: NEXT_PUBLIC_RAZORPAY_KEY_ID
    value: rzp_live_xxxxxxxxxx

  - variable: NEXT_PUBLIC_SITE_URL
    value: https://vnodenutra-store.web.app
```

Add **secret** keys via CLI (stored encrypted by Firebase — never put these in files):

```powershell
# Each command prompts you to paste the value — it will be hidden as you type
firebase apphosting:secrets:set SUPABASE_SERVICE_KEY
firebase apphosting:secrets:set RAZORPAY_KEY_SECRET
firebase apphosting:secrets:set RAZORPAY_WEBHOOK_SECRET
firebase apphosting:secrets:set SHIPROCKET_PASSWORD
```

Then redeploy:

```powershell
npm run build
firebase deploy --only hosting
```

The site now runs with real products, real orders, and real payments.

### Step 7 — Connect a Custom Domain (Free SSL included)

1. Firebase Console → left sidebar → **Hosting**
2. Click **Add custom domain**
3. Enter your domain: `vnodenutra.com`
4. Firebase gives you **2 DNS records (TXT + A)** to add in your domain registrar
5. Go to your domain registrar (GoDaddy / Namecheap / Google Domains etc.) → DNS settings → add those records
6. Click **Verify** in Firebase → wait 24–48 hours for DNS to propagate
7. Firebase **automatically provisions a free SSL certificate** (Let's Encrypt) — no action needed
8. After DNS propagates: `https://vnodenutra.com` works with full SSL ✅

> **Also update Supabase after connecting custom domain:**
> Authentication → Configuration → URL Configuration → change Site URL and Redirect URL to your new domain.

### Step 8 — Redeploy After Code Changes

Every time you update code:

```powershell
npm run build
firebase deploy --only hosting
```

Or set up auto-deploy on git push via Firebase App Hosting backend settings.

---

## 4️⃣ Vercel Deployment (Easiest — Recommended)

```powershell
npm install -g vercel
vercel
# Follow prompts → deploys instantly
```

Add all `.env.local` keys in **Vercel Dashboard → Settings → Environment Variables**.

Live URL: `https://vnodenutra.vercel.app`

Custom domain: Vercel Dashboard → **Domains** → Add `vnodenutra.com`

---

## 5️⃣ Payment Gateway (Razorpay)

### Create Razorpay Account
1. [razorpay.com](https://razorpay.com) → Sign Up → Complete KYC
2. **Settings → API Keys** → Generate Test Keys → copy to `.env.local`

### How It Works
```
Customer clicks Pay
  → POST /api/create-order  (creates Razorpay order with amount)
  → Razorpay SDK popup opens
  → Customer pays (UPI/Card/etc.)
  → POST /api/verify-payment  (HMAC signature verified → order saved)
```

### Files Already Stubbed (uncomment in checkout page)
- `app/checkout/page.tsx` — Razorpay SDK call (commented out)
- Create `app/api/create-order/route.ts`
- Create `app/api/verify-payment/route.ts`

See `integration_guide.md` in the project docs for full code.

---

## 6️⃣ Shipping (Shiprocket)

1. [shiprocket.in](https://shiprocket.in) → Sign Up
2. Get email + password credentials → add to `.env.local`
3. After payment verified → call `/api/shiprocket/create-shipment`
4. Shiprocket sends webhooks to `/api/webhooks/shiprocket` → updates order status

---

## 7️⃣ Pre-Launch Security Checklist

- [ ] `SUPABASE_SERVICE_KEY` only used server-side
- [ ] RLS enabled on all tables ✅ (done in schema)
- [ ] Razorpay HMAC verified in `/api/verify-payment`
- [ ] Admin users created only via Supabase Dashboard
- [ ] `.env.local` not committed to Git
- [ ] Remove all `console.log` before production
- [ ] Set `NEXT_PUBLIC_SUPABASE_URL` to production URL
- [ ] Update Supabase Auth Site URL to production domain
