/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ik.imagekit.io'], // Add your ImageKit domain
    formats: ['image/png','image/jpg','image/jpeg','image/avif', 'image/webp'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
