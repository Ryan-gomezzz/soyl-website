'use client'

import { useEffect, useRef } from 'react'

interface AmbientLayerProps {
  enabled?: boolean
  width: number
  height: number
}

export function AmbientLayer({ enabled = true, width, height }: AmbientLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!enabled) return
    
    // Check for reduced motion preference
    const prefersReducedMotion = 
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let raf = 0
    let w = (canvas.width = width)
    let h = (canvas.height = height)

    // Create small set of particles
    const particleCount = 30
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      alpha: 0.06 + Math.random() * 0.06,
    }))

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)
      
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        
        // Wrap around edges
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        ctx.beginPath()
        ctx.fillStyle = `rgba(31, 182, 255, ${p.alpha})` // cyan tint matching accent
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      
      raf = requestAnimationFrame(draw)
    }

    draw()

    function onResize() {
      w = canvas.width = width
      h = canvas.height = height
      // Reset particles if canvas size changed significantly
      for (const p of particles) {
        if (p.x > w) p.x = Math.random() * w
        if (p.y > h) p.y = Math.random() * h
      }
    }

    return () => {
      cancelAnimationFrame(raf)
    }
  }, [enabled, width, height])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[10]"
      aria-hidden="true"
    />
  )
}

