'use client'

import Link from 'next/link'
import clsx from 'clsx'
import { motion } from 'framer-motion'

interface CTAProps {
  href: string
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function CTA({
  href,
  variant = 'primary',
  size = 'md',
  children,
  className,
  onClick,
}: CTAProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg focus:ring-accent'

  const variants = {
    primary: 'bg-accent text-bg hover:bg-accent/90 focus:ring-accent',
    secondary:
      'bg-transparent border border-text/20 text-text hover:border-accent hover:text-accent focus:ring-accent',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className,
        'relative overflow-hidden group'
      )}
    >
      <motion.span
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative z-10 inline-block"
      >
        {children}
      </motion.span>
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ opacity: 0.5 }}
        />
      )}
    </Link>
  )
}

