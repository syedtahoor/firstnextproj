import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
    optimisticClientCache: true,
    cacheComponents: true,
    staleTimes: {
      dynamic: 300,
      static: 300,
    },
  },
};

export default nextConfig;