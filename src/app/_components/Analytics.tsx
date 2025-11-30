'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    // Send page visit to analytics API
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
    }).catch((err) => console.error('Analytics error:', err))
  }, [pathname])

  return null
}

