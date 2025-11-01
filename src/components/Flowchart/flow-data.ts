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
      id: 'n_phase1',
      title: 'Phase 1 — MVP',
      subtitle: 'Foundation & Feasibility',
      description:
        'Build real-time emotion sensing capabilities with face, voice, and text detection. Create AR commerce demo showcasing emotion-aware interactions.',
      x: 0.15,
      y: 0.35,
      size: 'lg',
      cta: {
        label: 'Read Phase 1',
        href: '/soyl-rd',
        action: 'docs',
      },
      meta: {
        phase: '0-6 mo',
      },
    },
    {
      id: 'n_phase2',
      title: 'Phase 2 — Cognitive Signal',
      subtitle: 'Emotion Intelligence Core',
      description:
        'Develop unified Emotion State Vector that fuses multimodal signals into a coherent affect representation. Build signal fusion architecture.',
      x: 0.45,
      y: 0.25,
      size: 'md',
      cta: {
        label: 'Read Phase 2',
        href: '/soyl-rd',
        action: 'docs',
      },
      meta: {
        phase: '6-12 mo',
      },
    },
    {
      id: 'n_phase3',
      title: 'Phase 3 — Agentic Layer',
      subtitle: 'Adaptive Salesperson',
      description:
        'Create adaptive AI salesperson powered by LLMs that responds dynamically based on detected emotion states. Functional adaptive agent within 12 months.',
      x: 0.7,
      y: 0.45,
      size: 'md',
      cta: {
        label: 'Read Phase 3',
        href: '/soyl-rd',
        action: 'docs',
      },
      meta: {
        phase: '12-18 mo',
      },
    },
    {
      id: 'n_product',
      title: 'SDK & API',
      subtitle: 'Productization',
      description:
        'Emotion API & SDK for developers. RESTful API for real-time emotion detection across modalities with privacy-first on-device inference options.',
      x: 0.45,
      y: 0.7,
      size: 'md',
      cta: {
        label: 'Request Pilot',
        href: 'mailto:hello@soyl.ai?subject=Pilot Request',
        action: 'pilot',
      },
    },
  ],
  edges: [
    { from: 'n_phase1', to: 'n_phase2', label: 'validate → scale' },
    { from: 'n_phase2', to: 'n_phase3', label: 'fusion → agent' },
    { from: 'n_phase3', to: 'n_product', label: 'agent → sdk & api' },
  ],
}

