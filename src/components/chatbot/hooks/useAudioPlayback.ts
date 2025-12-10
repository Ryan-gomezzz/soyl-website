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
      setState('playing')

      // Create audio element if it doesn't exist
      if (!audioRef.current) {
        audioRef.current = new Audio()
      }

      const audio = audioRef.current

      // Handle different audio data types
      let audioUrl: string
      if (typeof audioData === 'string') {
        // Base64 string
        audioUrl = `data:audio/mpeg;base64,${audioData}`
      } else if (audioData instanceof Blob) {
        audioUrl = URL.createObjectURL(audioData)
      } else {
        // ArrayBuffer
        const blob = new Blob([audioData], { type: 'audio/mpeg' })
        audioUrl = URL.createObjectURL(blob)
      }

      audio.src = audioUrl

      // Set up event handlers
      audio.onended = () => {
        setState('idle')
        if (options.onPlaybackComplete) {
          options.onPlaybackComplete()
        }
        // Clean up object URL if it was created
        if (audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl)
        }
      }

      audio.onerror = () => {
        const error = new Error('Audio playback failed')
        setError('Audio playback failed')
        setState('error')
        if (options.onError) {
          options.onError(error)
        }
        // Clean up object URL if it was created
        if (audioUrl.startsWith('blob:')) {
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

