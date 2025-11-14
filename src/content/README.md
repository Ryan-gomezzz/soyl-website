# Content Editing Guide

This document explains where to edit copy and content for different pages.

## Page Content Locations

### Homepage (`src/app/page.tsx`)

**Main sections:**
- Hero section: Edit `src/app/_components/Hero.tsx`
- Feature cards: Edit `src/lib/data/features.ts` (see below)
- "How it works" section: Inline in `src/app/page.tsx`
- Use cases: Inline in `src/app/page.tsx`
- Testimonials: Edit `src/lib/data/testimonials.ts`

### Feature Data (`src/lib/data/features.ts`)

Edit the `features` array to update the three main feature cards:

```typescript
export const features: Feature[] = [
  {
    title: 'Emotion Sensing',
    description: 'Real-time face, voice and text emotion detection for richer context.',
    icon: '🎯',
  },
  // Add more features here
]
```

### SOYL R&D Page (`src/app/soyl-rd/page.tsx`)

**Content source:** Content adapted from `SOYL R&D (2).pdf`

**Edit sections:**
1. **Overview section** - Update the intro paragraph
2. **Phases array** - Each phase contains:
   - `phase`: Phase title
   - `timeline`: Timeline (e.g., "Months 1-6")
   - `description`: Phase description
   - `milestones`: Array of milestone strings

Example:
```typescript
{
  phase: 'Phase 1: Foundation MVP',
  timeline: 'Months 1-6',
  description: 'Build real-time emotion sensing capabilities...',
  milestones: [
    'Milestone 1',
    'Milestone 2',
  ],
}
```

3. **Key metrics** - Update the metrics array
4. **Team section** - Update team roles and contacts

### Careers Page (`src/app/careers/page.tsx`)

**Edit:** `src/lib/data/careers.ts`

Each career object contains:
- `title`: Job title
- `department`: Department name
- `location`: Location (Remote/Hybrid/On-site)
- `type`: Full-time/Part-time/Contract
- `description`: Job description
- `responsibilities`: Array of responsibility strings

### Testimonials (`src/lib/data/testimonials.ts`)

Edit the `testimonials` array:

```typescript
export const testimonials: Testimonial[] = [
  {
    quote: 'Testimonial text here...',
    author: 'John Doe',
    title: 'CEO, Company Name',
    avatar: '/images/testimonials/john-doe.webp',
  },
]
```

### Other Pages

- **Pricing** (`src/app/pricing/page.tsx`) - Edit inline
- **Docs** (`src/app/docs/page.tsx`) - Edit inline
- **Resources** (`src/app/resources/page.tsx`) - Edit inline
- **Enterprise** (`src/app/enterprise/page.tsx`) - Edit inline
- **Custom Agents** (`src/app/custom-agents/page.tsx`) - Edit inline

## Site Configuration

**Global settings:** `src/lib/siteConfig.ts`

Edit:
- `name`, `fullName`, `tagline`
- `description`
- `url`, `email`, `jobsEmail`
- Social media links
- Navigation items

## Best Practices

1. **Consistency:** Use consistent tone and terminology across pages
2. **Accessibility:** Ensure all content has proper alt text for images
3. **SEO:** Update meta descriptions in `src/app/layout.tsx` metadata object
4. **Links:** Verify all links (especially email `mailto:` links) are correct

## Content Updates Workflow

1. Edit content in appropriate file
2. Test locally: `npm run dev`
3. Verify changes look correct
4. Commit changes with descriptive message
5. Push to feature branch

## Need to Add New Content Sections?

1. Create component in `src/app/_components/` if reusable
2. Add to page in `src/app/[page-name]/page.tsx`
3. Update navigation in `src/lib/siteConfig.ts` if adding new page
4. Add to header/footer navigation if needed

---

**Image replacement:** See the main [README.md](../../README.md) for image guidelines.

