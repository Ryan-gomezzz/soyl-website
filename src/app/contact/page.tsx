'use client'

import { CTA } from '../_components/CTA'
import { Mail, MessageSquare, Calendar } from 'lucide-react'

export default function ContactPage() {
    return (
        <div className="pt-24 min-h-screen bg-bg flex items-center">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Let's Talk.</h1>
                        <p className="text-xl text-muted mb-12">
                            Ready to deploy Autonomous Agents? We can get you live in 2 weeks.
                        </p>

                        <div className="space-y-8">
                            <ContactOption
                                icon={Mail}
                                title="Email Us"
                                value="hello@soyl.ai"
                                href="mailto:hello@soyl.ai"
                            />
                            <ContactOption
                                icon={Calendar}
                                title="Book a Demo"
                                value="Schedule 30 mins"
                                href="https://calendly.com/" target="_blank"
                            />
                        </div>
                    </div>

                    <div className="bg-panel rounded-2xl p-8 border border-white/10">
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-muted mb-2">Name</label>
                                <input type="text" id="name" className="w-full bg-bg/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" placeholder="John Doe" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-muted mb-2">Work Email</label>
                                <input type="email" id="email" className="w-full bg-bg/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" placeholder="john@company.com" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-muted mb-2">Project Details</label>
                                <textarea id="message" rows={4} className="w-full bg-bg/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors" placeholder="Tell us what you want to build..." />
                            </div>
                            <CTA href="#" variant="primary" className="w-full justify-center">Send Requests</CTA>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ContactOption({ icon: Icon, title, value, href, target }: any) {
    return (
        <a href={href} target={target} className="flex items-center gap-6 group">
            <div className="w-12 h-12 rounded-full bg-panel border border-white/10 flex items-center justify-center group-hover:border-accent/50 transition-colors">
                <Icon className="w-6 h-6 text-white group-hover:text-accent transition-colors" />
            </div>
            <div>
                <div className="text-sm text-muted mb-1">{title}</div>
                <div className="text-xl font-semibold text-white group-hover:text-accent transition-colors">{value}</div>
            </div>
        </a>
    )
}
