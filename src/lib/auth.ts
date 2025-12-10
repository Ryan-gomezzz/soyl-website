import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import prisma from './prisma'

/**
 * Verifies an admin session token from cookies.
 * Returns the session if valid, null otherwise.
 */
export async function verifyAdminSession(
  sessionToken: string | undefined
): Promise<{ id: string; token: string; expiresAt: Date } | null> {
  if (!sessionToken) {
    return null
  }

  try {
    const session = await prisma.adminSession.findUnique({
      where: { token: sessionToken },
    })

    if (!session) {
      return null
    }

    // Check if session has expired
    if (session.expiresAt < new Date()) {
      // Clean up expired session
      await prisma.adminSession.delete({
        where: { id: session.id },
      }).catch(() => {
        // Ignore errors during cleanup
      })
      return null
    }

    return session
  } catch (error) {
    console.error('Error verifying admin session:', error)
    return null
  }
}

/**
 * Gets and verifies the admin session from the request cookies.
 * Returns the session if valid, null otherwise.
 */
export async function getAdminSessionFromRequest(
  req: NextRequest
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
  req: NextRequest
): Promise<boolean> {
  const session = await getAdminSessionFromRequest(req)
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
    throw new Error('Unauthorized')
  }
  return session
}

