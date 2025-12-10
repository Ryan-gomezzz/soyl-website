import { NextRequest, NextResponse } from 'next/server'
import { ApplicantStatus } from '@prisma/client'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const paramsSchema = z.object({
  id: z.string().uuid(),
})

const bodySchema = z
  .object({
    status: z.nativeEnum(ApplicantStatus).optional(),
    adminNotes: z.string().trim().max(2000).optional(),
    assignedTo: z.string().trim().max(120).optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field must be provided.',
  })

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    await requireAdminSession()

    const { id } = await params
    const parsedParams = paramsSchema.safeParse({ id })
    if (!parsedParams.success) {
      return NextResponse.json(
        { error: 'Invalid applicant ID.' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const parsedBody = bodySchema.safeParse(body)
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsedBody.error.flatten() },
        { status: 400 }
      )
    }

    const updated = await prisma.applicant.update({
      where: { id: parsedParams.data.id },
      data: parsedBody.data,
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Applicant not found' },
        { status: 404 }
      )
    }
    console.error('Failed to update applicant', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin session
    await requireAdminSession()

    const { id } = await params
    const parsedParams = paramsSchema.safeParse({ id })
    if (!parsedParams.success) {
      return NextResponse.json(
        { error: 'Invalid applicant ID.' },
        { status: 400 }
      )
    }

    await prisma.applicant.delete({ where: { id: parsedParams.data.id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Applicant not found' },
        { status: 404 }
      )
    }
    console.error('Failed to delete applicant', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}

