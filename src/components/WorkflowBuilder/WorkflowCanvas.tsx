'use client'

import React, { useRef, useCallback } from 'react'
import { WorkflowNode } from './WorkflowNode'
import type { WorkflowNode as WorkflowNodeType, WorkflowData } from './types'

interface WorkflowCanvasProps {
  workflow: WorkflowData
  onNodeClick?: (node: WorkflowNodeType) => void
  selectedNodeId?: string
}

export function WorkflowCanvas({ workflow, onNodeClick, selectedNodeId }: WorkflowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback((_e: React.MouseEvent) => {
    // Canvas panning can be implemented here if needed
  }, [])

  const handleMouseMove = useCallback(
    (_e: React.MouseEvent) => {
      // Handle canvas panning here if needed
    },
    []
  )

  const handleMouseUp = useCallback(() => {
    // Handle mouse up for canvas panning
  }, [])

  // Create node map for efficient lookup
  const nodeMap = new Map(workflow.nodes.map((node) => [node.id, node]))

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-br from-bg via-bg/95 to-bg/90 canvas-bg"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      {/* Connection Lines */}
      <svg className="absolute inset-0 pointer-events-none z-10" style={{ width: '100%', height: '100%' }}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="rgba(167, 139, 250, 0.8)" />
          </marker>
        </defs>
        {workflow.connections.map((connection) => {
          const fromNode = nodeMap.get(connection.from)
          const toNode = nodeMap.get(connection.to)
          if (!fromNode || !toNode) return null

          // Calculate port positions based on node outputs/inputs
          const fromPortIndex = fromNode.outputs?.indexOf(connection.fromPort) ?? 0
          const toPortIndex = toNode.inputs?.indexOf(connection.toPort) ?? 0
          
          const fromX = fromNode.position.x + 180 // Right side of node
          const fromY = fromNode.position.y + 30 + fromPortIndex * 20 // Multiple ports
          const toX = toNode.position.x - 10 // Left side of node
          const toY = toNode.position.y + 30 + toPortIndex * 20

          const midX = (fromX + toX) / 2
          const controlY = Math.min(fromY, toY) - Math.max(50, Math.abs(toY - fromY) / 2)

          const path = `M ${fromX} ${fromY} Q ${midX} ${controlY} ${toX} ${toY}`

          return (
            <g key={connection.id}>
              <defs>
                <linearGradient id={`gradient-${connection.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(31, 182, 255, 0.7)" />
                  <stop offset="100%" stopColor="rgba(167, 139, 250, 0.7)" />
                </linearGradient>
              </defs>
              <path
                d={path}
                stroke={`url(#gradient-${connection.id})`}
                strokeWidth="2.5"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
              {/* Connection point circles */}
              <circle cx={fromX} cy={fromY} r="5" fill="rgba(31, 182, 255, 0.9)" />
              <circle cx={toX} cy={toY} r="5" fill="rgba(167, 139, 250, 0.9)" />
            </g>
          )
        })}
      </svg>

      {/* Nodes */}
      <div className="relative z-20">
        {workflow.nodes.map((node) => (
          <WorkflowNode
            key={node.id}
            node={node}
            onNodeClick={onNodeClick}
            isSelected={selectedNodeId === node.id}
          />
        ))}
      </div>
    </div>
  )
}

