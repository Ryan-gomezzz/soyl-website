import { render, screen } from '@testing-library/react'
import Home from '../page'

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill: _fill, priority: _priority, ...props }: { src: string; alt: string; fill?: boolean; priority?: boolean;[key: string]: unknown }) => {
    // Remove Next.js specific props that cause warnings in test environment
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />
  },
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

// Mock TestimonialCarousel
jest.mock('../_components/TestimonialCarousel', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react')
  return {
    TestimonialCarousel: () => React.createElement('div', { 'data-testid': 'testimonial-carousel' }, 'TestimonialCarousel'),
  }
})

// Mock FlowchartSection
jest.mock('@/components/Flowchart/FlowchartSection', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react')
  return {
    FlowchartSection: () => React.createElement('div', { 'data-testid': 'flowchart-section' }, 'FlowchartSection'),
  }
})

describe('Home Page Smoke Test', () => {
  it('renders hero H1 with AI and Automation text', () => {
    render(<Home />)
    // Find the hero heading specifically by role
    const headings = screen.getAllByRole('heading', { level: 1 })
    const heroHeading = headings.find((h) => h.textContent?.includes('AI and Automation'))
    expect(heroHeading).toBeInTheDocument()
  })

  it('renders "What SOYL Does" section', () => {
    render(<Home />)
    const section = screen.getByRole('heading', { name: /What SOYL Does/i })
    expect(section).toBeInTheDocument()
  })
})

