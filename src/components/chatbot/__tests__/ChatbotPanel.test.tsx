import { render, screen, fireEvent } from '@testing-library/react'
import { ChatbotPanel } from '../ChatbotPanel'
import type { ReactNode } from 'react'

// Mock the useChatbotState hook
const mockSetOpen = jest.fn()
const mockSetPinned = jest.fn()
const mockSetMinimized = jest.fn()
const mockSetPrefersModal = jest.fn()

const mockUseChatbotState = jest.fn(() => ({
  open: false,
  pinned: false,
  minimized: false,
  prefersModal: false,
  setOpen: mockSetOpen,
  setPinned: mockSetPinned,
  setMinimized: mockSetMinimized,
  setPrefersModal: mockSetPrefersModal,
  requestModalModeForFlow: mockSetPrefersModal,
  lastY: 0,
  setLastY: jest.fn(),
}))

jest.mock('../hooks/useChatbotState', () => ({
  useChatbotState: () => mockUseChatbotState(),
}))

// Mock MCQEngine
jest.mock('../MCQEngine', () => ({
  MCQEngine: () => <div>MCQ Engine Content</div>,
  FlowJson: {},
}))

// Mock framer-motion
jest.mock('framer-motion', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react')
  // Filter out framer-motion specific props that shouldn't be passed to DOM
  const filterProps = (props: { [key: string]: unknown }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { initial: _initial, animate: _animate, exit: _exit, whileHover: _whileHover, whileTap: _whileTap, transition: _transition, ...domProps } = props
    return domProps
  }
  const createMotionComponent = (tag: string) => {
    return React.forwardRef<HTMLElement, { children?: React.ReactNode; [key: string]: unknown }>(
      (props, ref) => {
        const { children, ...rest } = props
        return React.createElement(tag, { ...filterProps(rest), ref }, children)
      }
    )
  }
  return {
    motion: {
      aside: createMotionComponent('aside'),
      div: createMotionComponent('div'),
    },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  }
})

// Mock default flow
jest.mock('../mcq-flows/default-flow.json', () => ({
  id: 'test-flow',
  meta: { title: 'Test', version: '1.0' },
  startNode: 'n_start',
  nodes: { n_start: { type: 'question', text: 'Start' } },
}))

