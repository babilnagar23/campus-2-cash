/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bullmq', 'ioredis', 'pdf-parse'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
