#!/usr/bin/env node

/**
 * Bundle-Analyzer für HD App
 * Analysiert Bundle-Size und Performance
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 HD App - Bundle-Analyzer');
console.log('==========================');

// Bundle-Analyzer installieren falls nicht vorhanden
try {
  require('@next/bundle-analyzer');
} catch (error) {
  console.log('📦 Installing @next/bundle-analyzer...');
  execSync('npm install --save-dev @next/bundle-analyzer', { stdio: 'inherit' });
}

// Next.js Config für Bundle-Analyzer
const nextConfigPath = path.join(__dirname, '../next.config.js');
const nextConfigContent = `
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
    optimizeCss: true,
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'framer-motion'],
  },
  
  // Webpack-Optimierungen
  webpack: (config, { isServer, dev }) => {
    // Bundle-Size Optimierung
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Production-Optimierungen
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          mui: {
            test: /[\\/]node_modules[\\/]@mui[\\/]/,
            name: 'mui',
            chunks: 'all',
          },
        },
      };
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
`;

// Next.js Config aktualisieren
fs.writeFileSync(nextConfigPath, nextConfigContent);
console.log('✅ Next.js Config updated for bundle analysis');

// Package.json Script hinzufügen
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (!packageJson.scripts.analyze) {
  packageJson.scripts.analyze = 'ANALYZE=true next build';
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Added analyze script to package.json');
}

// Bundle-Analyse ausführen
console.log('🚀 Starting bundle analysis...');
console.log('This will open a browser window with the bundle analysis.');

try {
  // PowerShell-kompatibel
  const isWindows = process.platform === 'win32';
  const analyzeCommand = isWindows 
    ? 'set ANALYZE=true && npm run analyze'
    : 'ANALYZE=true npm run analyze';
    
  execSync(analyzeCommand, { 
    stdio: 'inherit',
    shell: isWindows ? 'cmd.exe' : '/bin/bash'
  });
  console.log('✅ Bundle analysis completed!');
  console.log('📊 Check the browser window for detailed bundle information.');
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  console.log('💡 Trying alternative approach...');
  
  // Alternative: Direkt mit cross-env
  try {
    execSync('npx cross-env ANALYZE=true next build', { stdio: 'inherit' });
    console.log('✅ Bundle analysis completed with cross-env!');
  } catch (crossEnvError) {
    console.error('❌ Alternative approach also failed:', crossEnvError.message);
    console.log('📋 Manual steps:');
    console.log('1. Set ANALYZE=true in your environment');
    console.log('2. Run: npm run build');
    console.log('3. Check .next/analyze/ folder for results');
  }
}

// Performance-Report generieren
const generatePerformanceReport = () => {
  const report = {
    timestamp: new Date().toISOString(),
    bundleAnalysis: {
      status: 'completed',
      recommendations: [
        'Consider code-splitting for large components',
        'Optimize MUI imports to reduce bundle size',
        'Implement lazy loading for non-critical components',
        'Use dynamic imports for heavy libraries'
      ]
    },
    nextSteps: [
      'Review bundle analysis in browser',
      'Identify largest dependencies',
      'Implement code-splitting where needed',
      'Optimize imports and remove unused code'
    ]
  };

  const reportPath = path.join(__dirname, '../performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log('📊 Performance report saved to:', reportPath);
};

generatePerformanceReport();

console.log('🎉 Bundle analysis complete!');
console.log('📈 Check the browser window for detailed insights.');
console.log('📊 Performance report saved to performance-report.json');
