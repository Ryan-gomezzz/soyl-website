import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — SOYL',
  description:
    'SOYL Terms of Service: Read our terms and conditions for using our emotion-aware AI services and platform.'
};

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Terms of Service</h1>
          <p className="text-lg text-muted">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted mb-4">
              By accessing or using the services, website, or products provided by SOYL (&quot;we,&quot; &quot;our,&quot;
              or &quot;us&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not
              agree to these Terms, you may not use our Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
            <p className="text-muted mb-4">
              SOYL provides emotion-aware AI services, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted ml-4">
              <li>Multimodal emotion detection APIs and SDKs</li>
              <li>Adaptive AI sales agents and conversational interfaces</li>
              <li>Enterprise AI solutions and custom agent development</li>
              <li>Research and development tools for emotion intelligence</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts and Registration</h2>
            <div className="space-y-4">
              <p className="text-muted">
                Some Services may require you to create an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your account information to keep it accurate</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access or security breach</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
            <p className="text-muted mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted ml-4">
              <li>Use the Services for any illegal purpose or in violation of any laws</li>
              <li>Transmit any harmful code, viruses, or malicious software</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Interfere with or disrupt the Services or servers</li>
              <li>Use the Services to harass, abuse, or harm others</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Reverse engineer, decompile, or disassemble any part of our Services</li>
              <li>Use automated systems (bots, scrapers) to access the Services without permission</li>
              <li>Collect or harvest personal information from other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <div className="space-y-4">
              <p className="text-muted">
                The Services, including all content, features, software, and technology, are owned by SOYL and protected
                by intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to
                use the Services in accordance with these Terms.
              </p>
              <p className="text-muted">
                You retain ownership of any content you submit through the Services. By submitting content, you grant us
                a worldwide, royalty-free license to use, reproduce, modify, and distribute such content for the purpose
                of providing and improving our Services.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. API Usage and Rate Limits</h2>
            <p className="text-muted mb-4">
              If you use our APIs or SDKs, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted ml-4">
              <li>Comply with any rate limits, usage quotas, or restrictions we impose</li>
              <li>Use API keys securely and not share them with unauthorized parties</li>
              <li>Not attempt to circumvent rate limits or usage restrictions</li>
              <li>Respect our fair use policies and terms of your subscription tier</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Payment and Billing</h2>
            <p className="text-muted mb-4">
              For paid Services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted ml-4">
              <li>You agree to pay all fees associated with your subscription or usage</li>
              <li>Fees are charged in advance on a recurring basis (monthly or annual)</li>
              <li>All fees are non-refundable unless required by law or stated otherwise</li>
              <li>We reserve the right to change pricing with 30 days&apos; notice</li>
              <li>Failure to pay may result in suspension or termination of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Privacy and Data Protection</h2>
            <p className="text-muted">
              Your use of the Services is also governed by our{' '}
              <a href="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </a>
              . By using the Services, you consent to the collection and use of your information as described in the
              Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimers and Limitations of Liability</h2>
            <div className="space-y-4">
              <p className="text-muted">
                <strong>THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF
                ANY KIND, EXPRESS OR IMPLIED.</strong> We disclaim all warranties, including but not limited to
                merchantability, fitness for a particular purpose, and non-infringement.
              </p>
              <p className="text-muted">
                To the maximum extent permitted by law, SOYL shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or
                indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of
                the Services.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
            <p className="text-muted">
              You agree to indemnify, defend, and hold harmless SOYL and its officers, directors, employees, and agents
              from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use
              of the Services, violation of these Terms, or infringement of any rights of another party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            <p className="text-muted mb-4">
              We may terminate or suspend your access to the Services at any time, with or without cause or notice, for
              any reason, including if you breach these Terms. Upon termination:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted ml-4">
              <li>Your right to use the Services will immediately cease</li>
              <li>We may delete your account and associated data</li>
              <li>All provisions of these Terms that by their nature should survive will survive</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law and Dispute Resolution</h2>
            <p className="text-muted">
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction],
              without regard to its conflict of law provisions. Any disputes arising from these Terms or the Services
              shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization],
              except where prohibited by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
            <p className="text-muted">
              We reserve the right to modify these Terms at any time. We will notify you of material changes by posting
              the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the
              Services after such changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
            <p className="text-muted mb-4">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-bg rounded-lg p-6 border border-white/10">
              <p className="text-muted mb-2">
                <strong>Email:</strong>{' '}
                <a href="mailto:legal@soyl.ai" className="text-accent hover:underline">
                  legal@soyl.ai
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

