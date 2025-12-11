import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { isAdminAuthenticatedFromCookies } from '@/lib/adminAuth'
import { createSignedDownloadUrl } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

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
      select: { resumeUrl: true },
    })

    if (!applicant) {
      return NextResponse.json({ error: 'Applicant not found' }, { status: 404 })
    }

    // Extract file path from Supabase URL format: supabase://bucket/path
    const resumeUrl = applicant.resumeUrl
    if (!resumeUrl.startsWith('supabase://')) {
      return NextResponse.json(
        { error: 'Invalid resume URL format' },
        { status: 400 }
      )
    }

    // Parse: supabase://bucket/path -> path
    const urlParts = resumeUrl.replace('supabase://', '').split('/')
    if (urlParts.length < 2) {
      return NextResponse.json(
        { error: 'Invalid resume URL format' },
        { status: 400 }
      )
    }

    const filePath = urlParts.slice(1).join('/') // Everything after bucket name

    // Generate signed download URL (valid for 1 hour)
    const downloadUrl = await createSignedDownloadUrl(filePath, 3600)

    return NextResponse.json({ downloadUrl })
  } catch (error) {
    console.error('[admin-resume-download]', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

