/**
 * Flowchart Data
 * 
 * Node descriptions adapted from SOYL R&D document (SOYL R&D (2).pdf)
 * Edit node positions (x, y as normalized 0-1 values), titles, descriptions here.
 * 
 * Citation: SOYL R&D (2).pdf - R&D phases and milestones documentation
 */

export type Node = {
  id: string
  title: string
  subtitle?: string
  description?: string
  x: number // normalized 0..1 position relative to canvas
  y: number
  color?: string // optional override for node accent
  size?: 'sm' | 'md' | 'lg'
  cta?: {
    label: string
    href?: string
    action?: 'docs' | 'pilot' | 'contact'
  }
  meta?: {
    phase?: string
  }
}

export type Edge = {
  from: string
  to: string
  label?: string
}

export const flow: { nodes: Node[]; edges: Edge[] } = {
  nodes: [
    {
      id: 'n_understand',
      title: 'Understanding Needs',
      subtitle: 'Problem Analysis',
      description: 'We start by deeply understanding your business problems and specific needs.',
      x: 0.15,
      y: 0.5,
      size: 'md',
      cta: {
        label: 'Contact Us',
        href: '/inquiry',
        action: 'contact',
      },
      meta: { phase: 'Step 1' },
    },
    {
      id: 'n_solutions',
      title: 'AI Solutions',
      subtitle: 'Tailored Proposal',
      description: 'We propose custom AI and automation solutions tailored to your requirements.',
      x: 0.35,
      y: 0.25,
      size: 'md',
      meta: { phase: 'Step 2' },
    },
    {
      id: 'n_pilot',
      title: '14-Day Pilot',
      subtitle: 'Cost Analysis',
      description: 'A 14-day pilot program to verify financial benefits and profitability.',
      x: 0.55,
      y: 0.5,
      size: 'md',
      cta: {
        label: 'Request Pilot',
        href: '/request-pilot',
        action: 'pilot',
      },
      meta: { phase: 'Step 3' },
    },
    {
      id: 'n_implementation',
      title: 'Implementation',
      subtitle: 'Build & Onboard',
      description: 'Full-scale implementation and client onboarding if the pilot is successful.',
      x: 0.75,
      y: 0.75,
      size: 'md',
      meta: { phase: 'Step 4' },
    },
    {
      id: 'n_services',
      title: 'Continuous Services',
      subtitle: 'Iterative Support',
      description: 'Ongoing support and iterative improvements throughout the pipeline.',
      x: 0.9,
      y: 0.5,
      size: 'md',
      meta: { phase: 'Step 5' },
    },
  ],
  edges: [
    { from: 'n_understand', to: 'n_solutions', label: 'analyze' },
    { from: 'n_solutions', to: 'n_pilot', label: 'propose' },
    { from: 'n_pilot', to: 'n_implementation', label: 'validate' },
    { from: 'n_implementation', to: 'n_services', label: 'scale' },
    { from: 'n_services', to: 'n_understand', label: 'iterate' }, // Optional loop back
  ],
}

