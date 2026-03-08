import { getFeaturedProducts, getAllProducts } from '@/lib/products';
import { MOCK_BRANDS } from '@/lib/products';
import ProductCard from '@/components/product/ProductCard';
import ProductShelf from '@/components/product/ProductShelf';
import { Carousel } from '@/components/ui/Carousel';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Zap, Target, Heart, TrendingUp, ShieldCheck, Truck, RotateCcw, Users, Star } from 'lucide-react';

// ─── Hero banners ─────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: 'slide-1',
    brand: 'HyperWhey Pro',
    badge: '🔬 FSSAI & NSF Certified',
    headline: 'World\'s Best\nWhey Protein',
    subline: 'Now in India',
    body: '27g Protein · Zero Sugar · 30 Servings · Mixes Instantly',
    cta: 'Shop Now — ₹2,499',
    ctaHref: '/product/hyperwhey-pro-whey-protein',
    discount: '24% OFF',
    image: '/products/hyperwhey-pro.png',
    bg: '#eef2ff',
    accent: '#1a237e',
  },
  {
    id: 'slide-2',
    brand: 'NitroBlast Pre-Workout',
    badge: '⚡ Max Strength Formula',
    headline: 'Explosive Energy\nUnstoppable Focus',
    subline: 'For Elite Athletes',
    body: '300mg Caffeine · 6g Citrulline · 20 Servings',
    cta: 'Get Started — ₹1,799',
    ctaHref: '/product/nitroblast-pre-workout',
    discount: '28% OFF',
    image: '/products/nitroblast.png',
    bg: '#fff3e0',
    accent: '#e65100',
  },
];

