import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/styles/flowchart.css'
import { Header } from './_components/Header'
import { Footer } from './_components/Footer'
import { CustomCursor } from './_components/CustomCursor'
import { SEO } from './_components/SEO'
import { Analytics } from './_components/Analytics'
import { Chatbot } from '@/components/chatbot'
import { AnimatedGrid } from '@/components/AnimatedGrid'
import { FloatingParticles, FloatingOrbs } from '@/components/FloatingParticles'
import { siteConfig } from '@/lib/siteConfig'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.fullName} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'emotion AI',
    'affective computing',
    'AI sales',
    'multimodal AI',
    'adaptive agents',
    'emotion detection',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.fullName,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: '/og/soyl-og.svg',
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.fullName,
    description: siteConfig.description,
        images: ['/og/soyl-og.svg'],
    creator: '@soyl_ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased bg-bg text-text relative">
        <AnimatedGrid />
        <FloatingParticles count={60} />
        <FloatingOrbs />
        <SEO />
        <Analytics />
        <CustomCursor />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-bg focus:rounded-md focus:font-medium"
        >
          Skip to main content
        </a>
        <div className="relative z-10">
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </div>
        <Chatbot />
      </body>
    </html>
  )
}

