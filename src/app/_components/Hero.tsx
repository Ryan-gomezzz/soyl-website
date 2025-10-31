'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { DotPattern } from './DotPattern'
import { CTA } from './CTA'

export function Hero() {
  return (
    <section className="relative min-h-[72vh] lg:min-h-[72vh] md:min-h-[56vh] flex items-center overflow-hidden">
      <DotPattern className="absolute inset-0 opacity-30" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance">
              SOYL —{' '}
              <span className="text-accent">Story Of Your Life</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted max-w-2xl text-balance">
              Multimodal emotion intelligence and adaptive agents for modern
              commerce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CTA href="#request-pilot" variant="primary" size="lg">
                Request a pilot
              </CTA>
              <CTA href="/docs" variant="secondary" size="lg">
                Read the docs
              </CTA>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden glass border border-white/10">
              <Image
                src="/images/hero-1.svg"
                alt="SOYL product visualization"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
            </div>
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-4 -right-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl"
            />
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute -bottom-4 -left-4 w-40 h-40 bg-accent-2/20 rounded-full blur-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

