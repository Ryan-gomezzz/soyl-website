'use client'

import { CTA } from '../_components/CTA'
import { motion } from 'framer-motion'

export default function PricingPage() {
  const tiers = [
    {
      name: 'Pilot',
      price: '₹2,500',
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
      price: '₹8,200',
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
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className={`glass rounded-xl p-8 border ${
                tier.highlighted
                  ? 'border-accent/50 bg-panel/50 animate-border-glow'
                  : 'border-white/10'
              } relative overflow-hidden group`}
            >
              {tier.highlighted && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    delay: index * 0.15 + 0.3
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="absolute top-4 right-4 px-3 py-1 bg-accent text-bg rounded-full text-xs font-semibold z-10"
                >
                  Popular
                </motion.div>
              )}
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={false}
              />
              {/* Shimmer effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                initial={false}
              />
              <div className="mb-6 relative z-10">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.2 }}
                  className="text-2xl font-bold mb-2"
                >
                  {tier.name}
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
                  className="flex items-baseline gap-1 mb-2"
                >
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="text-4xl font-bold"
                  >
                    {tier.price}
                  </motion.span>
                  <span className="text-muted">{tier.period}</span>
                </motion.div>
                <p className="text-sm text-muted">{tier.description}</p>
              </div>
              <ul className="space-y-3 mb-8 relative z-10">
                {tier.features.map((feature, featureIndex) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.15 + featureIndex * 0.05 + 0.4 
                    }}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-2"
                  >
                    <motion.span
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, 0]
                      }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.15 + featureIndex * 0.05 + 0.6,
                        ease: "easeOut"
                      }}
                      className="text-accent mt-1"
                    >
                      ✓
                    </motion.span>
                    <span className="text-muted text-sm">{feature}</span>
                  </motion.li>
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
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -5 }}
          className="glass rounded-xl p-8 border border-white/10 overflow-hidden group"
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-2/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            initial={false}
          />
          <h2 className="text-2xl font-bold mb-6 relative z-10">Feature Comparison</h2>
          <div className="overflow-x-auto relative z-10">
            <table className="w-full">
              <thead>
                <motion.tr
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="border-b border-white/10"
                >
                  <th className="text-left py-4 px-4 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold">Pilot</th>
                  <th className="text-center py-4 px-4 font-semibold">Startup</th>
                  <th className="text-center py-4 px-4 font-semibold">
                    Enterprise
                  </th>
                </motion.tr>
              </thead>
              <tbody>
                {[
                  { feature: 'API Calls/month', values: ['10K', '100K', 'Unlimited'] },
                  { feature: 'Support Level', values: ['Email', 'Priority', '24/7'] },
                  { feature: 'SDK Access', values: ['Limited', 'Full', 'Full + Custom'] },
                  { feature: 'SLA', values: ['—', '—', '✓'] },
                ].map((row, rowIndex) => (
                  <motion.tr
                    key={row.feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: rowIndex * 0.1 }}
                    whileHover={{ backgroundColor: 'rgba(31, 182, 255, 0.05)' }}
                    className="border-b border-white/5"
                  >
                    <td className="py-4 px-4 text-muted">{row.feature}</td>
                    {row.values.map((value, colIndex) => (
                      <motion.td
                        key={colIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: rowIndex * 0.1 + colIndex * 0.05 }}
                        className="py-4 px-4 text-center"
                      >
                        {value}
                      </motion.td>
                    ))}
                  </motion.tr>
                ))}
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

