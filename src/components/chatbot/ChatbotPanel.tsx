'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { MCQEngine, FlowJson } from './MCQEngine'
import { useChatbotState } from './hooks/useChatbotState'
import defaultFlow from './mcq-flows/default-flow.json'
import './ChatbotStyles.css'
import clsx from 'clsx'

interface ChatbotPanelProps {
  flow?: FlowJson
  requestModalModeForFlow?: (enable: boolean) => void
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

export function ChatbotPanel({ flow: flowProp, requestModalModeForFlow }: ChatbotPanelProps) {
  const flow = (flowProp || defaultFlow) as FlowJson
  const {
    open,
    setOpen,
    pinned,
    setPinned,
    minimized,
    setMinimized,
    prefersModal,
    setPrefersModal,
    requestModalModeForFlow: requestModalMode,
  } = useChatbotState()
  const [consent, setConsent] = useState(false)

  const containerRef = useFocusTrap(prefersModal && open)

  // Expose requestModalModeForFlow API to parent
  useEffect(() => {
    if (requestModalModeForFlow) {
      // Store the parent's callback if provided
      ;(window as Window & { __SOYL_CHAT_REQUEST_MODAL?: (enable: boolean) => void }).__SOYL_CHAT_REQUEST_MODAL = requestModalModeForFlow
    }
  }, [requestModalModeForFlow])

  // Handle ESC key - close if not pinned, minimize if pinned
  useEffect(() => {
    if (!open) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!pinned) {
          setOpen(false)
        } else {
          // If pinned, minimize instead of closing
          setMinimized(true)
        }
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open, pinned, setOpen, setMinimized])

  // Prevent body scroll only in modal mode
  useEffect(() => {
    if (open && prefersModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open, prefersModal])

  // Load consent from sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const savedConsent = sessionStorage.getItem('__soyl_chat_consent')
    if (savedConsent === 'true') {
      setConsent(true)
    }
  }, [setConsent])

  // Track analytics
  useEffect(() => {
    if (open && consent) {
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
  }, [open, consent])

  // Handle navigation (close if not pinned) - using Next.js pathname
  const pathname = usePathname()
  useEffect(() => {
    if (!pinned && open) {
      setOpen(false)
    }
  }, [pathname, pinned, open, setOpen])

  const handleClose = () => {
    if (pinned) {
      setMinimized(true)
    } else {
      setOpen(false)
    }
  }

  // Don't render if minimized (when minimized, panel completely hidden)
  if (minimized) {
    return null
  }

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <>
      {/* Visual overlay (non-blocking by default, blocking in modal mode) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            aria-hidden={!open}
            className={clsx(
              'chat-overlay fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm',
              prefersModal ? 'pointer-events-auto' : 'pointer-events-none'
            )}
            onClick={prefersModal ? handleClose : undefined}
          />
        )}
      </AnimatePresence>

      {/* Panel - always render for animations, but slide off-screen when closed */}
      <motion.aside
        ref={containerRef}
        initial={false}
        animate={{
          x: open ? 0 : '100%',
          opacity: open ? 1 : 0,
        }}
        style={{
          pointerEvents: open ? 'auto' : 'none',
        }}
        transition={{
          type: prefersReducedMotion ? 'tween' : 'spring',
          stiffness: prefersReducedMotion ? 0 : 300,
          damping: prefersReducedMotion ? 0 : 30,
          duration: prefersReducedMotion ? 0.3 : undefined,
        }}
        role={prefersModal ? 'dialog' : 'complementary'}
        aria-modal={prefersModal ? 'true' : undefined}
        aria-label="SOYL Assistant panel"
        className={clsx(
          'chat-panel fixed right-4 top-7 z-[70] h-[calc(100vh-3.5rem)] w-[420px] max-w-[calc(100vw-2rem)] bg-[var(--panel)]/90 backdrop-blur-md shadow-2xl rounded-lg border border-white/10 flex flex-col overflow-hidden',
          'max-sm:w-full max-sm:right-0 max-sm:top-0 max-sm:h-full max-sm:rounded-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 flex-shrink-0">
          <div>
            <h2 id="chatbot-title" className="text-xl md:text-2xl font-bold text-text">
              SOYL Assistant
            </h2>
            <p className="text-xs md:text-sm text-muted mt-1">
              Choose an option to get started
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Minimize button */}
            <button
              onClick={() => setMinimized(true)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Minimize panel"
              title="Minimize"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-text"
              >
                <path d="M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            {/* Pin button */}
            <button
              onClick={() => setPinned(!pinned)}
              className={clsx(
                'p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent',
                pinned ? 'bg-accent/20 text-accent' : 'hover:bg-white/10 text-text'
              )}
              aria-label={pinned ? 'Unpin panel' : 'Pin panel'}
              title={pinned ? 'Unpin' : 'Pin'}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
              >
                {pinned ? (
                  <path
                    d="M10 3L10 12M10 12L7 9M10 12L13 9M5 10L15 10M5 10L8 7M5 10L8 13M15 10L12 7M15 10L12 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M10 3L10 12M10 12L7 9M10 12L13 9M5 10L15 10M5 10L8 7M5 10L8 13M15 10L12 7M15 10L12 13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="2 2"
                  />
                )}
              </svg>
            </button>
            {/* Close button */}
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Close panel"
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
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Main content */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto chatbot-modal-focus-trap">
            <MCQEngine
              flow={flow}
              consent={consent}
              onConsentChange={setConsent}
              requestModalModeForFlow={requestModalMode}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between text-xs text-muted mb-3">
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
          {/* Modal mode toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={prefersModal}
              onChange={(e) => setPrefersModal(e.target.checked)}
              className="w-3 h-3 text-accent rounded focus:ring-accent"
            />
            <span className="text-muted">Modal Assist Mode (trap keyboard focus)</span>
          </label>
        </div>
      </motion.aside>
    </>
  )
}

