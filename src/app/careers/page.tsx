import { CTA } from '../_components/CTA'
import { motion } from 'framer-motion'
import { careers } from '@/lib/data/careers'

export default function CareersPage() {
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
            Careers at SOYL
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Join us in building the future of emotion-aware AI. We're looking
            for talented individuals who share our passion for multimodal AI
            and adaptive agents.
          </p>
        </motion.div>

        <div className="space-y-8 mb-16">
          {careers.map((career, index) => (
            <motion.div
              key={career.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-xl p-8 border border-white/10 hover:border-accent/30 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div>
                      <h2 className="text-2xl font-semibold mb-2">
                        {career.title}
                      </h2>
                      <div className="flex flex-wrap gap-3 text-sm text-muted">
                        <span>{career.department}</span>
                        <span>•</span>
                        <span>{career.location}</span>
                        <span>•</span>
                        <span>{career.type}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted mb-4">{career.description}</p>
                  <div>
                    <h3 className="font-semibold mb-3">Responsibilities:</h3>
                    <ul className="space-y-2">
                      {career.responsibilities.map((resp) => (
                        <li key={resp} className="flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          <span className="text-muted text-sm">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="lg:w-48 flex-shrink-0">
                  <CTA
                    href={`mailto:jobs@soyl.ai?subject=Application: ${encodeURIComponent(career.title)}`}
                    variant="primary"
                    size="md"
                    className="w-full"
                  >
                    Apply
                  </CTA>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-xl p-8 border border-white/10 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Don't See a Role That Fits?</h2>
          <p className="text-muted mb-6">
            We're always looking for exceptional talent. Send us your resume
            and we'll reach out if a role becomes available.
          </p>
          <CTA href="mailto:jobs@soyl.ai?subject=General Application" variant="secondary" size="md">
            Send General Application
          </CTA>
        </motion.div>
      </div>
    </div>
  )
}

