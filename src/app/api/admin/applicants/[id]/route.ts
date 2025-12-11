import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { isAdminAuthenticatedFromCookies } from '@/lib/adminAuth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const updateSchema = z.object({
  status: z.enum(['NEW', 'SCREENING', 'INTERVIEW', 'REJECTED', 'HIRED']).optional(),
  assignedTo: z.string().trim().max(200).optional(),
  adminNotes: z.string().trim().max(2000).optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await isAdminAuthenticatedFromCookies()
    if (!authed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const applicant = await prisma.applicant.findUnique({
      where: { id },
    })

    if (!applicant) {
      return NextResponse.json({ error: 'Applicant not found' }, { status: 404 })
    }

    return NextResponse.json(applicant)
  } catch (error) {
    console.error('[admin-applicants-get]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await isAdminAuthenticatedFromCookies()
    if (!authed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const parseResult = updateSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parseResult.error.flatten() },
        { status: 400 }
      )
    }

    const updateData = parseResult.data

    const applicant = await prisma.applicant.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(applicant)
  } catch (error) {
    console.error('[admin-applicants-update]', error)
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Applicant not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authed = await isAdminAuthenticatedFromCookies()
    if (!authed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.applicant.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin-applicants-delete]', error)
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({ error: 'Applicant not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

