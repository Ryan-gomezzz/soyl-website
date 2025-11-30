'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { DotPattern } from '@/app/_components/DotPattern'
import { ChatbotController } from './chatbot/controller'

export function AssistantPromo() {
  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleTryAssistant = () => {
    window.location.href = '/under-development'
  }

  const handleHowItWorks = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById('how-it-works')
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
    } else {
      // Fallback to docs page if section not found
      window.location.href = '/docs#how-it-works'
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <section
      id="assistant-promo"
      role="region"
      aria-labelledby="assistant-promo-title"
      className="relative py-16 md:py-24 overflow-hidden"
    >
      {/* Dot pattern background */}
      <DotPattern className="absolute inset-0 opacity-10 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side: Text and CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
            className="relative"
          >
            {/* Promo card with glass effect */}
            <div className="relative p-8 md:p-10 rounded-2xl bg-[var(--panel)]/80 backdrop-blur-md border border-white/10 shadow-xl">
              {/* Cyan glow effect */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

              <motion.h2
                id="assistant-promo-title"
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-text"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                      backgroundPosition: ['0%', '100%', '0%'],
                    }
                }
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  background: 'linear-gradient(90deg, var(--text) 0%, var(--accent) 50%, var(--text) 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                SOYL Assistant
              </motion.h2>
              <p className="text-lg text-muted mb-8 max-w-lg">
                Try our multimodal, emotion-aware AI assistant — an adaptive salesperson that
                listens and helps convert.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Primary CTA */}
                <motion.button
                  onClick={handleTryAssistant}
                  aria-controls="soyl-assistant-panel"
                  aria-label="Open SOYL Assistant chatbot panel"
                  whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
                  whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
                  className="px-6 py-3 bg-accent text-bg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg"
                >
                  <span className="flex items-center justify-center gap-2">
                    Try the Assistant
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline-block"
                    >
                      <path
                        d="M15 5L5 15M5 5L15 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
                    </svg>
                  </span>
                </motion.button>

                {/* Secondary CTA */}
                <a
                  href="#how-it-works"
                  onClick={handleHowItWorks}
                  className="px-6 py-3 border-2 border-text/20 text-text font-semibold rounded-lg hover:border-accent hover:text-accent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg inline-block text-center"
                >
                  How it works
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right side: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            <div className="relative w-full max-w-md h-64 md:h-80 rounded-xl overflow-hidden glass border border-white/10">
              <Image
                src="/images/placeholders/second.png"
                alt="SOYL Assistant visualization"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/20 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

