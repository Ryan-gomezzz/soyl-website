'use client'

import { CTA } from '../_components/CTA'
import { motion } from 'framer-motion'

export default function PricingPage() {
  const tiers = [
    {
      name: 'Pilot',
      price: '₹2,49,000',
      period: '/month',
      description: 'Perfect for early adopters and proof-of-concepts',
      features: [
        'Up to 10,000 API calls/month',
        'Basic emotion detection (face, voice, text)',
        'Email support',
        'SDK access (limited features)',
        'Onboarding assistance',
      ],
      cta: 'Start Pilot',
      highlighted: false,
    },
    {
      name: 'Startup',
      price: '₹8,29,000',
      period: '/month',
      description: 'For growing businesses ready to scale',
      features: [
        'Up to 100,000 API calls/month',
        'Advanced emotion detection',
        'Priority email support',
        'Full SDK access',
        'AR commerce integration',
        'Dedicated account manager',
      ],
      cta: 'Contact Sales',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Tailored solutions for large organizations',
      features: [
        'Unlimited API calls',
        'All emotion detection features',
        '24/7 priority support',
        'On-premise deployment options',
        'Custom integrations',
        'SLA guarantees',
        'Dedicated support team',
        'Custom model training',
      ],
      cta: 'Contact Sales',
      highlighted: false,
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
            Pricing
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Transparent pricing designed to scale with your needs. All prices
            are estimates — contact sales for custom pricing and enterprise
            deals.
          </p>
          <p className="text-sm text-muted mt-4">
            <em>Note: Prices are estimates and subject to change. Contact sales for accurate pricing.</em>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass rounded-xl p-8 border ${
                tier.highlighted
                  ? 'border-accent/50 bg-panel/50'
                  : 'border-white/10'
              } relative`}
            >
              {tier.highlighted && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-accent text-bg rounded-full text-xs font-semibold">
                  Popular
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted">{tier.period}</span>
                </div>
                <p className="text-sm text-muted">{tier.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    <span className="text-muted text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <CTA
                href="mailto:hello@soyl.ai?subject=Pricing Inquiry"
                variant={tier.highlighted ? 'primary' : 'secondary'}
                size="md"
                className="w-full"
              >
                {tier.cta}
              </CTA>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold mb-6">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold">Pilot</th>
                  <th className="text-center py-4 px-4 font-semibold">Startup</th>
                  <th className="text-center py-4 px-4 font-semibold">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-muted">API Calls/month</td>
                  <td className="py-4 px-4 text-center">10K</td>
                  <td className="py-4 px-4 text-center">100K</td>
                  <td className="py-4 px-4 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-muted">Support Level</td>
                  <td className="py-4 px-4 text-center">Email</td>
                  <td className="py-4 px-4 text-center">Priority</td>
                  <td className="py-4 px-4 text-center">24/7</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-muted">SDK Access</td>
                  <td className="py-4 px-4 text-center">Limited</td>
                  <td className="py-4 px-4 text-center">Full</td>
                  <td className="py-4 px-4 text-center">Full + Custom</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-4 px-4 text-muted">SLA</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="text-center mt-12">
          <p className="text-muted mb-4">
            Need custom pricing? Contact our sales team.
          </p>
          <CTA href="mailto:hello@soyl.ai?subject=Pricing Inquiry" variant="primary" size="lg">
            Contact Sales
          </CTA>
        </div>
      </div>
    </div>
  )
}

