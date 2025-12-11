import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client using service role key
// This client has admin privileges and bypasses RLS
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn(
    'Supabase credentials not configured. Storage operations will fail. ' +
    'Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
  )
}

export const supabase = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

// Storage bucket name for resumes
export const RESUME_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'resumes'

/**
 * Generate file path and return it for server-side upload
 * Since Supabase Storage doesn't support presigned upload URLs like S3,
 * we'll use server-side uploads through our API endpoint.
 * @param fileName - The name of the file to upload
 * @returns Object with filePath (the client will POST to /api/upload-resume with this path)
 */
export function generateFilePath(fileName: string): { filePath: string } {
  // Generate unique file path
  const timestamp = Date.now()
  const sanitizedFileName = fileName.replace(/[^\w.-]/g, '-').toLowerCase()
  const filePath = `resumes/${timestamp}-${sanitizedFileName}`

  return { filePath }
}

/**
 * Upload a file to Supabase Storage (server-side)
 * @param filePath - The path where the file should be stored
 * @param fileBuffer - The file data as a Buffer
 * @param contentType - The MIME type of the file
 * @returns The file URL in supabase://bucket/path format
 */
export async function uploadFile(
  filePath: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check environment variables.')
  }

  const { data, error } = await supabase.storage
    .from(RESUME_BUCKET)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: false, // Don't overwrite existing files
    })

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`)
  }

  if (!data || !data.path) {
    throw new Error('No file path returned from Supabase upload')
  }

  // Return the file path (stored in database as supabase://bucket/path format)
  return `supabase://${RESUME_BUCKET}/${data.path}`
}

/**
 * Generate a signed download URL for resume downloads
 * @param filePath - The path to the file in storage
 * @param expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
 * @returns Signed download URL
 */
export async function createSignedDownloadUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check environment variables.')
  }

  const { data, error } = await supabase.storage
    .from(RESUME_BUCKET)
    .createSignedUrl(filePath, expiresIn)

  if (error) {
    throw new Error(`Failed to create signed download URL: ${error.message}`)
  }

  if (!data?.signedUrl) {
    throw new Error('No signed URL returned from Supabase')
  }

  return data.signedUrl
}

/**
 * Delete a file from storage
 * @param filePath - The path to the file in storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check environment variables.')
  }

  const { error } = await supabase.storage.from(RESUME_BUCKET).remove([filePath])

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}

/**
 * Check if a file exists in storage
 * @param filePath - The path to the file in storage
 * @returns True if file exists, false otherwise
 */
export async function fileExists(filePath: string): Promise<boolean> {
  if (!supabase) {
    return false
  }

  const { data, error } = await supabase.storage
    .from(RESUME_BUCKET)
    .list(filePath.split('/').slice(0, -1).join('/') || '', {
      search: filePath.split('/').pop() || '',
    })

  if (error) {
    return false
  }

  return Array.isArray(data) && data.length > 0
}
