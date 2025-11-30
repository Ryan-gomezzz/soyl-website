'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function InquiryPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: 'SALES',
        message: '',
    })
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('submitting')
        try {
            const res = await fetch('/api/inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            if (res.ok) {
                setStatus('success')
                setFormData({ name: '', email: '', type: 'SALES', message: '' })
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
                    <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                    <p className="text-muted">
                        Get in touch with our team for sales, support, or general inquiries.
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
                                placeholder="Jane Doe"
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
                                placeholder="jane@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Inquiry Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full p-3 rounded-lg bg-bg/50 border border-white/10 focus:border-accent outline-none transition-colors"
                        >
                            <option value="SALES">Sales</option>
                            <option value="SUPPORT">Support</option>
                            <option value="GENERAL">General Inquiry</option>
                            <option value="PARTNERSHIP">Partnership</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Message *</label>
                        <textarea
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={5}
                            className="w-full p-3 rounded-lg bg-bg/50 border border-white/10 focus:border-accent outline-none transition-colors"
                            placeholder="How can we help you?"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full py-4 bg-accent text-bg font-bold rounded-lg hover:bg-accent-2 transition-all hover:shadow-lg hover:shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'submitting' ? 'Sending...' : 'Send Message'}
                    </button>

                    {status === 'success' && (
                        <p className="text-green-400 text-center">Message sent successfully! We&apos;ll get back to you soon.</p>
                    )}
                    {status === 'error' && (
                        <p className="text-red-400 text-center">Something went wrong. Please try again.</p>
                    )}
                </motion.form>
            </div>
        </div>
    )
}
