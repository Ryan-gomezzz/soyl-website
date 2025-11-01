import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FeatureCard } from '../FeatureCard'

// Mock DotCluster
jest.mock('../DotCluster', () => ({
  DotCluster: ({ size, className }: { size?: number; className?: string }) => (
    <div data-testid="dot-cluster" data-size={size} className={className} />
  ),
}))

// Mock framer-motion
jest.mock('framer-motion', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react')
  const createMotionComponent = (tag: string) => {
    const Component = ({
      children,
      whileInView: _whileInView,
      whileHover: _whileHover,
      whileTap: _whileTap,
      animate: _animate,
      initial: _initial,
      exit: _exit,
      transition: _transition,
      ...props
    }: {
      children?: React.ReactNode
      whileInView?: unknown
      whileHover?: unknown
      whileTap?: unknown
      animate?: unknown
      initial?: unknown
      exit?: unknown
      transition?: unknown
      [key: string]: unknown
    }) => {
      return React.createElement(tag, props, children)
    }
    return Component
  }
  return {
    motion: {
      div: createMotionComponent('div'),
    },
    useReducedMotion: () => false,
  }
})

describe('FeatureCard', () => {
  const mockFeature = {
    title: 'Test Feature',
    description: 'Test description',
    icon: '🎯',
    delay: 0,
  }

  it('renders feature card with title and description', async () => {
    render(<FeatureCard {...mockFeature} />)
    await waitFor(() => {
      expect(screen.getByText('Test Feature')).toBeInTheDocument()
      expect(screen.getByText('Test description')).toBeInTheDocument()
    })
  })

  it('shows dot cluster on hover', async () => {
    render(<FeatureCard {...mockFeature} />)
    const card = screen.getByText('Test Feature').closest('div')
    
    expect(screen.queryByTestId('dot-cluster')).not.toBeInTheDocument()
    
    if (card) {
      fireEvent.mouseEnter(card)
      
      await waitFor(() => {
        expect(screen.getByTestId('dot-cluster')).toBeInTheDocument()
      })
    }
  })

  it('renders icon', async () => {
    render(<FeatureCard {...mockFeature} />)
    await waitFor(() => {
      expect(screen.getByText('🎯')).toBeInTheDocument()
    })
  })
})

