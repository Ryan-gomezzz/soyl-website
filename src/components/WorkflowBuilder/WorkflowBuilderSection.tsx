'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { WorkflowBuilder } from './WorkflowBuilder'

export function WorkflowBuilderSection() {
  return (
    <section id="workflow-builder" className="py-24 lg:py-32 bg-bg">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Visual Workflow Builder
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Design your AI workflows visually with drag-and-drop nodes, API integrations, and automated actions
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <WorkflowBuilder />
        </motion.div>
      </div>
    </section>
  )
}

