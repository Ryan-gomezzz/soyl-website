'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DotCluster } from '../FeatureGrid/DotCluster'
import type { Node } from './flow-data'

interface FlowNodeProps {
  node: Node
  onHover?: (node: Node | null) => void
  onClick?: (node: Node) => void
}

export function FlowNode({ node, onHover, onClick }: FlowNodeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const reduced = useReducedMotion()

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHover?.(node)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onHover?.(null)
  }

  const handleClick = () => {
    onClick?.(node)
  }

  const sizeClasses = {
    sm: 'w-48 h-24',
    md: 'w-56 h-28',
    lg: 'w-64 h-32',
  }

  return (
    <div className={`relative ${sizeClasses[node.size || 'md']}`}>
      {/* Pulsing glow effect */}
      {!reduced && (
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        aria-labelledby={`${node.id}-title`}
        className="w-full h-full p-4 text-left rounded-lg bg-[var(--panel)]/70 border border-white/10 hover:border-accent/50 hover:bg-[var(--panel)]/90 transition-all focus:outline focus:outline-2 focus:outline-[var(--accent)] focus:outline-offset-2 relative z-10"
        whileHover={reduced ? {} : { scale: 1.05, y: -2 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          hover: { duration: 0.2 },
        }}
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

      {/* Dot cluster on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute -right-6 -top-4 pointer-events-none z-10"
        >
          <DotCluster size={48} />
        </motion.div>
      )}
    </div>
  )
}

