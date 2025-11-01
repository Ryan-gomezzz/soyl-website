'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Node } from './flow-data'

interface FlowNodePopupProps {
  node: Node
  anchorRef: React.RefObject<HTMLElement>
  onClose: () => void
}

export function FlowNodePopup({ node, anchorRef, onClose }: FlowNodePopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0, side: 'bottom' as 'bottom' | 'top' | 'left' | 'right' })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!anchorRef.current || !popupRef.current) return

    const anchor = anchorRef.current.getBoundingClientRect()
    const popup = popupRef.current.getBoundingClientRect()
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    // Default to bottom
    let top = anchor.bottom + 8
    let left = anchor.left + anchor.width / 2 - popup.width / 2
    let side: 'bottom' | 'top' | 'left' | 'right' = 'bottom'

    // Check if popup would overflow viewport
    if (top + popup.height > viewport.height - 20) {
      // Show above
      top = anchor.top - popup.height - 8
      side = 'top'
    }

    // Horizontal adjustments
    if (left < 20) {
      left = 20
    } else if (left + popup.width > viewport.width - 20) {
      left = viewport.width - popup.width - 20
    }

    // If node is on the right side (x > 0.8), prefer showing popup to left
    if (anchor.left > viewport.width * 0.8 && popup.width < anchor.left) {
      left = anchor.right - popup.width
      side = 'left'
    }

    // If node is on the left side (x < 0.2), prefer showing popup to right
    if (anchor.left < viewport.width * 0.2 && anchor.right + popup.width < viewport.width - 20) {
      left = anchor.left
      side = 'right'
    }

    setPosition({ top, left, side })
  }, [anchorRef])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        anchorRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [anchorRef, onClose])

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const transition = reduced
    ? { duration: 0 }
    : {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      }

  return (
    <motion.div
      ref={popupRef}
      role="tooltip"
      aria-label={`${node.title} details`}
      initial={{ opacity: 0, scale: 0.95, y: reduced ? 0 : 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: reduced ? 0 : 5 }}
      transition={transition}
      className="fixed z-50 bg-[var(--panel)]/95 backdrop-blur-md border border-white/20 rounded-lg p-4 max-w-xs shadow-xl pointer-events-auto"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <h4 className="text-white font-semibold text-sm mb-1">{node.title}</h4>
      {node.subtitle && (
        <p className="text-[var(--muted)] text-xs mb-2">{node.subtitle}</p>
      )}
      {node.description && (
        <p className="text-[var(--muted)] text-xs leading-relaxed mb-3 line-clamp-2">
          {node.description}
        </p>
      )}
      {node.cta?.href && (
        <a
          href={node.cta.href}
          className="inline-flex items-center text-[var(--accent)] text-xs font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[var(--panel)] rounded"
          onClick={(e) => {
            if (node.cta?.action === 'pilot' || node.cta?.action === 'contact') {
              // Let default behavior handle mailto
              return
            }
            e.stopPropagation()
          }}
        >
          {node.cta.label} →
        </a>
      )}
    </motion.div>
  )
}

