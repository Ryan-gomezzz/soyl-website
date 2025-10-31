'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface FeatureCardProps {
  title: string
  description: string
  icon: string
  delay?: number
}

export function FeatureCard({
  title,
  description,
  icon,
  delay = 0,
}: FeatureCardProps) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-xl p-6 border border-white/10 hover:border-accent/30 transition-all"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted">{description}</p>
    </motion.div>
  )
}

