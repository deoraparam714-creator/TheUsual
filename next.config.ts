import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Self-contained server.js for the Docker image (see Dockerfile). Local `next start` stays unchanged.
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85, 90],
  },
  // The Find us page now lives as a section on the home page.
  async redirects() {
    return [{ source: '/find-us', destination: '/#find-us', permanent: true }];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
