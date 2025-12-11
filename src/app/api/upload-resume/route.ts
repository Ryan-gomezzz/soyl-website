import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/supabase'
import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = new Set(['application/pdf'])

const uploadSchema = z.object({
  filePath: z.string().min(1),
  fileName: z.string().min(1).max(180),
})

export async function POST(req: NextRequest) {
  try {
    // Check authentication header
    const apiSecret = req.headers.get('x-api-secret')
    if (apiSecret !== process.env.UPLOAD_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const filePath = formData.get('filePath') as string | null
    const fileName = formData.get('fileName') as string | null

    if (!file || !filePath || !fileName) {
      return NextResponse.json(
        { error: 'Missing required fields: file, filePath, fileName' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Only PDF resumes are supported.' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 5 MB limit.' }, { status: 400 })
    }

    // Validate filePath format
    const parseResult = uploadSchema.safeParse({ filePath, fileName })
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid file path or name', details: parseResult.error.flatten() },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const fileUrl = await uploadFile(filePath, fileBuffer, file.type)

    return NextResponse.json({ 
      success: true, 
      fileUrl,
      message: 'File uploaded successfully' 
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

