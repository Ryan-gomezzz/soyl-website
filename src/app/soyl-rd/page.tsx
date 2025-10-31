import { CTA } from '../_components/CTA'
import { motion } from 'framer-motion'

export default function SOYLRDPage() {
  const phases = [
    {
      phase: 'Phase 1: Foundation MVP',
      timeline: 'Months 1-6',
      description:
        'Build real-time emotion sensing capabilities with face, voice, and text detection. Create AR commerce demo showcasing emotion-aware interactions.',
      milestones: [
        'Real-time multimodal emotion detection pipeline',
        'AR commerce proof-of-concept',
        'Initial dataset collection and validation',
        'Basic Emotion State Vector representation',
      ],
    },
    {
      phase: 'Phase 2: Cognitive Signal Layer',
      timeline: 'Months 6-12',
      description:
        'Develop unified Emotion State Vector that fuses multimodal signals into a coherent affect representation. Build signal fusion architecture.',
      milestones: [
        'Unified Emotion State Vector architecture',
        'Signal fusion algorithms',
        'Improved emotion detection accuracy',
        'API v1 for emotion detection',
      ],
    },
    {
      phase: 'Phase 3: Agentic Layer',
      timeline: 'Months 12-18',
      description:
        'Create adaptive AI salesperson powered by LLMs that responds dynamically based on detected emotion states. Functional adaptive agent within 12 months.',
      milestones: [
        'Functional adaptive AI salesperson',
        'LLM integration with emotion context',
        'Dialogue manager with affect adaptation',
        'Pilot deployments with partners',
      ],
    },
    {
      phase: 'Phase 4: Foundation Model',
      timeline: 'Months 18-24',
      description:
        'Develop proprietary emotion-aware foundation model. Train on multimodal emotion datasets (IEMOCAP, CMU-MOSEI, AffectNet).',
      milestones: [
        'Foundation model training and validation',
        'Multimodal emotion dataset integration',
        'Model performance benchmarks',
        'Open-source contributions',
      ],
    },
    {
      phase: 'Phase 5: Productization',
      timeline: 'Months 24+',
      description:
        'Commercial SDK and API offerings. B2B licensing model. Enterprise integrations and partnerships.',
      milestones: [
        'Commercial SDK release',
        'Enterprise API platform',
        'B2B licensing agreements',
        'Scaled infrastructure',
      ],
    },
  ]

  const keyMetrics = [
    { label: 'Emotion Detection Accuracy', target: '>90%' },
    { label: 'Real-time Latency', target: '<100ms' },
    { label: 'Multimodal Fusion Accuracy', target: '>85%' },
    { label: 'Agent Response Relevance', target: '>80% user satisfaction' },
  ]

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            SOYL R&D Roadmap
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Our staged R&D roadmap moves from a feasibility MVP (real-time
            emotion sensing + AR demo) to a unified affect foundation model
            and commercial SDK for B2B licensing. Key milestone: functional
            adaptive AI salesperson within 12 months; foundation model in
            18–24 months.
          </p>
        </motion.div>

        {/* Phases */}
        <div className="space-y-12 mb-24">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-xl p-8 border border-white/10"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-2xl font-bold text-accent">
                  Phase {index + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2">{phase.phase}</h2>
                  <p className="text-sm text-accent mb-4">{phase.timeline}</p>
                </div>
              </div>
              <p className="text-muted mb-6">{phase.description}</p>
              <div>
                <h3 className="font-semibold mb-3">Key Milestones:</h3>
                <ul className="space-y-2">
                  {phase.milestones.map((milestone) => (
                    <li key={milestone} className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-muted">{milestone}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-xl p-8 border border-white/10 mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            Success Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyMetrics.map((metric) => (
              <div
                key={metric.label}
                className="text-center p-4 rounded-lg bg-panel/50"
              >
                <div className="text-2xl font-bold text-accent mb-2">
                  {metric.target}
                </div>
                <div className="text-sm text-muted">{metric.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team & Partnerships */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-xl p-8 border border-white/10 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">Team & Partnerships</h2>
          <p className="text-muted mb-6">
            Our R&D team includes AI researchers, ML engineers, and product
            specialists working on cutting-edge emotion AI. We welcome
            partnerships with academic institutions and industry leaders.
          </p>
          <p className="text-muted mb-6">
            <strong>Research References:</strong> Our work builds on established
            datasets and methodologies including IEMOCAP, CMU-MOSEI, and
            AffectNet.
          </p>
          <p className="text-muted">
            For R&D partnerships or inquiries, contact:{' '}
            <a
              href="mailto:hello@soyl.ai?subject=R&D Partnership Inquiry"
              className="text-accent hover:underline"
            >
              hello@soyl.ai
            </a>
          </p>
        </motion.div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <CTA href="/resources" variant="primary" size="lg">
            Download Whitepaper (PDF)
          </CTA>
          <CTA
            href="mailto:hello@soyl.ai?subject=R&D Pilot Request"
            variant="secondary"
            size="lg"
          >
            Request R&D Pilot
          </CTA>
        </div>
      </div>
    </div>
  )
}

