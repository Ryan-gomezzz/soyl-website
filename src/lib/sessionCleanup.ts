import prisma from './prisma'

/**
 * Cleans up expired admin sessions from the database.
 * This should be called periodically (e.g., via a cron job or scheduled task).
 */
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const result = await prisma.adminSession.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    })

    return result.count
  } catch (error) {
    console.error('Failed to cleanup expired sessions:', error)
    return 0
  }
}

/**
 * Cleans up expired sessions and logs the result.
 * Useful for scheduled tasks or manual cleanup.
 */
export async function runSessionCleanup(): Promise<void> {
  const deletedCount = await cleanupExpiredSessions()
  if (deletedCount > 0) {
    console.log(`Cleaned up ${deletedCount} expired admin session(s)`)
  }
}

