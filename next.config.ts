import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'upload-images.api.appwiseinnovations.com',
      },
      {
        protocol: 'https',
        hostname: 'appwiseinnovations.dev',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5MB',
    },
  },
};

export default nextConfig;
