import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'node:crypto'
import { z } from 'zod'

const payloadSchema = z.object({
  fileName: z.string().min(1).max(180),
  fileType: z.string().min(1),
  fileSize: z.number().positive(),
})

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_UPLOAD_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.S3_UPLOAD_SECRET_ACCESS_KEY ?? '',
  },
})

const ALLOWED_TYPES = new Set(['application/pdf'])
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export async function POST(req: NextRequest) {
  try {
    // Check authentication header
    const apiSecret = req.headers.get('x-api-secret')
    if (apiSecret !== process.env.UPLOAD_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parseResult = payloadSchema.safeParse(body)

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parseResult.error.flatten() },
        { status: 400 }
      )
    }

    const { fileName, fileType, fileSize } = parseResult.data

    if (!process.env.RESUME_BUCKET) {
      return NextResponse.json({ error: 'Resume bucket not configured.' }, { status: 500 })
    }

    if (!process.env.S3_UPLOAD_ACCESS_KEY_ID || !process.env.S3_UPLOAD_SECRET_ACCESS_KEY) {
      return NextResponse.json({ error: 'S3 upload credentials missing.' }, { status: 500 })
    }

    if (!ALLOWED_TYPES.has(fileType)) {
      return NextResponse.json({ error: 'Only PDF resumes are supported.' }, { status: 400 })
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 5 MB limit.' }, { status: 400 })
    }

    const sanitizedFileName = fileName.replace(/[^\w.-]/g, '-').toLowerCase()
    const key = `resumes/${crypto.randomUUID()}-${sanitizedFileName}`

    const command = new PutObjectCommand({
      Bucket: process.env.RESUME_BUCKET,
      Key: key,
      ContentType: fileType,
      Metadata: {
        uploadedAt: new Date().toISOString(),
      },
    })

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 })
    const fileUrl = `s3://${process.env.RESUME_BUCKET}/${key}`

    return NextResponse.json({ uploadUrl, fileUrl, expiresInSeconds: 60 * 5 })
  } catch (error) {
    console.error('Error generating upload URL:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

