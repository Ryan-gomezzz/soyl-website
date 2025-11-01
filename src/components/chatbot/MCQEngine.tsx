'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSessionId } from './hooks/useSessionId'
import './ChatbotStyles.css'

export interface FlowJson {
  id: string
  meta: {
    title: string
    version: string
    createdBy?: string
  }
  startNode: string
  nodes: {
    [key: string]: FlowNode
  }
}

export interface FlowNode {
  type: 'question' | 'info' | 'end'
  text: string
  choices?: FlowChoice[]
  actions?: FlowAction[]
}

export interface FlowChoice {
  id: string
  text: string
  next: string
}

export interface FlowAction {
  type: 'mailto' | 'cta' | 'link' | 'feedback'
  value?: string
  href?: string
  label?: string
  subject?: string
}

interface MCQEngineProps {
  flow: FlowJson
  consent: boolean
  onConsentChange: (consent: boolean) => void
  requestModalModeForFlow?: (enable: boolean) => void
}

interface ConversationHistory {
  nodeId: string
  choiceId?: string
  timestamp: number
}

const SESSION_STORAGE_KEY = '__soyl_chat_history'
const CONSENT_KEY = '__soyl_chat_consent'

// Debounced logging
let logTimeout: NodeJS.Timeout | null = null
const LOG_DEBOUNCE_MS = 250

