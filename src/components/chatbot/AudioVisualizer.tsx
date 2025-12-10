'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AudioVisualizerProps {
    isActive: boolean
    mode?: 'listening' | 'speaking' | 'processing'
    barCount?: number
}

export function AudioVisualizer({ isActive, mode = 'listening', barCount = 12 }: AudioVisualizerProps) {
    const [bars, setBars] = useState<number[]>(new Array(barCount).fill(10))

    useEffect(() => {
        if (!isActive) {
            setBars(new Array(barCount).fill(10))
            return
        }

        const interval = setInterval(() => {
            setBars(prev => prev.map(() => {
                const minHeight = mode === 'processing' ? 15 : 10
                const maxHeight = mode === 'speaking' ? 40 : (mode === 'listening' ? 30 : 20)
                return Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight
            }))
        }, 100)

        return () => clearInterval(interval)
    }, [isActive, mode, barCount])

    return (
        <div className="flex items-center justify-center gap-1 h-12">
            {bars.map((height, i) => (
                <motion.div
                    key={i}
                    className={`w-1 rounded-full ${mode === 'speaking'
                            ? 'bg-accent'
                            : mode === 'listening'
                                ? 'bg-red-500'
                                : 'bg-indigo-400'
                        }`}
                    animate={{ height }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{ minHeight: 4 }}
                />
            ))}
        </div>
    )
}
