/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  output: 'standalone',
  // Ensure Prisma client is available during build
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Optimize for production
  swcMinify: true,
  // Handle environment variables gracefully
  env: {
    // Public env vars are automatically available
  },
}

module.exports = nextConfig

