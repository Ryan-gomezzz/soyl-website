'use client'

import { motion } from 'framer-motion'
import { FlowchartCanvas } from './FlowchartCanvas'
import { DotPattern } from '@/app/_components/DotPattern'

export function FlowchartSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Dot pattern background with subtle animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0.08, 0.12, 0.08],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <DotPattern className="absolute inset-0 opacity-10" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our R&D Journey
          </motion.h2>
          <motion.p
            className="text-lg text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From foundation MVP to productization — explore our phased development approach
          </motion.p>
        </motion.div>

        {/* Flowchart canvas with entrance animation */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative flex justify-center"
        >
          <FlowchartCanvas />
        </motion.div>
      </div>
    </section>
  )
}

