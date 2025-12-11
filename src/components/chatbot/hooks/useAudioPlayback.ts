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
        // Remove all whitespace, newlines, carriage returns, and other control characters
        cleaned = cleaned.replace(/\s/g, '').replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, '')
        // Remove any URL encoding artifacts
        cleaned = cleaned.replace(/%[0-9A-Fa-f]{2}/g, '')
        return cleaned
      }

      // Helper function to validate base64 format with detailed error reporting
      const isValidBase64 = (str: string): { valid: boolean; error?: string } => {
        if (!str || str.length === 0) {
          return { valid: false, error: 'Base64 string is empty' }
        }
        
        // Base64 regex: alphanumeric, +, /, and = for padding (0-2 times)
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
        if (!base64Regex.test(str)) {
          // Find invalid characters for better error message
          const invalidChars = str.match(/[^A-Za-z0-9+/=]/g)
          return { 
            valid: false, 
            error: `Invalid base64 characters found: ${invalidChars ? invalidChars.slice(0, 5).join(', ') : 'unknown'}` 
          }
        }
        
        // Check padding - base64 length should be multiple of 4 (after padding)
        const paddingCount = (str.match(/=/g) || []).length
        if (paddingCount > 2) {
          return { valid: false, error: 'Invalid base64 padding (too many = characters)' }
        }
        
        // Try to decode to verify it's valid
        try {
          const decoded = atob(str)
          if (decoded.length === 0) {
            return { valid: false, error: 'Base64 decodes to empty data' }
          }
          return { valid: true }
        } catch (e) {
          return { 
            valid: false, 
            error: `Base64 decode failed: ${e instanceof Error ? e.message : 'Unknown error'}` 
          }
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
          throw new Error('Invalid audio data: empty base64 string after cleaning')
        }

        // Validate base64 format with detailed error reporting
        const validation = isValidBase64(cleaned)
        if (!validation.valid) {
          const errorMsg = validation.error 
            ? `Invalid audio data: ${validation.error}`
            : 'Invalid audio data: corrupted or invalid base64 format'
          console.error('Base64 validation failed:', {
            originalLength: audioData.length,
            cleanedLength: cleaned.length,
            error: validation.error,
            preview: cleaned.substring(0, 50) + '...'
          })
          throw new Error(errorMsg)
        }

        // Determine MIME type from data URI if present, otherwise default to mpeg
        let mimeType = 'audio/mpeg'
        if (audioData.startsWith('data:audio/')) {
          const mimeMatch = audioData.match(/^data:audio\/([^;]+)/)
          if (mimeMatch && mimeMatch[1]) {
            const detectedType = mimeMatch[1].toLowerCase()
            // Validate MIME type and fallback to mpeg if invalid
            if (['mpeg', 'mp3', 'wav', 'ogg', 'webm', 'aac', 'flac'].includes(detectedType)) {
              mimeType = `audio/${detectedType === 'mp3' ? 'mpeg' : detectedType}`
            } else {
              console.warn(`Unknown audio MIME type: ${detectedType}, defaulting to audio/mpeg`)
            }
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

