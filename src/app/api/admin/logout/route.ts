import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

// Force dynamic rendering since we use cookies()
export const dynamic = 'force-dynamic'

export async function POST(_req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')

    if (sessionToken?.value) {
      // Delete session from database
      try {
        await prisma.adminSession.deleteMany({
          where: { token: sessionToken.value },
        })
      } catch (error) {
        console.error('Failed to delete session from database:', error)
        // Continue with cookie deletion even if DB deletion fails
      }
    }

    // Clear the cookie
    cookieStore.delete('admin_session')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

