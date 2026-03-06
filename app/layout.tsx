import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    default: 'V-Node Nutra — India\'s Sports Nutrition & Supplement Superstore',
    template: '%s | V-Node Nutra',
  },
  description: 'Shop 5000+ products from 300+ brands. FSSAI-certified, lab-tested whey protein, vitamins, creatine, pre-workout and more. Fast delivery across India.',
  keywords: ['supplements', 'whey protein', 'creatine', 'pre-workout', 'vitamins', 'MuscleBlaze', 'GNC', 'sports nutrition India'],
  authors: [{ name: 'V-Node Dynamics' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'V-Node Nutra',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#f5f5f5] text-gray-900 antialiased font-sans">
        {/*
          ConditionalLayout handles:
          - /admin/* routes → renders children directly (no customer nav)
          - All other routes → renders AnnouncementBar + Navbar + CartSlideout + pt-[140px] wrapper
        */}
        <ConditionalLayout>{children}</ConditionalLayout>
        <Analytics />
      </body>
    </html>
  );
}
