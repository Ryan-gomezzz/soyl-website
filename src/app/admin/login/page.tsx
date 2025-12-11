'use client'

import { useState } from 'react'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
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
            })

            const data = await response.json()

            if (!response.ok) {
                const errorMessage = data.error || 'Invalid credentials'
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

            // Small delay to ensure cookie is set before redirect
            await new Promise(resolve => setTimeout(resolve, 100))
            
            // Use window.location for a full page reload to ensure cookie is read
            window.location.href = '/admin/dashboard'
        } catch (err) {
            console.error('Login error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            
            if (errorMessage.includes('fetch')) {
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
                <form onSubmit={handleLogin} className="space-y-4">
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
                        disabled={isLoading}
                        className="w-full py-2 bg-accent text-bg font-bold rounded hover:bg-accent-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}
