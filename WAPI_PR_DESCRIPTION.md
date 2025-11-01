# feat: WAPI-inspired landing — placeholders + image guide

## Summary

This PR implements a WAPI-inspired visual landing page system for SOYL with updated theme tokens, enhanced components, and comprehensive documentation for content and asset management.

## Changes Made

### Theme & Styling
- Updated `src/styles/tokens.css` with WAPI color palette:
  - Background: `#08090b` (near black)
  - Accent: `#1fb6ff` (cyan)
  - Accent-2: `#7ce7c5` (mint)
- Updated `tailwind.config.ts` to match new color scheme
- Maintained Inter font variable with preconnect

### Components Updated
- **Hero Component** (`src/app/_components/Hero.tsx`):
  - Updated to use placeholder image path (`/images/placeholders/hero-1.svg`)
  - Changed CTA to `mailto:sales@soyl.ai?subject=Pilot%20Request`
  - Added error fallback with emoji
  - Improved responsive spacing

### Homepage Enhancements (`src/app/page.tsx`)
- Added **Use Cases** section with 4 cards:
  - Retail AR Commerce
  - Kiosk Systems
  - Remote Sales
  - Support Triage
- All sections already exist and are polished

### SOYL R&D Page
- Verified content includes phases from SOYL R&D (2).pdf
- Phase 1-4 with timelines, descriptions, and milestones
- Key metrics section
- Team contact and partnership info
- Whitepaper download and R&D pilot CTAs

### Placeholder Images Created
- `public/images/placeholders/hero-1.svg` - Hero image (16:9, 1600×900)
- `public/images/placeholders/feature-1.svg` - Feature cards (3:2, 600×400)
- `public/images/placeholders/testimonial-avatar-1.svg` - Avatars (160×160, circular)

### Documentation
- **ASSET-README.md** (root): Complete image replacement guide
  - Exact file paths
  - Recommended aspect ratios and formats
  - Optimization best practices
  - Next.js Image component examples
  
- **src/content/README.md**: Content editing guide
  - Where to edit copy for each page
  - Data file locations (features, careers, testimonials)
  - Site configuration locations

### Tests
- **src/app/__tests__/home.smoke.test.tsx**: Smoke tests for homepage
  - Hero H1 rendering
  - "Story Of Your Life" subtitle
  - "Request a pilot" CTA
  - "What SOYL Does" section

## Files Created

```
ASSET-README.md
src/content/README.md
src/app/__tests__/home.smoke.test.tsx
public/images/placeholders/hero-1.svg
public/images/placeholders/feature-1.svg
public/images/placeholders/testimonial-avatar-1.svg
```

## Files Modified

```
src/styles/tokens.css
tailwind.config.ts
src/app/_components/Hero.tsx
src/app/page.tsx
```

## Image Replacement Guide

### Quick Reference

**Hero Image:**
- Path: `public/images/placeholders/hero-1.svg`
- Recommended: 1600×900px (16:9), WebP/AVIF
- Update in: `src/app/_components/Hero.tsx`

**Example code:**
```tsx
<Image
  src="/images/hero-real.webp"
  alt="SOYL product visualization"
  fill
  className="object-cover"
  priority
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

**Feature Cards:**
- Path: `public/images/placeholders/feature-1.svg`
- Recommended: 600×400px (3:2), WebP
- Update in respective component files

**Testimonial Avatars:**
- Path: `public/images/placeholders/testimonial-avatar-1.svg`
- Recommended: 160×160px, WebP/PNG (transparent)
- Update in: `src/lib/data/testimonials.ts`

See `ASSET-README.md` for complete details.

## Content Source

R&D page content was adapted from **SOYL R&D (2).pdf** with phases, timelines, and milestones accurately represented.

## Acceptance Criteria

- [x] WAPI-inspired theme tokens applied
- [x] Hero component uses placeholder images
- [x] Use cases section added to homepage
- [x] SOYL R&D page includes PDF content
- [x] Placeholder images created in `/public/images/placeholders/`
- [x] ASSET-README.md created with replacement guide
- [x] Content README created
- [x] Smoke tests added
- [x] Build succeeds
- [x] Linting passes

## Next Steps for Team

1. **Designer**: Replace placeholder images per `ASSET-README.md`
   - Hero image: 1600×900px WebP/AVIF
   - Feature images: 600×400px
   - Testimonial avatars: 160×160px circular

2. **Content Team**: Review and refine copy per `src/content/README.md`
   - Update feature descriptions if needed
   - Verify R&D phase content matches latest roadmap
   - Review testimonials and use cases

3. **Engineering**: 
   - Verify image optimization pipeline
   - Test all breakpoints after image replacement
   - Check Lighthouse performance score

## Repository Structure

All files follow Next.js App Router conventions:
- Pages: `src/app/[page-name]/page.tsx`
- Components: `src/app/_components/`
- Styles: `src/styles/`
- Data: `src/lib/data/`
- Public assets: `public/images/`

No repository layout adaptations were needed (all files match expected structure).

---

**Branch:** `feat/wapi-inspired-landing`  
**PR Title:** `feat: WAPI-inspired landing — placeholders + image guide`

**Reviewers:** @ryan-gomez  
**Assignee:** @frontend-dev (if available)

