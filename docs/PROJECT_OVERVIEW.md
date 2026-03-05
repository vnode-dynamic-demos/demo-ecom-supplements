# V-Node Nutra — Project Overview

A full-featured supplement e-commerce platform built with **Next.js 15** (App Router), **Tailwind CSS v4**, **Supabase** (PostgreSQL + Auth + Storage), and **Zustand** for state management.

---

## 🧪 Test Credentials

| Portal | URL | Username | Password |
|--------|-----|----------|----------|
| Customer Login | `/login` | `demo@vnodenutra.com` | `Demo@1234` |
| Admin Panel | `/admin` | `admin` | `vnode@admin` |
| Order Tracking | `/track` | — | Try `VN20260001` |

---

## 📂 Project Structure

```
app/
├── page.tsx                  # Homepage
├── products/page.tsx         # Product listing + filters
├── product/[id]/             # Product Detail Page (PDP)
├── login/page.tsx            # Customer login
├── signup/page.tsx           # Customer sign-up
├── forgot-password/page.tsx  # Password reset
├── account/page.tsx          # Customer profile + orders
├── checkout/page.tsx         # Checkout (address + payment)
├── track/page.tsx            # Order tracking
├── wishlist/page.tsx         # Wishlist page
└── admin/
    ├── login/page.tsx        # Admin login
    ├── page.tsx              # Admin dashboard
    ├── products/             # Products CRUD
    ├── customers/            # Customer management
    ├── banners/              # Homepage banners
    ├── coupons/              # Discount coupons
    ├── offers/               # GWP offers
    ├── orders/               # Order management
    ├── reviews/              # Review moderation
    └── analytics/            # Sales analytics

components/
├── layout/
│   ├── Navbar.tsx            # Sticky two-row navbar
│   └── AnnouncementBar.tsx   # Top scrolling banner
├── product/
│   ├── ProductCard.tsx       # Product grid card
│   ├── ReviewSection.tsx     # Reviews + write review form
│   └── NutritionFacts.tsx    # Nutrition label component
└── cart/
    └── CartSlideout.tsx      # Slide-out cart drawer

store/
├── cartStore.ts              # Zustand cart with persistence
└── wishlistStore.ts          # Zustand wishlist with persistence

lib/
└── products.ts               # Product data layer (Supabase)

supabase/
└── schema.sql                # Full database schema + seed data
```

---

## 🌐 Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_KEY=sb_secret_...           # Server-side only, never expose

# Admin Security
ALLOWED_ADMIN_IPS=203.0.113.10,100.72.45.12 # Comma-separated IPs (Tailscale supported)
ADMIN_IP_RESTRICTION=disabled               # Set to 'disabled' during testing only

# Payment (Razorpay)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxx

# Shipping (Shiprocket)
SHIPROCKET_EMAIL=admin@yourdomain.com
SHIPROCKET_PASSWORD=your_password
```

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand (persist middleware) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Icons | Lucide React |
| Payments | Razorpay (ready to wire) |
| Shipping | Shiprocket (ready to wire) |
| Deploy | Vercel / Firebase App Hosting |
