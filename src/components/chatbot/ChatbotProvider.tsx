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
        const message = await conversation.sendVoiceMessage(audioBlob)
        if (message.audioUrl) {
          // Try to play audio, but don't fail if it doesn't work
          playback.play(message.audioUrl).catch((err) => {
            console.error('Failed to play audio response:', err)
            // Audio failed but text response is still available
          })
        }
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

