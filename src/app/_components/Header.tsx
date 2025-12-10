'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '@/lib/siteConfig'
import { CTA } from './CTA'
import clsx from 'clsx'

// SVG icons inline
const MenuIcon = ({ className }: { className?: string }) => (
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
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
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
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
)

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        scrolled ? "glass-gradient border-white/5 py-3 shadow-lg" : "bg-transparent py-5"
      )}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 group relative">
            <motion.div
              className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <motion.span
              className="relative text-2xl font-bold tracking-tight inline-block"
              style={{
                background: 'linear-gradient(to right, #00D4FF, #ffffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              SOYL
            </motion.span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-text hover:text-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {siteConfig.nav.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className="text-sm font-medium text-muted transition-all duration-300 hover:text-white relative group py-2"
              >
                <span className="relative z-10">{item.name}</span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out" />
                <span className="absolute -inset-2 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-6">
          <Link
            href="/admin/login"
            className="text-sm font-medium text-muted hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <CTA href="/open-dashboard" variant="primary" size="sm" className="shadow-none hover:shadow-lg hover:shadow-accent/20">
            Open Dashboard
          </CTA>
        </div>
      </nav>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-[var(--panel)]/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-6 py-6 space-y-4">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-lg font-medium text-text/80 hover:text-accent transition-all pl-2 border-l-2 border-transparent hover:border-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-6 space-y-4 border-t border-white/10 mt-4">
                <Link
                  href="/admin/login"
                  className="block text-base font-medium text-text/60 hover:text-text transition-colors pl-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <CTA
                  href="/open-dashboard"
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Open Dashboard
                </CTA>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

