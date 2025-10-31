export interface Career {
  title: string
  department: string
  location: string
  type: string
  description: string
  responsibilities: string[]
}

export const careers: Career[] = [
  {
    title: 'AI Research Lead',
    department: 'R&D',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    description:
      'Lead our foundation model research team, focusing on multimodal emotion understanding and adaptive agent architectures.',
    responsibilities: [
      'Define research roadmap for emotion-aware AI',
      'Publish papers and contribute to open-source',
      'Collaborate with engineering on model deployment',
      'Mentor junior researchers',
    ],
  },
  {
    title: 'ML Engineer',
    department: 'Engineering',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    description:
      'Build and deploy production ML models for emotion detection and adaptive agents.',
    responsibilities: [
      'Train and optimize emotion detection models',
      'Implement on-device inference pipelines',
      'Build MLOps infrastructure',
      'Optimize model performance and latency',
    ],
  },
  {
    title: 'UX/AR Developer',
    department: 'Product',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    description:
      'Design and develop AR commerce experiences with emotion-aware interactions.',
    responsibilities: [
      'Build AR shopping interfaces',
      'Integrate emotion detection in UX flows',
      'Create engaging user interactions',
      'Prototype new interaction patterns',
    ],
  },
  {
    title: 'Data Engineer',
    department: 'Engineering',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    description:
      'Build data pipelines and infrastructure for emotion datasets and model training.',
    responsibilities: [
      'Design data collection pipelines',
      'Ensure GDPR/DPDP compliance',
      'Manage emotion dataset curation',
      'Build ETL processes for training data',
    ],
  },
  {
    title: 'Ethics & Compliance Lead',
    department: 'Legal / Product',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    description:
      'Ensure ethical AI practices and regulatory compliance across all products.',
    responsibilities: [
      'Define consent and privacy frameworks',
      'Audit AI systems for bias',
      'Ensure GDPR/DPDP compliance',
      'Guide ethical product decisions',
    ],
  },
  {
    title: 'Product Manager',
    department: 'Product',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    description:
      'Drive product strategy for emotion-aware AI agents and SDK offerings.',
    responsibilities: [
      'Define product roadmap',
      'Work with R&D on feature prioritization',
      'Gather customer feedback',
      'Coordinate cross-functional teams',
    ],
  },
]

