'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useChatbotContext } from './ChatbotProvider'
import './ChatbotStyles.css'
import clsx from 'clsx'
import { Mic, Volume2, VolumeX, X, Minimize2, Pin, PinOff, Loader2, Keyboard, Send, Navigation } from 'lucide-react'
import { AudioVisualizer } from './AudioVisualizer'
import { findSectionByQuery } from '@/lib/websiteSections'

interface VoiceBotPanelProps {
  requestModalModeForFlow?: (enable: boolean) => void
  autoPlayAudio?: boolean
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

export function VoiceBotPanel({ requestModalModeForFlow: _requestModalModeForFlow, autoPlayAudio = true }: VoiceBotPanelProps) {
  const {
    open,
    setOpen,
    pinned,
    setPinned,
    minimized,
    setMinimized,
    prefersModal,
    conversation,
    recording,
    playback,
    aiNavigationMode,
    scrollToSectionByQuery,
    isNavigating,
  } = useChatbotContext()

  const [isPressing, setIsPressing] = useState(false)
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice')
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useFocusTrap(prefersModal && open)

  const handleSendText = async () => {
    if (!inputText.trim() || conversation.isLoading) return

    const text = inputText
    setInputText('') // Clear immediately

    try {
      await conversation.sendTextMessage(text)
      // Check if we should navigate to a section
      if (aiNavigationMode) {
        handleNavigationCheck(text)
      }
      // Audio will play automatically via the effect in the main component if processed
    } catch (err) {
      // Error is handled in hook
      setInputText(text) // Restore text on error
    }
  }

  // Check if message contains section-related queries and navigate if needed
  const handleNavigationCheck = async (query: string) => {
    if (!aiNavigationMode || isNavigating) return

    const section = findSectionByQuery(query)
    if (section) {
      try {
        await scrollToSectionByQuery(query, true)
      } catch (error) {
        console.error('Navigation error:', error)
      }
    }
  }

  // Monitor assistant messages for navigation triggers
  useEffect(() => {
    if (!aiNavigationMode || conversation.messages.length === 0) return

    const lastMessage = conversation.messages[conversation.messages.length - 1]
    if (lastMessage.role === 'assistant') {
      // Check if assistant message mentions a section
      handleNavigationCheck(lastMessage.content)
    }
  }, [conversation.messages, aiNavigationMode]) // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.messages])

  // Auto-play latest assistant audio if enabled (only once per message)
  const lastAutoPlayedIdRef = useRef<string | null>(null)
  useEffect(() => {
    if (autoPlayAudio && conversation.messages.length > 0) {
      const lastMsg = conversation.messages[conversation.messages.length - 1]
      // Only auto-play if:
      // 1. It's an assistant message with audio
      // 2. We haven't already auto-played this message
      // 3. Audio is not currently playing or paused
      if (
        lastMsg.role === 'assistant' && 
        lastMsg.audioUrl && 
        lastMsg.id !== lastAutoPlayedIdRef.current &&
        playback.state !== 'playing' &&
        playback.state !== 'paused'
      ) {
        lastAutoPlayedIdRef.current = lastMsg.id
        playback.play(lastMsg.audioUrl).catch(err => console.log('Auto-play blocked or failed:', err))
      }
    }
    // Only depend on messages and playback state, not the play function itself
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.messages, autoPlayAudio, playback.state])

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
              'chat-overlay fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm',
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
          'chat-panel fixed right-4 top-20 z-[70] h-[calc(100vh-6rem)] w-[420px] max-w-[calc(100vw-2rem)] bg-[var(--panel)]/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/10 flex flex-col overflow-hidden',
          'max-sm:w-full max-sm:right-0 max-sm:top-0 max-sm:h-full max-sm:rounded-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 flex-shrink-0 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <Mic className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h2 id="chatbot-title" className="text-lg font-bold text-white">
                SOYL Assistant
              </h2>
              <p className="text-xs text-muted flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(true)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Minimize panel"
              title="Minimize"
            >
              <Minimize2 className="w-4 h-4 text-muted hover:text-white" />
            </button>
            <button
              onClick={() => setPinned(!pinned)}
              className={clsx(
                'p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent',
                pinned ? 'bg-accent/20 text-accent' : 'hover:bg-white/10 text-muted hover:text-white'
              )}
              aria-label={pinned ? 'Unpin panel' : 'Pin panel'}
              title={pinned ? 'Unpin' : 'Pin'}
            >
              {pinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Close panel"
            >
              <X className="w-4 h-4 text-muted hover:text-white" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 px-6 space-y-6 min-h-0 custom-scrollbar">
          {conversation.messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-80">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full"></div>
                <Mic className="relative w-12 h-12 text-accent" />
              </div>
              <p className="text-muted text-sm max-w-[250px] leading-relaxed">
                Hi! I&apos;m your AI sales assistant. Hold the mic to ask how SOYL helps, pricing, or to request a pilot.
              </p>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {conversation.messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, type: "spring" }}
                className={clsx(
                  'flex w-full',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={clsx(
                    'max-w-[85%] rounded-2xl p-4 shadow-sm relative',
                    message.role === 'user'
                      ? 'bg-accent text-bg rounded-br-none'
                      : 'bg-white/10 backdrop-blur-md border border-white/5 text-text rounded-bl-none'
                  )}
                >
                  {message.transcription && message.role === 'user' && (
                    <p className="text-xs text-bg/70 italic mb-1">{message.transcription}</p>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>

                  {/* Audio Controls */}
                  <div className="flex items-center justify-between gap-3 mt-3 pt-2 border-t border-black/5 dark:border-white/5">
                    <span className={clsx("text-[10px]", message.role === 'user' ? "text-bg/60" : "text-muted")}>
                      {formatTime(message.timestamp)}
                    </span>
                    {message.role === 'assistant' && message.audioUrl && (
                      <div className="flex items-center gap-2">
                        {playback.state === 'playing' ? (
                          <AudioVisualizer isActive={true} mode="speaking" barCount={5} />
                        ) : null}
                        <button
                          onClick={() => {
                            if (playback.state === 'playing') {
                              playback.stop()
                            } else {
                              playback.play(message.audioUrl!).catch((err) => {
                                console.error('Failed to play audio:', err)
                              })
                            }
                          }}
                          className="p-1.5 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                          aria-label={playback.state === 'playing' ? 'Stop audio' : 'Play audio response'}
                          disabled={playback.state === 'error'}
                        >
                          {playback.state === 'playing' ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
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
              className="flex justify-start w-full"
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none p-4 flex items-center gap-3">
                <AudioVisualizer isActive={true} mode="processing" barCount={6} />
                <span className="text-xs text-muted font-medium">Thinking...</span>
              </div>
            </motion.div>
          )}

          {conversation.error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mx-auto w-full"
            >
              <p className="text-xs text-red-400 text-center">{conversation.error}</p>
            </motion.div>
          )}

          {recording.error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mx-auto w-full"
            >
              <p className="text-xs text-red-400 text-center">{recording.error}</p>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice Control Area */}
        <div className="p-6 border-t border-white/10 bg-[var(--panel)]/50 backdrop-blur-md relative z-10">
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Dynamic Status Text */}
            <div className="h-6 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isNavigating ? (
                  <motion.div
                    key="navigating"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-2"
                  >
                    <Navigation className="w-4 h-4 text-accent animate-pulse" />
                    <span className="text-sm text-accent font-medium">Navigating to section...</span>
                  </motion.div>
                ) : recording.hasPermission === false ? (
                  <motion.p
                    key="perm"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm text-red-300"
                  >
                    Microphone blocked. Please enable mic access to use voice.
                  </motion.p>
                ) : recording.state === 'recording' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-medium text-white">Listening...</span>
                  </motion.div>
                ) : conversation.isLoading ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted"
                  >
                    Processing logic...
                  </motion.p>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted"
                  >
                    Hold to speak • Tap Spacebar • Or switch to keyboard
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Main Interactive Control */}
            {inputMode === 'voice' ? (
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={clsx(
                  'relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl focus:outline-none ring-offset-4 ring-offset-[var(--panel)] focus:ring-2 focus:ring-accent',
                  recording.state === 'recording' || isPressing
                    ? 'bg-red-500 ring-4 ring-red-500/30'
                    : conversation.isLoading
                      ? 'bg-white/10 cursor-not-allowed'
                      : 'bg-gradient-to-br from-accent to-[#0099cc] hover:shadow-accent/40'
                )}
                aria-label={
                  recording.state === 'recording'
                    ? 'Stop recording'
                    : 'Start recording'
                }
              >
                {/* Outer Glow Ring */}
                {(recording.state === 'recording' || isPressing) && (
                  <motion.div
                    layoutId="recording-glow"
                    className="absolute inset-0 rounded-full border-2 border-red-500 opacity-50"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                <AnimatePresence mode="wait">
                  {recording.state === 'recording' || isPressing ? (
                    <motion.div
                      key="recording"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <AudioVisualizer isActive={true} mode="listening" barCount={4} />
                    </motion.div>
                  ) : conversation.isLoading || recording.state === 'processing' ? (
                    <motion.div
                      key="loading"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-8 h-8 text-white/50" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <Mic className="w-8 h-8 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ) : (
              <div className="w-full flex gap-2 items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
                  placeholder="Type your message..."
                  className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-muted/50"
                  disabled={conversation.isLoading}
                  autoFocus
                />
                <button
                  onClick={handleSendText}
                  disabled={!inputText.trim() || conversation.isLoading}
                  className="p-3 bg-accent text-bg rounded-xl hover:bg-accent-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {conversation.isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}

            {/* Mode Toggle */}
            <button
              onClick={() => setInputMode(prev => prev === 'voice' ? 'text' : 'voice')}
              className="absolute right-4 bottom-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted hover:text-white transition-colors"
              title={inputMode === 'voice' ? "Switch to keyboard" : "Switch to voice"}
            >
              {inputMode === 'voice' ? <Keyboard className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Clear Chat Option */}
            {conversation.messages.length > 0 && (
              <button
                onClick={conversation.clearConversation}
                className="text-xs text-muted/50 hover:text-red-400 transition-colors mt-2"
              >
                Clear conversation history
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  )
}

