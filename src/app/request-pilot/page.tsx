'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function RequestPilotPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        needs: '',
    })
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('submitting')
        try {
            const res = await fetch('/api/pilot-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            if (res.ok) {
                setStatus('success')
                setFormData({ name: '', email: '', company: '', phone: '', needs: '' })
            } else {
                setStatus('error')
            }
        } catch (error) {
            setStatus('error')
        }
    }

    return (
        <div className="pt-32 pb-24 px-6">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold mb-4">Request a Pilot</h1>
                    <p className="text-muted">
                        Start your 14-day pilot program to validate profitability and feasibility.
                    </p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="space-y-6 glass p-8 rounded-xl border border-white/10"
                >
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Name *</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 rounded-lg bg-bg/50 border border-white/10 focus:border-accent outline-none transition-colors"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Email *</label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-3 rounded-lg bg-bg/50 border border-white/10 focus:border-accent outline-none transition-colors"
                                placeholder="john@company.com"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Company *</label>
                            <input
                                required
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full p-3 rounded-lg bg-bg/50 border border-white/10 focus:border-accent outline-none transition-colors"
                                placeholder="Acme Inc."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full p-3 rounded-lg bg-bg/50 border border-white/10 focus:border-accent outline-none transition-colors"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Specific Needs / Challenges</label>
                        <textarea
                            value={formData.needs}
                            onChange={(e) => setFormData({ ...formData, needs: e.target.value })}
                            rows={4}
                            className="w-full p-3 rounded-lg bg-bg/50 border border-white/10 focus:border-accent outline-none transition-colors"
                            placeholder="Describe your current challenges and what you hope to achieve..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full py-4 bg-accent text-bg font-bold rounded-lg hover:bg-accent-2 transition-all hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'submitting' ? 'Submitting...' : 'Submit Request'}
                    </button>

                    {status === 'success' && (
                        <p className="text-green-400 text-center">Request submitted successfully! We'll be in touch shortly.</p>
                    )}
                    {status === 'error' && (
                        <p className="text-red-400 text-center">Something went wrong. Please try again.</p>
                    )}
                </motion.form>
            </div>
        </div>
    )
}
