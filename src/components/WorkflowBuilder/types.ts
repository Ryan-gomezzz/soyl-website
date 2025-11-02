/**
 * Workflow Builder Types
 * 
 * Types for the visual workflow builder component
 */

export type NodeType = 'start' | 'api' | 'action' | 'condition' | 'end'

export type ActionType = 'send_sms' | 'transfer_call' | 'hangup' | 'custom'

export interface WorkflowNode {
  id: string
  type: NodeType
  title: string
  position: { x: number; y: number }
  data?: {
    url?: string
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    parameters?: Array<{ key: string; value: string }>
    actionType?: ActionType
    customAction?: string
  }
  inputs?: string[] // Connection input IDs
  outputs?: string[] // Connection output IDs
}

export interface Connection {
  id: string
  from: string // Node ID
  fromPort: string // Port ID on source node
  to: string // Node ID
  toPort: string // Port ID on target node
}

export interface WorkflowData {
  nodes: WorkflowNode[]
  connections: Connection[]
}

