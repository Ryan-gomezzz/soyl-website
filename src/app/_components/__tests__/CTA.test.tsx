import { render, screen } from '@testing-library/react'
import { CTA } from '../CTA'

describe('CTA Component', () => {
  it('renders with primary variant', () => {
    render(<CTA href="/test">Test Button</CTA>)
    const link = screen.getByRole('link', { name: /test button/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('renders with secondary variant', () => {
    render(
      <CTA href="/test" variant="secondary">
        Secondary Button
      </CTA>
    )
    const link = screen.getByRole('link', { name: /secondary button/i })
    expect(link).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(
      <CTA href="/test" size="sm">
        Small
      </CTA>
    )
    expect(screen.getByRole('link')).toBeInTheDocument()

    rerender(
      <CTA href="/test" size="lg">
        Large
      </CTA>
    )
    expect(screen.getByRole('link')).toBeInTheDocument()
  })
})

