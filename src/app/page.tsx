'use client'

import { Hero } from './_components/Hero'
import { FeatureCard } from './_components/FeatureCard'
import { TestimonialCarousel } from './_components/TestimonialCarousel'
import { CTA } from './_components/CTA'
import { features, productFeatures } from '@/lib/data/features'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="pt-20">
      <Hero />

      {/* What SOYL Does */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              What SOYL Does
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Emotion-aware AI that understands context and adapts in real-time
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 lg:py-32 bg-panel/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              How it works
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="text-center"
            >
              <div className="glass rounded-xl p-8 border border-white/10 mb-6 hover:border-accent/30 transition-all">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut"
                  }}
                  className="text-5xl mb-4 inline-block"
                >
                  📷
                </motion.div>
                <h3 className="text-2xl font-semibold mb-2">Detect</h3>
                <p className="text-muted">
                  Camera, microphone, and text input capture multimodal signals
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="text-center"
            >
              <div className="glass rounded-xl p-8 border border-white/10 mb-6 hover:border-accent/30 transition-all">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut"
                  }}
                  className="text-5xl mb-4 inline-block"
                >
                  🧠
                </motion.div>
                <h3 className="text-2xl font-semibold mb-2">Understand</h3>
                <p className="text-muted">
                  Fuse signals into unified Emotion State Vector
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="text-center"
            >
              <div className="glass rounded-xl p-8 border border-white/10 mb-6 hover:border-accent/30 transition-all">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut"
                  }}
                  className="text-5xl mb-4 inline-block"
                >
                  🤖
                </motion.div>
                <h3 className="text-2xl font-semibold mb-2">Act</h3>
                <p className="text-muted">
                  Adaptive Sales Agent responds with context-aware suggestions
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Product/Features */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Product & Features
            </h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            className="space-y-12"
          >
            {productFeatures.map((feature) => (
              <motion.div
                key={feature.title}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="glass rounded-xl p-8 border border-white/10 hover:border-accent/30 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center transition-all"
              >
                <div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted mb-4">{feature.description}</p>
                </div>
                <div className="bg-bg rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-text/80">
                    <code>{feature.code}</code>
                  </pre>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32 bg-panel/30">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              First Impressions
            </h2>
          </motion.div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* SOYL R&D Snapshot */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-12 border border-white/10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  SOYL R&D Roadmap
                </h2>
                <p className="text-lg text-muted mb-6">
                  Our staged R&D roadmap moves from a feasibility MVP (real-time
                  emotion sensing + AR demo) to a unified affect foundation model
                  and commercial SDK for B2B licensing. Key milestone: functional
                  adaptive AI salesperson within 12 months; foundation model in
                  18–24 months.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="text-accent font-bold">Phase 1</div>
                    <p className="text-muted">Foundation MVP: Real-time emotion sensing + AR demo</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-accent font-bold">Phase 2</div>
                    <p className="text-muted">Cognitive Signal Layer: Unified Emotion State Vector</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-accent font-bold">Phase 3</div>
                    <p className="text-muted">Agentic Layer: Adaptive AI salesperson</p>
                  </div>
                </div>
                <div className="mt-8">
                  <CTA href="/soyl-rd" variant="primary" size="md">
                    Explore R&D Details
                  </CTA>
                </div>
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-panel">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">🔬</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Compliance */}
      <section className="py-24 lg:py-32 bg-panel/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
              Trust & Compliance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="glass rounded-lg p-6 border border-white/10">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="font-semibold mb-2">GDPR-Ready Pipeline</h3>
                <p className="text-sm text-muted">
                  Compliant data processing and storage
                </p>
              </div>
              <div className="glass rounded-lg p-6 border border-white/10">
                <div className="text-3xl mb-3">✅</div>
                <h3 className="font-semibold mb-2">Opt-in Consent</h3>
                <p className="text-sm text-muted">
                  Clear consent flows before data capture
                </p>
              </div>
              <div className="glass rounded-lg p-6 border border-white/10">
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="font-semibold mb-2">Privacy-First</h3>
                <p className="text-sm text-muted">
                  On-device inference options available
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section id="request-pilot" className="py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Customer Interactions?
            </h2>
            <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
              Request a pilot and see how emotion-aware AI can elevate your
              sales and customer experience.
            </p>
            <CTA href="mailto:hello@soyl.ai?subject=Pilot Request" variant="primary" size="lg">
              Request a pilot
            </CTA>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

