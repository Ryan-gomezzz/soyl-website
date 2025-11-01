'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { testimonials } from '@/lib/data/testimonials'

// SVG icons inline
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
)

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
)

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -30, scale: 0.95 }}
          transition={{ 
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="glass rounded-xl p-8 border border-white/10 hover:border-accent/30 transition-all"
        >
          <blockquote className="text-lg md:text-xl text-text mb-6">
            &ldquo;{testimonials[currentIndex].content}&rdquo;
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold text-text">
                {testimonials[currentIndex].name}
              </p>
              <p className="text-sm text-muted">
                {testimonials[currentIndex].role},{' '}
                {testimonials[currentIndex].company}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-4 mt-6 justify-center">
        <motion.button
          onClick={prev}
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="p-2 rounded-lg glass border border-white/10 hover:border-accent transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </motion.button>
        <div className="flex gap-2 items-center">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                width: index === currentIndex ? 24 : 8,
                opacity: index === currentIndex ? 1 : 0.5
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`h-2 rounded-full ${
                index === currentIndex ? 'bg-accent' : 'bg-white/20'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        <motion.button
          onClick={next}
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="p-2 rounded-lg glass border border-white/10 hover:border-accent transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  )
}

