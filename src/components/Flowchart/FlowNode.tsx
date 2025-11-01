'use client'

import { useState, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DotCluster } from '../FeatureGrid/DotCluster'
import { FlowNodePopup } from './FlowNodePopup'
import type { Node } from './flow-data'

interface FlowNodeProps {
  node: Node
  onHover?: (node: Node | null) => void
  onClick?: (node: Node) => void
}

export function FlowNode({ node, onHover, onClick }: FlowNodeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const nodeRef = useRef<HTMLButtonElement>(null)
  const touchRef = useRef(false)
  const reduced = useReducedMotion()

  // Check pointer type
  const isTouchDevice = 
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(pointer: coarse)').matches

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsHovered(true)
      setPopupOpen(true)
      onHover?.(node)
    }
  }

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setIsHovered(false)
      setPopupOpen(false)
      onHover?.(null)
    }
  }

  const handleFocus = () => {
    setIsHovered(true)
    setPopupOpen(true)
    onHover?.(node)
  }

  const handleBlur = () => {
    // Delay to allow clicking popup links
    setTimeout(() => {
      if (!nodeRef.current?.matches(':focus-within')) {
        setIsHovered(false)
        setPopupOpen(false)
        onHover?.(null)
      }
    }, 100)
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isTouchDevice) {
      // On touch devices, toggle popup on tap
      e.stopPropagation()
      e.preventDefault()
      setPopupOpen((prev) => {
        const newState = !prev
        if (newState) {
          onHover?.(node)
        } else {
          onHover?.(null)
        }
        return newState
      })
      touchRef.current = true
    } else {
      // Desktop: click opens full details (existing behavior)
      onClick?.(node)
      // Dispatch event for side panel if needed
      window.dispatchEvent(
        new CustomEvent('soyl-flownode-open', { detail: { id: node.id } })
      )
    }
  }

  const sizeClasses = {
    sm: 'w-48 h-24',
    md: 'w-56 h-28',
    lg: 'w-64 h-32',
  }

  return (
    <div className={`relative ${sizeClasses[node.size || 'md']}`}>
      {/* Pulsing glow effect - only on hover */}
      {isHovered && !reduced && (
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-lg bg-accent/10 blur-xl -z-10"
        />
      )}

      <motion.button
        ref={nodeRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={popupOpen}
        aria-labelledby={`${node.id}-title`}
        className="w-full h-full p-4 text-left rounded-lg bg-[var(--panel)]/70 border border-white/10 hover:border-accent/50 hover:bg-[var(--panel)]/90 transition-all focus:outline focus:outline-2 focus:outline-[var(--accent)] focus:outline-offset-2 relative z-10"
        whileHover={reduced ? {} : { scale: 1.05, y: -2 }}
        initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
        animate={reduced ? {} : { opacity: 1, scale: 1 }}
        transition={
          reduced
            ? {}
            : {
                duration: 0.5,
                delay: 0.2,
                hover: { duration: 0.2 },
              }
        }
      >
        <div className="flex items-start justify-between h-full">
          <div className="flex-1 min-w-0">
            <div id={`${node.id}-title`} className="text-white font-semibold text-sm mb-1 truncate">
              {node.title}
            </div>
            {node.subtitle && (
              <div className="text-[var(--muted)] text-xs mb-2 truncate">{node.subtitle}</div>
            )}
            {node.cta && (
              <div className="mt-2">
                <span className="text-[var(--accent)] text-xs font-medium">{node.cta.label} →</span>
              </div>
            )}
          </div>
          {node.meta?.phase && (
            <div className="ml-2 flex-shrink-0">
              <span className="px-2 py-1 text-xs bg-accent/20 text-accent rounded">
                {node.meta.phase}
              </span>
            </div>
          )}
        </div>
      </motion.button>

      {/* Dot cluster on hover - only show when hovered/focused */}
      {isHovered && (
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0 }}
          animate={reduced ? {} : { opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={reduced ? {} : { duration: 0.2 }}
          className="absolute -right-6 -top-4 pointer-events-none z-10"
        >
          <DotCluster size={48} />
        </motion.div>
      )}

      {/* Popup */}
      {popupOpen && (
        <FlowNodePopup node={node} anchorRef={nodeRef} onClose={() => setPopupOpen(false)} />
      )}
    </div>
  )
}

