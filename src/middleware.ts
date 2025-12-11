import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Don't interfere with login API or login page
    if (request.nextUrl.pathname.startsWith('/api/admin/login') ||
        request.nextUrl.pathname === '/admin/login') {
        return NextResponse.next()
    }

    // Check if the request is for the admin dashboard
    if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
        const authCookie = request.cookies.get('admin_session')

        // Debug logging for development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Middleware] Checking access for: ${request.nextUrl.pathname}`)
            console.log(`[Middleware] Auth cookie present: ${!!authCookie}`)
            if (authCookie) {
                console.log(`[Middleware] Auth cookie value length: ${authCookie.value.length}`)
            }
        }

        // If no auth cookie or empty value, redirect to login
        if (!authCookie || !authCookie.value) {
            console.warn('[Middleware] No admin_session cookie found, redirecting to login')
            const loginUrl = new URL('/admin/login', request.url)
            // Add callback URL to redirect back after login
            loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/dashboard/:path*',
        '/api/admin/login',
        '/admin/login',
    ],
}
