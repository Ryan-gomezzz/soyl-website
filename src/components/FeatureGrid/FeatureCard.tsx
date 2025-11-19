'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { DotCluster } from './DotCluster'
import { Icon } from '@/components/Icon'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
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
          animate={{
            opacity: [0, 0.8, 0.6],
            scale: [1, 1.02, 1],
          }}
          transition={{
            opacity: {
              duration: 0.6,
              repeat: Infinity,
              repeatType: 'reverse',
            },
            scale: {
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            },
          }}
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/15 via-transparent to-accent-2/15 pointer-events-none"
        />
      )}

      {/* Animated border glow */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-accent/30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              '0 0 20px rgba(31, 182, 255, 0.3)',
              '0 0 40px rgba(31, 182, 255, 0.5)',
              '0 0 20px rgba(31, 182, 255, 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
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
        className="mb-4 inline-block relative z-10 text-accent"
      >
        <Icon icon={icon} className="w-10 h-10" />
      </motion.div>
      <h3 className="text-xl font-semibold mb-2 relative z-10">{title}</h3>
      <p className="text-muted relative z-10">{description}</p>
    </motion.div>
  )
}
