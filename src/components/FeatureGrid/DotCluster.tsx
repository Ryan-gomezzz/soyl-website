'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface DotClusterProps {
  size?: number
  className?: string
}

const colors = ['var(--dot-1)', 'var(--dot-2)', 'var(--dot-3)', 'var(--dot-4)']

export const DotCluster = React.forwardRef<SVGSVGElement, DotClusterProps>(
  function DotCluster({ size = 48, className = '' }, ref) {
    const reduced = useReducedMotion()

    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
      >
      {colors.map((color, i) => {
        const angle = (i / colors.length) * Math.PI * 2
        const radius = 12
        const baseX = 24 + Math.cos(angle) * radius
        const baseY = 24 + Math.sin(angle) * radius

        return (
          <motion.circle
            key={i}
            cx={baseX}
            cy={baseY}
            r={3}
            fill={color}
            initial={{ opacity: 0, r: 2 }}
            animate={
              reduced
                ? { opacity: 1 }
                : {
                    opacity: [0, 1, 0.8, 0],
                    r: [2, 6, 4, 2],
                    cx: [baseX, baseX + Math.cos(angle) * 8, baseX + Math.cos(angle) * 4, baseX],
                    cy: [baseY, baseY + Math.sin(angle) * 8, baseY + Math.sin(angle) * 4, baseY],
                  }
            }
            transition={{
              delay: i * 0.06,
              duration: 0.9,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )
      })}
      </svg>
    )
  }
)

