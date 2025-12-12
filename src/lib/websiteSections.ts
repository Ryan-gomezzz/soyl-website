/**
 * Website Section Mapping
 * Maps user queries to website sections for AI navigation
 */

export interface WebsiteSection {
  id: string
  title: string
  description: string
  keywords: string[]
  content: string // Description of what's in this section for AI context
}

export const websiteSections: WebsiteSection[] = [
  {
    id: 'hero',
    title: 'Hero Section',
    description: 'Main landing area with company tagline and primary CTA',
    keywords: ['hero', 'home', 'landing', 'main', 'top', 'start', 'beginning'],
    content: 'The hero section introduces SOYL as an AI and automation company, emphasizing that solutions are tailored to your needs. It includes the main value proposition and call-to-action.',
  },
  {
    id: 'assistant-promo',
    title: 'SOYL Assistant Promo',
    description: 'Promotional section for the AI assistant',
    keywords: ['assistant', 'promo', 'ai assistant', 'voice assistant', 'chatbot'],
    content: 'This section promotes the SOYL AI assistant feature, highlighting how users can interact with the website through voice.',
  },
  {
    id: 'flowchart',
    title: 'Flowchart',
    description: 'Visual representation of SOYL\'s process or architecture',
    keywords: ['flowchart', 'process', 'architecture', 'flow', 'diagram', 'how it works visually'],
    content: 'A flowchart section that visually represents SOYL\'s process, architecture, or workflow in an interactive diagram format.',
  },
  {
    id: 'what-soyl-does',
    title: 'What SOYL Does',
    description: 'Overview of SOYL\'s core capabilities and services',
    keywords: ['what soyl does', 'features', 'capabilities', 'services', 'what we do', 'offerings', 'solutions', 'products'],
    content: 'This section explains SOYL\'s core capabilities including Adaptive AI Agents, Cognitive Signal Layer, and Intelligent Automation. It showcases the main features and what the company offers.',
  },
  {
    id: 'why-choose-us',
    title: 'Why Choose Us',
    description: 'Reasons to choose SOYL over competitors',
    keywords: ['why choose', 'benefits', 'advantages', 'why us', 'differentiators', 'competitive advantage'],
    content: 'This section highlights the unique benefits and advantages of choosing SOYL, explaining what makes the company stand out from competitors.',
  },
  {
    id: 'how-it-works',
    title: 'How it Works',
    description: 'Step-by-step explanation of SOYL\'s process',
    keywords: ['how it works', 'process', 'steps', 'workflow', 'methodology', 'approach', 'detect', 'understand', 'act'],
    content: 'This section breaks down how SOYL works into three main steps: Detect (capturing multimodal signals), Understand (fusing signals into Emotion State Vector), and Act (adaptive AI responses).',
  },
  {
    id: 'product-features',
    title: 'Product & Features',
    description: 'Detailed product features and technical capabilities',
    keywords: ['product', 'features', 'api', 'sdk', 'technical', 'emotion api', 'on-device', 'ar commerce', 'dialogue manager'],
    content: 'This section details SOYL\'s product features including Emotion API, On-device Inference, AR Commerce Integration, and Dialogue Manager. It includes code examples and technical specifications.',
  },
  {
    id: 'testimonials',
    title: 'First Impressions',
    description: 'Customer testimonials and feedback',
    keywords: ['testimonials', 'reviews', 'feedback', 'impressions', 'customers', 'clients', 'what people say'],
    content: 'This section showcases customer testimonials and first impressions from clients who have used SOYL\'s services.',
  },
  {
    id: 'use-cases',
    title: 'Use Cases',
    description: 'Industry-specific use cases and applications',
    keywords: ['use cases', 'applications', 'industries', 'examples', 'operations', 'marketing', 'automation', 'healthcare', 'banking'],
    content: 'This section presents various use cases across different industries including Operations, Marketing, Automation, Healthcare, and Banking, showing how SOYL can be applied.',
  },
  {
    id: 'soyl-rd',
    title: 'SOYL R&D Roadmap',
    description: 'Research and development roadmap and future plans',
    keywords: ['r&d', 'roadmap', 'research', 'development', 'future', 'plans', 'phases', 'milestones'],
    content: 'This section outlines SOYL\'s R&D roadmap, including Phase 1 (Foundation MVP), Phase 2 (Cognitive Signal Layer), and Phase 3 (Agentic Layer). It describes the company\'s research direction and future milestones.',
  },
  {
    id: 'trust-compliance',
    title: 'Trust & Compliance',
    description: 'Security, privacy, and compliance information',
    keywords: ['trust', 'compliance', 'security', 'privacy', 'gdpr', 'data protection', 'safety'],
    content: 'This section covers SOYL\'s commitment to trust and compliance, including GDPR-ready pipeline, opt-in consent, and privacy-first approaches with on-device inference options.',
  },
  {
    id: 'request-pilot',
    title: 'Request Pilot',
    description: 'Call-to-action to request a pilot program',
    keywords: ['pilot', 'request', 'demo', 'trial', 'get started', 'contact', 'cta', 'call to action'],
    content: 'This is the final call-to-action section where visitors can request a pilot program to see how emotion-aware AI can transform their customer interactions.',
  },
]

/**
 * Find a section by query text
 * Uses fuzzy matching on keywords and titles
 */
export function findSectionByQuery(query: string): WebsiteSection | null {
  const normalizedQuery = query.toLowerCase().trim()
  
  // Exact match on ID
  const exactMatch = websiteSections.find(section => 
    section.id.toLowerCase() === normalizedQuery
  )
  if (exactMatch) return exactMatch

  // Match on keywords
  for (const section of websiteSections) {
    for (const keyword of section.keywords) {
      if (normalizedQuery.includes(keyword.toLowerCase()) || 
          keyword.toLowerCase().includes(normalizedQuery)) {
        return section
      }
    }
  }

  // Match on title
  for (const section of websiteSections) {
    if (normalizedQuery.includes(section.title.toLowerCase()) ||
        section.title.toLowerCase().includes(normalizedQuery)) {
      return section
    }
  }

  return null
}

/**
 * Get all section IDs for navigation
 */
export function getAllSectionIds(): string[] {
  return websiteSections.map(section => section.id)
}

/**
 * Get section by ID
 */
export function getSectionById(id: string): WebsiteSection | undefined {
  return websiteSections.find(section => section.id === id)
}

