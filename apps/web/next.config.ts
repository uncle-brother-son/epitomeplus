import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
    minimumCacheTTL: 7776000, // 90 days - reduces bandwidth by caching optimized images
  },
};

export default nextConfig;
