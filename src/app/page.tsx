'use client'

import { Hero } from './_components/Hero'
import { CTA } from './_components/CTA'
import { motion } from 'framer-motion'
import { Mic, Globe, Zap, ArrowRight, Check, Activity, BarChart3, Shield } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="bg-bg text-white overflow-hidden">
      <Hero />

      {/* Social Proof / Trusted By */}
      <section className="py-10 border-b border-white/5 bg-panel/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-muted mb-8 uppercase tracking-widest">
            Trusted by forward-thinking companies
          </p>
          <div className="flex justify-center items-center opacity-70 grayscale hover:grayscale-0 transition-opacity duration-500">
            <div className="text-2xl md:text-3xl font-bold tracking-tight text-white/90 font-serif italic">Hush Gentle</div>
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-subtle-glow opacity-30" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-6">
              AI infrastructure, without the friction.
            </h2>
            <p className="text-lg text-muted leading-relaxed">
              We replace complex vendor negotiations with a simple promise:
              <strong>Production-grade AI agents in 2 weeks.</strong> No experiments, just results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Mic}
              title="Voice Agents"
              desc="Natural, latency-free voice interfaces for customer support and operations."
            />
            <FeatureCard
              icon={Globe}
              title="E-commerce"
              desc="Full-stack automation. We manage the infra, you manage the brand."
            />
            <FeatureCard
              icon={Zap}
              title="Custom AI"
              desc="Tailored solutions for enterprise needs. From zero to deployed in days."
            />
          </div>
        </div>
      </section>

      {/* Deep Dive: Voice (Primary Focus) */}
      <section className="py-24 bg-panel border-y border-white/5 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                <Activity className="w-4 h-4" />
                <span>Next-Gen Voice</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                Talk to your customers,<br />
                <span className="text-gray-500">at scale.</span>
              </h2>
              <p className="text-lg text-muted mb-8 leading-relaxed">
                Our voice agents don't sound like robots. They pause, think, and adapt.
                Built on cutting-edge representation learning (JEPA-inspired) for human-like reasoning.
              </p>
              <ul className="space-y-4 mb-10">
                <CheckItem text="Sub-500ms latency" />
                <CheckItem text="Handles interruptions gracefully" />
                <CheckItem text="Seamless handoff to humans" />
              </ul>
              <div className="flex gap-4">
                <CTA href="/voice-agents" variant="primary">Explore Voice Agents</CTA>
                <CTA href="/contact" variant="outline">Schedule Demo</CTA>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              {/* Placeholder for the voice visualization image */}
              <div className="aspect-[4/3] bg-black relative">
                <Image
                  src="/assets/voice-vis.png"
                  alt="Voice Visualization"
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why SOYL Wins */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-panel rounded-2xl p-10 border border-white/5">
              <BarChart3 className="w-10 h-10 text-accent mb-6" />
              <h3 className="text-2xl font-bold mb-4">Outcome Oriented</h3>
              <p className="text-muted">
                Most agencies sell &quot;hours&quot; or &quot;features&quot;. We sell outcomes.
                Higher conversion rates, lower support costs, and faster launch times.
              </p>
            </div>
            <div className="bg-panel rounded-2xl p-10 border border-white/5">
              <Shield className="w-10 h-10 text-accent mb-6" />
              <h3 className="text-2xl font-bold mb-4">Enterprise Grade</h3>
              <p className="text-muted">
                Security, compliance, and reliability are baked in.
                We treat AI as critical infrastructure, not a side project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-accent/5" />
        <div className="mx-auto max-w-3xl text-center px-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Build the future.<br />Without the wait.
          </h2>
          <CTA href="/contact" variant="primary" size="lg" className="px-8 py-4 text-lg">
            Start Building with SOYL <ArrowRight className="ml-2 w-5 h-5" />
          </CTA>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, desc }: { icon: React.ElementType, title: string, desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-panel border border-white/5 hover:border-accent/20 transition-all duration-300"
    >
      <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 text-accent">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">
        <Check className="w-3.5 h-3.5" />
      </div>
      <span className="text-muted">{text}</span>
    </div>
  )
}
