'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { findSectionByQuery, getSectionById, WebsiteSection } from '@/lib/websiteSections'

interface UseWebsiteNavigationOptions {
  enabled?: boolean
  onSectionChange?: (section: WebsiteSection | null) => void
}

interface UseWebsiteNavigationReturn {
  currentSection: WebsiteSection | null
  scrollToSection: (sectionId: string, smooth?: boolean) => Promise<void>
  scrollToSectionByQuery: (query: string, smooth?: boolean) => Promise<void>
  isScrolling: boolean
}

export function useWebsiteNavigation(
  options: UseWebsiteNavigationOptions = {}
): UseWebsiteNavigationReturn {
  const { enabled = true, onSectionChange } = options
  const [currentSection, setCurrentSection] = useState<WebsiteSection | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sectionElementsRef = useRef<Map<string, HTMLElement>>(new Map())
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const userScrollRef = useRef(false)

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Register section elements
  const registerSection = useCallback((id: string, element: HTMLElement | null) => {
    if (element) {
      sectionElementsRef.current.set(id, element)
    } else {
      sectionElementsRef.current.delete(id)
    }
  }, [])

  // Helper to scroll to an element
  const scrollToElement = useCallback(
    async (element: HTMLElement, smooth: boolean): Promise<void> => {
      setIsScrolling(true)
      userScrollRef.current = false

      // Clear any existing scroll timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      const scrollBehavior = smooth && !prefersReducedMotion ? 'smooth' : 'auto'
      const scrollDuration = smooth && !prefersReducedMotion ? 1000 : 0

      // Calculate target position (accounting for fixed headers if any)
      const headerOffset = 80 // Adjust based on your header height
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: scrollBehavior,
      })

      // Wait for scroll to complete
      await new Promise<void>((resolve) => {
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false)
          resolve()
        }, scrollDuration)
      })
    },
    [prefersReducedMotion]
  )

  // Scroll to a section by ID
  const scrollToSection = useCallback(
    async (sectionId: string, smooth: boolean = true): Promise<void> => {
      const section = getSectionById(sectionId)
      if (!section) {
        console.warn(`Section with ID "${sectionId}" not found`)
        return
      }

      const element = sectionElementsRef.current.get(sectionId)
      if (!element) {
        // Try to find element by ID in DOM
        const domElement = document.getElementById(sectionId)
        if (domElement) {
          sectionElementsRef.current.set(sectionId, domElement)
          await scrollToElement(domElement, smooth)
        } else {
          console.warn(`Element for section "${sectionId}" not found in DOM`)
        }
        return
      }

      await scrollToElement(element, smooth)
    },
    [scrollToElement]
  )

  // Scroll to a section by query
  const scrollToSectionByQuery = useCallback(
    async (query: string, smooth: boolean = true): Promise<void> => {
      const section = findSectionByQuery(query)
      if (!section) {
        console.warn(`No section found for query: "${query}"`)
        return
      }

      await scrollToSection(section.id, smooth)
    },
    [scrollToSection]
  )

  // Set up Intersection Observer to detect current section
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Section is "active" when it's in the top 20% of viewport
      threshold: 0,
    }

    observerRef.current = new IntersectionObserver((entries) => {
      // Find the entry with the highest intersection ratio
      let maxRatio = 0
      let activeEntry: IntersectionObserverEntry | null = null

      entries.forEach((entry) => {
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio
          activeEntry = entry
        }
      })

      if (activeEntry && activeEntry.isIntersecting && !isScrolling) {
        const sectionId = activeEntry.target.id
        const section = getSectionById(sectionId)
        if (section && section.id !== currentSection?.id) {
          setCurrentSection(section)
          onSectionChange?.(section)
        }
      }
    }, observerOptions)

    // Observe all registered section elements
    sectionElementsRef.current.forEach((element) => {
      observerRef.current?.observe(element)
    })

    // Also observe elements that might already be in the DOM
    const allSections = ['hero', 'assistant-promo', 'flowchart', 'what-soyl-does', 
                        'why-choose-us', 'how-it-works', 'product-features', 
                        'testimonials', 'use-cases', 'soyl-rd', 'trust-compliance', 
                        'request-pilot']
    
    allSections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        registerSection(id, element)
        observerRef.current?.observe(element)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [enabled, isScrolling, currentSection, onSectionChange, registerSection])

  // Detect user scrolling to allow manual override
  useEffect(() => {
    if (!enabled) return

    let scrollTimer: NodeJS.Timeout | null = null

    const handleScroll = () => {
      if (!isScrolling) {
        userScrollRef.current = true
      }

      // Clear existing timer
      if (scrollTimer) {
        clearTimeout(scrollTimer)
      }

      // Set a timer to reset user scroll flag after scrolling stops
      scrollTimer = setTimeout(() => {
        userScrollRef.current = false
      }, 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimer) {
        clearTimeout(scrollTimer)
      }
    }
  }, [enabled, isScrolling])

  // Register sections that are already in the DOM on mount
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    // Register all known sections
    const allSections = ['hero', 'assistant-promo', 'flowchart', 'what-soyl-does', 
                        'why-choose-us', 'how-it-works', 'product-features', 
                        'testimonials', 'use-cases', 'soyl-rd', 'trust-compliance', 
                        'request-pilot']
    
    allSections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        registerSection(id, element)
      }
    })
  }, [enabled, registerSection])

  return {
    currentSection,
    scrollToSection,
    scrollToSectionByQuery,
    isScrolling,
  }
}

