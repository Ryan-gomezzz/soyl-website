'use client'

import { useState, useEffect, useCallback } from 'react'

interface ChatbotState {
  open: boolean
  pinned: boolean
  minimized: boolean
  prefersModal: boolean
  lastY: number
}

const STORAGE_KEY = '__soyl_chat_panel'
const DEFAULT_STATE: ChatbotState = {
  open: false,
  pinned: false,
  minimized: false,
  prefersModal: false,
  lastY: 0,
}

function loadState(): ChatbotState {
  if (typeof window === 'undefined') return DEFAULT_STATE

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<ChatbotState>
      return { ...DEFAULT_STATE, ...parsed }
    }
  } catch (e) {
    // Ignore parse errors
  }

  // Load lastY from localStorage for persistence across sessions
  try {
    const lastYStored = localStorage.getItem(`${STORAGE_KEY}_lastY`)
    if (lastYStored) {
      const y = parseInt(lastYStored, 10)
      if (!isNaN(y)) {
        return { ...DEFAULT_STATE, lastY: y }
      }
    }
  } catch (e) {
    // Ignore
  }

  return DEFAULT_STATE
}

function saveState(state: ChatbotState) {
  if (typeof window === 'undefined') return

  try {
    // Save most state to sessionStorage
    const { lastY, ...sessionState } = state
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessionState))
    
    // Save lastY to localStorage for persistence
    localStorage.setItem(`${STORAGE_KEY}_lastY`, lastY.toString())
  } catch (e) {
    // Ignore storage errors (e.g., private browsing)
  }
}

export function useChatbotState() {
  const [state, setState] = useState<ChatbotState>(loadState)

  // Load state on mount
  useEffect(() => {
    setState(loadState())
  }, [])

  // Save state on changes
  useEffect(() => {
    saveState(state)
  }, [state])

  const setOpen = useCallback((open: boolean | ((prev: boolean) => boolean)) => {
    setState((prev) => {
      // Handle functional update
      const newOpen = typeof open === 'function' ? open(prev.open) : open
      
      // If opening and minimized, clear minimized state
      if (newOpen && prev.minimized) {
        return { ...prev, open: true, minimized: false }
      }
      // If closing and not pinned, close
      if (!newOpen && !prev.pinned) {
        return { ...prev, open: false, minimized: false }
      }
      // If closing but pinned, minimize instead
      if (!newOpen && prev.pinned) {
        return { ...prev, open: false, minimized: true }
      }
      return { ...prev, open: newOpen }
    })
  }, [])

  const setPinned = useCallback((pinned: boolean) => {
    setState((prev) => ({ ...prev, pinned }))
  }, [])

  const setMinimized = useCallback((minimized: boolean) => {
    setState((prev) => {
      if (minimized) {
        return { ...prev, minimized: true, open: false }
      } else {
        // Unminimize = open
        return { ...prev, minimized: false, open: true }
      }
    })
  }, [])

  const setPrefersModal = useCallback((prefersModal: boolean) => {
    setState((prev) => ({ ...prev, prefersModal }))
  }, [])

  const setLastY = useCallback((lastY: number) => {
    setState((prev) => ({ ...prev, lastY }))
  }, [])

  // API for requesting modal mode temporarily (for flows)
  const requestModalModeForFlow = useCallback((enable: boolean) => {
    setState((prev) => ({ ...prev, prefersModal: enable }))
  }, [])

  return {
    ...state,
    setOpen,
    setPinned,
    setMinimized,
    setPrefersModal,
    setLastY,
    requestModalModeForFlow,
  }
}

