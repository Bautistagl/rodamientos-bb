/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ["firebasestorage.googleapis.com", "www.soy502.com"],
  },
};

module.exports = nextConfig;