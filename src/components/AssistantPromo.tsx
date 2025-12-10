'use client'
import { useEffect, useState } from 'react'

import { motion } from 'framer-motion'

import { ArrowRight, Mic } from 'lucide-react'
import { DotPattern } from '@/app/_components/DotPattern'

import { AudioVisualizer } from '@/components/chatbot/AudioVisualizer'

export function AssistantPromo() {

  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleHowItWorks = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById('how-it-works')
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
    } else {
      window.location.href = '/docs#how-it-works'
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <section
      id="assistant-promo"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent opacity-40 pointer-events-none" />
      <DotPattern className="absolute inset-0 opacity-20 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                Live Voice Assistant
              </motion.div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-white leading-[1.1]">
                Talk to your data, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#ffffff]">
                  literally.
                </span>
              </h2>

              <p className="text-lg md:text-xl text-muted mb-10 max-w-lg leading-relaxed">
                Experience the next generation of conversational AI. Our multimodal assistant understands emotion, context, and nuance.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Dispatch event to open the chatbot
                    window.dispatchEvent(new CustomEvent('soyl-chatbot-open'))
                  }}
                  className="btn-primary flex items-center justify-center gap-3 group"
                >
                  <Mic className="w-5 h-5" />
                  Try Live Demo
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.button>

                <a
                  href="#how-it-works"
                  onClick={handleHowItWorks}
                  className="px-8 py-3 rounded-lg border border-white/10 text-white font-medium hover:bg-white/5 hover:border-white/20 transition-all text-center flex items-center justify-center"
                >
                  How it works
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Interactive Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden glass-gradient border border-white/10 shadow-2xl">
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-accent/20 blur-[80px] rounded-full pointer-events-none" />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent to-[#0099cc] flex items-center justify-center mb-8 shadow-lg shadow-accent/30 relative">
                  <div className="absolute inset-0 rounded-full border border-white/20 animate-pulse-slow"></div>
                  <Mic className="w-10 h-10 text-white" />
                </div>

                <div className="space-y-6 w-full max-w-xs mx-auto">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-accent font-medium">Assistant</span>
                      <span className="text-[10px] text-muted">Just now</span>
                    </div>
                    <div className="h-8 flex items-center justify-center gap-1">
                      <AudioVisualizer isActive={true} mode="speaking" barCount={15} />
                    </div>
                  </div>

                  <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 backdrop-blur-md">
                    <p className="text-sm text-white/90">
                      &quot;I can analyze your sales calls in real-time and suggest the best closing strategies. Want to see a demo?&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
