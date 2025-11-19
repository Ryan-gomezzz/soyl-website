'use client'

import { Hero } from './_components/Hero'
import { FeatureGrid } from '@/components/FeatureGrid/FeatureGrid'
import { FlowchartSection } from '@/components/Flowchart/FlowchartSection'
import { WhyChooseUs } from '@/components/WhyChoose/WhyChooseUs'
import { TestimonialCarousel } from './_components/TestimonialCarousel'
import { CTA } from './_components/CTA'
import { AssistantPromo } from '@/components/AssistantPromo'
import { features, productFeatures } from '@/lib/data/features'
import { motion } from 'framer-motion'
import { Camera, Brain, Bot, ShoppingBag, Monitor, Briefcase, Headphones, Microscope, Lock, CheckCircle, Shield } from 'lucide-react'
import { Icon } from '@/components/Icon'

export default function Home() {
  return (
    <div className="pt-20">
      <Hero />

      {/* SOYL Assistant Promo */}
      <AssistantPromo />

      {/* Flowchart Section */}
      <FlowchartSection />

      {/* What SOYL Does */}
      <section className="py-16 lg:py-20">
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
          <FeatureGrid features={features} />
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* How it works */}
      <section id="how-it-works" className="py-16 lg:py-20 bg-panel/30">
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
                  className="mb-4 inline-block text-accent"
                >
                  <Icon icon={Camera} className="w-12 h-12" />
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
                  className="mb-4 inline-block text-accent"
                >
                  <Icon icon={Brain} className="w-12 h-12" />
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
                  className="mb-4 inline-block text-accent"
                >
                  <Icon icon={Bot} className="w-12 h-12" />
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
      <section className="py-16 lg:py-20">
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
                className="glass rounded-xl p-8 border border-white/10 hover:border-accent/30 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center transition-all relative overflow-hidden group"
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                <div className="relative z-10">
                  <motion.h3
                    whileHover={{ x: 5 }}
                    className="text-2xl font-semibold mb-3"
                  >
                    {feature.title}
                  </motion.h3>
                  <p className="text-muted mb-4">{feature.description}</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-bg rounded-lg p-4 overflow-x-auto relative z-10"
                >
                  <pre className="text-sm text-text/80">
                    <code>{feature.code}</code>
                  </pre>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-20 bg-panel/30">
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

      {/* Use Cases */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Use Cases
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Emotion-aware AI for modern commerce across industries
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: 'Retail AR Commerce',
                description: 'In-store AR assistants that adapt recommendations based on customer emotion',
                icon: ShoppingBag,
              },
              {
                title: 'Kiosk Systems',
                description: 'Interactive kiosks with emotion-aware product suggestions and support',
                icon: Monitor,
              },
              {
                title: 'Remote Sales',
                description: 'Virtual sales assistants that read cues and personalize the conversation',
                icon: Briefcase,
              },
              {
                title: 'Support Triage',
                description: 'Customer support that prioritizes and routes based on emotional state',
                icon: Headphones,
              },
            ].map((usecase) => (
              <motion.div
                key={usecase.title}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="glass rounded-xl p-6 border border-white/10 hover:border-accent/30 transition-all text-center relative overflow-hidden group"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="mb-4 relative z-10 text-accent"
                >
                  <Icon icon={usecase.icon} className="w-10 h-10" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 relative z-10">{usecase.title}</h3>
                <p className="text-sm text-muted relative z-10">{usecase.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SOYL R&D Snapshot */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -5 }}
            className="glass rounded-2xl p-12 border border-white/10 relative overflow-hidden group"
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={false}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative z-10">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                >
                  SOYL R&D Roadmap
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg text-muted mb-6"
                >
                  Our staged R&D roadmap moves from a feasibility MVP (real-time
                  emotion sensing + AR demo) to a unified affect foundation model
                  and commercial SDK for B2B licensing. Key milestone: functional
                  adaptive AI salesperson within 12 months; foundation model in
                  18–24 months.
                </motion.p>
                <div className="space-y-4">
                  {[
                    { phase: 'Phase 1', desc: 'Foundation MVP: Real-time emotion sensing + AR demo' },
                    { phase: 'Phase 2', desc: 'Cognitive Signal Layer: Unified Emotion State Vector' },
                    { phase: 'Phase 3', desc: 'Agentic Layer: Adaptive AI salesperson' },
                  ].map((item, index) => (
                    <motion.div
                      key={item.phase}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-3"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="text-accent font-bold"
                      >
                        {item.phase}
                      </motion.div>
                      <p className="text-muted">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mt-8"
                >
                  <CTA href="/soyl-rd" variant="primary" size="md">
                    Explore R&D Details
                  </CTA>
                </motion.div>
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-panel">
                <div className="absolute inset-0 flex items-center justify-center text-accent/20">
                  <Icon icon={Microscope} className="w-32 h-32" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Compliance */}
      <section className="py-16 lg:py-20 bg-panel/30">
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
                <div className="mb-3 text-accent">
                  <Icon icon={Lock} className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">GDPR-Ready Pipeline</h3>
                <p className="text-sm text-muted">
                  Compliant data processing and storage
                </p>
              </div>
              <div className="glass rounded-lg p-6 border border-white/10">
                <div className="mb-3 text-accent-2">
                  <Icon icon={CheckCircle} className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">Opt-in Consent</h3>
                <p className="text-sm text-muted">
                  Clear consent flows before data capture
                </p>
              </div>
              <div className="glass rounded-lg p-6 border border-white/10">
                <div className="mb-3 text-accent">
                  <Icon icon={Shield} className="w-8 h-8" />
                </div>
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

