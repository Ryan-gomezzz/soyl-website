import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getAudio } from '../audioCache'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build',
})

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const token = searchParams.get('token')
    const text = searchParams.get('text') // For on-demand generation

    // If we have a token, try to get from cache
    if (token) {
      const cachedAudio = getAudio(token)
      if (cachedAudio) {
        return new NextResponse(new Uint8Array(cachedAudio), {
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

        // Note: On-demand generation - audio is generated fresh, not cached here
        // Caching happens in the chat route when audio is first generated

        return new NextResponse(new Uint8Array(audioBuffer), {
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

