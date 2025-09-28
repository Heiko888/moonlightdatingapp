import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Einfache Konfiguration für Development
  experimental: {
    reactCompiler: false,
  },
  devIndicators: false,
  trailingSlash: false,
  images: {
    unoptimized: true
  },
};

export default nextConfig;

