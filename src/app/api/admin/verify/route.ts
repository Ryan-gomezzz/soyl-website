import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

// Force dynamic rendering since we use cookies()
export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest) {
  try {
    const session = await getAdminSession()

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}

