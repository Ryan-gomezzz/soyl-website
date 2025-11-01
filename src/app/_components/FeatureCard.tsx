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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ 
        y: -5, 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="glass rounded-xl p-6 border border-white/10 hover:border-accent/30 transition-all cursor-default"
    >
      <motion.div
        animate={inView ? { 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={{ 
          duration: 0.6, 
          delay: delay + 0.2,
          ease: "easeInOut"
        }}
        className="text-4xl mb-4 inline-block"
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted">{description}</p>
    </motion.div>
  )
}

