'use client'

import { useState, useCallback, useEffect } from 'react'

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

export function useConversation() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
          reject(new Error('Voice request timed out after 5 seconds'))
        }, 5000)
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

      // Convert base64 audio to Blob URL for better browser compatibility
      let audioUrl: string

      // Validate base64 format first
      if (!data.audio || typeof data.audio !== 'string') {
        console.error('Invalid audio data received from API')
        throw new Error('Invalid audio data format')
      }

      // Clean the base64 string (remove any whitespace or data URI prefix if present)
      let cleanBase64 = String(data.audio || '').trim()

      // Remove data URI prefix if present
      if (cleanBase64.startsWith('data:audio')) {
        // Extract base64 from data URI if present
        const match = cleanBase64.match(/^data:audio\/[^;]+;base64,(.+)$/)
        if (match && match[1]) {
          cleanBase64 = match[1].trim()
        } else {
          // Try to extract just the base64 part after the comma
          const commaIndex = cleanBase64.indexOf(',')
          if (commaIndex !== -1) {
            cleanBase64 = cleanBase64.substring(commaIndex + 1).trim()
          }
        }
      }

      // Remove any remaining whitespace (newlines, spaces, etc.)
      cleanBase64 = cleanBase64.replace(/\s/g, '')

      // Check if we have any data
      if (!cleanBase64 || cleanBase64.length === 0) {
        console.error('Empty audio data received from API')
        throw new Error('Invalid audio data: empty base64 string')
      }

      // Validate base64 format (more lenient - allows padding)
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
      if (!base64Regex.test(cleanBase64)) {
        console.error('Invalid base64 format in audio data:', cleanBase64.substring(0, 50))
        throw new Error('Invalid audio data: malformed base64 format')
      }

      try {
        const binaryString = atob(cleanBase64)
        if (binaryString.length === 0) {
          throw new Error('Decoded audio data is empty')
        }
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: 'audio/mpeg' })
        audioUrl = URL.createObjectURL(blob)
      } catch (e) {
        console.error('Failed to convert base64 to blob:', e)
        // Fallback to data URI if conversion fails
        audioUrl = `data:audio/mpeg;base64,${cleanBase64}`
      }

      // Add assistant message with audio
      const assistantMessage = addMessage({
        role: 'assistant',
        content: data.text,
        audioUrl,
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
  }, [messages, addMessage])

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
          reject(new Error('Request timed out after 10 seconds'))
        }, 10000)
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
        // Add logic to handle audio if needed, reusing the base64 processing from sendVoiceMessage is repetitive
        // For now, let's keep it simple and just reuse the logic or duplicate it slightly modified
        // To keep code clean, I will assume the same base64 processing is needed.

        let cleanBase64 = String(data.audio || '').trim()
        if (cleanBase64.startsWith('data:audio')) {
          const match = cleanBase64.match(/^data:audio\/[^;]+;base64,(.+)$/)
          if (match && match[1]) cleanBase64 = match[1].trim()
        }
        cleanBase64 = cleanBase64.replace(/\s/g, '')

        try {
          const binaryString = atob(cleanBase64)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          const blob = new Blob([bytes], { type: 'audio/mpeg' })
          audioUrl = URL.createObjectURL(blob)
        } catch (e) {
          console.error('Failed to convert base64 to blob:', e)
          audioUrl = `data:audio/mpeg;base64,${cleanBase64}`
        }
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
  }, [messages, addMessage])

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

