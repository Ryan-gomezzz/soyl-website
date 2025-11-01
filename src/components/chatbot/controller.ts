/**
 * ChatbotController - Programmatic API to control the chatbot panel
 * This allows other components (like AssistantPromo) to open/close the panel
 * without directly coupling to ChatbotLauncher or ChatbotPanel
 */

export const ChatbotController = {
  /**
   * Open the chatbot panel
   */
  open: () => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent('soyl-chatbot-open'))
  },

  /**
   * Close the chatbot panel
   */
  close: () => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent('soyl-chatbot-close'))
  },

  /**
   * Toggle the chatbot panel (open if closed, close if open)
   */
  toggle: () => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent('soyl-chatbot-toggle'))
  },
}

