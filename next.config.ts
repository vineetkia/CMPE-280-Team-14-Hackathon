import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  // Turbopack config (Next.js 16+ uses Turbopack by default)
  turbopack: {},
  // Webpack fallback for older builds or --webpack flag
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Azure Speech SDK uses Node.js modules — tell webpack to skip them in browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
