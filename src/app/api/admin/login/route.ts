import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma, { safePrismaOperation } from '@/lib/prisma'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const attempt = loginAttempts.get(ip)

  if (attempt) {
    if (now < attempt.resetAt) {
      if (attempt.count >= MAX_ATTEMPTS) {
        return false // Rate limited
      }
    } else {
      // Reset expired lockout
      loginAttempts.delete(ip)
    }
  }

  return true
}

function recordFailedAttempt(ip: string) {
  const now = Date.now()
  const attempt = loginAttempts.get(ip)

  if (attempt && now < attempt.resetAt) {
    attempt.count += 1
  } else {
    loginAttempts.set(ip, {
      count: 1,
      resetAt: now + LOCKOUT_DURATION,
    })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get client IP
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { username, password } = body

    // Validate input
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      recordFailedAttempt(ip)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Get credentials from environment
    const adminUsername = process.env.ADMIN_USERNAME || 'admin'
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      console.error('[Admin Login] ADMIN_PASSWORD not configured. Please set ADMIN_PASSWORD environment variable.')
      const errorMessage = process.env.NODE_ENV === 'development'
        ? 'Server configuration error: ADMIN_PASSWORD environment variable is not set. Please configure it in your .env.local file.'
        : 'Server configuration error: Admin authentication is not properly configured.'
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }

    // Verify credentials
    if (username !== adminUsername || password !== adminPassword) {
      recordFailedAttempt(ip)
      console.warn(`[Admin Login] Failed login attempt from IP: ${ip}`)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate secure session token
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store session in database (with graceful fallback)
    const sessionResult = await safePrismaOperation(
      async () => {
        return await prisma.adminSession.create({
          data: {
            token: sessionToken,
            expiresAt,
          },
        })
      }
    )

    if (!sessionResult.success) {
      const isConnectionError = sessionResult.error?.includes('connection') || 
                                sessionResult.error?.includes('Database')
      
      if (isConnectionError) {
        console.warn('[Admin Login] Database unavailable, using cookie-only session. Error:', sessionResult.error)
        // Continue with cookie-only authentication as fallback
        // This allows login to work even if database is temporarily unavailable
      } else {
        console.error('[Admin Login] Failed to create session in database:', sessionResult.error)
        // For non-connection errors, we might want to be more strict
        // But for now, we'll allow cookie-only fallback for all database errors
      }
    } else {
      console.log('[Admin Login] Session created successfully in database')
    }

    // Note: Cookie will be set on the redirect response below
    // This ensures the cookie is available when the redirect happens

    // Clear failed attempts on success
    loginAttempts.delete(ip)

    console.log(`[Admin Login] Successful login for user: ${username} from IP: ${ip}`)
    
    // Create response with JSON body and set cookie
    const response = NextResponse.json({ 
      success: true,
      redirect: '/admin/dashboard',
      // Include warning if database session wasn't created
      warning: !sessionResult.success ? 'Session stored in cookie only (database unavailable)' : undefined
    })
    
    // Set cookie on the response
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })
    
    return response
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Admin Login] Unexpected error:', errorMessage, error)
    
    // Provide more specific error messages
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: process.env.NODE_ENV === 'development' 
          ? `Internal server error: ${errorMessage}` 
          : 'Internal server error. Please try again later.'
      },
      { status: 500 }
    )
  }
}

