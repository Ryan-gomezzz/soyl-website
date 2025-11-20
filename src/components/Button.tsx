'use client'

import React from 'react'
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

import { cn } from '@/utils/cn'

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white font-semibold shadow-lg hover:shadow-accent/40 hover:bg-accent/90 border border-white/10',
  secondary: 'border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 hover:border-white/30 backdrop-blur-sm',
  ghost: 'text-muted hover:text-white hover:bg-white/5',
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

  const baseStyles = 'inline-flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'
  const combinedClassName = cn(baseStyles, variantStyles[variant], sizeStyles[size], className)

  // Filter out conflicting drag props and pass only safe props to motion.button
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onDrag: _onDrag, onDragStart: _onDragStart, onDragEnd: _onDragEnd, ...safeProps } = props as HTMLMotionProps<'button'>

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled && !reduced ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled && !reduced ? { scale: 0.95 } : {}}
      className={combinedClassName}
      aria-disabled={disabled}
      {...safeProps}
    >
      {children}
    </motion.button>
  )
}

