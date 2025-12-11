import { NextResponse } from 'next/server'
import { isAdminAuthenticatedFromCookies } from '@/lib/adminAuth'

export async function GET() {
  try {
    const authed = await isAdminAuthenticatedFromCookies()
    if (!authed) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error('[admin-verify]', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}

