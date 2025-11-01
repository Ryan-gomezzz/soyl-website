// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock IntersectionObserver for jsdom
if (typeof window !== 'undefined') {
  window.IntersectionObserver = class IntersectionObserver {
    constructor() {
      // Constructor stub
    }
    observe() {
      // Observe stub
    }
    unobserve() {
      // Unobserve stub
    }
    disconnect() {
      // Disconnect stub
    }
  }

  // Also mock ResizeObserver (used by Framer Motion)
  window.ResizeObserver = class ResizeObserver {
    constructor() {
      // Constructor stub
    }
    observe() {
      // Observe stub
    }
    unobserve() {
      // Unobserve stub
    }
    disconnect() {
      // Disconnect stub
    }
  }

  // Mock matchMedia for prefers-reduced-motion
  window.matchMedia = (query) => ({
    matches: false, // Default to no reduced motion
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })
}

