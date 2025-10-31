import { CTA } from '../_components/CTA'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ResourcesPage() {
  const resources = [
    {
      type: 'Whitepaper',
      title: 'Emotion-Aware AI: The Future of Customer Engagement',
      description:
        'Deep dive into SOYL\'s approach to multimodal emotion intelligence and adaptive agents.',
      link: '#',
      download: true,
    },
    {
      type: 'Case Study',
      title: 'RetailTech Inc.: 40% Conversion Rate Increase',
      description:
        'Learn how RetailTech integrated SOYL\'s emotion-aware agents into their e-commerce platform.',
      link: '#',
      download: false,
    },
    {
      type: 'Research',
      title: 'Multimodal Emotion Detection: A Comparative Study',
      description:
        'Research paper comparing emotion detection across IEMOCAP, CMU-MOSEI, and AffectNet datasets.',
      link: '#',
      download: false,
    },
    {
      type: 'Webinar',
      title: 'Building Emotion-Aware Applications',
      description:
        'Watch our technical webinar on integrating SOYL\'s SDK into your applications.',
      link: '#',
      download: false,
      video: true,
    },
  ]

  const citations = [
    {
      title: 'IEMOCAP',
      description: 'Interactive emotional dyadic motion capture database',
      link: 'https://www.cs.columbia.edu/~dyan/iemocap/',
    },
    {
      title: 'CMU-MOSEI',
      description: 'CMU Multimodal Opinion Sentiment and Emotion Intensity',
      link: 'https://cmu-multicomp.github.io/CMU-MOSEI/',
    },
    {
      title: 'AffectNet',
      description: 'A large-scale facial expression dataset',
      link: 'https://arxiv.org/abs/1708.03985',
    },
  ]

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Resources
          </h1>
          <p className="text-xl text-muted max-w-3xl">
            Explore whitepapers, case studies, research citations, and webinars
            to learn more about emotion-aware AI and SOYL's technology.
          </p>
        </motion.div>

        {/* Resources List */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-xl p-6 border border-white/10 hover:border-accent/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wide">
                    {resource.type}
                  </span>
                  {resource.download && (
                    <span className="text-xs text-muted">PDF</span>
                  )}
                  {resource.video && (
                    <span className="text-xs text-muted">Video</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                <p className="text-muted mb-4 text-sm">{resource.description}</p>
                <Link
                  href={resource.link}
                  className="text-accent hover:underline text-sm font-medium"
                >
                  {resource.download ? 'Download' : resource.video ? 'Watch' : 'Read'} →
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Research Citations */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-xl p-8 border border-white/10"
          >
            <h2 className="text-3xl font-bold mb-8">Research Citations</h2>
            <p className="text-muted mb-6">
              SOYL's research builds on established multimodal emotion datasets
              and methodologies:
            </p>
            <div className="space-y-4">
              {citations.map((citation) => (
                <div
                  key={citation.title}
                  className="p-4 rounded-lg bg-panel/50 border border-white/5"
                >
                  <h3 className="font-semibold mb-2">{citation.title}</h3>
                  <p className="text-sm text-muted mb-2">{citation.description}</p>
                  <Link
                    href={citation.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline"
                  >
                    {citation.link} →
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-xl p-8 border border-white/10 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted mb-6">
            Subscribe to our newsletter for the latest research, case studies,
            and product updates.
          </p>
          <CTA href="mailto:hello@soyl.ai?subject=Newsletter Subscription" variant="primary" size="md">
            Subscribe to Newsletter
          </CTA>
        </motion.div>
      </div>
    </div>
  )
}

