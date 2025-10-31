'use client'

import { CTA } from '../_components/CTA'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function DocsPage() {
  const quickstartSteps = [
    {
      step: 1,
      title: 'Install the SDK',
      content: `npm install @soyl/sdk`,
    },
    {
      step: 2,
      title: 'Get Your API Key',
      content: `Sign up for an account and generate an API key from the dashboard.`,
    },
    {
      step: 3,
      title: 'Initialize the Client',
      content: `import { SOYLClient } from '@soyl/sdk';

const client = new SOYLClient({
  apiKey: 'your-api-key-here'
});`,
    },
    {
      step: 4,
      title: 'Make Your First Call',
      content: `const result = await client.emotion.detect({
  audio: audioData,
  video: videoFrame,
  text: userInput
});

console.log(result.emotion); // e.g., 'happy', 'neutral', 'excited'
console.log(result.confidence); // 0.0 - 1.0`,
    },
  ]

  const apiSections = [
    {
      title: 'Emotion API',
      description: 'Detect emotions from face, voice, and text inputs',
      endpoints: [
        {
          method: 'POST',
          path: '/v1/emotion/detect',
          description: 'Detect emotion from multimodal inputs',
        },
        {
          method: 'GET',
          path: '/v1/emotion/models',
          description: 'List available emotion detection models',
        },
      ],
    },
    {
      title: 'Agent API',
      description: 'Interact with adaptive AI sales agents',
      endpoints: [
        {
          method: 'POST',
          path: '/v1/agent/chat',
          description: 'Send message to adaptive agent',
        },
        {
          method: 'GET',
          path: '/v1/agent/session/{id}',
          description: 'Retrieve agent session state',
        },
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
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Documentation
          </h1>
          <p className="text-xl text-muted max-w-3xl">
            Get started with SOYL&apos;s emotion-aware AI APIs and SDKs. Build
            powerful applications with multimodal emotion detection and adaptive
            agents.
          </p>
        </motion.div>

        {/* Quickstart */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8">Quickstart</h2>
          <div className="space-y-8">
            {quickstartSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-bg flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    {step.content.includes('`') ? (
                      <div className="bg-bg rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-text/80">
                          <code>{step.content}</code>
                        </pre>
                      </div>
                    ) : (
                      <p className="text-muted">{step.content}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* API Reference */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8">API Reference</h2>
          <div className="space-y-12">
            {apiSections.map((section) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass rounded-xl p-8 border border-white/10"
              >
                <h3 className="text-2xl font-semibold mb-2">{section.title}</h3>
                <p className="text-muted mb-6">{section.description}</p>
                <div className="space-y-4">
                  {section.endpoints.map((endpoint) => (
                    <div
                      key={endpoint.path}
                      className="bg-bg rounded-lg p-4 border border-white/5"
                    >
                      <div className="flex items-center gap-4 mb-2">
                        <span className="px-3 py-1 rounded bg-accent/20 text-accent text-sm font-semibold">
                          {endpoint.method}
                        </span>
                        <code className="text-text/80">{endpoint.path}</code>
                      </div>
                      <p className="text-sm text-muted">{endpoint.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SDK Links */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-xl p-8 border border-white/10"
          >
            <h2 className="text-2xl font-semibold mb-4">SDK & Libraries</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">JavaScript/TypeScript SDK</h3>
                <Link
                  href="https://github.com/soyl-ai/soyl-sdk-js"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  github.com/soyl-ai/soyl-sdk-js
                </Link>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Python SDK</h3>
                <Link
                  href="https://github.com/soyl-ai/soyl-sdk-python"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  github.com/soyl-ai/soyl-sdk-python (Coming soon)
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Support */}
        <div className="text-center">
          <p className="text-muted mb-6">
            Need help? Check out our resources or contact support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTA href="/resources" variant="secondary" size="md">
              View Resources
            </CTA>
            <CTA href="mailto:hello@soyl.ai?subject=Documentation Question" variant="primary" size="md">
              Contact Support
            </CTA>
          </div>
        </div>
      </div>
    </div>
  )
}

