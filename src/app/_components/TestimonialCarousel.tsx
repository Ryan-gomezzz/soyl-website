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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-xl p-8 border border-white/10"
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
        <button
          onClick={prev}
          className="p-2 rounded-lg glass border border-white/10 hover:border-accent transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <div className="flex gap-2 items-center">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-accent w-6' : 'bg-white/20'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="p-2 rounded-lg glass border border-white/10 hover:border-accent transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

