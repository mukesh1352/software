import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com"
      },
    ],
  },
};

export default nextConfig;

module.exports = {
  images: {
    domains: ["source.unsplash.com"],
  },
};
