import { CTA } from '../_components/CTA'
import { motion } from 'framer-motion'

export default function CustomAgentsPage() {
  const verticals = [
    {
      name: 'Retail',
      description:
        'Emotion-aware shopping assistants that adapt recommendations based on customer sentiment and engagement.',
      features: [
        'Product recommendation engine',
        'Virtual try-on integration',
        'Shopping cart optimization',
        'Customer sentiment tracking',
      ],
    },
    {
      name: 'Healthcare',
      description:
        'Empathetic AI agents that provide emotional support and guide patients through healthcare journeys.',
      features: [
        'Patient engagement support',
        'Symptom assessment guidance',
        'Appointment scheduling',
        'HIPAA-compliant interactions',
      ],
    },
    {
      name: 'EdTech',
      description:
        'Personalized learning agents that adapt teaching style based on student emotion and comprehension.',
      features: [
        'Adaptive learning paths',
        'Emotion-based feedback',
        'Student engagement tracking',
        'Parent-teacher communication',
      ],
    },
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
            Custom Agents
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Drag-and-deploy agent templates for various verticals. Custom AI
            agents tailored to your industry and use case, powered by SOYL's
            emotion-aware technology.
          </p>
        </motion.div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-xl p-8 border border-white/10 mb-16"
        >
          <h2 className="text-3xl font-bold mb-6">How Custom Agents Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Choose Template</h3>
              <p className="text-muted text-sm">
                Select from pre-built agent templates designed for your
                industry.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold mb-2">Customize</h3>
              <p className="text-muted text-sm">
                Tailor the agent's personality, knowledge base, and response
                style.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Deploy</h3>
              <p className="text-muted text-sm">
                Deploy to your platform with a few clicks and start engaging
                users.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Verticals */}
        <div className="space-y-12 mb-16">
          {verticals.map((vertical, index) => (
            <motion.div
              key={vertical.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-xl p-8 border border-white/10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-4">{vertical.name}</h2>
                  <p className="text-muted mb-6">{vertical.description}</p>
                  <h3 className="font-semibold mb-3">Key Features:</h3>
                  <ul className="space-y-2">
                    {vertical.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="text-accent mt-1">✓</span>
                        <span className="text-muted text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative aspect-square rounded-xl overflow-hidden bg-panel flex items-center justify-center">
                  <div className="text-6xl">{vertical.name === 'Retail' ? '🛍️' : vertical.name === 'Healthcare' ? '🏥' : '📚'}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-xl p-12 border border-white/10 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">
            Ready to Build Your Custom Agent?
          </h2>
          <p className="text-muted mb-8 max-w-2xl mx-auto">
            Contact our sales team to discuss your specific use case and get a
            custom agent built for your business.
          </p>
          <CTA
            href="mailto:hello@soyl.ai?subject=Custom Agent Inquiry"
            variant="primary"
            size="lg"
          >
            Contact Sales to Build Yours
          </CTA>
        </motion.div>
      </div>
    </div>
  )
}

