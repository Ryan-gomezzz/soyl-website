'use client'

import { motion } from 'framer-motion'
import { FlowchartCanvas } from './FlowchartCanvas'
import { DotPattern } from '@/app/_components/DotPattern'

export function FlowchartSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Dot pattern background */}
      <DotPattern className="absolute inset-0 opacity-10 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Our R&D Journey
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            From foundation MVP to productization — explore our phased development approach
          </p>
        </motion.div>

        {/* Flowchart canvas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <FlowchartCanvas />
        </motion.div>
      </div>
    </section>
  )
}

