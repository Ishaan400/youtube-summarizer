import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    strictNullChecks: true,
  },
  eslint: {
    dirs: ['src', 'app'],
  },
};

export default nextConfig;
