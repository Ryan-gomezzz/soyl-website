import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { isDatabaseConnectionError } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const pilotRequestSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Valid email is required'),
  company: z.string().trim().min(1, 'Company is required'),
  phone: z.string().trim().max(80).optional(),
  needs: z.string().trim().max(1000).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate request body
    const parseResult = pilotRequestSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parseResult.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, company, phone, needs } = parseResult.data

    // Create pilot request
    const newRequest = await prisma.pilotRequest.create({
      data: {
        name,
        email,
        company,
        phone: phone || null,
        needs: needs || null,
      },
    })

    return NextResponse.json({ success: true, data: newRequest }, { status: 201 })
  } catch (error) {
    console.error('Error creating pilot request:', error)
    
    // Handle database connection errors
    if (isDatabaseConnectionError(error)) {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      )
    }

    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      // Unique constraint violation
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A pilot request with this email already exists.' },
          { status: 409 }
        )
      }
    }

    // Generic error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to create pilot request. Please try again.' },
      { status: 500 }
    )
  }
}
