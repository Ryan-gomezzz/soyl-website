import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AssistantPromo } from '../AssistantPromo'


// Mock DotPattern
jest.mock('@/app/_components/DotPattern', () => ({
  DotPattern: ({ className }: { className?: string }) => (
    <div data-testid="dot-pattern" className={className} />
  ),
}))

// Mock framer-motion
jest.mock('framer-motion', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react')
  // Create a component factory that strips animation props
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
      children?: React.ReactNode;
      animate?: unknown;
      initial?: unknown;
      whileInView?: unknown;
      whileHover?: unknown;
      whileTap?: unknown;
      whileFocus?: unknown;
      whileDrag?: unknown;
      transition?: unknown;
      viewport?: unknown;
      exit?: unknown;
      variants?: unknown;
      [key: string]: unknown
    }) => {
      return React.createElement(tag, props, children)
    }
    return Component
  }

  // Create motion object with common HTML and SVG elements
  const motionElements = ['div', 'section', 'h1', 'h2', 'h3', 'p', 'span', 'a', 'button', 'ul', 'li', 'svg', 'path', 'text', 'g', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'foreignObject']
  const motion: Record<string, React.ComponentType<{ children?: React.ReactNode;[key: string]: unknown }>> = {}

  motionElements.forEach(tag => {
    motion[tag] = createMotionComponent(tag)
  })

  // Create mock MotionValue
  const createMotionValue = (value: number) => ({
    get: () => value,
    set: () => { },
    subscribe: () => () => { },
  })

  return {
    motion,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
    useReducedMotion: () => false,
    useScroll: () => ({ scrollY: createMotionValue(0) }),
    useTransform: () => createMotionValue(0),
  }
})

describe('AssistantPromo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    // Mock window.location
    let href = 'http://localhost/'
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...window.location,
        assign: jest.fn(),
        replace: jest.fn(),
        get href() {
          return href
        },
        set href(val) {
          href = val
        },
      },
    })
  })

  it('renders the promo section with correct heading', async () => {
    render(<AssistantPromo />)
    await waitFor(() => {
      expect(screen.getByRole('region', { name: /soyl assistant/i })).toBeInTheDocument()
    })
    expect(screen.getByText('SOYL Assistant')).toBeInTheDocument()
  })

  it('renders the description text', async () => {
    render(<AssistantPromo />)
    await waitFor(() => {
      expect(
        screen.getByText(/Try our multimodal, emotion-aware AI assistant/)
      ).toBeInTheDocument()
    })
  })

  it('renders primary CTA button that redirects to under development page', async () => {
    render(<AssistantPromo />)

    await waitFor(() => {
      expect(screen.getByText('Try the Assistant')).toBeInTheDocument()
    })

    const tryButton = screen.getByText('Try the Assistant').closest('button')
    expect(tryButton).toBeInTheDocument()

    fireEvent.click(tryButton!)
    expect(window.location.href).toBe('/under-development')
  })

  it('renders secondary CTA link to how it works', async () => {
    render(<AssistantPromo />)
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /how it works/i })).toBeInTheDocument()
    })
    const howItWorksLink = screen.getByRole('link', { name: /how it works/i })
    expect(howItWorksLink).toBeInTheDocument()
    expect(howItWorksLink).toHaveAttribute('href', '#how-it-works')
  })

  it('has correct accessibility attributes', async () => {
    render(<AssistantPromo />)
    await waitFor(() => {
      expect(screen.getByRole('region', { name: /soyl assistant/i })).toBeInTheDocument()
    })
    const section = screen.getByRole('region', { name: /soyl assistant/i })
    expect(section).toHaveAttribute('id', 'assistant-promo')
    expect(section).toHaveAttribute('aria-labelledby', 'assistant-promo-title')

    const heading = screen.getByText('SOYL Assistant')
    expect(heading).toHaveAttribute('id', 'assistant-promo-title')
  })

  it('handles scroll to how-it-works section', async () => {
    // Mock document.getElementById and scrollIntoView
    const mockScrollIntoView = jest.fn()
    const mockElement = {
      scrollIntoView: mockScrollIntoView,
    }
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as unknown as HTMLElement)

    render(<AssistantPromo />)
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /how it works/i })).toBeInTheDocument()
    })
    const howItWorksLink = screen.getByRole('link', { name: /how it works/i })

    fireEvent.click(howItWorksLink)
    expect(document.getElementById).toHaveBeenCalledWith('how-it-works')
    // When prefersReducedMotion is false (default), it uses 'smooth'
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })
  })

  it('handles reduced motion preference', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
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

    const mockScrollIntoView = jest.fn()
    const mockElement = {
      scrollIntoView: mockScrollIntoView,
    }
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as unknown as HTMLElement)

    render(<AssistantPromo />)
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /how it works/i })).toBeInTheDocument()
    })
    const howItWorksLink = screen.getByRole('link', { name: /how it works/i })

    fireEvent.click(howItWorksLink)
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' })
  })
})

