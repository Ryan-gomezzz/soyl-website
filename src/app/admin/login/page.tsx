'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (username === 'admin' && password === 'soyladmin123') {
            // Set a simple cookie or local storage
            document.cookie = 'admin_auth=true; path=/'
            router.push('/admin/dashboard')
        } else {
            setError('Invalid credentials')
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
                        className="w-full py-2 bg-accent text-bg font-bold rounded hover:bg-accent-2 transition-colors"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}
