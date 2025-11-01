'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { flow } from './flow-data'
import { FlowNode } from './FlowNode'
import { FlowEdge } from './FlowEdge'

interface FlowchartCanvasProps {
  onNodeClick?: (node: typeof flow.nodes[0]) => void
}

export function FlowchartCanvas({ onNodeClick }: FlowchartCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 1200, h: 700 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<typeof flow.nodes[0] | null>(null)

  useEffect(() => {
    function measure() {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setSize({ w: rect.width, h: rect.height })
      }
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const handleNodeHover = (node: typeof flow.nodes[0] | null) => {
    setHoveredNode(node?.id || null)
    setTooltip(node || null)
  }

  const handleNodeClick = (node: typeof flow.nodes[0]) => {
    if (node.cta?.href) {
      if (node.cta.action === 'pilot' || node.cta.action === 'contact') {
        window.location.href = node.cta.href
      } else {
        window.location.href = node.cta.href
      }
    }
    onNodeClick?.(node)
  }

  return (
    <div ref={canvasRef} className="relative w-full h-[520px] md:h-[640px] overflow-hidden">
      <svg width={size.w} height={size.h} className="absolute inset-0">
        <defs>
          {/* Arrow marker */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 10 5, 0 10" fill="var(--accent)" opacity="0.5" />
          </marker>

          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Render edges */}
        {flow.edges.map((edge, i) => (
          <FlowEdge
            key={`${edge.from}-${edge.to}-${i}`}
            edge={edge}
            nodes={flow.nodes}
            canvas={size}
            highlighted={edge.from === hoveredNode || edge.to === hoveredNode}
          />
        ))}

        {/* Render nodes */}
        {flow.nodes.map((node) => {
          const nodeX = node.x * size.w - (node.size === 'lg' ? 128 : node.size === 'sm' ? 96 : 112)
          const nodeY = node.y * size.h - (node.size === 'lg' ? 48 : node.size === 'sm' ? 32 : 40)

          return (
            <foreignObject
              key={node.id}
              x={nodeX}
              y={nodeY}
              width={node.size === 'lg' ? 256 : node.size === 'sm' ? 192 : 224}
              height={node.size === 'lg' ? 64 : node.size === 'sm' ? 48 : 56}
            >
              <FlowNode node={node} onHover={handleNodeHover} onClick={handleNodeClick} />
            </foreignObject>
          )
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[var(--panel)]/90 backdrop-blur-md border border-white/10 rounded-lg p-4 max-w-md z-20 pointer-events-none"
        >
          <h4 className="text-white font-semibold text-sm mb-1">{tooltip.title}</h4>
          {tooltip.subtitle && (
            <p className="text-[var(--muted)] text-xs mb-2">{tooltip.subtitle}</p>
          )}
          {tooltip.description && (
            <p className="text-[var(--muted)] text-xs leading-relaxed">{tooltip.description}</p>
          )}
        </motion.div>
      )}
    </div>
  )
}

