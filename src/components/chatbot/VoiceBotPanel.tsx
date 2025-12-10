'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useChatbotContext } from './ChatbotProvider'
import './ChatbotStyles.css'
import clsx from 'clsx'
import { Mic, MicOff, Volume2, VolumeX, X, Minimize2, Pin, PinOff, Loader2 } from 'lucide-react'

interface VoiceBotPanelProps {
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

    firstElement?.focus()
    document.addEventListener('keydown', handleTab)
    return () => {
      document.removeEventListener('keydown', handleTab)
    }
  }, [isActive])

  return containerRef
}

export function VoiceBotPanel({ requestModalModeForFlow: _requestModalModeForFlow }: VoiceBotPanelProps) {
  const {
    open,
    setOpen,
    pinned,
    setPinned,
    minimized,
    setMinimized,
    prefersModal,
    setPrefersModal,
    conversation,
    recording,
    playback,
  } = useChatbotContext()

  const [isPressing, setIsPressing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useFocusTrap(prefersModal && open)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.messages])

  // Listen for programmatic open/close/toggle events from ChatbotController
  useEffect(() => {
    const handleOpen = () => {
      setOpen(true)
      setMinimized(false)
    }
    const handleClose = () => {
      setOpen(false)
    }
    const handleToggle = () => {
      setOpen((prevOpen) => {
        if (prevOpen) {
          return false
        } else {
          setMinimized(false)
          return true
        }
      })
    }

    window.addEventListener('soyl-chatbot-open', handleOpen)
    window.addEventListener('soyl-chatbot-close', handleClose)
    window.addEventListener('soyl-chatbot-toggle', handleToggle)

    return () => {
      window.removeEventListener('soyl-chatbot-open', handleOpen)
      window.removeEventListener('soyl-chatbot-close', handleClose)
      window.removeEventListener('soyl-chatbot-toggle', handleToggle)
    }
  }, [setOpen, setMinimized])

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Spacebar to record (when not typing in input)
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault()
        if (recording.state === 'idle' && !conversation.isLoading) {
          recording.startRecording()
          setIsPressing(true)
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        if (recording.state === 'recording') {
          recording.stopRecording()
          setIsPressing(false)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [open, recording, conversation.isLoading])

  // Handle ESC key
  useEffect(() => {
    if (!open) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!pinned) {
          setOpen(false)
        } else {
          setMinimized(true)
        }
      }
    }

    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open, pinned, setOpen, setMinimized])

  // Prevent body scroll in modal mode
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

  // Handle navigation (close if not pinned)
  const pathname = usePathname()
  useEffect(() => {
    if (!pinned && open) {
      setOpen(false)
    }
  }, [pathname, pinned, open, setOpen])

  const handleClose = () => {
    if (pinned) {
      setMinimized(true)
      setOpen(false)
    } else {
      setOpen(false)
    }
  }

  // Don't render if minimized
  if (minimized) {
    return null
  }

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleVoiceButtonMouseDown = () => {
    if (recording.state === 'idle' && !conversation.isLoading) {
      recording.startRecording()
      setIsPressing(true)
    }
  }

  const handleVoiceButtonMouseUp = () => {
    if (recording.state === 'recording') {
      recording.stopRecording()
      setIsPressing(false)
    }
  }

  const handleVoiceButtonTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    handleVoiceButtonMouseDown()
  }

  const handleVoiceButtonTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    handleVoiceButtonMouseUp()
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Visual overlay */}
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

      {/* Panel */}
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
        id="soyl-assistant-panel"
        role={prefersModal ? 'dialog' : 'complementary'}
        aria-modal={prefersModal ? 'true' : undefined}
        aria-label="SOYL Voice Assistant panel"
        className={clsx(
          'chat-panel fixed right-4 top-7 z-[70] h-[calc(100vh-3.5rem)] w-[420px] max-w-[calc(100vw-2rem)] bg-[var(--panel)]/90 backdrop-blur-md shadow-2xl rounded-lg border border-white/10 flex flex-col overflow-hidden',
          'max-sm:w-full max-sm:right-0 max-sm:top-0 max-sm:h-full max-sm:rounded-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 flex-shrink-0">
          <div>
            <h2 id="chatbot-title" className="text-xl md:text-2xl font-bold text-text">
              SOYL Voice Assistant
            </h2>
            <p className="text-xs md:text-sm text-muted mt-1">
              Ask me anything about SOYL
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMinimized(true)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Minimize panel"
              title="Minimize"
            >
              <Minimize2 className="w-5 h-5 text-text" />
            </button>
            <button
              onClick={() => setPinned(!pinned)}
              className={clsx(
                'p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent',
                pinned ? 'bg-accent/20 text-accent' : 'hover:bg-white/10 text-text'
              )}
              aria-label={pinned ? 'Unpin panel' : 'Pin panel'}
              title={pinned ? 'Unpin' : 'Pin'}
            >
              {pinned ? <Pin className="w-5 h-5" /> : <PinOff className="w-5 h-5" />}
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Close panel"
            >
              <X className="w-5 h-5 text-text" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 min-h-0">
          {conversation.messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center"
              >
                <Mic className="w-8 h-8 text-accent" />
              </motion.div>
              <p className="text-muted text-sm max-w-xs">
                Press and hold the microphone button to ask me about SOYL&apos;s products, features, or pricing.
              </p>
            </div>
          )}

          <AnimatePresence>
            {conversation.messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={clsx(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={clsx(
                    'max-w-[80%] rounded-lg p-3 space-y-1',
                    message.role === 'user'
                      ? 'bg-accent/20 text-text'
                      : 'glass border border-white/10 text-text'
                  )}
                >
                  {message.transcription && message.role === 'user' && (
                    <p className="text-xs text-muted italic">{message.transcription}</p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <span className="text-xs text-muted">{formatTime(message.timestamp)}</span>
                    {message.role === 'assistant' && message.audioUrl && (
                      <button
                        onClick={() => {
                          if (playback.state === 'playing') {
                            playback.stop()
                          } else {
                            playback.play(message.audioUrl!).catch((err) => {
                              console.error('Failed to play audio:', err)
                              // Audio will still be available as text
                            })
                          }
                        }}
                        className="p-1 rounded hover:bg-white/10 transition-colors disabled:opacity-50"
                        aria-label={playback.state === 'playing' ? 'Stop audio' : 'Play audio response'}
                        disabled={playback.state === 'error'}
                      >
                        {playback.state === 'playing' ? (
                          <VolumeX className="w-4 h-4 text-text" />
                        ) : playback.state === 'error' ? (
                          <Volume2 className="w-4 h-4 text-muted" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-text" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {conversation.isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="glass border border-white/10 rounded-lg p-3 flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Loader2 className="w-4 h-4 text-accent" />
                </motion.div>
                <span className="text-sm text-muted">Processing your request...</span>
              </div>
            </motion.div>
          )}

          {conversation.error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 rounded-lg p-3"
            >
              <p className="text-sm text-red-400">{conversation.error}</p>
            </motion.div>
          )}

          {recording.error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 rounded-lg p-3"
            >
              <p className="text-sm text-red-400">{recording.error}</p>
            </motion.div>
          )}

          {recording.hasPermission === false && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3"
            >
              <p className="text-sm text-yellow-400">
                Microphone permission is required. Please allow microphone access to use the voice assistant.
              </p>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Control Area */}
        <div className="p-4 md:p-6 border-t border-white/10 flex-shrink-0 space-y-4">
          {/* Voice Button */}
          <div className="flex justify-center">
            <motion.button
              onMouseDown={handleVoiceButtonMouseDown}
              onMouseUp={handleVoiceButtonMouseUp}
              onMouseLeave={handleVoiceButtonMouseUp}
              onTouchStart={handleVoiceButtonTouchStart}
              onTouchEnd={handleVoiceButtonTouchEnd}
              disabled={
                recording.state === 'processing' ||
                conversation.isLoading ||
                recording.hasPermission === false
              }
              className={clsx(
                'w-16 h-16 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-accent',
                recording.state === 'recording' || isPressing
                  ? 'bg-red-500 scale-110'
                  : conversation.isLoading || recording.state === 'processing'
                  ? 'bg-muted cursor-not-allowed'
                  : 'bg-accent hover:bg-accent/90 cursor-pointer'
              )}
              aria-label={
                recording.state === 'recording'
                  ? 'Stop recording'
                  : 'Start recording'
              }
            >
              <AnimatePresence mode="wait">
                {recording.state === 'recording' || isPressing ? (
                  <motion.div
                    key="recording"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <MicOff className="w-8 h-8 text-white" />
                  </motion.div>
                ) : conversation.isLoading || recording.state === 'processing' ? (
                  <motion.div
                    key="loading"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="w-8 h-8 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Mic className="w-8 h-8 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Recording indicator */}
          {recording.state === 'recording' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-sm text-muted">Recording... Release to send</p>
            </motion.div>
          )}

          {/* Helper text */}
          <div className="text-center text-xs text-muted space-y-1">
            <p>Press and hold to speak, or press Spacebar</p>
            {conversation.messages.length > 0 && (
              <button
                onClick={conversation.clearConversation}
                className="text-accent hover:underline"
              >
                Clear conversation
              </button>
            )}
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

