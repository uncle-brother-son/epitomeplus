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
  },
  async redirects() {
    return [
      {
        source: '/info',
        destination: '/info/privacy-policy',
        permanent: true,
      },
      {
        source: '/projects',
        has: [
          {
            type: 'query',
            key: 'category',
            value: 'Motion',
          },
        ],
        destination: '/motion',
        permanent: true,
      },
      {
        source: '/projects',
        has: [
          {
            type: 'query',
            key: 'category',
            value: 'Stills',
          },
        ],
        destination: '/stills',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/info/privacy-policy',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
