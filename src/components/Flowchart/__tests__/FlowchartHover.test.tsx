import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import { FlowNode } from '../FlowNode'
import { AmbientLayer } from '../AmbientLayer'
import { flow } from '../flow-data'

// Mock framer-motion
jest.mock('framer-motion', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react')
  const createMotionComponent = (tag: string) => {
    const Component = React.forwardRef<HTMLElement, {
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
    }>(({
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
    }, ref) => {
      return React.createElement(tag, { ...props, ref }, children)
    })
    Component.displayName = `motion.${tag}`
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
jest.mock('../../FeatureGrid/DotCluster', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react')
  const DotClusterMock = React.forwardRef<SVGSVGElement, { size?: number }>(
    ({ size }, _ref) => (
      <div data-testid="dot-cluster" data-size={size} />
    )
  )
  DotClusterMock.displayName = 'DotCluster'
  return {
    DotCluster: DotClusterMock,
  }
})

// Mock FlowEdge
jest.mock('../FlowEdge', () => ({
  FlowEdge: () => <g data-testid="flow-edge">Flow Edge</g>,
}))

// Mock FlowNodePopup
jest.mock('../FlowNodePopup', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react')
  return {
    FlowNodePopup: ({ node, anchorRef, onClose }: { 
      node: typeof flow.nodes[0]
      anchorRef: React.RefObject<HTMLElement>
      onClose: () => void 
    }) => {
      const popupRef = React.useRef<HTMLDivElement>(null)
      
      // eslint-disable-next-line react-hooks/rules-of-hooks
      React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
          const target = event.target as HTMLElement | null
          const popup = popupRef.current
          const anchor = anchorRef.current
          
          if (!popup || !anchor || !target) return
          
          // Check if click is outside both popup and anchor
          const isOutsidePopup = !popup.contains(target)
          const isOutsideAnchor = !anchor.contains(target)
          
          if (isOutsidePopup && isOutsideAnchor) {
            // Use setTimeout to ensure React state updates are processed
            setTimeout(() => {
              onClose()
            }, 0)
          }
        }
        
        // Add listener with capture phase to catch events earlier
        document.addEventListener('mousedown', handleClickOutside, true)
        return () => {
          document.removeEventListener('mousedown', handleClickOutside, true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [onClose])

      return (
        <div ref={popupRef} role="tooltip" data-testid="flow-node-popup">
          <h4>{node.title}</h4>
          {node.description && <p>{node.description}</p>}
          <button onClick={onClose} aria-label="Close popup">Close</button>
        </div>
      )
    },
  }
})

// Mock canvas getContext globally
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: jest.fn().mockReturnValue({
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
  }),
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
      const popup = screen.getByTestId('flow-node-popup')
      expect(popup).toBeInTheDocument()
      expect(popup).toHaveTextContent(mockNode.title)
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
      const popup = screen.getByTestId('flow-node-popup')
      expect(popup).toBeInTheDocument()
      expect(popup).toHaveTextContent(mockNode.title)
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
      expect(screen.getByTestId('flow-node-popup')).toBeInTheDocument()
    })

    // Wait for event listener to be set up
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
    })

    const outside = screen.getByTestId('outside')
    
    // Use userEvent for more realistic interaction, or fireEvent with proper event
    await act(async () => {
      fireEvent.mouseDown(outside, { bubbles: true })
      // Give React time to process the state update
      await new Promise((resolve) => setTimeout(resolve, 50))
    })
    
    await waitFor(() => {
      expect(screen.queryByTestId('flow-node-popup')).not.toBeInTheDocument()
    }, { timeout: 1000 })
  })
})

