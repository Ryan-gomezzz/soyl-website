import { render, screen } from '@testing-library/react'
import Home from '../page'

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill: _fill, priority: _priority, ...props }: { src: string; alt: string; fill?: boolean; priority?: boolean; [key: string]: unknown }) => {
    // Remove Next.js specific props that cause warnings in test environment
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...props} />
  },
}))

describe('Home Page Smoke Test', () => {
  it('renders hero H1 with SOYL text', () => {
    render(<Home />)
    // Find the hero heading specifically by role
    const headings = screen.getAllByRole('heading', { level: 1 })
    const heroHeading = headings.find((h) => h.textContent?.includes('SOYL'))
    expect(heroHeading).toBeInTheDocument()
    expect(heroHeading?.textContent).toContain('SOYL')
  })

  it('renders "Story Of Your Life" in hero', () => {
    render(<Home />)
    const subtitle = screen.getByText(/Story Of Your Life/i)
    expect(subtitle).toBeInTheDocument()
  })

  it('renders "Request a pilot" CTA', () => {
    render(<Home />)
    // Find the CTA link specifically by role
    const links = screen.getAllByRole('link')
    const pilotLink = links.find((link) => 
      link.textContent?.includes('Request a pilot') && 
      link.getAttribute('href')?.includes('mailto')
    )
    expect(pilotLink).toBeInTheDocument()
  })

  it('renders "What SOYL Does" section', () => {
    render(<Home />)
    const section = screen.getByRole('heading', { name: /What SOYL Does/i })
    expect(section).toBeInTheDocument()
  })
})

