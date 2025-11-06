'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useChatbotState } from './hooks/useChatbotState'

interface ChatbotContextType {
  open: boolean
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void
  pinned: boolean
  setPinned: (pinned: boolean) => void
  minimized: boolean
  setMinimized: (minimized: boolean) => void
  prefersModal: boolean
  setPrefersModal: (prefersModal: boolean) => void
  lastY: number
  setLastY: (lastY: number) => void
  requestModalModeForFlow: (enable: boolean) => void
}

const ChatbotContextValue = createContext<ChatbotContextType | undefined>(undefined)

export function useChatbotContext() {
  const context = useContext(ChatbotContextValue)
  if (context === undefined) {
    throw new Error('useChatbotContext must be used within a ChatbotProvider')
  }
  return context
}

interface ChatbotProviderProps {
  children: ReactNode
}

export function ChatbotProvider({ children }: ChatbotProviderProps) {
  const state = useChatbotState()

  return (
    <ChatbotContextValue.Provider value={state}>
      {children}
    </ChatbotContextValue.Provider>
  )
}

