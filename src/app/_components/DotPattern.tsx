'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import clsx from 'clsx'

interface DotPatternProps {
  className?: string
}

export function DotPattern({ className }: DotPatternProps) {
  const [mounted, setMounted] = useState(false)
  const { scrollY } = useScroll()
  const x = useTransform(scrollY, [0, 1000], [0, 80], { clamp: false })
  const y = useTransform(scrollY, [0, 1000], [0, 50], { clamp: false })
  const opacity = useTransform(scrollY, [0, 500, 1000], [0.3, 0.5, 0.3])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <motion.svg
      className={clsx('absolute inset-0 w-full h-full', className)}
      style={{ x, y, opacity }}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="dot-pattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.5" fill="currentColor" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-pattern)" />
    </motion.svg>
  )
}

