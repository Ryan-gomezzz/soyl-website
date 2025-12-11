import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { PRODUCT_KNOWLEDGE_SYSTEM_PROMPT } from '@/lib/prompts/productKnowledge'
import { rateLimitAppRouter } from '@/utils/rateLimitAppRouter'
import { storeAudio } from '../audio/route'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build',
})

// Constants
const MAX_AUDIO_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_CONVERSATION_HISTORY = 10 // Last 10 messages
const MAX_MESSAGE_LENGTH = 5000 // Max characters per message
const AUDIO_MIME_TYPE = 'audio/mpeg'

export interface VoiceChatRequest {
  audio?: string // Base64 encoded audio (optional if text is provided)
  text?: string // Direct text input (optional if audio is provided)
  conversationHistory: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

export interface VoiceChatResponse {
  text: string
  audioUrl?: string // URL to binary audio endpoint
  audio?: string // Deprecated: base64 encoded audio (for backward compatibility)
  transcription: string
}

// Validate base64 string
function isValidBase64(str: string): boolean {
  try {
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
    if (!base64Regex.test(str)) {
      return false
    }
    // Try to decode
    Buffer.from(str, 'base64')
    return true
  } catch {
    return false
  }
}

// Sanitize text input
function sanitizeText(text: string): string {
  // Remove null bytes and control characters
  return text.replace(/[\x00-\x1F\x7F]/g, '').trim()
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: 10 requests per minute per IP
    const rateLimit = rateLimitAppRouter(req, {
      intervalMs: 60 * 1000, // 1 minute
      uniqueTokenPerInterval: 10,
    })

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetAt),
          },
        }
      )
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured')
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    const body: VoiceChatRequest = await req.json()

    // Validate request body - require either audio or text
    if ((!body.audio || typeof body.audio !== 'string') && (!body.text || typeof body.text !== 'string')) {
      return NextResponse.json(
        { error: 'Invalid request: audio data or text input is required' },
        { status: 400 }
      )
    }

    // Validate and limit conversation history
    let conversationHistory = body.conversationHistory || []
    if (!Array.isArray(conversationHistory)) {
      conversationHistory = []
    }

    // Limit to last N messages and validate each message
    conversationHistory = conversationHistory
      .slice(-MAX_CONVERSATION_HISTORY)
      .filter((msg) => {
        return (
          msg &&
          typeof msg === 'object' &&
          (msg.role === 'user' || msg.role === 'assistant') &&
          typeof msg.content === 'string' &&
          msg.content.length <= MAX_MESSAGE_LENGTH
        )
      })
      .map((msg) => ({
        role: msg.role,
        content: sanitizeText(msg.content),
      }))

    // If a Python voice service is configured, proxy the request and return its response
    if (process.env.VOICE_SERVICE_URL) {
      try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 20000)
        const proxyRes = await fetch(`${process.env.VOICE_SERVICE_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...body, conversationHistory }),
          signal: controller.signal,
        })
        clearTimeout(timer)

        const proxyData = await proxyRes.json().catch(() => ({}))
        if (!proxyRes.ok) {
          return NextResponse.json(
            { error: proxyData.detail || proxyData.error || 'Voice service error' },
            { status: proxyRes.status }
          )
        }

        // Convert Python service base64 audio to binary and store it
        if (proxyData.audio && typeof proxyData.audio === 'string') {
          try {
            // Extract base64 from data URI if present
            let base64Data = proxyData.audio.trim()
            if (base64Data.startsWith('data:audio/')) {
              const match = base64Data.match(/^data:audio\/[^;]+;base64,(.+)$/)
              if (match && match[1]) {
                base64Data = match[1]
              } else {
                const commaIndex = base64Data.indexOf(',')
                if (commaIndex !== -1) {
                  base64Data = base64Data.substring(commaIndex + 1)
                }
              }
            }
            
            // Remove whitespace
            base64Data = base64Data.replace(/\s/g, '')
            
            // Decode base64 to buffer
            const audioBuffer = Buffer.from(base64Data, 'base64')
            if (audioBuffer.length > 0) {
              // Store in cache and get token
              const token = storeAudio(audioBuffer, 5)
              // Return with audioUrl instead of base64
              const response: VoiceChatResponse = {
                text: proxyData.text || '',
                audioUrl: `/api/voice/audio?token=${token}`,
                transcription: proxyData.transcription || '',
              }
              return NextResponse.json(response, {
                headers: {
                  'X-RateLimit-Limit': '10',
                  'X-RateLimit-Remaining': String(rateLimit.remaining),
                  'X-RateLimit-Reset': String(rateLimit.resetAt),
                },
              })
            }
          } catch (error) {
            console.error('Failed to process audio from Python service:', error)
            // Fall through to local handling
          }
        }
        
        // If we get here, audio processing failed - fall through to local handling
        console.warn('Invalid or missing audio from Python service, using local TTS instead')
      } catch (error) {
        console.error('Voice service proxy error:', error)
        // fall through to local handling
      }
    }

    let transcription = ''

    // Case 1: Audio Input - Needs Transcription
    if (body.audio) {
      // Validate base64 format
      if (!isValidBase64(body.audio)) {
        return NextResponse.json(
          { error: 'Invalid request: invalid audio format' },
          { status: 400 }
        )
      }

      // Check audio size
      const audioSize = Buffer.from(body.audio, 'base64').length
      if (audioSize > MAX_AUDIO_SIZE) {
        return NextResponse.json(
          { error: `Audio file too large. Maximum size is ${MAX_AUDIO_SIZE / 1024 / 1024}MB` },
          { status: 400 }
        )
      }

      // Convert base64 audio to buffer
      const audioBuffer = Buffer.from(body.audio, 'base64')

      // Step 1: Transcribe audio using Whisper API
      let audioFile: File | Blob
      try {
        if (typeof File !== 'undefined') {
          audioFile = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' })
        } else {
          audioFile = new Blob([audioBuffer], { type: 'audio/webm' })
        }
      } catch (error) {
        audioFile = new Blob([audioBuffer], { type: 'audio/webm' })
      }

      try {
        const transcriptionResponse = await openai.audio.transcriptions.create({
          file: audioFile as File | Blob,
          model: 'whisper-1',
          language: 'en',
        })
        transcription = sanitizeText(transcriptionResponse.text)

        // Validate transcription length
        if (transcription.length > MAX_MESSAGE_LENGTH) {
          transcription = transcription.substring(0, MAX_MESSAGE_LENGTH)
        }
      } catch (error) {
        console.error('Whisper transcription error:', error)
        return NextResponse.json(
          { error: 'Failed to process audio. Please try again.' },
          { status: 500 }
        )
      }
    } else if (body.text) {
      // Case 2: Direct Text Input
      transcription = sanitizeText(body.text)
      if (transcription.length > MAX_MESSAGE_LENGTH) {
        transcription = transcription.substring(0, MAX_MESSAGE_LENGTH)
      }
    }

    // Step 2: Get AI response using GPT-3.5-turbo (faster and more cost-effective)
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: PRODUCT_KNOWLEDGE_SYSTEM_PROMPT,
      },
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user',
        content: transcription,
      },
    ]

    let aiResponse: string
    try {
      // Use gpt-4o-mini for better intelligence and speed balance
      const chatResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.8, // Slightly higher for more natural, conversational responses
        max_tokens: 400, // Increased for more natural conversation flow while staying concise
        presence_penalty: 0.1, // Encourage variety in responses
        frequency_penalty: 0.1, // Reduce repetition
      })
      aiResponse = sanitizeText(
        chatResponse.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'
      )

      // Ensure response isn't empty
      if (!aiResponse || aiResponse.trim().length === 0) {
        aiResponse = "I'm here to help! Could you tell me more about what you're looking for?"
      }
    } catch (error) {
      console.error('GPT chat error:', error)
      
      // Provide more helpful error messages based on error type
      if (error instanceof Error) {
        if (error.message.includes('rate_limit') || error.message.includes('quota')) {
          return NextResponse.json(
            { error: 'Service is temporarily busy. Please try again in a moment.' },
            { status: 503 }
          )
        }
        if (error.message.includes('invalid_api_key')) {
          console.error('OpenAI API key is invalid or missing')
          return NextResponse.json(
            { error: 'Service temporarily unavailable' },
            { status: 503 }
          )
        }
      }
      
      // Don't expose internal error details
      return NextResponse.json(
        { error: 'I had trouble processing that. Could you try rephrasing your question?' },
        { status: 500 }
      )
    }

    // Step 3: Generate TTS audio using TTS API
    let ttsAudio: Buffer
    try {
      // Use tts-1 instead of tts-1-hd for faster generation (still high quality)
      const ttsResponse = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'nova', // More natural, friendly voice for sales conversations
        input: aiResponse,
      })

      // Convert response to buffer
      const arrayBuffer = await ttsResponse.arrayBuffer()
      ttsAudio = Buffer.from(arrayBuffer)

      // Validate audio buffer
      if (!ttsAudio || ttsAudio.length === 0) {
        throw new Error('TTS returned empty audio buffer')
      }
    } catch (error) {
      console.error('TTS error:', error)
      
      // Return text response even if TTS fails, so conversation can continue
      return NextResponse.json(
        {
          text: aiResponse,
          transcription,
          warning: 'Audio generation failed, but you can read the response above.',
        },
        { status: 200 }
      )
    }

    // Store audio in cache and get token for binary endpoint
    const token = storeAudio(ttsAudio, 5)
    
    // Return response with audioUrl pointing to binary endpoint
    const response: VoiceChatResponse = {
      text: aiResponse,
      audioUrl: `/api/voice/audio?token=${token}`,
      transcription,
    }

    return NextResponse.json(response, {
      headers: {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': String(rateLimit.resetAt),
      },
    })
  } catch (error) {
    console.error('Voice chat API error:', error)
    // Generic error message for clients
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}

