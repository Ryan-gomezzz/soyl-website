'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface FlowEdgeProps {
  edge: { from: string; to: string; label?: string }
  nodes: Array<{ id: string; x: number; y: number }>
  canvas: { w: number; h: number }
  highlighted?: boolean
}

export function FlowEdge({ edge, nodes, canvas, highlighted = false }: FlowEdgeProps) {
  const fromNode = nodes.find((n) => n.id === edge.from)
  const toNode = nodes.find((n) => n.id === edge.to)
  const reduced = useReducedMotion()

  if (!fromNode || !toNode) return null

  // Calculate actual pixel positions
  const x1 = fromNode.x * canvas.w
  const y1 = fromNode.y * canvas.h
  const x2 = toNode.x * canvas.w
  const y2 = toNode.y * canvas.h

  // Create smooth cubic Bezier curve
  const dx = x2 - x1
  const dy = y2 - y1
  const cx1 = x1 + dx * 0.5
  const cy1 = y1 - dy * 0.3
  const cx2 = x2 - dx * 0.5
  const cy2 = y2 + dy * 0.3

  const pathData = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`

  // Calculate midpoint for label
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2

  return (
    <g>
      {/* Path with animated dash */}
      <motion.path
        d={pathData}
        fill="none"
        stroke={highlighted ? 'var(--accent)' : 'rgba(31, 182, 255, 0.3)'}
        strokeWidth={highlighted ? 2.5 : 1.5}
        strokeDasharray={highlighted ? '0' : '6 6'}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: highlighted ? 0.9 : 0.4,
          strokeWidth: highlighted ? 2.5 : 1.5,
        }}
        transition={{
          pathLength: { duration: reduced ? 0 : 1.5, ease: 'easeInOut' },
          opacity: { duration: 0.3 },
          strokeWidth: { duration: 0.3 },
        }}
        markerEnd="url(#arrowhead)"
      />

      {/* Flowing particles along edge - using SVG animateMotion */}
      {!reduced && highlighted && (
        <g>
          <path
            id={`edge-${edge.from}-${edge.to}`}
            d={pathData}
            fill="none"
            stroke="none"
            visibility="hidden"
          />
          <circle r="3" fill="var(--accent)" opacity="0.8">
            <animateMotion dur="2s" repeatCount="indefinite" calcMode="linear">
              <mpath href={`#edge-${edge.from}-${edge.to}`} />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;1;0.5;1;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      )}

      {/* Edge label with fade animation */}
      {edge.label && (
        <motion.text
          x={midX}
          y={midY - 5}
          fontSize="10"
          fill={highlighted ? 'var(--accent)' : 'var(--muted)'}
          textAnchor="middle"
          className="select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {edge.label}
        </motion.text>
      )}
    </g>
  )
}

