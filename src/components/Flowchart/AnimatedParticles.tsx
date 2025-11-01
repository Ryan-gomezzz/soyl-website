'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface AnimatedParticlesProps {
  count?: number
  radius?: number
  duration?: number
}

export function AnimatedParticles({
  count = 8,
  radius = 80,
  duration = 20,
}: AnimatedParticlesProps) {
  const reduced = useReducedMotion()

  if (reduced) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2
        const delay = (i / count) * duration
        const orbitRadius = radius + Math.sin(i) * 20

        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[var(--dot-1)]"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [
                Math.cos(angle) * orbitRadius,
                Math.cos(angle + Math.PI) * orbitRadius,
                Math.cos(angle + Math.PI * 2) * orbitRadius,
              ],
              y: [
                Math.sin(angle) * orbitRadius,
                Math.sin(angle + Math.PI) * orbitRadius,
                Math.sin(angle + Math.PI * 2) * orbitRadius,
              ],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: 'linear',
            }}
          />
        )
      })}
    </div>
  )
}

