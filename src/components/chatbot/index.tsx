'use client'

import { useEffect } from 'react'
import { ChatbotProvider, useChatbotContext } from './ChatbotProvider'
import { ChatbotLauncher } from './ChatbotLauncher'
import { ChatbotPanel } from './ChatbotPanel'

function ChatbotContent() {
  const { 
    setOpen, 
    requestModalModeForFlow,
    minimized,
    setMinimized,
    lastY,
    setLastY
  } = useChatbotContext()

  // Ensure chatbot is properly initialized
  useEffect(() => {
    // Chatbot component is ready
    if (typeof window !== 'undefined') {
      // Component mounted successfully
    }
  }, [])

  return (
    <>
      <ChatbotLauncher 
        onClick={() => setOpen(true)} 
        minimized={minimized}
        onMinimizeChange={setMinimized}
        lastY={lastY}
        onLastYChange={setLastY}
      />
      <ChatbotPanel requestModalModeForFlow={requestModalModeForFlow} />
    </>
  )
}

export function Chatbot() {
  return (
    <ChatbotProvider>
      <ChatbotContent />
    </ChatbotProvider>
  )
}

