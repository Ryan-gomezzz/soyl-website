import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Force dynamic rendering since we use cookies()
export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin_session')

    if (!sessionToken || !sessionToken.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // In a production system, you would verify the token against a database
    // For now, we just check if the cookie exists
    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}

