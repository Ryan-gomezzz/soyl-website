import { NextRequest, NextResponse } from 'next/server'
import { ApplicantStatus } from '@prisma/client'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const querySchema = z.object({
  role: z.string().trim().optional(),
  status: z.nativeEnum(ApplicantStatus).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
})

export async function GET(req: NextRequest) {
  try {
    // Verify admin session
    await requireAdminSession()

    const { searchParams } = new URL(req.url)
    const query = {
      role: searchParams.get('role') || undefined,
      status: searchParams.get('status') as ApplicantStatus | null || undefined,
      page: searchParams.get('page') || undefined,
      pageSize: searchParams.get('pageSize') || undefined,
    }

    const parseResult = querySchema.safeParse(query)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: parseResult.error.flatten() },
        { status: 400 }
      )
    }

    const { role, status, page = 1, pageSize = 20 } = parseResult.data
    const skip = (page - 1) * pageSize

    const where = {
      ...(role ? { roleApplied: role } : {}),
      ...(status ? { status } : {}),
    }

    const [items, total] = await Promise.all([
      prisma.applicant.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.applicant.count({ where }),
    ])

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error fetching applicants:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

