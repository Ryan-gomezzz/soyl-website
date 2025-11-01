export interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  avatar?: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Anonymous',
    role: 'Tech Executive',
    company: 'Enterprise Client',
    content:
      'The emotion-aware capabilities are genuinely impressive. It&apos;s clear this technology understands context in a way that goes beyond surface-level interactions. We&apos;re seeing tangible improvements in engagement metrics.',
    avatar: undefined,
  },
  {
    name: 'Anonymous',
    role: 'Product Leader',
    company: 'E-commerce Platform',
    content:
      'The multimodal approach makes a real difference. Our initial tests show users feel more understood, and the adaptive responses feel natural rather than scripted. Excited to see where this goes.',
    avatar: undefined,
  },
  {
    name: 'Anonymous',
    role: 'Research Director',
    company: 'AI Lab',
    content:
      'The technical foundation is solid. The fusion of signals into an Emotion State Vector is novel, and the R&D roadmap shows serious commitment to building something meaningful, not just another AI wrapper.',
    avatar: undefined,
  },
  {
    name: 'Anonymous',
    role: 'Founder',
    company: 'Startup',
    content:
      'We&apos;ve been testing early access features, and the emotion detection accuracy is surprisingly good. The on-device inference option is exactly what we needed for privacy-sensitive use cases.',
    avatar: undefined,
  },
]

