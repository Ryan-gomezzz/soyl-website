import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check if the request is for the admin dashboard
    if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
        const authCookie = request.cookies.get('admin_auth')

        // If no auth cookie, redirect to login
        if (!authCookie || authCookie.value !== 'true') {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/admin/dashboard/:path*',
}
