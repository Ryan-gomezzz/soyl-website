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
        whileHover={{ scale: 1.05, x: 2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative z-10 inline-block"
      >
        {children}
      </motion.span>
      {variant === 'primary' && (
        <>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ opacity: 0.5 }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent-2/10 rounded-lg"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}
      {variant === 'secondary' && (
        <motion.div
          className="absolute inset-0 border-2 border-accent/0 rounded-lg"
          whileHover={{
            borderColor: 'rgba(31, 182, 255, 0.5)',
            boxShadow: '0 0 20px rgba(31, 182, 255, 0.3)',
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  )
}

