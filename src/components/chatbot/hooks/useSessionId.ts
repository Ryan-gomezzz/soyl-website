'use client'

import { useState, useEffect } from 'react'

const SESSION_STORAGE_KEY = '__soyl_chat_session'

export function useSessionId(): string {
  const [sessionId, setSessionId] = useState<string>('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Try to get existing session from sessionStorage
    const existingSession = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (existingSession) {
      setSessionId(existingSession)
      return
    }

    // Generate new session ID (v4-like format simplified)
    const newSessionId = generateSessionId()
    sessionStorage.setItem(SESSION_STORAGE_KEY, newSessionId)
    setSessionId(newSessionId)
  }, [])

  return sessionId
}

function generateSessionId(): string {
  // Generate a UUID-like session ID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

