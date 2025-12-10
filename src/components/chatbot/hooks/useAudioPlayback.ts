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

      // Handle different audio data types
      let audioUrl: string
      let shouldRevokeUrl = false
      
      if (typeof audioData === 'string') {
        // Handle both data URIs and plain base64 strings
        if (audioData.startsWith('data:')) {
          // Extract base64 from data URI
          const base64Match = audioData.match(/^data:audio\/([^;]+);base64,(.+)$/)
          if (base64Match) {
            const mimeType = `audio/${base64Match[1]}`
            const base64Data = base64Match[2]
            // Convert base64 to binary
            const binaryString = atob(base64Data)
            const bytes = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i)
            }
            const blob = new Blob([bytes], { type: mimeType })
            audioUrl = URL.createObjectURL(blob)
            shouldRevokeUrl = true
          } else {
            // Fallback: try as direct data URI (may not work in all browsers)
            audioUrl = audioData
          }
        } else {
          // Plain base64 string - convert to Blob
          // Clean the string first (remove whitespace)
          const cleanBase64 = String(audioData).trim().replace(/\s/g, '')
          
          // Check if empty
          if (!cleanBase64 || cleanBase64.length === 0) {
            throw new Error('Invalid base64: empty string')
          }
          
          // Validate it's actually base64 (more lenient)
          const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
          if (!base64Regex.test(cleanBase64)) {
            throw new Error('Invalid base64 format: contains invalid characters')
          }
          
          try {
            const binaryString = atob(cleanBase64)
            if (binaryString.length === 0) {
              throw new Error('Invalid base64: decoded data is empty')
            }
            const bytes = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i)
            }
            // Try to detect format, default to mp3/mpeg
            const blob = new Blob([bytes], { type: 'audio/mpeg' })
            audioUrl = URL.createObjectURL(blob)
            shouldRevokeUrl = true
          } catch (e) {
            const errorMsg = e instanceof Error ? e.message : 'Unknown error'
            // Don't throw - log and use fallback
            console.error('Failed to decode base64 audio:', errorMsg)
            // Try as data URI fallback
            audioUrl = `data:audio/mpeg;base64,${cleanBase64}`
          }
        }
      } else if (audioData instanceof Blob) {
        audioUrl = URL.createObjectURL(audioData)
        shouldRevokeUrl = true
      } else {
        // ArrayBuffer
        const blob = new Blob([audioData], { type: 'audio/mpeg' })
        audioUrl = URL.createObjectURL(blob)
        shouldRevokeUrl = true
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

