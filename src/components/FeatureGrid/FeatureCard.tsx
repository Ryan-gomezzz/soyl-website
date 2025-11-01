'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DotCluster } from './DotCluster'

interface FeatureCardProps {
  title: string
  description: string
  icon: string
  slug?: string
  delay?: number
}

export function FeatureCard({
  title,
  description,
  icon,
  delay = 0,
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative glass rounded-xl p-6 border border-white/10 hover:border-accent/30 transition-all cursor-default group"
      whileHover={reduced ? {} : { y: -5, scale: 1.02 }}
    >
      {/* Dot cluster on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="absolute -top-4 -right-4 pointer-events-none z-10"
        >
          <DotCluster size={48} />
        </motion.div>
      )}

      {/* Gradient glow on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/10 via-transparent to-accent-2/10 pointer-events-none"
        />
      )}

      <motion.div
        animate={
          reduced
            ? {}
            : {
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }
        }
        transition={{
          duration: 0.6,
          delay: delay + 0.2,
          ease: 'easeInOut',
        }}
        className="text-4xl mb-4 inline-block relative z-10"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold mb-2 relative z-10">{title}</h3>
      <p className="text-muted relative z-10">{description}</p>
    </motion.div>
  )
}

