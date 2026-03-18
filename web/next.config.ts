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
        source: '/:path*',
        has: [{ type: 'host', value: 'www.epitomeplus.co.uk' }],
        destination: 'https://epitomeplus.co.uk/:path*',
        permanent: true,
      },
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
