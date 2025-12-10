import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { PRODUCT_KNOWLEDGE_SYSTEM_PROMPT } from '@/lib/prompts/productKnowledge'
import { rateLimitAppRouter } from '@/utils/rateLimitAppRouter'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Constants
const MAX_AUDIO_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_CONVERSATION_HISTORY = 10 // Last 10 messages
const MAX_MESSAGE_LENGTH = 5000 // Max characters per message

export interface VoiceChatRequest {
  audio: string // Base64 encoded audio
  conversationHistory: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

export interface VoiceChatResponse {
  text: string
  audio: string // Base64 encoded audio
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

    // Validate request body
    if (!body.audio || typeof body.audio !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: audio data is required' },
        { status: 400 }
      )
    }

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

    // Convert base64 audio to buffer
    const audioBuffer = Buffer.from(body.audio, 'base64')

    // Step 1: Transcribe audio using Whisper API
    // Create a File object for OpenAI API
    // Handle File API compatibility for different Node.js versions
    let audioFile: File | Blob
    try {
      // Try to create File (Node.js 18+)
      if (typeof File !== 'undefined') {
        audioFile = new File([audioBuffer], 'audio.webm', {
          type: 'audio/webm',
        })
      } else {
        // Fallback to Blob
        audioFile = new Blob([audioBuffer], { type: 'audio/webm' })
      }
    } catch (error) {
      // Final fallback: use Blob
      audioFile = new Blob([audioBuffer], { type: 'audio/webm' })
    }

    let transcription: string
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
      // Don't expose internal error details
      return NextResponse.json(
        { error: 'Failed to process audio. Please try again.' },
        { status: 500 }
      )
    }

    // Step 2: Get AI response using GPT-3.5-turbo (faster and more cost-effective)
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: PRODUCT_KNOWLEDGE_SYSTEM_PROMPT,
      },
      ...body.conversationHistory.map((msg) => ({
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
      // Use gpt-3.5-turbo for faster responses (3-5x faster, 10x cheaper)
      // Still provides excellent conversational quality
      const chatResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.8, // Slightly higher for more natural, sales-oriented responses
        max_tokens: 400, // Reduced for faster generation and more concise responses
      })
      aiResponse = sanitizeText(
        chatResponse.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'
      )
    } catch (error) {
      console.error('GPT chat error:', error)
      // Don't expose internal error details
      return NextResponse.json(
        { error: 'Failed to generate response. Please try again.' },
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
    } catch (error) {
      console.error('TTS error:', error)
      // Don't expose internal error details
      return NextResponse.json(
        { error: 'Failed to generate speech. Please try again.' },
        { status: 500 }
      )
    }

    // Return response with base64 encoded audio
    const response: VoiceChatResponse = {
      text: aiResponse,
      audio: ttsAudio.toString('base64'),
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

