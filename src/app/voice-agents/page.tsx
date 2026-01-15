'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { CTA } from '../_components/CTA'
import { Mic, Zap, Brain, Server, Shield, Activity } from 'lucide-react'

export default function VoiceAgentsPage() {
    return (
        <div className="pt-24 min-h-screen bg-bg">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                                Voice agents that <br />
                                <span className="text-accent">actually listen.</span>
                            </h1>
                            <p className="text-lg text-muted mb-8 text-balance">
                                Forget rigid IVR menus and robotic scripts. SOYL Voice Agents use advanced
                                representation learning to understand context, nuance, and intent—interruptions included.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <CTA href="/contact" variant="primary">Deploy in 2 Weeks</CTA>
                                <div className="flex items-center gap-2 text-sm text-green-400">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    Live Demo Available
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="aspect-square relative rounded-2xl overflow-hidden border border-white/10 bg-panel shadow-2xl">
                                <Image
                                    src="/assets/voice-vis.png"
                                    alt="Voice Visualization"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                                {/* Floating Stats */}
                                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-4">
                                    <div className="bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/5">
                                        <div className="text-xs text-muted uppercase tracking-wider mb-1">Latency</div>
                                        <div className="text-xl font-mono text-green-400">~450ms</div>
                                    </div>
                                    <div className="bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/5">
                                        <div className="text-xs text-muted uppercase tracking-wider mb-1">Success Rate</div>
                                        <div className="text-xl font-mono text-accent">98.5%</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* The Problem */}
            <section className="py-20 bg-panel border-y border-white/5">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why traditional voice fails</h2>
                        <p className="text-muted">Most &quot;AI&quot; voice bots are just fancy text-to-speech readers wrapped in slow API calls.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ProblemCard
                            title="Latency"
                            desc="Standard LLM pipelines take 2-3 seconds to respond. That&apos;s an eternity in conversation."
                        />
                        <ProblemCard
                            title="Rigidity"
                            desc="They break when users interrupt or change topics mid-sentence."
                        />
                        <ProblemCard
                            title="Hallucinations"
                            desc="Generic models make up facts. Ours are grounded in your business data."
                        />
                    </div>
                </div>
            </section>

            {/* The Solution Features */}
            <section className="py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard icon={Zap} title="Sub-Second Latency" desc="Optimized WebSocket streaming pipeline for near-instant responses." />
                        <FeatureCard icon={Brain} title="Context Retention" desc="Remembers details from the start of the call to the end." />
                        <FeatureCard icon={Server} title="Enterprise Scale" desc="Handles thousands of concurrent calls without degradation." />
                        <FeatureCard icon={Shield} title="PII Redaction" desc="Sensitive data is automatically filtered and secured." />
                        <FeatureCard icon={Mic} title="Noise Cancellation" desc="Works perfectly even in noisy environments." />
                        <FeatureCard icon={Activity} title="Sentiment Analysis" desc="Detects frustration and routes to humans automatically." />
                    </div>
                </div>
            </section>

            {/* Use Cases Grid */}
            <section className="py-20 bg-panel/30">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-12 text-center">Built for High-Volume Operations</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <UseCaseCard
                            title="Hospitality Concierge"
                            items={[
                                "Room service ordering",
                                "Front desk FAQs",
                                "Late checkout requests",
                                "Local recommendations"
                            ]}
                        />
                        <UseCaseCard
                            title="E-commerce Support"
                            items={[
                                "Order status tracking",
                                "Return processing",
                                "Product Q&A",
                                "Subscription management"
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center">
                <div className="mx-auto max-w-2xl px-6">
                    <h2 className="text-4xl font-bold mb-6">Hear the difference.</h2>
                    <p className="text-muted mb-8">Book a demo to interact with a live SOYL agent tailored to your industry.</p>
                    <CTA href="/contact" variant="primary" size="lg">Book Demo</CTA>
                </div>
            </section>
        </div>
    )
}

function ProblemCard({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="p-6 rounded-xl bg-black/50 border border-white/5">
            <h3 className="text-xl font-bold text-red-400 mb-2">{title}</h3>
            <p className="text-muted">{desc}</p>
        </div>
    )
}

function FeatureCard({ icon: Icon, title, desc }: { icon: React.ElementType, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-xl bg-panel border border-white/5 hover:border-accent/20 transition-all">
            <Icon className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-sm text-muted">{desc}</p>
        </div>
    )
}

function UseCaseCard({ title, items }: { title: string, items: string[] }) {
    return (
        <div className="p-8 rounded-2xl bg-black/40 border border-white/5">
            <h3 className="text-2xl font-bold mb-6">{title}</h3>
            <ul className="grid grid-cols-2 gap-4">
                {items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-muted">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    )
}
