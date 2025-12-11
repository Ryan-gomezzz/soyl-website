'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/admin/logout', {
                method: 'POST',
                credentials: 'include',
            })

            if (response.ok) {
                // Redirect to login page
                router.push('/admin/login')
                router.refresh()
            } else {
                console.error('Logout failed')
                setIsLoading(false)
            }
        } catch (error) {
            console.error('Logout error:', error)
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
            {isLoading ? 'Logging out...' : 'Logout'}
        </button>
    )
}

