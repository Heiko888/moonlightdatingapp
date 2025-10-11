
/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://njjcywgskzepikyzhihy.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamN5d2dza3plcGlreXpoaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjYxNTYsImV4cCI6MjA3MTkwMjE1Nn0.5eyIEMHJr10PjNbNyDokqqcvycgEUIgyHkjB5puQOFs'
  },
  
  // Performance-Optimierungen
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image-Optimierung
  images: {
    domains: ['localhost'],
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
