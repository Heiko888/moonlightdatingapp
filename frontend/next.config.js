
/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Environment-Variablen werden über .env-Dateien oder Docker gesetzt
  // KEINE hardcodierten Keys mehr hier!
  // NEXT_PUBLIC_* Variablen werden automatisch von Next.js geladen
  
  // Performance-Optimierungen
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image-Optimierung
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Experimental Features für Performance
  experimental: {
    optimizeCss: false, // Deaktiviert für Docker Build
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'framer-motion'],
  },
  
  // Docker-spezifische Konfiguration
  output: 'standalone',
  
  // Port-Konfiguration für standalone
  serverRuntimeConfig: {
    port: 3000,
    hostname: '0.0.0.0'
  },
  
  // Webpack-Optimierungen (vereinfacht für Docker)
  webpack: (config, { isServer, dev }) => {
    // Basis-Fallbacks
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      util: false,
      buffer: false,
    };
    
    // Docker-spezifische Fixes
    if (isServer) {
      // Server-side rendering fixes
      config.externals = config.externals || [];
      config.externals.push({
        'lightningcss': 'commonjs lightningcss',
      });
    }
    
    return config;
  },
  
  // Headers für Caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // TypeScript-Konfiguration (temporär deaktiviert für OOM-Fix)
  typescript: {
    ignoreBuildErrors: true,
  },
  // ESLint-Konfiguration (temporär deaktiviert für OOM-Fix)
  eslint: {
    ignoreDuringBuilds: true,
  }
}

module.exports = withBundleAnalyzer(nextConfig);
