'use client'

import { useEffect, useRef } from 'react'

export function AnimatedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawGrid()
    }

    const drawGrid = () => {
      if (!ctx) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const gridSize = 50
      const lineWidth = 0.5
      const baseOpacity = 0.12
      const time = Date.now() * 0.001
      const opacity = baseOpacity + Math.sin(time) * 0.03
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.lineWidth = lineWidth
      
      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      
      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Animate subtle pulsing
    let animationFrame: number
    
    const animate = () => {
      drawGrid()
      animationFrame = requestAnimationFrame(animate)
    }
    
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    />
  )
}

