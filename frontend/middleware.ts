import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AdminService } from './lib/supabase/services'

// Subscription-based access control
const subscriptionAccess = {
  'free': ['/chart', '/chart-info', '/human-design-info', '/'],
  'basic': ['/chart', '/chart-info', '/human-design-info', '/', '/dashboard', '/profile', '/settings', '/mondkalender', '/community', '/reading'],
  'premium': ['/chart', '/chart-info', '/human-design-info', '/', '/dashboard', '/profile', '/settings', '/mondkalender', '/community', '/reading', '/bodygraph-advanced', '/chart-comparison', '/dating', '/analytics', '/api-access'],
  'vip': ['/chart', '/chart-info', '/human-design-info', '/', '/dashboard', '/profile', '/settings', '/mondkalender', '/community', '/reading', '/bodygraph-advanced', '/chart-comparison', '/dating', '/coaching', '/analytics', '/api-access', '/vip-community', '/personal-coach', '/dashboard-vip', '/admin']
}

// Helper function to get user subscription from localStorage (client-side)
function getUserSubscriptionFromRequest(request: NextRequest) {
  // Try to get from cookies first
  const cookieSubscription = request.cookies.get('user-subscription')?.value
  if (cookieSubscription) {
    try {
      const subscription = JSON.parse(cookieSubscription)
      console.log('Middleware: Found subscription in cookie:', subscription)
      return subscription
    } catch (e) {
      console.warn('Invalid subscription cookie:', e)
    }
  }
  
  // Fallback to default free plan
  console.log('Middleware: No subscription found, using free plan')
  return { packageId: 'free', plan: 'Free', status: 'active' }
}

// Security middleware for production
export async function middleware(request: NextRequest) {
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

  // Öffentliche App - nur VIP-Bereiche und Admin-Bereiche blockieren
  const vipRoutes = ['/vip-community', '/personal-coach', '/dashboard-vip']
  const adminRoutes = ['/admin']
  
  const isVipRoute = vipRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  const isAdminRoute = adminRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Nur VIP-Bereiche blockieren (mit Upgrade-Prompt)
  if (isVipRoute) {
    const subscription = getUserSubscriptionFromRequest(request)
    const userPlan = subscription?.packageId || 'free'
    
    if (userPlan !== 'vip' && userPlan !== 'admin') {
      // Redirect zu Upgrade-Seite statt Blockierung
      return NextResponse.redirect(new URL('/pricing?upgrade=vip', request.url))
    }
  }

  // Admin-Bereiche - Authentifizierung und Admin-Rolle erforderlich
  if (isAdminRoute) {
    const accessToken = request.cookies.get('access_token')?.value
    const userId = request.cookies.get('user_id')?.value
    
    if (!accessToken || !userId) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Admin-Rolle prüfen
    try {
      const isAdmin = await AdminService.isAdmin(userId)
      if (!isAdmin) {
        console.log(`Admin access denied for user ${userId}`)
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Sync subscription data to cookies for client-side access (für alle Routen)
  const subscription = getUserSubscriptionFromRequest(request)
  if (subscription && subscription.packageId !== 'free') {
    response.cookies.set('user-subscription', JSON.stringify(subscription), {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
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
