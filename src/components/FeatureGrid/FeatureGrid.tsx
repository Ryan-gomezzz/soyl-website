'use client'

import { FeatureCard } from './FeatureCard'
import type { Feature } from '@/lib/data/features'

interface FeatureGridProps {
  features: Feature[]
}

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.title}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          delay={index * 0.1}
        />
      ))}
    </div>
  )
}

