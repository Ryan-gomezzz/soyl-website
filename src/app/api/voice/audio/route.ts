import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import crypto from 'crypto'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build',
})

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
function getAudio(token: string): Buffer | null {
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

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const token = searchParams.get('token')
    const text = searchParams.get('text') // For on-demand generation

    // If we have a token, try to get from cache
    if (token) {
      const cachedAudio = getAudio(token)
      if (cachedAudio) {
        return new NextResponse(cachedAudio, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': String(cachedAudio.length),
            'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
          },
        })
      }
    }

    // If we have text but no cached audio, generate on-demand
    if (text && process.env.OPENAI_API_KEY) {
      try {
        const ttsResponse = await openai.audio.speech.create({
          model: 'tts-1',
          voice: 'nova',
          input: text,
        })

        const arrayBuffer = await ttsResponse.arrayBuffer()
        const audioBuffer = Buffer.from(arrayBuffer)

        if (audioBuffer.length === 0) {
          return NextResponse.json(
            { error: 'Generated audio is empty' },
            { status: 500 }
          )
        }

        // Cache it if we have a token, otherwise just return it
        if (token) {
          const expiresAt = Date.now() + 5 * 60 * 1000
          audioCache.set(token, { buffer: audioBuffer, expiresAt })
        }

        return new NextResponse(audioBuffer, {
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Length': String(audioBuffer.length),
            'Cache-Control': 'public, max-age=300',
          },
        })
      } catch (error) {
        console.error('TTS generation error in audio endpoint:', error)
        return NextResponse.json(
          { error: 'Failed to generate audio' },
          { status: 500 }
        )
      }
    }

    // No token and no text - invalid request
    return NextResponse.json(
      { error: 'Missing token or text parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Audio endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

