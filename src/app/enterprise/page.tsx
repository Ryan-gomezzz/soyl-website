import { CTA } from '../_components/CTA'
import { motion } from 'framer-motion'

export default function EnterprisePage() {
  const benefits = [
    {
      icon: '🚀',
      title: 'Pilot Programs',
      description:
        'Start with a pilot program tailored to your use case. Our team works closely with you to ensure success.',
    },
    {
      icon: '📊',
      title: 'SLA Guarantees',
      description:
        'Enterprise-grade SLAs with 99.9% uptime guarantees and dedicated support channels.',
    },
    {
      icon: '🔧',
      title: 'Integration Support',
      description:
        'Dedicated integration support to help you seamlessly integrate SOYL into your existing infrastructure.',
    },
    {
      icon: '🔒',
      title: 'On-Premise Options',
      description:
        'On-premise deployment options available for maximum data security and compliance.',
    },
    {
      icon: '👥',
      title: 'Dedicated Support',
      description:
        '24/7 priority support with dedicated account managers and technical specialists.',
    },
    {
      icon: '📈',
      title: 'Custom Training',
      description:
        'Custom model training and fine-tuning for your specific industry and use case.',
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
            Enterprise Solutions
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Enterprise-grade emotion-aware AI solutions tailored to your
            business needs. Pilot programs, SLA guarantees, and dedicated
            support.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass rounded-xl p-6 border border-white/10"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Pilot Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-xl p-8 border border-white/10 mb-12"
        >
          <h2 className="text-3xl font-bold mb-8">Pilot Program Flow</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-bg flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-2">Discovery Call</h3>
                <p className="text-muted text-sm">
                  Discuss your use case, requirements, and goals with our
                  enterprise team.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-bg flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pilot Proposal</h3>
                <p className="text-muted text-sm">
                  Receive a customized pilot proposal with timeline, milestones,
                  and success metrics.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-bg flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">Implementation</h3>
                <p className="text-muted text-sm">
                  Begin pilot with dedicated support and regular check-ins to
                  track progress.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-bg flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-2">Scale & Deploy</h3>
                <p className="text-muted text-sm">
                  Scale from pilot to production with full enterprise support and
                  SLA guarantees.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-xl p-8 border border-white/10"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">
            Request Enterprise Consultation
          </h2>
          <p className="text-muted text-center mb-8 max-w-2xl mx-auto">
            Fill out the form below or contact us directly to discuss your
            enterprise needs.
          </p>
          <div className="max-w-2xl mx-auto">
            <form
              action="mailto:hello@soyl.ai"
              method="post"
              encType="text/plain"
              className="space-y-6"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-panel border border-white/10 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-panel border border-white/10 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  className="w-full px-4 py-3 bg-panel border border-white/10 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 bg-panel border border-white/10 rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="text-center">
                <CTA
                  href="mailto:hello@soyl.ai?subject=Enterprise Inquiry"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Contact Enterprise Sales
                </CTA>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

