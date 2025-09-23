import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable all dev tools to prevent webpack errors
  experimental: {
    reactCompiler: false,
  },
  // Disable Next.js DevTools to prevent webpack errors
  devIndicators: false,
  // Disable dev overlay
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // API Routes benötigen Server-Side Rendering
  // output: 'export', // Entfernt für API-Routes
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;

