'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  // Redirect to login if session is missing (best-effort client guard; server guard is middleware)
  useEffect(() => {
    fetch('/api/admin/auth/verify')
      .then((res) => {
        if (!res.ok) {
          router.push('/admin/login')
        }
      })
      .catch(() => {
        router.push('/admin/login')
      })
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1224] via-[#0e162d] to-[#0b1224] text-white">
      {children}
    </div>
  )
}

