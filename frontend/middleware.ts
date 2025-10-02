import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Subscription-based access control
const subscriptionAccess = {
  'free': ['/chart', '/chart-info', '/human-design-info', '/'],
  'basic': ['/chart', '/chart-info', '/human-design-info', '/', '/dashboard', '/profile', '/settings', '/mondkalender', '/community', '/reading'],
  'premium': ['/chart', '/chart-info', '/human-design-info', '/', '/dashboard', '/profile', '/settings', '/mondkalender', '/community', '/reading', '/bodygraph-advanced', '/chart-comparison', '/dating', '/coaching', '/analytics', '/api-access', '/vip-community', '/personal-coach', '/dashboard-vip'],
  'vip': ['/chart', '/chart-info', '/human-design-info', '/', '/dashboard', '/profile', '/settings', '/mondkalender', '/community', '/reading', '/bodygraph-advanced', '/chart-comparison', '/dating', '/coaching', '/analytics', '/api-access', '/vip-community', '/personal-coach', '/dashboard-vip', '/admin']
}

// Helper function to get user subscription from localStorage (client-side)
function getUserSubscriptionFromRequest(request: NextRequest) {
  // Try to get from cookies first
  const cookieSubscription = request.cookies.get('user-subscription')?.value
  if (cookieSubscription) {
    try {
      return JSON.parse(cookieSubscription)
    } catch (e) {
      console.warn('Invalid subscription cookie:', e)
    }
  }
  
  // Fallback to default free plan
  return { packageId: 'free', plan: 'Free', status: 'active' }
}

// Security middleware for production
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  }

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://api.stripe.com wss://*.supabase.co",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  // Rate limiting (basic implementation)
  // This is a basic implementation - in production, use Redis or similar
  const rateLimit = request.headers.get('x-rate-limit')
  if (rateLimit && parseInt(rateLimit) > 100) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  // API route protection
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Add API-specific security measures
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    
    // CORS for API routes
    const origin = request.headers.get('origin')
    const allowedOrigins = [
      'https://your-domain.com',
      'https://www.your-domain.com',
      'http://localhost:3000', // Development only
    ]
    
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
  }

  // Authentication check for protected routes (temporarily disabled for dashboard)
  const protectedRoutes = ['/profile', '/settings', '/subscription', '/chart', '/chart-info', '/human-design-info', '/mondkalender', '/community', '/reading', '/bodygraph-advanced', '/chart-comparison', '/dating', '/coaching', '/analytics', '/api-access', '/vip-community', '/personal-coach', '/dashboard-vip']
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Temporarily allow dashboard without authentication
  if (isProtectedRoute) {
    // Prüfe HttpOnly Cookies für Authentifizierung
    const accessToken = request.cookies.get('access_token')?.value
    const userId = request.cookies.get('user_id')?.value
    
    console.log('Middleware Debug:', {
      pathname: request.nextUrl.pathname,
      accessToken: accessToken ? 'present' : 'missing',
      userId: userId ? 'present' : 'missing',
      allCookies: request.cookies.getAll().map(c => c.name)
    })
    
    if (!accessToken || !userId) {
      console.log('No auth cookies found, redirecting to login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Subscription-based access control
    const subscription = getUserSubscriptionFromRequest(request)
    
    // Check if user has access to the requested route
    const userPlan = subscription.packageId || 'free'
    const allowedRoutes = subscriptionAccess[userPlan as keyof typeof subscriptionAccess] || subscriptionAccess.free
    
    const currentPath = request.nextUrl.pathname
    const hasAccess = allowedRoutes.some(route => currentPath.startsWith(route))
    
    if (!hasAccess) {
      // Redirect to upgrade page for premium features
      if (currentPath.startsWith('/bodygraph-advanced') || 
          currentPath.startsWith('/chart-comparison') || 
          currentPath.startsWith('/dating') || 
          currentPath.startsWith('/coaching') ||
          currentPath.startsWith('/analytics') ||
          currentPath.startsWith('/api-access') ||
          currentPath.startsWith('/vip-community') ||
          currentPath.startsWith('/personal-coach') ||
          currentPath.startsWith('/dashboard-vip')) {
        return NextResponse.redirect(new URL('/pricing', request.url))
      }
      
      // Redirect to basic upgrade for basic features
      if (currentPath.startsWith('/dashboard') || 
          currentPath.startsWith('/profile') || 
          currentPath.startsWith('/settings') ||
          currentPath.startsWith('/mondkalender') ||
          currentPath.startsWith('/community') ||
          currentPath.startsWith('/reading')) {
        return NextResponse.redirect(new URL('/pricing', request.url))
      }
    }
  }

  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value
    const userRole = request.cookies.get('user-role')?.value
    
    if (!token || userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  // Sync subscription data to cookies for client-side access
  if (isProtectedRoute) {
    const subscription = getUserSubscriptionFromRequest(request)
    if (subscription && subscription.packageId !== 'free') {
      response.cookies.set('user-subscription', JSON.stringify(subscription), {
        httpOnly: false, // Allow client-side access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
