'use client'

import React from 'react'
import type { Connection, WorkflowNode } from './types'

interface ConnectionLineProps {
  connection: Connection
  fromNode: WorkflowNode
  toNode: WorkflowNode
}

export function ConnectionLine({ connection, fromNode, toNode }: ConnectionLineProps) {
  // Calculate connection points
  const fromX = fromNode.position.x + (fromNode.outputs?.indexOf(connection.fromPort) ?? 0) * 20
  const fromY = fromNode.position.y + 40 // Middle of node height
  const toX = toNode.position.x - (toNode.inputs?.indexOf(connection.toPort) ?? 0) * 20
  const toY = toNode.position.y + 40

  // Calculate control points for smooth curve
  const midX = (fromX + toX) / 2
  const controlY = Math.abs(toY - fromY) > 50 ? (fromY + toY) / 2 : fromY - 50

  const path = `M ${fromX} ${fromY} Q ${midX} ${controlY} ${toX} ${toY}`

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id={`gradient-${connection.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(31, 182, 255, 0.6)" />
          <stop offset="100%" stopColor="rgba(167, 139, 250, 0.6)" />
        </linearGradient>
      </defs>
      <path
        d={path}
        stroke={`url(#gradient-${connection.id})`}
        strokeWidth="2"
        fill="none"
        strokeDasharray="4,4"
        className="animate-pulse"
      />
      <circle cx={fromX} cy={fromY} r="4" fill="rgba(31, 182, 255, 0.8)" />
      <circle cx={toX} cy={toY} r="4" fill="rgba(167, 139, 250, 0.8)" />
    </svg>
  )
}

