'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { CTA } from './CTA'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-bg">
      {/* Abstract Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/hero-wave.png"
          alt="Abstract Wave"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-bg/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg/50" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <div className="inline-block rounded-full px-3 py-1 text-sm leading-6 text-accent ring-1 ring-accent/20 bg-accent/5 mb-4">
            Accelerate your AI Roadmap
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white max-w-4xl mx-auto">
            AI without <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">friction.</span>
          </h1>

          <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            We build production-grade Voice Agents and E-commerce automation infrastructure.
            Launched in weeks, not months.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <CTA href="/contact" variant="primary" size="lg" className="min-w-[160px]">
              Start Building
            </CTA>
            <CTA href="/voice-agents" variant="secondary" size="lg" className="min-w-[160px]">
              View Voice Agents
            </CTA>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
