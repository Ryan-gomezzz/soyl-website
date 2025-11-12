import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — SOYL',
  description:
    'SOYL Privacy Policy: Learn how we collect, use, and protect your data when using our emotion-aware AI services.'
};

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-lg text-muted">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted mb-4">
              SOYL (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
              website, services, and emotion-aware AI products (collectively, the &quot;Services&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">2.1 Information You Provide</h3>
                <ul className="list-disc list-inside space-y-2 text-muted ml-4">
                  <li>Contact information (name, email, phone) when you apply for jobs or contact us</li>
                  <li>Resume and application materials submitted through our careers portal</li>
                  <li>Messages and communications sent through our chatbot or contact forms</li>
                  <li>Account credentials if you create an account to use our Services</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">2.2 Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted ml-4">
                  <li>Usage data (pages visited, time spent, interactions with our chatbot)</li>
                  <li>Device information (browser type, operating system, IP address)</li>
                  <li>Cookies and similar tracking technologies (see Section 5)</li>
                  <li>Analytics data to improve our Services</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">2.3 Emotion Data</h3>
                <p className="text-muted">
                  When you use our emotion-aware AI services, we may process multimodal inputs (audio, video, text) to
                  detect emotions. This data is processed in real-time and, when possible, on-device. We do not store
                  raw emotion data unless you explicitly consent, and we implement privacy-preserving techniques to
                  minimize data retention.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-muted ml-4">
              <li>Provide, maintain, and improve our Services</li>
              <li>Process job applications and communicate with candidates</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send you updates, newsletters, and marketing communications (with your consent)</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
              <li>Comply with legal obligations and enforce our Terms of Service</li>
              <li>Conduct research and analytics to improve our AI models and services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-muted mb-4">
              We do not sell your personal information. We may share your information only in the following
              circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted ml-4">
              <li>
                <strong>Service Providers:</strong> With trusted third-party vendors who assist us in operating our
                Services (e.g., cloud hosting, email services, analytics)
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, court order, or government regulation
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
              </li>
              <li>
                <strong>With Your Consent:</strong> When you explicitly authorize us to share your information
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="text-muted mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide
              personalized content. You can control cookies through your browser settings. Essential cookies are required
              for the Services to function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p className="text-muted mb-4">
              We implement industry-standard security measures to protect your information, including encryption,
              access controls, and regular security audits. However, no method of transmission over the Internet is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights and Choices</h2>
            <p className="text-muted mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc list-inside space-y-2 text-muted ml-4">
              <li>
                <strong>Access:</strong> Request a copy of the personal information we hold about you
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate or incomplete information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal information (subject to legal
                requirements)
              </li>
              <li>
                <strong>Opt-Out:</strong> Unsubscribe from marketing communications
              </li>
              <li>
                <strong>Data Portability:</strong> Request your data in a portable format
              </li>
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
            <h2 className="text-2xl font-semibold mb-4">8. Children&apos;s Privacy</h2>
            <p className="text-muted">
              Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal
              information from children. If you believe we have collected information from a child, please contact us
              immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
            <p className="text-muted">
              Your information may be transferred to and processed in countries other than your country of residence.
              We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy
              and applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-muted">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by
              posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. Your
              continued use of the Services after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="text-muted mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please
              contact us:
            </p>
            <div className="bg-bg rounded-lg p-6 border border-white/10">
              <p className="text-muted mb-2">
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@soyl.ai" className="text-accent hover:underline">
                  privacy@soyl.ai
                </a>
              </p>
              <p className="text-muted">
                <strong>General Inquiries:</strong>{' '}
                <a href="mailto:hello@soyl.ai" className="text-accent hover:underline">
                  hello@soyl.ai
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

