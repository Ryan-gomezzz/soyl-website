'use client'

import { CTA } from '../_components/CTA'
import { Search, PenTool, Rocket, RefreshCw } from 'lucide-react'

export default function HowItWorksPage() {
    return (
        <div className="pt-24 min-h-screen bg-bg">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-24">
                <div className="text-center mb-24">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">From Idea to Production in 2 Weeks</h1>
                    <p className="text-xl text-muted max-w-2xl mx-auto">
                        No long consulting cycles. No &quot;digital transformation&quot; buzzwords.
                        Just a streamlined process to get AI agents working for your business.
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/50 to-transparent hidden lg:block" />

                    <div className="space-y-24">
                        <TimelineItem
                            step="01"
                            title="Discovery"
                            desc="We map your workflows and identify high-impact automation targets. No fluff, just ops."
                            icon={Search}
                            side="left"
                            time="Days 1-3"
                        />
                        <TimelineItem
                            step="02"
                            title="Build & Configure"
                            desc="We deploy our pre-built agentic infrastructure and fine-tune models on your data."
                            icon={PenTool}
                            side="right"
                            time="Days 4-10"
                        />
                        <TimelineItem
                            step="03"
                            title="Deploy & Train"
                            desc="Live testing with your team. We ensure latency specs and accuracy requirements are met."
                            icon={Rocket}
                            side="left"
                            time="Days 11-14"
                        />
                        <TimelineItem
                            step="04"
                            title="Iterate"
                            desc="Continuous improvement based on real-world interaction data. The model gets smarter every day."
                            icon={RefreshCw}
                            side="right"
                            time="Ongoing"
                        />
                    </div>
                </div>

                <div className="mt-32 text-center">
                    <div className="p-8 rounded-2xl bg-panel border border-white/10 max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4">Why we move fast</h2>
                        <p className="text-muted mb-6">
                            We treat AI as software shipping, not scientific research.
                            Our infrastructure is pre-built, proven, and ready to scale.
                        </p>
                        <CTA href="/contact" variant="primary">Start Your 2-Week Sprint</CTA>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TimelineItem({ step, title, desc, icon: Icon, side, time }: { step: string, title: string, desc: string, icon: React.ElementType, side: 'left' | 'right', time: string }) {
    const isLeft = side === 'left';
    return (
        <div className={`flex flex-col lg:flex-row items-center justify-between gap-12 relative ${isLeft ? '' : 'lg:flex-row-reverse'}`}>
            <div className={`flex-1 text-center lg:text-${isLeft ? 'right' : 'left'}`}>
                <div className={`text-accent font-mono text-sm mb-2 uppercase tracking-widest block lg:hidden`}>{time}</div>
                <h3 className="text-3xl font-bold mb-4">{title}</h3>
                <p className="text-muted text-lg leading-relaxed">{desc}</p>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center w-16">
                <div className="w-16 h-16 rounded-full bg-panel border border-accent/20 flex items-center justify-center shadow-lg shadow-accent/10 relative">
                    <Icon className="w-8 h-8 text-accent" />
                    <div className="absolute -top-10 text-accent/50 font-bold text-6xl opacity-20 select-none font-mono">
                        {step}
                    </div>
                </div>
            </div>

            <div className={`flex-1 text-center lg:text-${isLeft ? 'left' : 'right'}`}>
                <div className={`text-accent font-mono text-xl mb-2 hidden lg:block`}>{time}</div>
            </div>
        </div>
    )
}
