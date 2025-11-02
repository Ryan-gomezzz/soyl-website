'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { WorkflowNode as WorkflowNodeType, NodeType, ActionType } from './types'

interface WorkflowNodeProps {
  node: WorkflowNodeType
  onNodeClick?: (node: WorkflowNodeType) => void
  isSelected?: boolean
}

const nodeTypeConfig: Record<NodeType, { icon: string; bgColor: string; borderColor: string }> = {
  start: {
    icon: '🎤',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
  },
  api: {
    icon: '🚀',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
  },
  action: {
    icon: '⚡',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/50',
  },
  condition: {
    icon: '❓',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50',
  },
  end: {
    icon: '✓',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50',
  },
}

const actionTypeLabels: Record<ActionType, string> = {
  send_sms: 'Send SMS',
  transfer_call: 'Transfer call',
  hangup: 'Hangup',
  custom: 'Custom Action',
}

export function WorkflowNode({ node, onNodeClick, isSelected = false }: WorkflowNodeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const config = nodeTypeConfig[node.type]

  const renderNodeContent = () => {
    switch (node.type) {
      case 'start':
        return (
          <div className="flex items-center gap-3">
            <div className="text-2xl">{config.icon}</div>
            <div>
              <div className="font-semibold text-white">{node.title}</div>
              <div className="text-xs text-gray-400 mt-1">INPUT</div>
            </div>
          </div>
        )
      case 'api':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="text-xl">{config.icon}</div>
              <div className="font-semibold text-white text-sm">{node.title}</div>
            </div>
            {node.data?.url && (
              <div className="text-xs text-gray-300 mt-2">
                <div className="font-medium text-gray-400 mb-1">URL:</div>
                <div className="bg-black/30 px-2 py-1 rounded text-gray-200 font-mono">
                  {node.data.url}
                </div>
              </div>
            )}
            {node.data?.parameters && node.data.parameters.length > 0 && (
              <div className="text-xs text-gray-300 mt-2 space-y-1">
                {node.data.parameters.map((param, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-gray-400">{'{}'}</span>
                    <span>{param.key}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      case 'action':
        const actionLabel =
          node.data?.actionType && node.data.actionType !== 'custom'
            ? actionTypeLabels[node.data.actionType]
            : node.data?.customAction || node.title
        return (
          <div className="flex items-center gap-3">
            <div className="text-xl">{config.icon}</div>
            <div className="font-semibold text-white text-sm">{actionLabel}</div>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-2">
            <div className="text-xl">{config.icon}</div>
            <div className="font-semibold text-white text-sm">{node.title}</div>
          </div>
        )
    }
  }

  return (
    <motion.div
      className={`absolute ${config.bgColor} border-2 ${config.borderColor} rounded-lg p-4 cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : ''
      }`}
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        minWidth: node.type === 'api' ? '220px' : '160px',
        maxWidth: node.type === 'api' ? '280px' : '200px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onNodeClick?.(node)}
      whileHover={{ scale: 1.05, y: -2 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {renderNodeContent()}

      {/* Connection Ports - Outputs */}
      {node.outputs && node.outputs.length > 0 && (
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
          {node.outputs.map((outputId, idx) => (
            <div
              key={outputId}
              className="w-4 h-4 rounded-full bg-accent border-2 border-bg cursor-pointer hover:scale-125 transition-transform"
              style={{
                background: `hsl(${(idx * 60) % 360}, 70%, 60%)`,
              }}
              title={`Output ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Connection Ports - Inputs */}
      {node.inputs && node.inputs.length > 0 && (
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
          {node.inputs.map((inputId, idx) => (
            <div
              key={inputId}
              className="w-4 h-4 rounded-full bg-accent border-2 border-bg cursor-pointer hover:scale-125 transition-transform"
              style={{
                background: `hsl(${(idx * 60) % 360}, 70%, 60%)`,
              }}
              title={`Input ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Glow effect on hover */}
      {isHovered && (
        <motion.div
          className={`absolute inset-0 ${config.bgColor} blur-xl -z-10 rounded-lg opacity-50`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  )
}

