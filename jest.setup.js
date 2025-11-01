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
}

