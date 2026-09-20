import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'bzppuunjiqiggbuldjts.supabase.co', // 🔴 آدرس Supabase شما اضافه شد
      },
    ],
  },
};

export default nextConfig;