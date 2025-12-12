'use client'

import { useEffect, useRef } from 'react'
import { WelcomeModal } from './WelcomeModal'
import { useChatbotContext } from './ChatbotProvider'

export function WelcomeModalWrapper() {
  const { setOpen, setAiNavigationMode, conversation } = useChatbotContext()
  const hasStartedWelcomeFlow = useRef(false)

  const handleAccept = async () => {
    // Enable AI navigation mode and open chatbot
    setAiNavigationMode(true)
    setOpen(true)
    
    // Start a welcome conversation flow
    if (!hasStartedWelcomeFlow.current) {
      hasStartedWelcomeFlow.current = true
      
      // Wait a moment for the panel to open, then send a welcome message
      setTimeout(async () => {
        try {
          await conversation.sendTextMessage("Hi! I'd like to learn about SOYL. Can you guide me through the website?")
        } catch (error) {
          console.error('Failed to start welcome flow:', error)
        }
      }, 500)
    }
  }

  const handleDismiss = () => {
    // Just dismiss, don't enable navigation mode
  }

  return <WelcomeModal onAccept={handleAccept} onDismiss={handleDismiss} />
}

