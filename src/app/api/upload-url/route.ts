import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generateFilePath } from '@/lib/supabase'

const payloadSchema = z.object({
  fileName: z.string().min(1).max(180),
  fileType: z.string().min(1),
  fileSize: z.number().positive(),
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

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Supabase not configured.' }, { status: 500 })
    }

    if (!ALLOWED_TYPES.has(fileType)) {
      return NextResponse.json({ error: 'Only PDF resumes are supported.' }, { status: 400 })
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 5 MB limit.' }, { status: 400 })
    }

    // Generate file path for Supabase Storage
    const { filePath } = generateFilePath(fileName)
    
    // For Supabase, we'll use server-side uploads
    // Return the file path and upload endpoint URL
    // The client will POST the file to /api/upload-resume with this path
    const uploadUrl = `/api/upload-resume`
    const fileUrl = `supabase://${process.env.SUPABASE_STORAGE_BUCKET || 'resumes'}/${filePath}`

    return NextResponse.json({ 
      uploadUrl, 
      fileUrl, 
      filePath,
      expiresInSeconds: 60 * 5 // 5 minutes to complete upload
    })
  } catch (error) {
    console.error('Error generating upload URL:', error)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

