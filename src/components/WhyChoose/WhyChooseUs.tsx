'use client'

import { motion } from 'framer-motion'
import { DotPattern } from '@/app/_components/DotPattern'

import { Lock, Zap, Brain, Target } from 'lucide-react'
import { Icon } from '@/components/Icon'

const reasons = [
  {
    title: 'Privacy-first emotion pipeline',
    description:
      'On-device inference options ensure sensitive emotion data never leaves user devices.',
    icon: Lock,
  },
  {
    title: 'SDK & API for integration',
    description:
      'Easy-to-integrate RESTful API and SDK for seamless emotion detection across platforms.',
    icon: Zap,
  },
  {
    title: 'Multimodal emotion fusion',
    description:
      'Combines face, voice, and text signals into a unified Emotion State Vector for richer context.',
    icon: Brain,
  },
  {
    title: 'Real-time adaptive responses',
    description:
      'AI agents that dynamically adjust tone and recommendations based on detected emotion states.',
    icon: Target,
  },
]

export function WhyChooseUs() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Dot pattern background */}
      <DotPattern className="absolute inset-0 opacity-10 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Choose SOYL?
          </motion.h2>
          <motion.p
            className="text-lg text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Built with privacy, performance, and developer experience in mind
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Animated dot accent */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: 'easeInOut',
                }}
                className="absolute left-0 top-2 w-2 h-2 rounded-full bg-[var(--dot-1)]"
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.3 + 0.5,
                  ease: 'easeInOut',
                }}
                className="absolute left-0 top-6 w-2 h-2 rounded-full bg-[var(--dot-2)]"
              />

              <div className="ml-8 glass rounded-xl p-6 border border-white/10 hover:border-accent/30 transition-all">
                <div className="mb-4 text-accent">
                  <Icon icon={reason.icon} className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

