'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MCQEngine, FlowJson } from './MCQEngine'
import defaultFlow from './mcq-flows/default-flow.json'
import './ChatbotStyles.css'

interface ChatbotModalProps {
  isOpen: boolean
  onClose: () => void
}

// Focus trap hook
function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    // Focus first element on open
    firstElement?.focus()

    document.addEventListener('keydown', handleTab)
    return () => {
      document.removeEventListener('keydown', handleTab)
    }
  }, [isActive])

  return containerRef
}

export function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const [consent, setConsent] = useState(false)
  const containerRef = useFocusTrap(isOpen)

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Load consent from sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const savedConsent = sessionStorage.getItem('__soyl_chat_consent')
    if (savedConsent === 'true') {
      setConsent(true)
    }
  }, [])

  // Track analytics
  useEffect(() => {
    if (isOpen && consent) {
      // Track chatbot flow start
      if (typeof window !== 'undefined') {
        const trackFn = (window as Window & { __SOYL_TRACK?: (event: string, data: unknown) => void }).__SOYL_TRACK
        if (trackFn) {
          try {
            trackFn('chatbot:flow_start', {
              timestamp: Date.now(),
            })
          } catch (e) {
            // Ignore analytics errors
          }
        }
      }
    }
  }, [isOpen, consent])

  const flow = defaultFlow as FlowJson

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chatbot-title"
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] z-[999] flex flex-col glass rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10">
              <div>
                <h2 id="chatbot-title" className="text-xl md:text-2xl font-bold text-text">
                  SOYL Assistant
                </h2>
                <p className="text-xs md:text-sm text-muted mt-1">
                  Choose an option to get started
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Close chatbot"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-text"
                >
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left decorative area (desktop only) */}
              <div className="hidden md:block w-48 border-r border-white/10 relative overflow-hidden">
                <svg
                  className="absolute inset-0 opacity-20"
                  width="100%"
                  height="100%"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern
                      id="chatbot-dot-pattern"
                      x="0"
                      y="0"
                      width="30"
                      height="30"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#chatbot-dot-pattern)" />
                </svg>
              </div>

              {/* Main content */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto chatbot-modal-focus-trap">
                <MCQEngine
                  flow={flow}
                  consent={consent}
                  onConsentChange={setConsent}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-muted">
                <button
                  onClick={() => {
                    // Show privacy disclosure
                    alert(
                      'We collect non-identifying analytics of your choices with consent. Contact privacy@soyl.ai for deletion requests.'
                    )
                  }}
                  className="hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded px-2 py-1"
                >
                  What we collect
                </button>
                <a
                  href="mailto:sales@soyl.ai?subject=SOYL%20Inquiry"
                  className="hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded px-2 py-1"
                >
                  Prefer human? Contact sales
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

