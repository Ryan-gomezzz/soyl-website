'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles } from 'lucide-react'
import clsx from 'clsx'

const STORAGE_KEY = 'soyl-welcome-modal-dismissed'
const DELAY_MS = 4000 // 4 seconds delay

interface WelcomeModalProps {
  onAccept: () => void
  onDismiss: () => void
}

export function WelcomeModal({ onAccept, onDismiss }: WelcomeModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false)

  useEffect(() => {
    // Check if user has already dismissed the modal
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(STORAGE_KEY)
      setHasCheckedStorage(true)
      
      if (dismissed === 'true') {
        // User has already dismissed, don't show
        return
      }

      // Show modal after delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, DELAY_MS)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    // Don't store preference for "accept" - let them see it again if they want
    setIsVisible(false)
    onAccept()
  }

  const handleDismiss = () => {
    // Store preference to not show again
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'true')
    }
    setIsVisible(false)
    onDismiss()
  }

  // Don't render until we've checked storage
  if (!hasCheckedStorage) {
    return null
  }

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={handleDismiss}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-modal-title"
            aria-describedby="welcome-modal-description"
          >
            <div
              className="relative bg-[var(--panel)]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 text-muted hover:text-white" />
              </button>

              {/* Content */}
              <div className="text-center space-y-6">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.1,
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="flex justify-center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full"></div>
                    <div className="relative bg-gradient-to-br from-accent to-[#0099cc] p-4 rounded-full">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Text */}
                <div className="space-y-3">
                  <h2
                    id="welcome-modal-title"
                    className="text-2xl font-bold text-white"
                  >
                    Welcome to SOYL
                  </h2>
                  <p
                    id="welcome-modal-description"
                    className="text-muted text-sm leading-relaxed"
                  >
                    Would you like help from the SOYL assistant? I can guide you
                    through our website and answer any questions you have about
                    our AI automation solutions.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleDismiss}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    No, thanks
                  </button>
                  <button
                    onClick={handleAccept}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-br from-accent to-[#0099cc] hover:from-accent-2 hover:to-[#0088bb] text-bg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent shadow-lg shadow-accent/20"
                  >
                    Yes, help me
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

