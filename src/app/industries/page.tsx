'use client'

import { CTA } from '../_components/CTA'
import { CheckCircle } from 'lucide-react'
import Image from 'next/image'

export default function IndustriesPage() {
    return (
        <div className="pt-24 min-h-screen bg-bg">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-24">
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Industries</h1>
                    <p className="text-xl text-muted max-w-2xl mx-auto">
                        Purpose-built AI infrastructure for specific verticals.
                        We don&apos;t do &quot;general purpose&quot; chat. We do outcomes.
                    </p>
                </div>

                <div className="space-y-24">
                    {/* E-Commerce Section (Live) */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium mb-6">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Live & Scaling
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">E-Commerce Infrastructure</h2>
                            <p className="text-muted text-lg mb-8 leading-relaxed">
                                We don&apos;t just build your site. We run your stack.
                                SOYL provides complete e-commerce automation: hosting, maintenance,
                                transactional emails, and scaling logic.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <ListItem>Launch in 2 weeks guaranteed</ListItem>
                                <ListItem>Predictable monthly pricing (No agency retainers)</ListItem>
                                <ListItem>Includes hosting, security, and maintenance</ListItem>
                            </ul>
                            <CTA href="/pricing" variant="primary">View Pricing</CTA>
                        </div>
                        <div className="bg-panel rounded-2xl border border-white/10 relative overflow-hidden group min-h-[300px] flex flex-col justify-end p-8">
                            <Image
                                src="/images/ecommerce-bg.png"
                                alt="Automated Logistics"
                                fill
                                className="object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                            <h3 className="text-xl font-bold mb-2 relative z-10">B2C Automation</h3>
                            <p className="text-sm text-muted relative z-10 w-full">
                                From &quot;Order Placed&quot; to &quot;Delivered&quot;, our agents handle the noise so you can focus on brand.
                            </p>
                        </div>
                    </section>

                    {/* Hospitality Section (Pilot) */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
                        <div className="lg:order-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium mb-6">
                                Pilot Program
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hospitality & Hotels</h2>
                            <p className="text-muted text-lg mb-8 leading-relaxed">
                                Transform guest experiences with voice-first room service and concierge agents.
                                Currently deployed in select boutique hotels.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <ListItem>Zero-wait room service ordering</ListItem>
                                <ListItem>Multilingual front-desk support</ListItem>
                                <ListItem>Automated housekeeping requests</ListItem>
                            </ul>
                            <CTA href="/contact" variant="outline">Join Waitlist</CTA>
                        </div>
                        <div className="bg-panel rounded-2xl border border-white/10 relative overflow-hidden group min-h-[300px] flex flex-col justify-end p-8 lg:order-1">
                            <Image
                                src="/images/hospitality-bg.png"
                                alt="Luxury Hospitality"
                                fill
                                className="object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                            <h3 className="text-xl font-bold mb-2 relative z-10">Guest Experience AI</h3>
                            <p className="text-sm text-muted relative z-10">
                                Give every guest a personal butler that never sleeps and speaks 30 languages.
                            </p>
                        </div>
                    </section>

                    {/* Custom/Enterprise Section */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6">
                                Enterprise
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Custom Enterprise Systems</h2>
                            <p className="text-muted text-lg mb-8 leading-relaxed">
                                Have a unique workflow? We deploy dedicated engineering teams to build
                                custom agentic infrastructure for Logistics, Healthcare, and Finance.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <ListItem>Private VPC deployment options</ListItem>
                                <ListItem>Custom LLM fine-tuning</ListItem>
                                <ListItem>SLA-backed reliability</ListItem>
                            </ul>
                            <CTA href="/contact" variant="secondary">Contact Sales</CTA>
                        </div>
                        <div className="bg-panel rounded-2xl border border-white/10 relative overflow-hidden group min-h-[300px] flex flex-col justify-end p-8">
                            <Image
                                src="/images/enterprise-bg.png"
                                alt="Enterprise Infrastructure"
                                fill
                                className="object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                            <h3 className="text-xl font-bold mb-2 relative z-10">Deep Integration</h3>
                            <p className="text-sm text-muted relative z-10">
                                We don&apos;t just wrap APIs. We build deep integrations into your legacy ERPs and CRMs.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

function ListItem({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-center gap-3 text-muted">
            <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
            <span>{children}</span>
        </li>
    )
}
