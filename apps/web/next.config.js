/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  transpilePackages: ['@sportsprognose/core'],
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@sportsprognose/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
    };
    return config;
  },
  // Proxy /api to backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3002/api/:path*',
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
  },
};

module.exports = nextConfig;