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
      
      if (typeof audioData === 'string') {
        // If it's already a URL (blob: or http:), use it directly
        if (audioData.startsWith('blob:') || audioData.startsWith('http://') || audioData.startsWith('https://') || audioData.startsWith('/')) {
          audioUrl = audioData
          shouldRevokeUrl = false
        } 
        // If it's a data URI (backward compatibility), convert to blob
        else if (audioData.startsWith('data:audio/')) {
          try {
            const response = await fetch(audioData)
            const blob = await response.blob()
            if (blob.size === 0) {
              throw new Error('Invalid audio data: blob is empty')
            }
            audioUrl = URL.createObjectURL(blob)
            shouldRevokeUrl = true
          } catch (e) {
            throw new Error(`Failed to process data URI: ${e instanceof Error ? e.message : 'Unknown error'}`)
          }
        } else {
          throw new Error('Invalid audio data: string must be a URL or data URI')
        }
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

