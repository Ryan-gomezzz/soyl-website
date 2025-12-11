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

        // If no auth cookie or empty value, redirect to login
        if (!authCookie || !authCookie.value) {
            if (process.env.NODE_ENV === 'development') {
                console.log('[Middleware] No admin_session cookie found, redirecting to login')
            }
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
        
        if (process.env.NODE_ENV === 'development') {
            console.log('[Middleware] Admin session cookie found, allowing access')
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
