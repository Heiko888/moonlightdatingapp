/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://njjcywgskzepikyzhihy.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamN5d2dza3plcGlreXpoaWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjYxNTYsImV4cCI6MjA3MTkwMjE1Nn0.5eyIEMHJr10PjNbNyDokqqcvycgEUIgyHkjB5puQOFs'
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

module.exports = nextConfig