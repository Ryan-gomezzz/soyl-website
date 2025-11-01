import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MCQEngine, FlowJson } from '../MCQEngine'

// Mock the useSessionId hook
jest.mock('../hooks/useSessionId', () => ({
  useSessionId: () => 'test-session-123',
}))

// Mock fetch
global.fetch = jest.fn()

const mockFlow: FlowJson = {
  id: 'test-flow',
  meta: {
    title: 'Test Flow',
    version: '1.0',
  },
  startNode: 'n_welcome',
  nodes: {
    n_welcome: {
      type: 'question',
      text: 'Welcome! What would you like to do?',
      choices: [
        { id: 'c_option1', text: 'Option 1', next: 'n_result' },
        { id: 'c_option2', text: 'Option 2', next: 'n_result' },
      ],
    },
    n_result: {
      type: 'info',
      text: 'You selected an option.',
      choices: [{ id: 'c_back', text: 'Back', next: 'n_welcome' }],
    },
  },
}

describe('MCQEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })
    sessionStorage.clear()
  })

  it('renders the welcome node', () => {
    render(<MCQEngine flow={mockFlow} consent={true} onConsentChange={jest.fn()} />)

    expect(screen.getByText(/Welcome! What would you like to do?/)).toBeInTheDocument()
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  it('requires consent before allowing choices', () => {
    const onConsentChange = jest.fn()
    render(<MCQEngine flow={mockFlow} consent={false} onConsentChange={onConsentChange} />)

    const checkbox = screen.getByLabelText(/I consent to non-identifying analytics/i)
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).not.toBeChecked()

    const option1 = screen.getByText('Option 1')
    expect(option1).toBeDisabled()
  })

  it('navigates to next node on choice click', async () => {
    render(<MCQEngine flow={mockFlow} consent={true} onConsentChange={jest.fn()} />)

    const option1 = screen.getByText('Option 1')
    fireEvent.click(option1)

    await waitFor(() => {
      expect(screen.getByText(/You selected an option/i)).toBeInTheDocument()
    })
  })

  it('sends log to API on choice', async () => {
    render(<MCQEngine flow={mockFlow} consent={true} onConsentChange={jest.fn()} />)

    const option1 = screen.getByText('Option 1')
    fireEvent.click(option1)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/chatbot/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"nodeId":"n_welcome"'),
      })
    })
  })

  it('allows back navigation', async () => {
    render(<MCQEngine flow={mockFlow} consent={true} onConsentChange={jest.fn()} />)

    // Click option to navigate forward
    fireEvent.click(screen.getByText('Option 1'))

    await waitFor(() => {
      expect(screen.getByText(/You selected an option/i)).toBeInTheDocument()
    })

    // Click back
    fireEvent.click(screen.getByText('← Back'))

    await waitFor(() => {
      expect(screen.getByText(/Welcome! What would you like to do?/)).toBeInTheDocument()
    })
  })

  it('restarts flow when restart button is clicked', async () => {
    render(<MCQEngine flow={mockFlow} consent={true} onConsentChange={jest.fn()} />)

    // Click option to navigate
    fireEvent.click(screen.getByText('Option 1'))

    await waitFor(() => {
      expect(screen.getByText(/You selected an option/i)).toBeInTheDocument()
    })

    // Click restart
    fireEvent.click(screen.getByText('↻ Restart'))

    await waitFor(() => {
      expect(screen.getByText(/Welcome! What would you like to do?/)).toBeInTheDocument()
    })
  })
})

