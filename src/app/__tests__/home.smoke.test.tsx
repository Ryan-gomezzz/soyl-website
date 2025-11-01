import { render, screen } from '@testing-library/react'
import Home from '../page'

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('Home Page Smoke Test', () => {
  it('renders hero H1 with SOYL text', () => {
    render(<Home />)
    const heading = screen.getByText(/SOYL/i)
    expect(heading).toBeInTheDocument()
  })

  it('renders "Story Of Your Life" in hero', () => {
    render(<Home />)
    const subtitle = screen.getByText(/Story Of Your Life/i)
    expect(subtitle).toBeInTheDocument()
  })

  it('renders "Request a pilot" CTA', () => {
    render(<Home />)
    const cta = screen.getByText(/Request a pilot/i)
    expect(cta).toBeInTheDocument()
  })

  it('renders "What SOYL Does" section', () => {
    render(<Home />)
    const section = screen.getByText(/What SOYL Does/i)
    expect(section).toBeInTheDocument()
  })
})

