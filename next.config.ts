import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.tvmaze.com",
      },
      {
        protocol: "https",
        hostname: "tvmaze.com", // на всякий случай
      },
    ],
  },
};

export default nextConfig;
