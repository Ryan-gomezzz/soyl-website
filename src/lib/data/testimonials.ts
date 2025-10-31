export interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  avatar?: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'RetailTech Inc.',
    content:
      'SOYL\'s emotion-aware agents transformed our customer interactions. Conversion rates increased by 40% in the first quarter.',
    avatar: undefined,
  },
  {
    name: 'Marcus Rodriguez',
    role: 'VP of Product',
    company: 'CommerceFlow',
    content:
      'The adaptive agents understand context and emotion in ways traditional chatbots never could. Our customer satisfaction scores are at an all-time high.',
    avatar: undefined,
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Head of Research',
    company: 'AI Ventures',
    content:
      'SOYL\'s R&D in multimodal emotion understanding is pushing the boundaries of what\'s possible. The foundation model work is particularly impressive.',
    avatar: undefined,
  },
]

