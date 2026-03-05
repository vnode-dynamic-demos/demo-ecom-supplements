import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable the Next.js dev toolbar (the "N" badge) — it overlapped the admin sidebar
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Unsplash for demo/fallback images
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