// ─── Goal categories ──────────────────────────────────────────────────────────
const GOALS = [
  { icon: Zap, label: 'Muscle Gain', sub: 'Whey, Creatine, Mass Gainer', href: '/products?goal=muscle', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon_bg: 'bg-blue-100' },
  { icon: TrendingUp, label: 'Weight Loss', sub: 'Fat Burners, CLA, L-Carnitine', href: '/products?goal=loss', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon_bg: 'bg-green-100' },
  { icon: Target, label: 'Endurance', sub: 'BCAAs, Electrolytes, Beta-Al', href: '/products?goal=endurance', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon_bg: 'bg-orange-100' },
  { icon: Heart, label: 'General Health', sub: 'Multivitamins, Omega-3, Zinc', href: '/products?goal=health', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', icon_bg: 'bg-pink-100' },
];

// ─── Flash deals ──────────────────────────────────────────────────────────────
const FLASH_DEALS = [
  { id: '1', name: 'HyperWhey Pro 2kg', image: '/products/hyperwhey-pro.png', price: 4199, mrp: 5999, discount: 30, sold: 78 },
  { id: '2', name: 'NitroBlast 600g Combo', image: '/products/nitroblast.png', price: 1999, mrp: 3499, discount: 43, sold: 91 },
  { id: '3', name: 'PureCre 500g Twin Pack', image: '/products/purecre.png', price: 1499, mrp: 2299, discount: 35, sold: 65 },
];

// ─── Promo banners ────────────────────────────────────────────────────────────
const PROMO_BANNERS = [
  { tag: 'Limited Time', title: 'Protein Week Sale', sub: 'Up to 40% off on Whey Protein', code: 'PROTEIN15', bg: '#1a237e', text: 'white' },
  { tag: 'New Arrivals', title: 'NitroBlast 2.0 is Here', sub: 'Pre-Workout redefined', code: 'NITRO10', bg: '#e65100', text: 'white' },
  { tag: 'Flash Deal', title: 'Creatine Bundle', sub: 'Buy 2 PureCre — Get 1 FREE', code: 'CRE3FOR2', bg: '#1b5e20', text: 'white' },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();
  const allProducts = await getAllProducts();

  const healthProducts = allProducts.filter(p => ['cat-vitamins', 'cat-health-foods'].includes(p.category_id || ''));

  return (
    <div className="min-h-screen bg-[#f5f5f5]">

      {/* ── Hero Banner ───────────────────────────────────── */}
      <Carousel autoPlay loop showArrows showDots align="center" className="bg-white border-b border-gray-100">
        {HERO_SLIDES.map(slide => (
          <div key={slide.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Text */}
              <div>
                <span className="inline-flex items-center gap-2 bg-[#eef2ff] text-[#1a237e] text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                  {slide.badge}
                </span>
                <p className="text-gray-500 font-semibold text-sm mb-1">{slide.brand}</p>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-2 leading-tight whitespace-pre-line">
                  {slide.headline}
                </h1>
                <p className="text-[#1a237e] font-bold text-xl mb-4">{slide.subline}</p>
                <p className="text-gray-500 text-sm mb-6">{slide.body}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href={slide.ctaHref}
                    className="bg-[#1a237e] hover:bg-[#0d1459] text-white font-black px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-900/20 flex items-center gap-2"
                  >
                    {slide.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                  <div className="bg-red-500 text-white font-black px-4 py-2 rounded-xl text-sm">{slide.discount}</div>
                </div>
                <div className="flex flex-wrap gap-4 mt-6">
                  {['5000+ Products', '300+ Brands', 'Free Delivery ₹999+', 'FSSAI Certified'].map(t => (
                    <span key={t} className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                      <span className="w-1.5 h-1.5 bg-[#1a237e] rounded-full" /> {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div className="relative flex items-center justify-center rounded-2xl p-8 h-72 lg:h-96" style={{ backgroundColor: slide.bg }}>
                <Image
                  src={slide.image}
                  alt={slide.brand}
                  width={320}
                  height={320}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
                <div className="absolute top-4 right-4 bg-white rounded-xl px-3 py-2 shadow-md border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Rating</p>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500 font-black">4.7</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <p className="text-[10px] text-gray-400">3,124 reviews</p>
                </div>
                <div className="absolute bottom-4 left-4 bg-white rounded-xl px-3 py-2 shadow-md border border-gray-100">
                  <p className="text-[10px] text-green-700 font-bold">✅ Lab Tested</p>
                  <p className="text-[10px] text-gray-400">Authentic Pick</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* ── Trust Bar ─────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, title: '100% Authentic', sub: 'Sourced directly from brands' },
              { icon: Truck, title: 'Free Delivery on ₹999+', sub: 'Pan-India, fast shipping' },
              { icon: RotateCcw, title: 'Easy Returns', sub: '7-day hassle-free returns' },
              { icon: Users, title: '2 Lakh+ Customers', sub: 'Happy customers across India' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#eef2ff] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#1a237e]" />
                </div>
                <div>
                  <p className="text-gray-800 font-bold text-sm">{title}</p>
                  <p className="text-gray-400 text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop by Goal ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-black text-gray-900 mb-4">Shop by Goal</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {GOALS.map(goal => {
            const Icon = goal.icon;
            return (
              <Link
                key={goal.label}
                href={goal.href}
                className={`${goal.bg} border ${goal.border} rounded-xl p-5 flex items-start gap-3 hover:shadow-md transition-all group`}
              >
                <div className={`${goal.icon_bg} rounded-xl p-2.5 flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${goal.text}`} />
                </div>
                <div>
                  <p className={`font-black text-sm ${goal.text}`}>{goal.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-snug">{goal.sub}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Promo Banners ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid md:grid-cols-3 gap-4">
          {PROMO_BANNERS.map((b) => (
            <div
              key={b.title}
              className="rounded-xl p-5 text-white flex flex-col gap-2 relative overflow-hidden shadow-md"
              style={{ backgroundColor: b.bg }}
            >
              <span className="text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full w-fit">{b.tag}</span>
              <p className="font-black text-lg leading-tight">{b.title}</p>
              <p className="text-sm opacity-80">{b.sub}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">Use: {b.code}</span>
              </div>
              <Link href="/products" className="mt-1 text-white font-bold text-sm flex items-center gap-1 hover:underline">
                Shop Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Health to Start With (Vitamins & Healthy Foods) */}
      <ProductShelf
        title="Health to Start With"
        subtitle="Vitamins, Omega-3, Probiotics & Oats"
        products={healthProducts}
        viewAllLink="/products?category=cat-vitamins"
      />

      {/* ── Featured / Best Sellers ───────────────────────── */}
      <ProductShelf
        title="Best Sellers"
        subtitle="Top-rated products across categories"
        products={featured}
        viewAllLink="/products"
      />

      {/* ── Flash Deals ───────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="bg-red-500 text-white font-black text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> FLASH DEALS
              </div>
              <h2 className="text-xl font-black text-gray-900">Limited Time Offers</h2>
            </div>
            <Link href="/products?sale=true" className="text-[#1a237e] font-bold text-sm flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {FLASH_DEALS.map(deal => (
              <Link key={deal.id} href={`/product/${deal.id}`} className="group bg-gray-50 border border-gray-100 rounded-xl p-4 flex gap-4 items-center hover:shadow-md hover:border-gray-200 transition-all">
                <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <Image src={deal.image} alt={deal.name} fill className="object-contain p-2" sizes="80px" />
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black px-1 py-0.5">{deal.discount}%</span>
                </div>
                <div className="min-w-0">
                  <p className="text-gray-800 font-bold text-sm leading-snug line-clamp-2">{deal.name}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-gray-900 font-black">₹{deal.price.toLocaleString('en-IN')}</span>
                    <span className="text-gray-400 text-xs line-through">₹{deal.mrp.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${deal.sold}%` }} />
                    </div>
                    <span className="text-[11px] text-orange-600 font-bold">{deal.sold}% sold</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Brands ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-gray-900">Top Brands</h2>
          <Link href="/brands" className="text-[#1a237e] font-bold text-sm flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {MOCK_BRANDS.map(brand => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="bg-white border border-gray-100 rounded-xl py-4 px-3 flex flex-col items-center gap-1.5 hover:shadow-md hover:border-[#1a237e]/30 hover:bg-[#f0f4ff] transition-all group text-center"
            >
              <div className="w-10 h-10 bg-[#eef2ff] rounded-xl flex items-center justify-center font-black text-[#1a237e] text-sm group-hover:bg-[#1a237e] group-hover:text-white transition-all">
                {brand.name.slice(0, 2).toUpperCase()}
              </div>
              <p className="text-gray-700 font-bold text-[11px] leading-tight">{brand.name}</p>
              <p className="text-gray-400 text-[10px]">{brand.product_count}+ items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Why V-Node Nutra ──────────────────────────────── */}
      <section className="bg-[#1a237e] py-10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black mb-2">Why Choose V-Node Nutra?</h2>
          <p className="text-blue-200 text-sm mb-8">India's most trusted multi-brand supplement superstore</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { stat: '5,000+', label: 'Products', sub: 'Across all categories' },
              { stat: '300+', label: 'Brands', sub: 'Authentic, lab-tested' },
              { stat: '2L+', label: 'Customers', sub: 'Across India' },
              { stat: '4.8★', label: 'Avg Rating', sub: 'Google & user reviews' },
            ].map(({ stat, label, sub }) => (
              <div key={label} className="bg-white/10 rounded-xl py-5 px-4 border border-white/10">
                <p className="text-3xl font-black text-white mb-0.5">{stat}</p>
                <p className="text-blue-200 font-bold text-sm">{label}</p>
                <p className="text-blue-300/60 text-xs mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-black text-[#1a237e] text-lg mb-1">V-Node<span className="text-[#ff6b35]">Nutra</span></p>
              <p className="text-gray-400 text-xs leading-relaxed">India's premium multi-brand supplement superstore. 5000+ products, 300+ brands, pan-India delivery.</p>
            </div>
            {[
              { title: 'Quick Links', links: ['All Products', 'Top Brands', 'Flash Deals', 'Track Order'] },
              { title: 'Categories', links: ['Protein', 'Pre-Workout', 'Creatine', 'Vitamins'] },
              { title: 'Help', links: ['FAQs', 'Returns', 'Contact Us', 'About Us'] },
            ].map(col => (
              <div key={col.title}>
                <p className="font-bold text-gray-800 text-sm mb-3">{col.title}</p>
                <ul className="space-y-1.5">
                  {col.links.map(link => (
                    <li key={link}>
                      <Link href="#" className="text-gray-500 text-xs hover:text-[#1a237e] transition-colors">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-400 text-xs">© 2026 V-Node Nutra. All rights reserved. FSSAI License: 10018022XXXXXXX</p>
            <div className="flex gap-3 text-xs text-gray-400">
              <Link href="#" className="hover:text-[#1a237e]">Privacy Policy</Link>
              <Link href="#" className="hover:text-[#1a237e]">Terms of Service</Link>
              <Link href="/track" className="hover:text-[#1a237e] font-semibold text-gray-600">Track Order</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