async function sendClientLog(data: {
  sessionId: string
  nodeId: string
  choiceId?: string
  text?: string
  timestamp: number
  consent: boolean
  redacted?: boolean
}) {
  if (logTimeout) {
    clearTimeout(logTimeout)
  }

  logTimeout = setTimeout(async () => {
    try {
      await fetch('/api/chatbot/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    } catch (error) {
      // Silently fail - logging is non-critical
      console.error('Failed to log chatbot interaction:', error)
    }
  }, LOG_DEBOUNCE_MS)
}

export function MCQEngine({ flow, consent, onConsentChange, requestModalModeForFlow }: MCQEngineProps) {
  const sessionId = useSessionId()
  const [currentNodeId, setCurrentNodeId] = useState<string>(flow.startNode)
  const [history, setHistory] = useState<ConversationHistory[]>([])
  const [conversation, setConversation] = useState<
    Array<{ type: 'bot' | 'user'; text: string; timestamp: number }>
  >([])
  const [feedbackData, setFeedbackData] = useState<{
    email: string
    company: string
    message: string
  }>({ email: '', company: '', message: '' })
  const [showPIIWarning, setShowPIIWarning] = useState(false)
  const [piiDetected, setPiiDetected] = useState(false)

  const getChoiceText = useCallback((nodeId: string, choiceId?: string): string => {
    const node = flow.nodes[nodeId]
    if (!choiceId || !node?.choices) return ''
    const choice = node.choices.find((c) => c.id === choiceId)
    return choice?.text || ''
  }, [flow.nodes])

  // Load session state on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedHistory = sessionStorage.getItem(SESSION_STORAGE_KEY)
    const savedConsent = sessionStorage.getItem(CONSENT_KEY)
    const savedNode = sessionStorage.getItem('__soyl_chat_current_node')

    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setHistory(parsed)
        setConversation(
          parsed.map((h: ConversationHistory) => ({
            type: 'user' as const,
            text: `Selected: ${getChoiceText(h.nodeId, h.choiceId)}`,
            timestamp: h.timestamp,
          }))
        )
      } catch (e) {
        // Ignore parse errors
      }
    }

    if (savedConsent === 'true') {
      onConsentChange(true)
    }

    if (savedNode && flow.nodes[savedNode]) {
      setCurrentNodeId(savedNode)
    }
  }, [flow, onConsentChange, getChoiceText])

  // Save state to sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(history))
    sessionStorage.setItem('__soyl_chat_current_node', currentNodeId)
  }, [history, currentNodeId])

  const handleChoice = useCallback(
    (choice: FlowChoice) => {
      if (!consent) {
        return // Should not happen, but safety check
      }

      const currentNode = flow.nodes[currentNodeId]
      if (!currentNode) return

      const newHistory: ConversationHistory = {
        nodeId: currentNodeId,
        choiceId: choice.id,
        timestamp: Date.now(),
      }

      // Add to conversation
      const botText = currentNode.text
      const userText = `Selected: ${choice.text}`

      setConversation((prev) => [
        ...prev,
        { type: 'bot', text: botText, timestamp: Date.now() },
        { type: 'user', text: userText, timestamp: Date.now() },
      ])

      // Update history
      setHistory((prev) => [...prev, newHistory])

      // Log interaction
      sendClientLog({
        sessionId,
        nodeId: currentNodeId,
        choiceId: choice.id,
        timestamp: Date.now(),
        consent: true,
      })

      // Navigate to next node
      if (choice.next && flow.nodes[choice.next]) {
        setCurrentNodeId(choice.next)
      } else {
        // Fallback to error node
        setCurrentNodeId('n_error_fallback')
      }
    },
    [currentNodeId, flow, consent, sessionId]
  )

  const handleBack = useCallback(() => {
    if (history.length === 0) return

    const prevHistory = [...history]
    prevHistory.pop()
    setHistory(prevHistory)

    if (prevHistory.length > 0) {
      const lastEntry = prevHistory[prevHistory.length - 1]
      setCurrentNodeId(lastEntry.nodeId)
    } else {
      setCurrentNodeId(flow.startNode)
    }

    // Update conversation
    setConversation((prev) => prev.slice(0, -2))
  }, [history, flow.startNode])

  const handleRestart = useCallback(() => {
    setHistory([])
    setConversation([])
    setCurrentNodeId(flow.startNode)
    setFeedbackData({ email: '', company: '', message: '' })
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_STORAGE_KEY)
      sessionStorage.removeItem('__soyl_chat_current_node')
    }
  }, [flow.startNode])

  const detectPII = (text: string): boolean => {
    // Simple PII detection: email and phone patterns
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|\b\+?\d{10,15}\b/g
    return emailPattern.test(text) || phonePattern.test(text)
  }

  const redactPII = (text: string): string => {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|\b\+?\d{10,15}\b/g
    return text
      .replace(emailPattern, '[EMAIL REDACTED]')
      .replace(phonePattern, '[PHONE REDACTED]')
  }

  const handleFeedbackChange = (field: 'email' | 'company' | 'message', value: string) => {
    setFeedbackData((prev) => ({ ...prev, [field]: value }))

    // Check for PII in message field
    if (field === 'message' && value) {
      const hasPII = detectPII(value)
      setPiiDetected(hasPII)
      if (hasPII) {
        setShowPIIWarning(true)
      }
    }
  }

  const handleFeedbackSubmit = async () => {
    let finalMessage = feedbackData.message
    let wasRedacted = false

    if (piiDetected && showPIIWarning) {
      // Redact PII before sending
      finalMessage = redactPII(feedbackData.message)
      wasRedacted = true
    }

    // Log feedback
    await sendClientLog({
      sessionId,
      nodeId: currentNodeId,
      text: finalMessage,
      timestamp: Date.now(),
      consent: true,
      redacted: wasRedacted,
    })

    // Show thanks node if it exists, otherwise show end message
    setFeedbackData({ email: '', company: '', message: '' })
    setShowPIIWarning(false)
    setPiiDetected(false)
    if (flow.nodes['n_feedback_thanks']) {
      setCurrentNodeId('n_feedback_thanks')
    }
  }

  // Expose requestModalModeForFlow API via window for flows to call
  useEffect(() => {
    if (typeof window === 'undefined' || !requestModalModeForFlow) return

    ;(window as Window & { __SOYL_CHAT_REQUEST_MODAL?: (enable: boolean) => void }).__SOYL_CHAT_REQUEST_MODAL = requestModalModeForFlow

    return () => {
      delete (window as Window & { __SOYL_CHAT_REQUEST_MODAL?: (enable: boolean) => void }).__SOYL_CHAT_REQUEST_MODAL
    }
  }, [requestModalModeForFlow])

  const currentNode = flow.nodes[currentNodeId]
  
  // Check if we're on the feedback node (must be before early return)
  const hasFeedbackAction = currentNode?.actions?.some((a) => a.type === 'feedback')
  const isFeedbackNode = currentNodeId === 'n_pilot_contact' || hasFeedbackAction

  // Optionally enable modal mode for feedback nodes (if needed)
  useEffect(() => {
    if (requestModalModeForFlow && isFeedbackNode) {
      // Enable modal mode for feedback nodes to ensure form completion
      requestModalModeForFlow(true)
      // Disable when leaving feedback node
      return () => {
        requestModalModeForFlow(false)
      }
    }
  }, [isFeedbackNode, requestModalModeForFlow])

  if (!currentNode) {
    return (
      <div className="text-center p-8">
        <p className="text-muted">Error: Invalid node. Please restart.</p>
        <button
          onClick={handleRestart}
          className="mt-4 px-4 py-2 bg-accent text-bg rounded-lg hover:bg-accent/90 transition-colors"
        >
          Restart
        </button>
      </div>
    )
  }

  const isEndNode = currentNode.type === 'end'

  return (
    <div className="flex flex-col h-full">
      {/* Consent checkbox - show before first interaction */}
      {!consent && history.length === 0 && (
        <div className="mb-6 p-4 glass rounded-lg border border-white/10">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                onConsentChange(e.target.checked)
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem(CONSENT_KEY, String(e.target.checked))
                }
              }}
              className="mt-1 w-4 h-4 text-accent rounded focus:ring-accent"
            />
            <span className="text-sm text-text">
              I consent to non-identifying analytics of my choices
            </span>
          </label>
        </div>
      )}

      {/* Conversation history */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        <AnimatePresence>
          {conversation.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.type === 'user'
                    ? 'bg-accent/20 text-text'
                    : 'glass border border-white/10 text-text'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Current node content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start"
        >
          <div className="max-w-[80%] p-3 rounded-lg glass border border-white/10 text-text">
            <p className="text-sm whitespace-pre-wrap">{currentNode.text}</p>
          </div>
        </motion.div>
      </div>

      {/* Feedback form */}
      {isFeedbackNode && hasFeedbackAction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 space-y-4"
        >
          <div className="glass rounded-lg p-4 border border-white/10">
            <h3 className="text-sm font-semibold mb-3">Contact Information (Optional)</h3>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email (optional)"
                value={feedbackData.email}
                onChange={(e) => handleFeedbackChange('email', e.target.value)}
                className="w-full px-3 py-2 bg-panel border border-white/10 rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <input
                type="text"
                placeholder="Company (optional)"
                value={feedbackData.company}
                onChange={(e) => handleFeedbackChange('company', e.target.value)}
                className="w-full px-3 py-2 bg-panel border border-white/10 rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <textarea
                placeholder="Message (optional)"
                value={feedbackData.message}
                onChange={(e) => handleFeedbackChange('message', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-panel border border-white/10 rounded-lg text-text text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>
            {showPIIWarning && piiDetected && (
              <div className="mt-3 p-3 pii-warning rounded text-sm text-text">
                <p className="font-semibold mb-1">⚠️ PII Detected</p>
                <p className="text-xs text-muted">
                  We detected personal information (email/phone) in your message. This will be
                  redacted before sending. Do you want to continue?
                </p>
                <div className="mt-2 p-2 bg-panel rounded text-xs pii-redacted">
                  {redactPII(feedbackData.message)}
                </div>
              </div>
            )}
            <button
              onClick={handleFeedbackSubmit}
              className="mt-3 w-full px-4 py-2 bg-accent text-bg rounded-lg hover:bg-accent/90 transition-colors font-medium"
            >
              Send
            </button>
          </div>
        </motion.div>
      )}

      {/* Action buttons for end nodes */}
      {isEndNode && currentNode.actions && currentNode.actions.length > 0 && (
        <div className="mb-4 space-y-2">
          {currentNode.actions.map((action, idx) => {
            if (action.type === 'mailto') {
              return (
                <a
                  key={idx}
                  href={`mailto:${action.value}${action.subject ? `?subject=${encodeURIComponent(action.subject)}` : ''}`}
                  className="block w-full px-4 py-2 bg-accent text-bg rounded-lg hover:bg-accent/90 transition-colors text-center font-medium text-sm"
                >
                  {action.label || `Email ${action.value}`}
                </a>
              )
            }
            if (action.type === 'cta') {
              return (
                <a
                  key={idx}
                  href={action.href || action.value || '#'}
                  className="block w-full px-4 py-2 bg-transparent border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors text-center font-medium text-sm"
                >
                  {action.label || 'Continue'}
                </a>
              )
            }
            if (action.type === 'link') {
              return (
                <a
                  key={idx}
                  href={action.value || '#'}
                  className="block w-full px-4 py-2 bg-transparent border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors text-center font-medium text-sm"
                >
                  {action.label || 'Open Link'}
                </a>
              )
            }
            return null
          })}
        </div>
      )}

      {/* Choices - show even for end nodes if they have choices (like n_feedback_thanks) */}
      {currentNode.choices && currentNode.choices.length > 0 && (
        <div className="space-y-2">
          {currentNode.choices.map((choice, idx) => (
            <motion.button
              key={choice.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              disabled={!consent}
              onClick={() => handleChoice(choice)}
              className="w-full px-4 py-3 glass border border-white/10 rounded-lg text-left text-sm text-text hover:border-accent/30 hover:bg-accent/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {choice.text}
            </motion.button>
          ))}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
        {history.length > 0 && (
          <button
            onClick={handleBack}
            className="flex-1 px-3 py-2 bg-transparent border border-white/10 text-text rounded-lg hover:border-accent/30 transition-colors text-sm"
          >
            ← Back
          </button>
        )}
        <button
          onClick={handleRestart}
          className="flex-1 px-3 py-2 bg-transparent border border-white/10 text-text rounded-lg hover:border-accent/30 transition-colors text-sm"
        >
          ↻ Restart
        </button>
      </div>
    </div>
  )
}