describe('ChatbotPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sessionStorage.clear()
    // Reset mock to return closed by default
    mockUseChatbotState.mockReturnValue({
      open: false,
      pinned: false,
      minimized: false,
      prefersModal: false,
      setOpen: mockSetOpen,
      setPinned: mockSetPinned,
      setMinimized: mockSetMinimized,
      setPrefersModal: mockSetPrefersModal,
      requestModalModeForFlow: mockSetPrefersModal,
      lastY: 0,
      setLastY: jest.fn(),
    })
  })

  it('renders panel even when closed (for animations)', () => {
    const { container } = render(<ChatbotPanel />)
    // Panel should be in DOM but off-screen when closed
    const panel = container.querySelector('.chat-panel')
    expect(panel).toBeInTheDocument()
  })

  it('renders panel when open', () => {
    mockUseChatbotState.mockReturnValue({
      open: true,
      pinned: false,
      minimized: false,
      prefersModal: false,
      setOpen: mockSetOpen,
      setPinned: mockSetPinned,
      setMinimized: mockSetMinimized,
      setPrefersModal: mockSetPrefersModal,
      requestModalModeForFlow: mockSetPrefersModal,
      lastY: 0,
      setLastY: jest.fn(),
    })

    render(<ChatbotPanel />)
    expect(screen.getByLabelText('SOYL Assistant panel')).toBeInTheDocument()
  })

  it('overlay has pointer-events-none by default', () => {
    mockUseChatbotState.mockReturnValue({
      open: true,
      pinned: false,
      minimized: false,
      prefersModal: false,
      setOpen: mockSetOpen,
      setPinned: mockSetPinned,
      setMinimized: mockSetMinimized,
      setPrefersModal: mockSetPrefersModal,
      requestModalModeForFlow: mockSetPrefersModal,
      lastY: 0,
      setLastY: jest.fn(),
    })

    const { container } = render(<ChatbotPanel />)
    const overlay = container.querySelector('.chat-overlay')
    expect(overlay).toHaveClass('pointer-events-none')
  })

  it('overlay becomes blocking when modal mode is enabled', () => {
    mockUseChatbotState.mockReturnValue({
      open: true,
      pinned: false,
      minimized: false,
      prefersModal: true,
      setOpen: mockSetOpen,
      setPinned: mockSetPinned,
      setMinimized: mockSetMinimized,
      setPrefersModal: mockSetPrefersModal,
      requestModalModeForFlow: mockSetPrefersModal,
      lastY: 0,
      setLastY: jest.fn(),
    })

    const { container } = render(<ChatbotPanel />)
    const overlay = container.querySelector('.chat-overlay')
    expect(overlay).toHaveClass('pointer-events-auto')
  })

  it('allows background clicks when overlay is non-blocking', () => {
    mockUseChatbotState.mockReturnValue({
      open: true,
      pinned: false,
      minimized: false,
      prefersModal: false,
      setOpen: mockSetOpen,
      setPinned: mockSetPinned,
      setMinimized: mockSetMinimized,
      setPrefersModal: mockSetPrefersModal,
      requestModalModeForFlow: mockSetPrefersModal,
      lastY: 0,
      setLastY: jest.fn(),
    })

    // Create a button outside the panel
    render(
      <>
        <button data-testid="background-button">Click me</button>
        <ChatbotPanel />
      </>
    )

    const backgroundButton = screen.getByTestId('background-button')
    fireEvent.click(backgroundButton)
    
    // Button click should work (no blocking)
    expect(backgroundButton).toBeInTheDocument()
  })

  it('closes panel on ESC when not pinned', () => {
    mockUseChatbotState.mockReturnValue({
      open: true,
      pinned: false,
      minimized: false,
      prefersModal: false,
      setOpen: mockSetOpen,
      setPinned: mockSetPinned,
      setMinimized: mockSetMinimized,
      setPrefersModal: mockSetPrefersModal,
      requestModalModeForFlow: mockSetPrefersModal,
      lastY: 0,
      setLastY: jest.fn(),
    })

    render(<ChatbotPanel />)
    
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    
    expect(mockSetOpen).toHaveBeenCalledWith(false)
  })

  it('does not close panel on ESC when pinned', () => {
    mockUseChatbotState.mockReturnValue({
      open: true,
      pinned: true,
      minimized: false,
      prefersModal: false,
      setOpen: mockSetOpen,
      setPinned: mockSetPinned,
      setMinimized: mockSetMinimized,
      setPrefersModal: mockSetPrefersModal,
      requestModalModeForFlow: mockSetPrefersModal,
      lastY: 0,
      setLastY: jest.fn(),
    })

    render(<ChatbotPanel />)
    
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    
    expect(mockSetOpen).not.toHaveBeenCalled()
  })

  it('enables modal mode when toggle is checked', () => {
    mockUseChatbotState.mockReturnValue({
      open: true,
      pinned: false,
      minimized: false,
      prefersModal: false,
      setOpen: mockSetOpen,
      setPinned: mockSetPinned,
      setMinimized: mockSetMinimized,
      setPrefersModal: mockSetPrefersModal,
      requestModalModeForFlow: mockSetPrefersModal,
      lastY: 0,
      setLastY: jest.fn(),
    })

    render(<ChatbotPanel />)
    
    const checkbox = screen.getByLabelText(/Modal Assist Mode/i)
    fireEvent.click(checkbox)
    
    expect(mockSetPrefersModal).toHaveBeenCalledWith(true)
  })

  it('has aria-modal=true when modal mode is enabled', () => {
    mockUseChatbotState.mockReturnValue({
      open: true,
      pinned: false,
      minimized: false,
      prefersModal: true,
      setOpen: mockSetOpen,
      setPinned: mockSetPinned,
      setMinimized: mockSetMinimized,
      setPrefersModal: mockSetPrefersModal,
      requestModalModeForFlow: mockSetPrefersModal,
      lastY: 0,
      setLastY: jest.fn(),
    })

    render(<ChatbotPanel />)
    const panel = screen.getByLabelText('SOYL Assistant panel')
    expect(panel).toHaveAttribute('aria-modal', 'true')
    expect(panel).toHaveAttribute('role', 'dialog')
  })

  it('has role="complementary" when modal mode is disabled', () => {
    mockUseChatbotState.mockReturnValue({
      open: true,
      pinned: false,
      minimized: false,
      prefersModal: false,
      setOpen: mockSetOpen,
      setPinned: mockSetPinned,
      setMinimized: mockSetMinimized,
      setPrefersModal: mockSetPrefersModal,
      requestModalModeForFlow: mockSetPrefersModal,
      lastY: 0,
      setLastY: jest.fn(),
    })

    render(<ChatbotPanel />)
    const panel = screen.getByLabelText('SOYL Assistant panel')
    expect(panel).not.toHaveAttribute('aria-modal')
    expect(panel).toHaveAttribute('role', 'complementary')
  })

  it('has minimize and pin buttons', () => {
    mockUseChatbotState.mockReturnValue({
      open: true,
      pinned: false,
      minimized: false,
      prefersModal: false,
      setOpen: mockSetOpen,
      setPinned: mockSetPinned,
      setMinimized: mockSetMinimized,
      setPrefersModal: mockSetPrefersModal,
      requestModalModeForFlow: mockSetPrefersModal,
      lastY: 0,
      setLastY: jest.fn(),
    })

    render(<ChatbotPanel />)
    
    expect(screen.getByLabelText('Minimize panel')).toBeInTheDocument()
    expect(screen.getByLabelText('Pin panel')).toBeInTheDocument()
    expect(screen.getByLabelText('Close panel')).toBeInTheDocument()
  })

  it('calls setMinimized when minimize button is clicked', () => {
    mockUseChatbotState.mockReturnValue({
      open: true,
      pinned: false,
      minimized: false,
      prefersModal: false,
      setOpen: mockSetOpen,
      setPinned: mockSetPinned,
      setMinimized: mockSetMinimized,
      setPrefersModal: mockSetPrefersModal,
      requestModalModeForFlow: mockSetPrefersModal,
      lastY: 0,
      setLastY: jest.fn(),
    })

    render(<ChatbotPanel />)
    
    const minimizeButton = screen.getByLabelText('Minimize panel')
    fireEvent.click(minimizeButton)
    
    expect(mockSetMinimized).toHaveBeenCalledWith(true)
  })

  it('calls setPinned when pin button is clicked', () => {
    mockUseChatbotState.mockReturnValue({
      open: true,
      pinned: false,
      minimized: false,
      prefersModal: false,
      setOpen: mockSetOpen,
      setPinned: mockSetPinned,
      setMinimized: mockSetMinimized,
      setPrefersModal: mockSetPrefersModal,
      requestModalModeForFlow: mockSetPrefersModal,
      lastY: 0,
      setLastY: jest.fn(),
    })

    render(<ChatbotPanel />)
    
    const pinButton = screen.getByLabelText('Pin panel')
    fireEvent.click(pinButton)
    
    expect(mockSetPinned).toHaveBeenCalledWith(true)
  })
})

