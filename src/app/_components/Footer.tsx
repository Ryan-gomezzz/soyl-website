'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { siteConfig } from '@/lib/siteConfig'

// SVG icons inline
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-panel/50">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="-m-1.5 p-1.5 inline-block group">
              <motion.span
                className="text-2xl font-bold text-accent inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                SOYL
              </motion.span>
            </Link>
            <p className="mt-4 text-sm text-muted">
              {siteConfig.tagline}
            </p>
            <div className="mt-6 flex gap-x-4">
              <motion.a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors inline-block"
                aria-label="LinkedIn"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <LinkedinIcon className="h-5 w-5" />
              </motion.a>
              <motion.a
                href={siteConfig.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors inline-block"
                aria-label="Twitter/X"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <TwitterIcon className="h-5 w-5" />
              </motion.a>
              <motion.a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors inline-block"
                aria-label="GitHub"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <GithubIcon className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
              <div>
                <h3 className="text-sm font-semibold text-text">Product</h3>
                <ul className="mt-4 space-y-3">
                  {siteConfig.nav.slice(0, 3).map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted hover:text-accent transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text">Company</h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link
                      href="/careers"
                      className="text-sm text-muted hover:text-accent transition-colors"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/enterprise"
                      className="text-sm text-muted hover:text-accent transition-colors"
                    >
                      Enterprise
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/soyl-rd"
                      className="text-sm text-muted hover:text-accent transition-colors"
                    >
                      R&D
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text">Resources</h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link
                      href="/docs"
                      className="text-sm text-muted hover:text-accent transition-colors"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/resources"
                      className="text-sm text-muted hover:text-accent transition-colors"
                    >
                      Resources
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text">Legal</h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link
                      href="/privacy"
                      className="text-sm text-muted hover:text-accent transition-colors"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-sm text-muted hover:text-accent transition-colors"
                    >
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-white/5 pt-8">
              <p className="text-xs text-muted">
                Our staged R&D roadmap moves from a feasibility MVP (real-time
                emotion sensing + AR demo) to a unified affect foundation model
                and commercial SDK for B2B licensing. Key milestone: functional
                adaptive AI salesperson within 12 months; foundation model in
                18–24 months.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/5 pt-8">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} {siteConfig.fullName}. All rights
            reserved.
          </p>
          <p className="mt-2 text-xs text-muted">
            Contact:{' '}
            <a
              href={`mailto:${siteConfig.email}`}
              className="hover:text-accent transition-colors"
            >
              {siteConfig.email}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

