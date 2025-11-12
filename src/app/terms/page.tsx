import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — SOYL',
  description: 'SOYL Terms of Service: Legal terms and conditions for using our services.'
};

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted">
              By accessing or using SOYL&apos;s website, services, or applications, you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
            <p className="text-muted">
              SOYL provides emotion-aware AI solutions, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li>AI-powered cognitive agents and chatbots</li>
              <li>Emotion detection APIs and SDKs</li>
              <li>Enterprise AI solutions and integrations</li>
              <li>Documentation, resources, and support services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Use of Services</h2>
            <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Permitted Use</h3>
            <p className="text-muted">
              You may use our services only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit harmful, offensive, or illegal content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt our services</li>
              <li>Use automated systems to scrape or extract data without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
            <p className="text-muted">
              All content, features, and functionality of our services, including but not limited to text, graphics, logos, software, and AI models, are owned by SOYL or its licensors and are protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. User Accounts and Job Applications</h2>
            <p className="text-muted mb-4">
              When you submit a job application or create an account:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You consent to our processing of your application data as described in our Privacy Policy</li>
              <li>You grant us permission to contact you regarding your application</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. API and SDK Usage</h2>
            <p className="text-muted">
              If you use our APIs or SDKs, you agree to comply with any applicable usage limits, rate limits, and terms specified in your service agreement or API documentation. Unauthorized use or abuse of our APIs may result in suspension or termination of access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Disclaimers</h2>
            <p className="text-muted">
              Our services are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, error-free, or secure. AI-generated content may contain inaccuracies and should be verified independently.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="text-muted">
              To the maximum extent permitted by law, SOYL shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Indemnification</h2>
            <p className="text-muted">
              You agree to indemnify and hold harmless SOYL, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of your use of our services or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <p className="text-muted">
              We reserve the right to suspend or terminate your access to our services at any time, with or without cause or notice, for any reason, including violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
            <p className="text-muted">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which SOYL operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p className="text-muted">
              We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of our services after such changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Severability</h2>
            <p className="text-muted">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
            <p className="text-muted">
              If you have questions about these Terms, please contact us at:
            </p>
            <p className="text-muted mt-4">
              <strong>Email:</strong>{' '}
              <a href="mailto:legal@soyl.ai" className="text-accent hover:underline">
                legal@soyl.ai
              </a>
            </p>
            <p className="text-muted mt-2">
              <strong>General Inquiries:</strong>{' '}
              <a href="mailto:hello@soyl.ai" className="text-accent hover:underline">
                hello@soyl.ai
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

