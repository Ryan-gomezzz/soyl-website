import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, COOKIE_NAME } from './lib/adminAuth'

const ADMIN_PATHS = ['/admin', '/api/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminPath = ADMIN_PATHS.some((path) => pathname.startsWith(path))
  const isAuthRoute = pathname.startsWith('/api/admin/auth') || pathname.startsWith('/admin/login')

  if (!isAdminPath) {
    return NextResponse.next()
  }

  // Allow auth routes without session
  if (isAuthRoute) {
    return NextResponse.next()
  }

  const cookie = request.cookies.get(COOKIE_NAME)?.value
  const authorized = verifyToken(cookie)

  if (!authorized) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

