import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — SOYL',
  description: 'SOYL Privacy Policy: How we collect, use, and protect your data.'
};

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-muted mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted">
              SOYL (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, services, and AI-powered applications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li>Contact information (name, email, phone) when you apply for jobs or contact us</li>
              <li>Resume and application materials submitted through our careers portal</li>
              <li>Messages and communications sent through our chatbot or contact forms</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li>Usage data and analytics (with consent) from chatbot interactions</li>
              <li>Technical information (IP address, browser type, device information)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li>To process job applications and communicate with candidates</li>
              <li>To provide, maintain, and improve our services</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To analyze usage patterns and improve user experience (with consent)</li>
              <li>To comply with legal obligations and protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-muted mb-4">
              We do not sell your personal information. We may share your data with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li>Service providers who assist in our operations (e.g., cloud hosting, email services)</li>
              <li>Legal authorities when required by law or to protect our rights</li>
              <li>Business partners in connection with mergers, acquisitions, or asset sales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-muted">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <p className="text-muted mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate or incomplete information</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Withdraw consent at any time (where processing is based on consent)</li>
            </ul>
            <p className="text-muted mt-4">
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@soyl.ai" className="text-accent hover:underline">
                privacy@soyl.ai
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Chatbot and Analytics</h2>
            <p className="text-muted">
              Our chatbot collects non-identifying analytics of your choices only with your explicit consent. You can withdraw consent at any time. We do not collect personally identifiable information through chatbot interactions without your permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p className="text-muted">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
            <p className="text-muted">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-muted">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="text-muted">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at:
            </p>
            <p className="text-muted mt-4">
              <strong>Email:</strong>{' '}
              <a href="mailto:privacy@soyl.ai" className="text-accent hover:underline">
                privacy@soyl.ai
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

