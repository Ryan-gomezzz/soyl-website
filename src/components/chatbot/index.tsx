'use client'

import { useState } from 'react'
import { ChatbotLauncher } from './ChatbotLauncher'
import { ChatbotModal } from './ChatbotModal'

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ChatbotLauncher onClick={() => setIsOpen(true)} />
      <ChatbotModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

