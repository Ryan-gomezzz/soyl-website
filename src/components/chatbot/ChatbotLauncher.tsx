'use client'

import { motion } from 'framer-motion'
import './ChatbotStyles.css'

interface ChatbotLauncherProps {
  onClick: () => void
}

export function ChatbotLauncher({ onClick }: ChatbotLauncherProps) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="chatbot-launcher w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent text-bg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
      aria-label="Open SOYL assistant"
      title="Ask SOYL"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-bg w-6 h-6 md:w-7 md:h-7"
      >
        <path
          d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
          fill="currentColor"
        />
        <circle cx="7" cy="10" r="1" fill="#0f1724" />
        <circle cx="12" cy="10" r="1" fill="#0f1724" />
        <circle cx="17" cy="10" r="1" fill="#0f1724" />
      </svg>
    </motion.button>
  )
}

