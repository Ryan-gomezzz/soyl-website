'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'error'

interface UseAudioPlaybackOptions {
  onPlaybackComplete?: () => void
  onError?: (error: Error) => void
}

export function useAudioPlayback(options: UseAudioPlaybackOptions = {}) {
  const [state, setState] = useState<PlaybackState>('idle')
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const play = useCallback(async (audioData: string | Blob | ArrayBuffer) => {
    try {
      setError(null)
      setState('idle')
      
      // Stop any currently playing audio
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      // Create audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio()
      }

      const audio = audioRef.current
      
      // Reset audio element
      audio.src = ''
      audio.load()
      audio.onplay = () => setState('playing')
      audio.onpause = () => {
        if (state !== 'idle') {
          setState('paused')
        }
      }

      // Handle different audio data types
      let audioUrl: string
      let shouldRevokeUrl = false
      
      // Helper function to clean and validate base64
      const cleanBase64 = (str: string): string => {
        // Remove data URI prefix if present
        let cleaned = str.trim()
        if (cleaned.startsWith('data:audio/')) {
          const match = cleaned.match(/^data:audio\/[^;]+;base64,(.+)$/)
          if (match && match[1]) {
            cleaned = match[1]
          } else {
            const commaIndex = cleaned.indexOf(',')
            if (commaIndex !== -1) {
              cleaned = cleaned.substring(commaIndex + 1)
            }
          }
        }
        // Remove all whitespace and newlines
        cleaned = cleaned.replace(/\s/g, '').replace(/\n/g, '').replace(/\r/g, '')
        return cleaned
      }

      // Helper function to validate base64 format
      const isValidBase64 = (str: string): boolean => {
        if (!str || str.length === 0) return false
        // Base64 regex: alphanumeric, +, /, and = for padding (0-2 times)
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
        if (!base64Regex.test(str)) return false
        // Try to decode to verify it's valid
        try {
          const decoded = atob(str)
          return decoded.length > 0
        } catch {
          return false
        }
      }

      // Helper function to decode base64 to blob
      const base64ToBlob = (base64: string, mimeType: string = 'audio/mpeg'): Blob | null => {
        try {
          const binaryString = atob(base64)
          if (binaryString.length === 0) return null
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          return new Blob([bytes], { type: mimeType })
        } catch (e) {
          console.error('Failed to decode base64 to blob:', e)
          return null
        }
      }
      
      if (typeof audioData === 'string') {
        const cleaned = cleanBase64(audioData)
        
        if (!cleaned || cleaned.length === 0) {
          throw new Error('Invalid audio data: empty base64 string')
        }

        // Validate base64 format
        if (!isValidBase64(cleaned)) {
          throw new Error('Invalid audio data: corrupted or invalid base64 format')
        }

        // Determine MIME type from data URI if present, otherwise default to mpeg
        let mimeType = 'audio/mpeg'
        if (audioData.startsWith('data:audio/')) {
          const mimeMatch = audioData.match(/^data:audio\/([^;]+)/)
          if (mimeMatch && mimeMatch[1]) {
            mimeType = `audio/${mimeMatch[1]}`
          }
        }

        // Convert to blob for better browser compatibility
        const blob = base64ToBlob(cleaned, mimeType)
        if (!blob) {
          throw new Error('Failed to create audio blob from base64 data')
        }

        // Verify blob has content
        if (blob.size === 0) {
          throw new Error('Invalid audio data: blob is empty')
        }

        audioUrl = URL.createObjectURL(blob)
        shouldRevokeUrl = true
      } else if (audioData instanceof Blob) {
        if (audioData.size === 0) {
          throw new Error('Invalid audio data: blob is empty')
        }
        audioUrl = URL.createObjectURL(audioData)
        shouldRevokeUrl = true
      } else if (audioData instanceof ArrayBuffer) {
        if (audioData.byteLength === 0) {
          throw new Error('Invalid audio data: ArrayBuffer is empty')
        }
        const blob = new Blob([audioData], { type: 'audio/mpeg' })
        audioUrl = URL.createObjectURL(blob)
        shouldRevokeUrl = true
      } else {
        throw new Error('Invalid audio data type')
      }

      audio.src = audioUrl

      // Set up event handlers
      audio.onended = () => {
        setState('idle')
        if (options.onPlaybackComplete) {
          options.onPlaybackComplete()
        }
        // Clean up object URL if it was created
        if (shouldRevokeUrl && audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl)
        }
      }

      audio.onerror = (e) => {
        console.error('Audio playback error:', e, audio.error)
        const error = new Error(`Audio playback failed: ${audio.error?.message || 'Unknown error'}`)
        setError(error.message)
        setState('error')
        if (options.onError) {
          options.onError(error)
        }
        // Clean up object URL if it was created
        if (shouldRevokeUrl && audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl)
        }
      }

      audio.onpause = () => {
        if (state === 'playing') {
          setState('paused')
        }
      }

      // Play audio
      await audio.play()
      setState('playing')
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to play audio')
      setError(error.message)
      setState('error')
      
      if (options.onError) {
        options.onError(error)
      }
    }
  }, [options, state])

  const pause = useCallback(() => {
    if (audioRef.current && state === 'playing') {
      audioRef.current.pause()
      setState('paused')
    }
  }, [state])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setState('idle')
    }
  }, [])

  const reset = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.src = ''
    }
    setState('idle')
    setError(null)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  }, [])

  return {
    state,
    error,
    play,
    pause,
    stop,
    reset,
  }
}

