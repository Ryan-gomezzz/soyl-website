import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const dbHealth = await checkDatabaseHealth()

    return NextResponse.json(
      {
        status: 'ok',
        database: dbHealth.available ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
        ...(dbHealth.error && { error: dbHealth.error }),
      },
      { status: dbHealth.available ? 200 : 503 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

