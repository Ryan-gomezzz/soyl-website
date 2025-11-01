'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { useChatbotState } from './hooks/useChatbotState'
import './ChatbotStyles.css'

interface ChatbotLauncherProps {
  onClick: () => void
}

export function ChatbotLauncher({ onClick }: ChatbotLauncherProps) {
  const { minimized, setMinimized, setOpen, lastY, setLastY } = useChatbotState()
  const [isDragging, setIsDragging] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  // Detect touch device (disable drag on touch)
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Set initial Y position (transform offset from bottom: 32px)
  // y: 0 means at bottom: 32px, positive y moves down
  const y = useMotionValue(0)
  
  // Constrain Y to viewport bounds and save on change
  useEffect(() => {
    const unsubscribe = y.on('change', (latestY) => {
      // Save the y offset (latestY is transform offset)
      setLastY(latestY)
    })
    return unsubscribe
  }, [y, setLastY])

  // Load initial position if saved
  useEffect(() => {
    if (lastY !== 0) {
      y.set(lastY)
    }
  }, [y, lastY])

  // Handle minimize/restore
  const handleClick = (e: React.MouseEvent) => {
    // Prevent click if we just dragged
    if (isDragging) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    
    if (minimized) {
      setMinimized(false)
      setOpen(true)
    } else {
      onClick()
    }
  }

  const handleDragStart = () => {
    if (!isTouchDevice) {
      setIsDragging(true)
    }
  }

  const handleDragEnd = () => {
    // Reset dragging after a short delay to allow click to fire if no drag happened
    setTimeout(() => {
      setIsDragging(false)
    }, 100)
  }

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <motion.button
      ref={buttonRef}
      initial={{ scale: 0 }}
      animate={{ 
        scale: 1,
      }}
      transition={prefersReducedMotion ? { duration: 0 } : { 
        type: 'spring', 
        stiffness: 200,
        damping: 20,
      }}
      whileHover={!isDragging ? { scale: 1.1 } : {}}
      whileTap={!isDragging ? { scale: 0.95 } : {}}
      drag={!isTouchDevice ? 'y' : false}
      dragConstraints={{ top: 32, bottom: typeof window !== 'undefined' ? window.innerHeight - 96 : 800 }}
      dragElastic={0.1}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onPointerDown={() => {
        // Track if this was a click vs drag start
        // Note: actual drag detection is handled by framer-motion drag handlers
        if (!isTouchDevice) {
          // Reset dragging state on new pointer down
          setIsDragging(false)
        }
      }}
      className="chatbot-launcher w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent text-bg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent cursor-pointer select-none"
      style={{
        bottom: '32px',
        right: '32px',
        position: 'fixed',
        zIndex: 9999,
        ...(isTouchDevice ? {} : { y }),
      }}
      aria-label={minimized ? 'Restore SOYL assistant' : 'Open SOYL assistant'}
      title={minimized ? 'Restore assistant' : 'Ask SOYL'}
    >
      <motion.div
        animate={
          minimized && !prefersReducedMotion
            ? {
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 2,
        }}
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
      </motion.div>
    </motion.button>
  )
}
