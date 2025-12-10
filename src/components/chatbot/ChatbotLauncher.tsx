'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import './ChatbotStyles.css'

interface ChatbotLauncherProps {
  onClick: () => void
  minimized?: boolean
  onMinimizeChange?: (minimized: boolean) => void
  lastY?: number
  onLastYChange?: (y: number) => void
}

export function ChatbotLauncher({ 
  onClick, 
  minimized = false, 
  onMinimizeChange,
  lastY = 0,
  onLastYChange
}: ChatbotLauncherProps) {
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
    if (onLastYChange) {
      const unsubscribe = y.on('change', (latestY) => {
        // Save the y offset (latestY is transform offset)
        onLastYChange(latestY)
      })
      return unsubscribe
    }
  }, [y, onLastYChange])

  // Load initial position if saved
  useEffect(() => {
    if (lastY !== 0) {
      y.set(lastY)
    }
  }, [y, lastY])

  const wasDragging = useRef<boolean>(false)

  // Handle minimize/restore - use onTap which fires after drag ends if no drag occurred
  const handleTap = () => {
    // Only open if we didn't drag
    if (!wasDragging.current) {
      if (minimized) {
        onMinimizeChange?.(false)
      }
      onClick()
    }
    wasDragging.current = false
  }

  const handleDragStart = () => {
    if (!isTouchDevice) {
      wasDragging.current = false
      setIsDragging(true)
    }
  }

  const handleDrag = () => {
    // If drag actually happened, mark it
    if (!isTouchDevice) {
      wasDragging.current = true
    }
  }

  const handleDragEnd = () => {
    setTimeout(() => {
      setIsDragging(false)
      // Reset after a delay to allow tap to check
      setTimeout(() => {
        wasDragging.current = false
      }, 50)
    }, 50)
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
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      onClick={handleTap}
      className="chatbot-launcher w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent text-bg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent cursor-pointer select-none"
      style={{
        bottom: '32px',
        right: '32px',
        position: 'fixed',
        zIndex: 9999,
        ...(isTouchDevice ? {} : { y }),
      }}
      aria-label={minimized ? 'Restore SOYL voice assistant' : 'Open SOYL voice assistant'}
      title={minimized ? 'Restore voice assistant' : 'Talk to SOYL'}
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
            d="M12 14C13.1 14 14 13.1 14 12V6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6V12C10 13.1 10.9 14 12 14Z"
            fill="currentColor"
          />
          <path
            d="M19 10V12C19 15.9 15.9 19 12 19C8.1 19 5 15.9 5 12V10H7V12C7 14.8 9.2 17 12 17C14.8 17 17 14.8 17 12V10H19Z"
            fill="currentColor"
          />
          <path
            d="M11 22H13V20H11V22Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>
    </motion.button>
  )
}
