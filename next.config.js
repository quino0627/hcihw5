/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.midjourney.com"],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
