import crypto from 'crypto'

// In-memory cache for audio buffers
// Key: token, Value: { buffer: Buffer, expiresAt: number }
const audioCache = new Map<string, { buffer: Buffer; expiresAt: number }>()

// Clean up expired cache entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [token, entry] of audioCache.entries()) {
    if (entry.expiresAt < now) {
      audioCache.delete(token)
    }
  }
}, 5 * 60 * 1000)

// Generate a secure token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Store audio in cache
export function storeAudio(buffer: Buffer, ttlMinutes: number = 5): string {
  const token = generateToken()
  const expiresAt = Date.now() + ttlMinutes * 60 * 1000
  audioCache.set(token, { buffer, expiresAt })
  return token
}

// Get audio from cache
export function getAudio(token: string): Buffer | null {
  const entry = audioCache.get(token)
  if (!entry) {
    return null
  }
  if (entry.expiresAt < Date.now()) {
    audioCache.delete(token)
    return null
  }
  return entry.buffer
}

