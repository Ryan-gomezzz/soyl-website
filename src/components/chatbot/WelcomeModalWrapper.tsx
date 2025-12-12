'use client'

import { WelcomeModal } from './WelcomeModal'
import { useChatbotContext } from './ChatbotProvider'

export function WelcomeModalWrapper() {
  const { setOpen, setAiNavigationMode } = useChatbotContext()

  const handleAccept = () => {
    // Enable AI navigation mode and open chatbot
    setAiNavigationMode(true)
    setOpen(true)
  }

  const handleDismiss = () => {
    // Just dismiss, don't enable navigation mode
  }

  return <WelcomeModal onAccept={handleAccept} onDismiss={handleDismiss} />
}

