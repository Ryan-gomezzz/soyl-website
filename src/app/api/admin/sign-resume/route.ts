import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { z } from 'zod'
import { requireAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const bodySchema = z.object({
  s3Path: z.string().regex(/^s3:\/\//, 'Invalid S3 path'),
})

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_UPLOAD_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.S3_UPLOAD_SECRET_ACCESS_KEY ?? '',
  },
})

export async function POST(req: NextRequest) {
  try {
    // Verify admin session
    await requireAdminSession()

    const body = await req.json()
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const s3Path = parsed.data.s3Path
    if (!s3Path.startsWith(`s3://${process.env.RESUME_BUCKET}/`)) {
      return NextResponse.json(
        { error: 'Resume bucket mismatch.' },
        { status: 400 }
      )
    }

    const [, , ...keyParts] = s3Path.split('/')
    const key = keyParts.join('/')

    const command = new GetObjectCommand({
      Bucket: process.env.RESUME_BUCKET,
      Key: key,
      ResponseContentType: 'application/pdf',
    })

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 })

    return NextResponse.json({ signedUrl, expiresInSeconds: 60 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error signing resume URL:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

