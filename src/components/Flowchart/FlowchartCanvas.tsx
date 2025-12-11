'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { flow } from './flow-data'
import { FlowNode } from './FlowNode'

interface FlowchartCanvasProps {
  onNodeClick?: (node: typeof flow.nodes[0]) => void
}

export function FlowchartCanvas({ onNodeClick }: FlowchartCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 1200, h: 700 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const reduced = useReducedMotion()

  const measure = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      setSize({ w: Math.max(rect.width, 800), h: Math.max(rect.height, 500) })
    }
  }, [])

  useEffect(() => {
    measure()

    let timeoutId: NodeJS.Timeout
    function handleResize() {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(measure, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [measure])

  const handleNodeHover = useCallback((node: typeof flow.nodes[0] | null) => {
    setHoveredNode(node?.id || null)
  }, [])

  const handleNodeClick = useCallback((node: typeof flow.nodes[0]) => {
    if (node.cta?.href) {
      if (node.cta.href.startsWith('mailto:')) {
        window.location.href = node.cta.href
      } else {
        window.location.href = node.cta.href
      }
    }
    onNodeClick?.(node)
  }, [onNodeClick])

  const getNodeSize = (nodeSize?: 'sm' | 'md' | 'lg') => {
    switch (nodeSize) {
      case 'lg': return { w: 256, h: 96 }
      case 'sm': return { w: 192, h: 72 }
      default: return { w: 224, h: 84 }
    }
  }

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-[520px] md:h-[640px] min-h-[500px] overflow-visible mx-auto flex justify-center"
      style={{ maxWidth: '100%' }}
    >
      {/* Background SVG for edges */}
      <svg
        width={size.w}
        height={size.h}
        className="absolute left-1/2 top-1/2 z-0 pointer-events-none"
        style={{
          overflow: 'visible',
          transform: 'translate(-50%, -50%)',
          maxWidth: '100%',
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 5, 0 10"
              fill="var(--accent)"
              opacity={0.6}
            />
          </marker>
        </defs>

        {/* Render edges */}
        {flow.edges.map((edge, i) => {
          const fromNode = flow.nodes.find(n => n.id === edge.from)
          const toNode = flow.nodes.find(n => n.id === edge.to)
          if (!fromNode || !toNode) return null

          const fromX = fromNode.x * size.w
          const fromY = fromNode.y * size.h
          const toX = toNode.x * size.w
          const toY = toNode.y * size.h

          const isHighlighted = edge.from === hoveredNode || edge.to === hoveredNode

          // Calculate control points for a smooth curve
          const cp1x = fromX + (toX - fromX) * 0.5
          const cp1y = fromY
          const cp2x = fromX + (toX - fromX) * 0.5
          const cp2y = toY

          // Path definition
          const pathD = `M ${fromX} ${fromY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${toX} ${toY}`

          return (
            <path
              key={`${edge.from}-${edge.to}-${i}`}
              d={pathD}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={isHighlighted ? 3 : 2}
              strokeOpacity={isHighlighted ? 0.8 : 0.4}
              markerEnd="url(#arrowhead)"
              className="transition-all duration-300"
            />
          )
        })}
      </svg>

      {/* Render nodes with absolute positioning */}
      <div className="relative w-full h-full z-10">
        {flow.nodes.map((node, index) => {
          const nodeSize = getNodeSize(node.size)

          return (
            <motion.div
              key={node.id}
              className="absolute"
              style={{
                left: `${(node.x * 100)}%`,
                top: `${(node.y * 100)}%`,
                transform: 'translate(-50%, -50%)',
                width: `${nodeSize.w}px`,
                height: `${nodeSize.h}px`,
              }}
              initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.8, y: 20 }}
              animate={reduced ? {} : { opacity: 1, scale: 1, y: 0 }}
              transition={
                reduced
                  ? {}
                  : {
                    duration: 0.5,
                    delay: index * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }
              }
            >
              <FlowNode node={node} onHover={handleNodeHover} onClick={handleNodeClick} />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
