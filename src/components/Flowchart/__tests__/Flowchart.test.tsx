import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FlowchartSection } from '../FlowchartSection'
import { flow } from '../flow-data'

// Mock DotPattern
jest.mock('@/app/_components/DotPattern', () => ({
  DotPattern: ({ className }: { className?: string }) => (
    <div data-testid="dot-pattern" className={className} />
  ),
}))

// Mock FlowchartCanvas components
jest.mock('../FlowchartCanvas', () => ({
  FlowchartCanvas: () => <div data-testid="flowchart-canvas">Flowchart Canvas</div>,
}))

// Mock FlowNode
jest.mock('../FlowNode', () => ({
  FlowNode: () => <div data-testid="flow-node">Flow Node</div>,
}))

// Mock FlowEdge
jest.mock('../FlowEdge', () => ({
  FlowEdge: () => <g data-testid="flow-edge">Flow Edge</g>,
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <div {...props}>{children}</div>
    ),
  },
  useReducedMotion: () => false,
}))

describe('FlowchartSection', () => {
  it('renders flowchart section with heading', async () => {
    render(<FlowchartSection />)
    await waitFor(() => {
      expect(screen.getByText('Our R&D Journey')).toBeInTheDocument()
    })
  })

  it('renders flowchart canvas', async () => {
    render(<FlowchartSection />)
    await waitFor(() => {
      expect(screen.getByTestId('flowchart-canvas')).toBeInTheDocument()
    })
  })

  it('renders flowchart description', async () => {
    render(<FlowchartSection />)
    await waitFor(() => {
      expect(
        screen.getByText(/From foundation MVP to productization/)
      ).toBeInTheDocument()
    })
  })
})

