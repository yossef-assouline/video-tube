/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Changed from 'standalone' to 'export'
  images: {
    unoptimized: true,  // Add this for static export
    domains: [
      'localhost',
      'video-tube-d2lw.onrender.com',
      'res.cloudinary.com'
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  }
}

module.exports = nextConfig 