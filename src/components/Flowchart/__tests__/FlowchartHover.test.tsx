import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import { FlowNode } from '../FlowNode'
import { AmbientLayer } from '../AmbientLayer'
import { flow } from '../flow-data'

// Mock framer-motion
jest.mock('framer-motion', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react')
  const createMotionComponent = (tag: string) => {
    const Component = ({
      children,
      animate: _animate,
      initial: _initial,
      whileInView: _whileInView,
      whileHover: _whileHover,
      whileTap: _whileTap,
      whileFocus: _whileFocus,
      whileDrag: _whileDrag,
      transition: _transition,
      viewport: _viewport,
      exit: _exit,
      variants: _variants,
      ...props
    }: {
      children?: React.ReactNode
      animate?: unknown
      initial?: unknown
      whileInView?: unknown
      whileHover?: unknown
      whileTap?: unknown
      whileFocus?: unknown
      whileDrag?: unknown
      transition?: unknown
      viewport?: unknown
      exit?: unknown
      variants?: unknown
      [key: string]: unknown
    }) => {
      return React.createElement(tag, props, children)
    }
    return Component
  }

  const motionElements = [
    'div',
    'section',
    'h1',
    'h2',
    'h3',
    'p',
    'span',
    'a',
    'button',
    'ul',
    'li',
    'svg',
    'path',
    'text',
    'g',
    'circle',
    'rect',
    'line',
    'polyline',
    'polygon',
    'ellipse',
    'foreignObject',
  ]
  const motion: Record<string, React.ComponentType<{ children?: React.ReactNode; [key: string]: unknown }>> = {}

  motionElements.forEach((tag) => {
    motion[tag] = createMotionComponent(tag)
  })

  const createMotionValue = (value: number) => ({
    get: () => value,
    set: () => {},
    subscribe: () => () => {},
  })

  return {
    motion,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
    useReducedMotion: () => false,
    useScroll: () => ({ scrollY: createMotionValue(0) }),
    useTransform: () => createMotionValue(0),
  }
})

// Mock DotCluster
jest.mock('../../FeatureGrid/DotCluster', () => ({
  DotCluster: ({ size }: { size?: number }) => (
    <div data-testid="dot-cluster" data-size={size} />
  ),
}))

// Mock FlowEdge
jest.mock('../FlowEdge', () => ({
  FlowEdge: () => <g data-testid="flow-edge">Flow Edge</g>,
}))

// Mock FlowNodePopup
jest.mock('../FlowNodePopup', () => ({
  FlowNodePopup: ({ node, onClose }: { node: typeof flow.nodes[0]; onClose: () => void }) => (
    <div role="tooltip" data-testid="flow-node-popup">
      <h4>{node.title}</h4>
      {node.description && <p>{node.description}</p>}
      <button onClick={onClose} aria-label="Close popup">Close</button>
    </div>
  ),
}))

// Mock canvas getContext
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
  })
})

describe('Flowchart Hover/Focus/Tap Behavior', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === '(pointer: fine)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  it('shows popup on mouseenter', async () => {
    const mockNode = flow.nodes[0]
    const mockOnHover = jest.fn()
    const mockOnClick = jest.fn()

    render(<FlowNode node={mockNode} onHover={mockOnHover} onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    
    fireEvent.mouseEnter(button)
    
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
      expect(screen.getByText(mockNode.title)).toBeInTheDocument()
    })

    expect(mockOnHover).toHaveBeenCalledWith(mockNode)
  })

  it('hides popup on mouseleave', async () => {
    const mockNode = flow.nodes[0]
    const mockOnHover = jest.fn()
    const mockOnClick = jest.fn()

    render(<FlowNode node={mockNode} onHover={mockOnHover} onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    
    fireEvent.mouseEnter(button)
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    fireEvent.mouseLeave(button)
    
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })

    expect(mockOnHover).toHaveBeenCalledWith(null)
  })

  it('shows popup on focus', async () => {
    const mockNode = flow.nodes[0]
    const mockOnHover = jest.fn()
    const mockOnClick = jest.fn()

    render(<FlowNode node={mockNode} onHover={mockOnHover} onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    
    fireEvent.focus(button)
    
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
      expect(screen.getByText(mockNode.title)).toBeInTheDocument()
    })

    expect(mockOnHover).toHaveBeenCalledWith(mockNode)
  })

  it('hides popup on blur', async () => {
    const mockNode = flow.nodes[0]
    const mockOnHover = jest.fn()
    const mockOnClick = jest.fn()

    render(<FlowNode node={mockNode} onHover={mockOnHover} onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    
    fireEvent.focus(button)
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    fireEvent.blur(button)
    
    // Wait for setTimeout in handleBlur (100ms delay)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150))
    })
    
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })
  })

  it('toggles popup on tap for touch devices', async () => {
    // Mock touch device
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === '(pointer: coarse)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    const mockNode = flow.nodes[0]
    const mockOnHover = jest.fn()
    const mockOnClick = jest.fn()

    render(<FlowNode node={mockNode} onHover={mockOnHover} onClick={mockOnClick} />)

    const button = screen.getByRole('button')
    
    // First tap opens popup
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    // Second tap closes popup
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })
  })

  it('renders ambient layer with pointer-events-none', () => {
    // Mock matchMedia to return false for prefers-reduced-motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query !== '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    const { container } = render(<AmbientLayer enabled={true} width={1200} height={700} />)
    const canvas = container.querySelector('canvas')
    
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
    expect(canvas?.className).toContain('pointer-events-none')
  })

  it('disables ambient layer when reduced motion is preferred', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    const { container } = render(<AmbientLayer enabled={true} width={1200} height={700} />)
    
    // Ambient layer should not render when reduced motion is enabled
    // (the component returns null in that case)
    expect(container.querySelector('canvas')).not.toBeInTheDocument()
  })

  it('closes popup when clicking outside', async () => {
    const mockNode = flow.nodes[0]
    const mockOnHover = jest.fn()
    const mockOnClick = jest.fn()

    render(
      <div>
        <FlowNode node={mockNode} onHover={mockOnHover} onClick={mockOnClick} />
        <div data-testid="outside">Outside</div>
      </div>
    )

    const button = screen.getByRole('button')
    fireEvent.focus(button)
    
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument()
    })

    const outside = screen.getByTestId('outside')
    fireEvent.mouseDown(outside)
    
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })
  })
})

