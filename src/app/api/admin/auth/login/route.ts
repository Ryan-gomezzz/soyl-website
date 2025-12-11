import { NextRequest, NextResponse } from 'next/server'
import { setAdminSessionCookie } from '@/lib/adminAuth'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    const configuredUser = process.env.ADMIN_USERNAME || 'admin'
    const configuredPass = process.env.ADMIN_PASSWORD

    if (!configuredPass) {
      return NextResponse.json(
        { error: 'Admin password is not configured on the server.' },
        { status: 500 }
      )
    }

    if (username !== configuredUser || password !== configuredPass) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    await setAdminSessionCookie()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin-login]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

