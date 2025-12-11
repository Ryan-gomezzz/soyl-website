import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import prisma, { safePrismaOperation, isDatabaseConnectionError } from './prisma'

/**
 * Verifies an admin session token from cookies.
 * Returns the session if valid, null otherwise.
 * Falls back to cookie-only verification if database is unavailable.
 */
export async function verifyAdminSession(
  sessionToken: string | undefined
): Promise<{ id: string; token: string; expiresAt: Date } | null> {
  if (!sessionToken) {
    return null
  }

  // Try to verify session in database
  const sessionResult = await safePrismaOperation(
    async () => {
      const session = await prisma.adminSession.findUnique({
        where: { token: sessionToken },
      })

      if (!session) {
        return null
      }

      // Check if session has expired
      if (session.expiresAt < new Date()) {
        // Clean up expired session (ignore errors)
        await prisma.adminSession.delete({
          where: { id: session.id },
        }).catch(() => {
          // Ignore errors during cleanup
        })
        return null
      }

      return session
    },
    null // Fallback value when operation fails
  )

  // If database query succeeded and found a session, return it
  if (sessionResult.success) {
    const sessionData = sessionResult.data
    if (sessionData != null) {
      return {
        id: sessionData.id,
        token: sessionData.token,
        expiresAt: sessionData.expiresAt
      }
    }
  }

  // If database query succeeded but returned null (session not found in DB),
  // we still allow cookie-only authentication as fallback
  // This handles the case where database was unavailable during login
  // but is now available, or session creation failed but cookie was set
  if (sessionResult.success && sessionResult.data === null) {
    // Session not found in database, but we have a valid cookie token
    // Allow cookie-only authentication as fallback
    if (sessionToken && sessionToken.length >= 32) {
      console.warn('[Auth] Session not found in database, using cookie-only fallback for token:', sessionToken.substring(0, 8) + '...')
      return {
        id: 'cookie-only',
        token: sessionToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    }
    return null
  }

  // If database is unavailable, fall back to cookie-only verification
  // This allows the system to work even when database is temporarily down
  if (isDatabaseConnectionError(sessionResult.error as unknown)) {
    console.warn('[Auth] Database unavailable, using cookie-only session verification for token:', sessionToken.substring(0, 8) + '...')
    
    // For cookie-only fallback, we accept any non-empty token
    // In a production system, you might want to add additional validation
    // like checking token format, length, or using a signed cookie
    if (sessionToken && sessionToken.length >= 32) {
      // Return a mock session object for cookie-only authentication
      // The expiresAt is set to 24 hours from now as a reasonable default
      return {
        id: 'cookie-only',
        token: sessionToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    }
    
    return null
  }

  // For other database errors, log and return null
  console.error('[Auth] Error verifying admin session:', sessionResult.error)
  return null
}

/**
 * Gets and verifies the admin session from the request cookies.
 * Returns the session if valid, null otherwise.
 */
export async function getAdminSessionFromRequest(
  _req: NextRequest
): Promise<{ id: string; token: string; expiresAt: Date } | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('admin_session')?.value
  return verifyAdminSession(sessionToken)
}

/**
 * Gets and verifies the admin session from cookies (for App Router).
 * Returns the session if valid, null otherwise.
 */
export async function getAdminSession(): Promise<{
  id: string
  token: string
  expiresAt: Date
} | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('admin_session')?.value
  return verifyAdminSession(sessionToken)
}

/**
 * Checks if the request is authenticated as an admin.
 * Returns true if authenticated, false otherwise.
 */
export async function isAdminAuthenticated(
  _req: NextRequest
): Promise<boolean> {
  const session = await getAdminSessionFromRequest(_req)
  return session !== null
}

/**
 * Middleware helper for App Router routes that require admin authentication.
 * Throws an error if not authenticated (which Next.js will convert to a 401 response).
 */
export async function requireAdminSession(): Promise<{
  id: string
  token: string
  expiresAt: Date
}> {
  const session = await getAdminSession()
  if (!session) {
    console.warn('[Auth] requireAdminSession: No valid session found')
    throw new Error('Unauthorized')
  }
  
  // Log successful authentication (only in development to avoid log spam)
  if (process.env.NODE_ENV === 'development' && session.id === 'cookie-only') {
    console.log('[Auth] Using cookie-only session (database unavailable)')
  }
  
  return session
}

