/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the output: 'export' line
  images: {
    domains: [
      'video-tube-d2lw.onrender.com',
      'res.cloudinary.com'
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  }
}

module.exports = nextConfig