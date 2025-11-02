'use client'

import React, { useState } from 'react'
import { WorkflowCanvas } from './WorkflowCanvas'
import type { WorkflowNode, WorkflowData } from './types'

interface WorkflowBuilderProps {
  initialWorkflow?: WorkflowData
  readonly?: boolean
}

// Sample workflow data based on the image
const defaultWorkflow: WorkflowData = {
  nodes: [
    {
      id: 'start-1',
      type: 'start',
      title: 'Start call',
      position: { x: 50, y: 300 },
      outputs: ['output-1'],
    },
    {
      id: 'api-1',
      type: 'api',
      title: 'API Request',
      position: { x: 300, y: 280 },
      data: {
        url: 'HTTP://VAPI.AI/',
      },
      inputs: ['input-1'],
      outputs: ['output-1', 'output-2', 'output-3'],
    },
    {
      id: 'api-2',
      type: 'api',
      title: 'API Request',
      position: { x: 700, y: 150 },
      data: {
        url: 'HTTP://VAPI.AI/',
        parameters: [
          { key: 'Merchant Name', value: '' },
          { key: 'Agent Name', value: '' },
          { key: 'Integration Partner', value: '' },
        ],
      },
      inputs: ['input-1'],
      outputs: ['output-1', 'output-2', 'output-3'],
    },
    {
      id: 'api-3',
      type: 'api',
      title: 'API Request',
      position: { x: 700, y: 380 },
      data: {
        url: 'HTTP://VAPI.AI/',
      },
      inputs: ['input-1'],
      outputs: ['output-1', 'output-2', 'output-3'],
    },
    {
      id: 'action-1',
      type: 'action',
      title: 'Send SMS',
      position: { x: 1100, y: 200 },
      data: {
        actionType: 'send_sms',
      },
      inputs: ['input-1', 'input-2', 'input-3'],
    },
    {
      id: 'action-2',
      type: 'action',
      title: 'Transfer call',
      position: { x: 1100, y: 280 },
      data: {
        actionType: 'transfer_call',
      },
      inputs: ['input-1', 'input-2', 'input-3'],
    },
    {
      id: 'action-3',
      type: 'action',
      title: 'Hangup',
      position: { x: 1100, y: 360 },
      data: {
        actionType: 'hangup',
      },
      inputs: ['input-1', 'input-2', 'input-3'],
    },
  ],
  connections: [
    {
      id: 'conn-1',
      from: 'start-1',
      fromPort: 'output-1',
      to: 'api-1',
      toPort: 'input-1',
    },
    {
      id: 'conn-2',
      from: 'api-1',
      fromPort: 'output-1',
      to: 'api-2',
      toPort: 'input-1',
    },
    {
      id: 'conn-3',
      from: 'api-1',
      fromPort: 'output-2',
      to: 'api-3',
      toPort: 'input-1',
    },
    {
      id: 'conn-4',
      from: 'api-2',
      fromPort: 'output-1',
      to: 'action-1',
      toPort: 'input-1',
    },
    {
      id: 'conn-5',
      from: 'api-2',
      fromPort: 'output-2',
      to: 'action-2',
      toPort: 'input-1',
    },
    {
      id: 'conn-6',
      from: 'api-3',
      fromPort: 'output-1',
      to: 'action-1',
      toPort: 'input-2',
    },
    {
      id: 'conn-7',
      from: 'api-3',
      fromPort: 'output-2',
      to: 'action-2',
      toPort: 'input-2',
    },
    {
      id: 'conn-8',
      from: 'api-2',
      fromPort: 'output-3',
      to: 'action-3',
      toPort: 'input-1',
    },
    {
      id: 'conn-9',
      from: 'api-3',
      fromPort: 'output-3',
      to: 'action-3',
      toPort: 'input-2',
    },
  ],
}

export function WorkflowBuilder({ initialWorkflow, readonly = false }: WorkflowBuilderProps) {
  const [workflow] = useState<WorkflowData>(initialWorkflow || defaultWorkflow)
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>()

  const handleNodeClick = (node: WorkflowNode) => {
    if (!readonly) {
      setSelectedNodeId(node.id)
    }
  }

  return (
    <div className="w-full h-full min-h-[600px] relative bg-bg rounded-xl overflow-hidden border border-white/10">
      <WorkflowCanvas
        workflow={workflow}
        onNodeClick={handleNodeClick}
        selectedNodeId={selectedNodeId}
      />
    </div>
  )
}

