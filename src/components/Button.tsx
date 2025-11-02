'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-bg font-semibold shadow-lg hover:shadow-xl focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg',
  secondary: 'border-2 border-text/20 text-text font-semibold hover:border-accent hover:text-accent focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg',
  ghost: 'text-text/80 hover:text-text hover:bg-white/5 focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-md',
  md: 'px-6 py-3 text-base rounded-lg',
  lg: 'px-8 py-4 text-lg rounded-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  onClick,
  disabled,
  ...props
}: ButtonProps) {
  const reduced = useReducedMotion()

  const baseStyles = 'transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled && !reduced ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled && !reduced ? { scale: 0.95 } : {}}
      className={combinedClassName}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}

