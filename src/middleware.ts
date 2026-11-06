import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = [
  '/',
  '/signin',
  '/signup',
  '/error',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/auth/verify-request',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth',
  '/api/analytics/view',
  '/templates',
  '/pricing',
  '/features',
  '/integrations',
]

const apiPublicRoutes = [
  '/api/auth',
  '/api/analytics/view',
]

export function middleware(request: NextRequest) {
  const { nextUrl } = request

  // Check for NextAuth / Auth.js session cookies
  const sessionToken =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value

  const isLoggedIn = !!sessionToken

  const isPublicRoute = publicRoutes.some(route => nextUrl.pathname === route || nextUrl.pathname.startsWith(route + '/'))
  const isApiRoute = nextUrl.pathname.startsWith('/api/')
  const isApiPublicRoute = apiPublicRoutes.some(route => nextUrl.pathname.startsWith(route))
  const isProfileRoute = /^\/[a-zA-Z0-9_-]{3,30}$/.test(nextUrl.pathname)
  const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard')
  const isAdminRoute = nextUrl.pathname.startsWith('/admin')

  // Public profiles can always be viewed
  if (isProfileRoute && !isDashboardRoute && !isAdminRoute) {
    return NextResponse.next()
  }

  // API unauthorized check
  if (isApiRoute && !isApiPublicRoute && !isLoggedIn && !nextUrl.pathname.startsWith('/api/bot')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Dashboard route check
  if (isDashboardRoute && !isLoggedIn) {
    const signInUrl = new URL('/signin', nextUrl)
    signInUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|badges|uploads|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|mp3|mp4|webm|woff2?|ttf|otf)$).*)',
  ],
}
