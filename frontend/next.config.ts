import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Temporarily disable dev tools to fix webpack issues
  experimental: {
    reactCompiler: false,
  },
  // Disable Next.js DevTools to prevent webpack errors
  devIndicators: false,
  // API Routes benötigen Server-Side Rendering
  // output: 'export', // Entfernt für API-Routes
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;

