import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { isAdminAuthenticatedFromCookies } from '@/lib/adminAuth'

export async function GET() {
  try {
    const authed = await isAdminAuthenticatedFromCookies()
    if (!authed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [pageVisits, pilotRequests, inquiries] = await Promise.all([
      prisma.pageVisit.count().catch(() => null),
      prisma.pilotRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }).catch(() => []),
      prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }).catch(() => []),
    ])

    return NextResponse.json({
      pageVisits,
      pilotRequests,
      inquiries,
    })
  } catch (error) {
    console.error('[admin-data]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

