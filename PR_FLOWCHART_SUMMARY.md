# Flowchart Visuals + Feature Hover Dots + Why Choose Us

## Branch
`feat/flowchart-visuals`

## Overview
This PR adds three major visual enhancements to the landing page:
1. **Interactive Flowchart** - Visual representation of SOYL's R&D journey with hoverable nodes
2. **Feature Grid with Hover Dots** - Enhanced feature cards with multi-color animated dot clusters on hover
3. **Why Choose Us Section** - New section highlighting key benefits with animated dot accents

## Files Created

### Flowchart Components
- `src/components/Flowchart/FlowchartSection.tsx` - Main wrapper component
- `src/components/Flowchart/FlowchartCanvas.tsx` - SVG canvas renderer with pan/zoom support
- `src/components/Flowchart/FlowNode.tsx` - Interactive node card component
- `src/components/Flowchart/FlowEdge.tsx` - Curved edge/connection renderer
- `src/components/Flowchart/flow-data.ts` - Node and edge data (EDIT HERE for node positions/copy)
- `src/components/Flowchart/README.md` - Complete editing guide with citation
- `src/components/Flowchart/__tests__/Flowchart.test.tsx` - Unit tests

### Feature Grid Components
- `src/components/FeatureGrid/DotCluster.tsx` - Multi-color animated dots component
- `src/components/FeatureGrid/FeatureCard.tsx` - Enhanced feature card with hover effects
- `src/components/FeatureGrid/FeatureGrid.tsx` - Grid container component
- `src/components/FeatureGrid/__tests__/FeatureCard.test.tsx` - Unit tests

### Why Choose Us
- `src/components/WhyChoose/WhyChooseUs.tsx` - New benefits section

### Modified Files
- `src/app/page.tsx` - Added FlowchartSection, FeatureGrid, WhyChooseUs
- `src/styles/tokens.css` - Added multi-color dot palette variables
- `README.md` - Added flowchart editing guide section

## How to Edit Flowchart Nodes

### Quick Guide

1. **Open**: `src/components/Flowchart/flow-data.ts`
2. **Edit node positions**: Change `x` and `y` values (0.0 to 1.0)
   - `x: 0` = left edge, `x: 1` = right edge
   - `y: 0` = top edge, `y: 1` = bottom edge
3. **Update copy**: Edit `title`, `subtitle`, `description` fields
4. **Save** and run `npm run dev` to see changes

### Example

```typescript
{
  id: "n_phase1",
  title: "Phase 1 — MVP",
  subtitle: "Foundation & Feasibility",
  description: "Your description here...",
  x: 0.15,  // 15% from left (0 = left, 1 = right)
  y: 0.35,  // 35% from top (0 = top, 1 = bottom)
  size: "lg",
  cta: {
    label: "Read Phase 1",
    href: "/soyl-rd",
    action: "docs"
  },
  meta: {
    phase: "0-6 mo"
  }
}
```

See `src/components/Flowchart/README.md` for complete documentation.

### Data Source Citation

**Node descriptions adapted from:** SOYL R&D (2).pdf - R&D phases and milestones documentation

All node content (titles, subtitles, descriptions, timelines) were adapted from the SOYL R&D document. Please cite this source when updating node copy.

## Acceptance Checklist

- [x] Flowchart added below hero (desktop & mobile responsive)
- [x] Hovering a flow node reveals animated multi-color dot cluster and tooltip
- [x] Clicking a node opens details/CTAs (routes to /soyl-rd or mailto pilot)
- [x] Feature grid shows multi-color dot accent on hover
- [x] Why choose us block uses dot accents and readable contrast
- [x] All animations respect `prefers-reduced-motion`
- [x] Unit tests pass locally (3 flowchart tests, 3 feature card tests)
- [x] Build passes successfully
- [x] Flow data README included with editing guide
- [x] R&D document citation present in flow-data.ts and README

## How to Test Locally

```bash
git checkout feat/flowchart-visuals
npm install && npm run dev
```

1. Open http://localhost:3000
2. Scroll below hero - flowchart section should appear
3. Hover over flowchart nodes - dot cluster should appear, tooltip should show
4. Click a flowchart node - should route to /soyl-rd or mailto
5. Scroll to feature grid - hover over cards - dot clusters should appear
6. Scroll to "Why Choose Us" - animated dots should be visible
7. Verify all animations stop when `prefers-reduced-motion` is enabled

## Test Results

- ✅ All 6 unit tests pass
- ✅ Build successful
- ✅ No linting errors
- ✅ TypeScript compilation passes

## Visual Features

- **Multi-color dot palette**: Cyan, mint, yellow, magenta dots for hover effects
- **Smooth animations**: Respects reduced motion preferences
- **Interactive flowchart**: Hover highlights, tooltips, clickable CTAs
- **Responsive design**: Works on desktop and mobile
- **Accessible**: Keyboard navigation, ARIA labels, focus outlines

