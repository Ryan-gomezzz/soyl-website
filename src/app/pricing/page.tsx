'use client'

import { CTA } from '../_components/CTA'
import { motion } from 'framer-motion'

export default function PricingPage() {
  const tiers = [
    {
      name: 'Pilot Program',
      price: '14 Days',
      period: '',
      description: 'Validate profitability and feasibility before full commitment.',
      features: [
        'Comprehensive Cost Analysis',
        'Feasibility Check',
        'Profitability Report',
        'Custom Implementation Plan',
        'Risk Assessment',
      ],
      cta: 'Request Pilot',
      ctaLink: '/request-pilot',
      highlighted: false,
    },
    {
      name: 'AI Voice Agents',
      price: '₹5',
      period: '/min',
      description: 'Custom built AI agents tailored to your specific business needs.',
      features: [
        'Custom Built to Your Needs',
        '24/7 Support',
        'Unlimited Concurrent Calls',
        'Multimodal Intelligence',
        'Real-time Adaptation',
        'Seamless Integration',
      ],
      cta: 'Contact Sales',
      ctaLink: '/inquiry',
      highlighted: true,
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
            Transparent pricing designed to scale with your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
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
              className={`glass rounded-xl p-8 border ${tier.highlighted
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
                href={tier.ctaLink}
                variant={tier.highlighted ? 'primary' : 'secondary'}
                size="md"
                className="w-full"
              >
                {tier.cta}
              </CTA>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted mb-4">
            Need custom pricing? Contact our sales team.
          </p>
          <CTA href="/inquiry" variant="primary" size="lg">
            Contact Sales
          </CTA>
        </div>
      </div>
    </div>
  )
}

