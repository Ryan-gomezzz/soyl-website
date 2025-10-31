import { motion } from 'framer-motion'
import { CTA } from '../_components/CTA'

export default function OpenDashboardPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass rounded-2xl p-16 border border-white/10 mb-8">
            <div className="text-6xl mb-6">🚧</div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Coming Soon
            </h1>
            <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
              The SOYL Dashboard is currently under development. We're building
              a powerful interface to manage your emotion-aware AI agents,
              monitor performance, and access analytics.
            </p>
            <div className="space-y-4">
              <p className="text-muted">
                Want to be notified when it's ready? Join our waitlist.
              </p>
              <CTA
                href="mailto:hello@soyl.ai?subject=Dashboard Waitlist"
                variant="primary"
                size="lg"
              >
                Join Waitlist
              </CTA>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-xl p-8 border border-white/10 text-left"
          >
            <h2 className="text-2xl font-bold mb-4">What to Expect</h2>
            <ul className="space-y-3 text-left">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span className="text-muted">
                  Real-time agent performance monitoring
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span className="text-muted">
                  Emotion detection analytics and insights
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span className="text-muted">
                  Agent configuration and customization tools
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span className="text-muted">
                  API key management and usage tracking
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span className="text-muted">
                  Team collaboration and access controls
                </span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

