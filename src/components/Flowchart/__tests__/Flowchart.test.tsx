import { render, screen, waitFor } from '@testing-library/react'
import { FlowchartSection } from '../FlowchartSection'

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
jest.mock('framer-motion', () => {
  const React = require('react')
  // Create a component factory that strips animation props
  const createMotionComponent = (tag: string) => {
    const Component = ({ children, animate, initial, whileInView, transition, viewport, ...props }: any) => {
      return React.createElement(tag, props, children)
    }
    return Component
  }
  
  // Create motion object with common HTML and SVG elements
  const motionElements = ['div', 'section', 'h1', 'h2', 'h3', 'p', 'span', 'a', 'button', 'ul', 'li', 'svg', 'path', 'text', 'g', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse']
  const motion: Record<string, React.ComponentType<any>> = {}
  
  motionElements.forEach(tag => {
    motion[tag] = createMotionComponent(tag)
  })
  
  // Create mock MotionValue
  const createMotionValue = (value: number) => ({
    get: () => value,
    set: () => {},
    subscribe: () => () => {},
  })

  return {
    motion,
    useReducedMotion: () => false,
    useScroll: () => ({ scrollY: createMotionValue(0) }),
    useTransform: () => createMotionValue(0),
  }
})

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

