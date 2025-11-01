'use client'

import { useChatbotState } from './hooks/useChatbotState'
import { ChatbotLauncher } from './ChatbotLauncher'
import { ChatbotPanel } from './ChatbotPanel'

export function Chatbot() {
  const { setOpen, requestModalModeForFlow } = useChatbotState()

  return (
    <>
      <ChatbotLauncher onClick={() => setOpen(true)} />
      <ChatbotPanel requestModalModeForFlow={requestModalModeForFlow} />
    </>
  )
}

