'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useChatbotState } from './hooks/useChatbotState'
import { useConversation } from './hooks/useConversation'
import { useVoiceRecording } from './hooks/useVoiceRecording'
import { useAudioPlayback } from './hooks/useAudioPlayback'

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
  // Voice bot functionality
  conversation: ReturnType<typeof useConversation>
  recording: ReturnType<typeof useVoiceRecording>
  playback: ReturnType<typeof useAudioPlayback>
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
  const conversation = useConversation()
  
  const playback = useAudioPlayback({
    onError: (error) => {
      console.error('Playback error:', error)
      // Audio playback failed, but text response is still available
      // User can still read the response
    },
  })

  const recording = useVoiceRecording({
    onRecordingComplete: async (audioBlob) => {
      try {
        await conversation.sendVoiceMessage(audioBlob)
        // Don't auto-play here - let VoiceBotPanel handle it to avoid duplicate playback
        // The VoiceBotPanel's useEffect will automatically play the audio when the message is added
      } catch (error) {
        console.error('Error sending voice message:', error)
      }
    },
    onError: (error) => {
      console.error('Recording error:', error)
    },
  })

  return (
    <ChatbotContextValue.Provider value={{
      ...state,
      conversation,
      recording,
      playback,
    }}>
      {children}
    </ChatbotContextValue.Provider>
  )
}

