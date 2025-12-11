'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  transcription?: string
  timestamp: number
  audioUrl?: string
}

const CONVERSATION_STORAGE_KEY = '__soyl_voice_conversation'
const MAX_MESSAGES = 20 // Keep last 20 messages in memory
const MAX_STORAGE_MESSAGES = 10 // Keep last 10 messages in storage
const VOICE_TIMEOUT_MS = 15000
const TEXT_TIMEOUT_MS = 12000

export function useConversation() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const greetingInjectedRef = useRef(false)

  const buildAudioUrl = useCallback((base64: string): string | null => {
    if (!base64 || typeof base64 !== 'string') return null

    let cleanBase64 = base64.trim()
    if (!cleanBase64) return null

    // Extract base64 from data URI if present
    if (cleanBase64.startsWith('data:audio/')) {
      const match = cleanBase64.match(/^data:audio\/[^;]+;base64,(.+)$/)
      if (match && match[1]) {
        cleanBase64 = match[1].trim()
      } else {
        const commaIndex = cleanBase64.indexOf(',')
        if (commaIndex !== -1) {
          cleanBase64 = cleanBase64.substring(commaIndex + 1).trim()
        }
      }
    }

    // Remove all whitespace, newlines, and carriage returns
    cleanBase64 = cleanBase64.replace(/\s/g, '').replace(/\n/g, '').replace(/\r/g, '')
    if (!cleanBase64) return null

    // Validate base64 format
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
    if (!base64Regex.test(cleanBase64)) {
      console.error('Invalid base64 format in audio data')
      return null
    }

    try {
      // Try to decode to verify it's valid
      const binaryString = atob(cleanBase64)
      if (!binaryString || binaryString.length === 0) {
        console.error('Decoded base64 audio is empty')
        return null
      }

      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      const blob = new Blob([bytes], { type: 'audio/mpeg' })
      if (blob.size === 0) {
        console.error('Created blob is empty')
        return null
      }

      return URL.createObjectURL(blob)
    } catch (err) {
      console.error('Failed to convert base64 audio:', err)
      // Don't fallback to data URI - return null to let playback hook handle error
      return null
    }
  }, [])

  // Load conversation from sessionStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const saved = sessionStorage.getItem(CONVERSATION_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Message[]
        // Limit loaded messages
        const limited = Array.isArray(parsed) ? parsed.slice(-MAX_STORAGE_MESSAGES) : []
        setMessages(limited)
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, [])

  // Save conversation to sessionStorage whenever it changes (limited)
  useEffect(() => {
    if (typeof window === 'undefined') return
    // Only save last N messages to storage
    const toSave = messages.slice(-MAX_STORAGE_MESSAGES)
    sessionStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(toSave))
  }, [messages])

  // Inject a friendly greeting when no conversation exists
  useEffect(() => {
    if (greetingInjectedRef.current) return
    if (messages.length === 0) {
      greetingInjectedRef.current = true
      setMessages([
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: "Hi! I'm SOYL's AI assistant. Hold the mic to ask how we help, pricing, or to request a pilot.",
          timestamp: Date.now(),
        },
      ])
    }
  }, [messages.length])

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    }
    setMessages((prev) => {
      // Keep only last MAX_MESSAGES messages
      const updated = [...prev, newMessage]
      return updated.slice(-MAX_MESSAGES)
    })
    return newMessage
  }, [])

  const sendVoiceMessage = useCallback(async (audioBlob: Blob) => {
    setIsLoading(true)
    setError(null)

    // Declare placeholder outside try block so it's accessible in catch
    let userMessagePlaceholder: Message | null = null

    try {
      // Convert blob to base64
      const base64Audio = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1]
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(audioBlob)
      })

      // Prepare conversation history for API (limit to last 10 messages)
      const conversationHistory = messages
        .slice(-10)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))

      // Add optimistic user message placeholder (will be updated with transcription)
      userMessagePlaceholder = addMessage({
        role: 'user',
        content: '...',
        transcription: 'Processing...',
      })

      // Create timeout promise (5 seconds)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Voice request timed out'))
        }, VOICE_TIMEOUT_MS)
      })

      // Call API with timeout
      const fetchPromise = fetch('/api/voice/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: base64Audio,
          conversationHistory,
        }),
      })

      const response = await Promise.race([fetchPromise, timeoutPromise])

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to get response')
      }

      const data = await response.json()

      // Update user message with actual transcription
      if (userMessagePlaceholder !== null) {
        const placeholderId = userMessagePlaceholder.id
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === placeholderId
              ? {
                ...msg,
                content: data.transcription,
                transcription: data.transcription,
              }
              : msg
          )
        )
      }

      const audioUrl = data.audio ? buildAudioUrl(data.audio) : null
      // Add assistant message with audio
      const assistantMessage = addMessage({
        role: 'assistant',
        content: data.text,
        audioUrl: audioUrl || undefined,
      })

      return assistantMessage
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'

      // Check if it's a timeout or network error
      const isTimeout = errorMessage.includes('timed out') || errorMessage.includes('timeout')
      const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')

      // Set user-friendly error message
      if (isTimeout || isNetworkError) {
        setError('Voice currently unavailable. Please try again or use text chat.')
      } else {
        setError('Voice service error. Please try again.')
      }

      // Remove optimistic message on error
      if (userMessagePlaceholder) {
        setMessages((prev) => prev.filter((msg) => msg.id !== userMessagePlaceholder!.id))
      }

      // Add error message to conversation so user can see it
      addMessage({
        role: 'assistant',
        content: 'Voice currently unavailable. Please try typing your question instead.',
      })

      throw err
    } finally {
      setIsLoading(false)
    }
  }, [messages, addMessage, buildAudioUrl])

  const clearConversation = useCallback(() => {
    // Clean up blob URLs before clearing messages
    messages.forEach((msg) => {
      if (msg.audioUrl && msg.audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(msg.audioUrl)
      }
    })
    setMessages([])
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(CONVERSATION_STORAGE_KEY)
    }
  }, [messages])

  const sendTextMessage = useCallback(async (text: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Add user message immediately
      addMessage({
        role: 'user',
        content: text,
      })

      // Prepare conversation history
      const conversationHistory = messages
        .slice(-10)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out'))
        }, TEXT_TIMEOUT_MS)
      })

      // Call API
      const fetchPromise = fetch('/api/voice/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          conversationHistory,
        }),
      })

      const response = await Promise.race([fetchPromise, timeoutPromise])

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to get response')
      }

      const data = await response.json()

      // Process audio response similar to voice message
      let audioUrl: string | undefined

      if (data.audio) {
        audioUrl = buildAudioUrl(data.audio) || undefined
      }

      // Add assistant message
      addMessage({
        role: 'assistant',
        content: data.text,
        audioUrl,
      })

      return { audioUrl }

    } catch (err) {
      console.error('Text message error:', err)
      // const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError('Failed to send message. Please try again.')

      addMessage({
        role: 'assistant',
        content: 'I encountered an error processing your request. Please try again.',
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [messages, addMessage, buildAudioUrl])

  return {
    messages,
    isLoading,
    error,
    addMessage,
    sendVoiceMessage,
    sendTextMessage,
    clearConversation,
  }
}

