/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Change back from 'export'
  images: {
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