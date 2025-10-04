/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: true },   // TS-Check nicht im Build
  eslint: { ignoreDuringBuilds: true },      // ESLint nicht im Build
  experimental: { optimizePackageImports: false }, // laut Log aktiv → aus!
  productionBrowserSourceMaps: false,        // keine Prod-Sourcemaps
};
export default nextConfig;
