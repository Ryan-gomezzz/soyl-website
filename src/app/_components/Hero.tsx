'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { DotPattern } from './DotPattern'
import { CTA } from './CTA'
import { Bot } from 'lucide-react'
import { Icon } from '@/components/Icon'

export function Hero() {
  const [imageError, setImageError] = useState(false)

  return (
    <section className="relative min-h-[72vh] lg:min-h-[72vh] md:min-h-[56vh] flex items-center overflow-hidden">
      <DotPattern className="absolute inset-0 opacity-30 animate-parallax-slow" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance"
            >
              AI and Automation{' '}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-accent animate-text-shimmer"
              >
                tailored to your needs
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-xl md:text-2xl text-muted max-w-2xl text-balance"
            >
              Multimodal Emotion Intelligence and Adaptive Agents built for your specific business requirements.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <CTA href="/request-pilot" variant="primary" size="lg">
                Request a Pilot
              </CTA>
              <CTA href="/under-development" variant="secondary" size="lg">
                Try the Assistant
              </CTA>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
              scale: { type: "spring", stiffness: 100, damping: 15 }
            }}
            className="relative"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden glass border border-white/10 flex items-center justify-center bg-panel">
              {!imageError ? (
                <Image
                  src="/images/placeholders/product.png"
                  alt="SOYL product visualization"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="text-accent">
                  <Icon icon={Bot} className="w-24 h-24" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent pointer-events-none" />
            </div>
            {/* Multiple floating orbs for depth */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                x: [0, 5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-4 -right-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl"
            />
            <motion.div
              animate={{
                y: [0, 12, 0],
                x: [0, -8, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute -bottom-4 -left-4 w-40 h-40 bg-accent-2/20 rounded-full blur-2xl"
            />
            <motion.div
              animate={{
                y: [0, -8, 0],
                x: [0, -10, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 2,
              }}
              className="absolute top-1/2 -right-8 w-24 h-24 bg-accent/15 rounded-full blur-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
