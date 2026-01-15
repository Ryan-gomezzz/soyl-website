'use client'

import { motion } from 'framer-motion'
import { CTA } from '../_components/CTA'
import Image from 'next/image'

export default function AboutPage() {
    return (
        <div className="pt-24 min-h-screen bg-bg">
            <div className="mx-auto max-w-4xl px-6 lg:px-8 py-16 lg:py-24">

                {/* Manifesto */}
                <div className="mb-24">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                        We believe AI should be <br />
                        <span className="text-gray-500">invisible infrastructure.</span>
                    </h1>
                    <div className="prose prose-invert prose-lg text-muted">
                        <p>
                            The current AI market is a mess of buzzwords, flash-in-the-pan demos, and "consultants" selling prompts.
                            Business owners are tired of excessive hype and minimal outcomes.
                        </p>
                        <p>
                            We built SOYL with a simple premise: <strong>Outcomes over experiments.</strong>
                        </p>
                        <p>
                            We don't want to build you a "chatbot". We want to build an automated department that
                            handles customer service, sales, and operations with human-like reliability and machine-like speed.
                        </p>
                    </div>
                </div>

                {/* Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-panel border border-white/10">
                        {/* Abstract representation of "The Machine" */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                        <Image
                            src="/assets/network-nodes.png"
                            alt="Neural Network"
                            fill
                            className="object-cover opacity-80"
                        />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-6">The 10-Year View</h2>
                        <p className="text-muted text-lg mb-6">
                            We are building towards a future where "interacting with software" feels antiquated.
                            You shouldn't have to click buttons to get food delivered or type shifting queries to find data.
                        </p>
                        <p className="text-muted text-lg">
                            You should just ask. And the system should just do it.
                            <br /><br />
                            SOYL is the infrastructure layer for that future.
                        </p>
                    </div>
                </div>

                {/* Team/Culture */}
                <div className="text-center bg-panel rounded-3xl p-12 border border-white/5">
                    <h2 className="text-3xl font-bold mb-6">Built by Builders</h2>
                    <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
                        We are a team of engineers, researchers, and designers who care deeply about craft.
                        We ship production code, not proof-of-concepts.
                    </p>
                    <CTA href="/careers" variant="outline">View Open Roles</CTA>
                </div>

            </div>
        </div>
    )
}
