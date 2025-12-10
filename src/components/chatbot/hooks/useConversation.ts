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
      const userMessagePlaceholder = addMessage({
        role: 'user',
        content: '...',
        transcription: 'Processing...',
      })

      // Call API
      const response = await fetch('/api/voice/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio: base64Audio,
          conversationHistory,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to get response')
      }

      const data = await response.json()

      // Update user message with actual transcription
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessagePlaceholder.id
            ? {
                ...msg,
                content: data.transcription,
                transcription: data.transcription,
              }
            : msg
        )
      )

      // Convert base64 audio to Blob URL for better browser compatibility
      let audioUrl: string
      try {
        const binaryString = atob(data.audio)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: 'audio/mpeg' })
        audioUrl = URL.createObjectURL(blob)
      } catch (e) {
        // Fallback to data URI if conversion fails
        audioUrl = `data:audio/mpeg;base64,${data.audio}`
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
      setError(errorMessage)
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => msg.content !== '...'))
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

  return {
    messages,
    isLoading,
    error,
    addMessage,
    sendVoiceMessage,
    clearConversation,
  }
}

