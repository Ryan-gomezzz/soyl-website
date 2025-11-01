import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AssistantPromo } from '../AssistantPromo'
import { ChatbotController } from '../chatbot/controller'

// Mock ChatbotController
jest.mock('../chatbot/controller', () => ({
  ChatbotController: {
    open: jest.fn(),
    close: jest.fn(),
    toggle: jest.fn(),
  },
}))

// Mock DotPattern
jest.mock('@/app/_components/DotPattern', () => ({
  DotPattern: ({ className }: { className?: string }) => (
    <div data-testid="dot-pattern" className={className} />
  ),
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <button {...props}>{children}</button>
    ),
  },
}))

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

  it('renders primary CTA button that opens chatbot panel', async () => {
    render(<AssistantPromo />)
    
    await waitFor(() => {
      expect(screen.getByText('Try the Assistant')).toBeInTheDocument()
    })
    
    const tryButton = screen.getByText('Try the Assistant').closest('button')
    expect(tryButton).toBeInTheDocument()
    expect(tryButton).toHaveAttribute('aria-controls', 'soyl-assistant-panel')
    expect(tryButton).toHaveAttribute('aria-label', 'Open SOYL Assistant chatbot panel')

    fireEvent.click(tryButton!)
    expect(ChatbotController.open).toHaveBeenCalledTimes(1)
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
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as HTMLElement)

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
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as HTMLElement)

    render(<AssistantPromo />)
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /how it works/i })).toBeInTheDocument()
    })
    const howItWorksLink = screen.getByRole('link', { name: /how it works/i })

    fireEvent.click(howItWorksLink)
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' })
  })
})

