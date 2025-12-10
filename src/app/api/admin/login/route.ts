import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

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
      console.error('ADMIN_PASSWORD not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Verify credentials
    if (username !== adminUsername || password !== adminPassword) {
      recordFailedAttempt(ip)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate secure session token
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Set httpOnly cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    })

    // Clear failed attempts on success
    loginAttempts.delete(ip)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

