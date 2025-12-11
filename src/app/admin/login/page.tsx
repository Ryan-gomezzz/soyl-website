'use client'

import { useState } from 'react'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation() // Prevent any form bubbling
        
        if (isLoading) return // Prevent double submission
        
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include', // Ensure cookies are sent and received
                redirect: 'follow', // Follow redirects
            })

            // Parse JSON response
            const data = await response.json()

            if (!response.ok) {
                const errorMessage = data?.error || 'Invalid credentials'
                setError(errorMessage)
                
                // Provide more helpful error messages
                if (response.status === 500 && errorMessage.includes('ADMIN_PASSWORD')) {
                    setError('Server configuration error. Please contact the administrator.')
                } else if (response.status === 429) {
                    setError('Too many login attempts. Please wait before trying again.')
                } else if (response.status === 401) {
                    setError('Invalid username or password. Please try again.')
                } else {
                    setError(errorMessage)
                }
                
                setIsLoading(false)
                return
            }

            // Success - cookie should be set now
            if (data.success) {
                console.log('[Login] Login successful, redirecting to dashboard')
                
                // Small delay to ensure cookie is available in browser
                await new Promise(resolve => setTimeout(resolve, 200))
                
                // Use window.location.href for more reliable redirect
                // This ensures the browser processes the cookie before navigation
                const redirectUrl = data.redirect || '/admin/dashboard'
                
                try {
                    window.location.href = redirectUrl
                    // Fallback after 1 second if redirect hasn't happened
                    setTimeout(() => {
                        if (window.location.pathname !== redirectUrl) {
                            console.warn('[Login] Redirect may have failed, trying again')
                            window.location.href = redirectUrl
                        }
                    }, 1000)
                } catch (redirectError) {
                    console.error('[Login] Redirect error:', redirectError)
                    setError('Redirect failed. Please navigate to the dashboard manually.')
                    setIsLoading(false)
                }
            } else {
                // Fallback if success flag is missing
                setError('Login successful but redirect failed. Please try accessing the dashboard directly.')
                setIsLoading(false)
            }
        } catch (err) {
            console.error('Login error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            
            if (errorMessage.includes('fetch') || err instanceof TypeError) {
                setError('Unable to connect to the server. Please check your connection and try again.')
            } else {
                setError('An unexpected error occurred. Please try again.')
            }
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg">
            <div className="w-full max-w-md p-8 glass rounded-xl border border-white/10">
                <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
                <form onSubmit={handleLogin} className="space-y-4" noValidate>
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 rounded bg-bg/50 border border-white/10 focus:border-accent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 rounded bg-bg/50 border border-white/10 focus:border-accent outline-none"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading || !username || !password}
                        className="w-full py-2 bg-accent text-bg font-bold rounded hover:bg-accent-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}
