'use client'

import { CTA } from '../_components/CTA'
import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="pt-24 min-h-screen bg-bg">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Transparent Infrastructure Pricing</h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Predictable monthly costs for your e-commerce stack. Scale as you grow.
            No hidden retainer fees.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          <PricingCard
            name="Starter"
            price="₹2,100"
            orders="Up to 150 orders/mo"
            desc="Ideal for early-stage D2C brands."
            features={[
              "Shared infrastructure",
              "Standard email support (24-48h)",
              "Full e-commerce website",
              "Hosting & DB management",
              "Secure infrastructure"
            ]}
          />
          <PricingCard
            name="Growth"
            price="₹3,500"
            orders="150-500 orders/mo"
            desc="For scaling brands necessitating speed."
            isPopular
            features={[
              "Priority email support",
              "Higher performance infra",
              "Mobile + Desktop responsive",
              "Admin dashboard",
              "Platform monitoring"
            ]}
          />
          <PricingCard
            name="Scale"
            price="₹6,500"
            orders="500-2,000 orders/mo"
            desc="Performance tuning for high volume."
            features={[
              "Performance tuning",
              "Analytics-ready",
              "Stability-focused infra",
              "Maintenance & Bug fixes",
              "Transactional email system"
            ]}
          />
          <PricingCard
            name="Enterprise"
            price="₹10,000+"
            orders="2,000+ orders/mo"
            desc="Dedicated resources and SLAs."
            features={[
              "Dedicated infrastructure",
              "SLA-backed support",
              "Custom integrations",
              "Advanced analytics",
              "Priority feature development"
            ]}
          />
        </div>

        {/* Setup Fee & Responsibility Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <div className="bg-panel rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-4">One-Time Setup Fee</h3>
            <div className="text-3xl font-bold text-accent mb-2">₹5,000 – ₹20,000</div>
            <p className="text-muted mb-6">
              Depends on catalog size, store complexity, and required integrations.
              This ensures your store is launched production-ready.
            </p>
            <div className="p-4 bg-white/5 rounded-lg text-sm text-muted">
              Includes: Initial deployment, domain setup, payment gateway integration, and catalog upload.
            </div>
          </div>

          <div className="bg-panel rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-6">Responsibility Split</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-accent mb-3">SOYL Handles</h4>
                <ul className="space-y-2 text-sm text-muted">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Tech Infrastructure</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Hosting & Security</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Platform Stability</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-accent" /> Backend Systems</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Client Handles</h4>
                <ul className="space-y-2 text-sm text-muted">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-white" /> Products & Inventory</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-white" /> Pricing & Margins</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-white" /> Logistics</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-white" /> Marketing Strategy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Add-ons */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-8 text-center">Modular Add-Ons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AddOnCard title="AI Chatbot" price="₹500/mo base + usage" desc="Automate customer support queries." />
            <AddOnCard title="OTP Login" price="₹199/mo" desc="Seamless mobile number authentication." />
            <AddOnCard title="Marketing Automation" price="Custom" desc="Email flows and auto-calling campaigns." />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to launch?</h2>
          <CTA href="/contact" variant="primary" size="lg">Get Started</CTA>
        </div>
      </div>
    </div>
  )
}

function PricingCard({ name, price, orders, desc, features, isPopular }: { name: string, price: string, orders: string, desc: string, features: string[], isPopular?: boolean }) {
  return (
    <div className={`relative p-8 rounded-2xl bg-panel border ${isPopular ? 'border-accent shadow-lg shadow-accent/10' : 'border-white/10'} flex flex-col`}>
      {isPopular && (
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
          <span className="bg-accent text-bg text-xs font-bold px-3 py-1 rounded-full">POPULAR</span>
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <div className="text-3xl font-bold text-white mb-1">{price}</div>
      <div className="text-sm text-accent mb-4">{orders}</div>
      <p className="text-sm text-muted mb-6 pb-6 border-b border-white/5">{desc}</p>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feat: string, i: number) => (
          <li key={i} className="flex gap-3 text-sm text-muted">
            <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <span>{feat}</span>
          </li>
        ))}
      </ul>

      <CTA href="/contact" variant={isPopular ? 'primary' : 'outline'} className="w-full justify-center">
        Choose Plan
      </CTA>
    </div>
  )
}

function AddOnCard({ title, price, desc }: { title: string, price: string, desc: string }) {
  return (
    <div className="p-6 rounded-xl border border-white/10 bg-black/20">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold">{title}</h3>
        <span className="text-sm font-mono text-accent">{price}</span>
      </div>
      <p className="text-sm text-muted">{desc}</p>
    </div>
  )
}
