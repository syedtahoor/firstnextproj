import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
    optimisticClientCache: true,
    cacheComponents: true,
    staleTimes: {
      dynamic: 600,
      static: 600,
    },
  },
};

export default nextConfig;