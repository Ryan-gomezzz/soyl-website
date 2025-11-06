'use client'

import { useEffect } from 'react'
import { useChatbotState } from './hooks/useChatbotState'
import { ChatbotLauncher } from './ChatbotLauncher'
import { ChatbotPanel } from './ChatbotPanel'

export function Chatbot() {
  const { setOpen, requestModalModeForFlow } = useChatbotState()

  // Ensure chatbot is properly initialized
  useEffect(() => {
    // Chatbot component is ready
    if (typeof window !== 'undefined') {
      // Component mounted successfully
    }
  }, [])

  return (
    <>
      <ChatbotLauncher onClick={() => setOpen(true)} />
      <ChatbotPanel requestModalModeForFlow={requestModalModeForFlow} />
    </>
  )
}

