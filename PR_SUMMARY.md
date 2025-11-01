# SOYL Assistant Promo Section - Implementation Summary

## Branch
`feat/landing-assistant-promo`

## Overview
Added a promotional section on the landing page below the hero that introduces the SOYL Assistant and provides CTAs to try it or learn more.

## Files Created/Modified

### Created
- `src/components/AssistantPromo.tsx` - New promo component with glass effect card
- `src/components/__tests__/AssistantPromo.test.tsx` - Unit tests for the promo component
- `src/components/chatbot/controller.ts` - Programmatic API to control chatbot panel

### Modified
- `src/app/page.tsx` - Added AssistantPromo below hero, added id to "How it works" section
- `src/components/chatbot/ChatbotPanel.tsx` - Added event listeners for ChatbotController, added id="soyl-assistant-panel"

## Features

1. **Promo Section**
   - Placed directly under hero, above feature cards
   - Glass effect card with dot pattern background
   - Cyan accent glow effect
   - Responsive: 2-column desktop, stacked mobile

2. **CTAs**
   - Primary: "Try the Assistant" - Opens ChatbotPanel via ChatbotController
   - Secondary: "How it works" - Smooth scrolls to #how-it-works section

3. **Integration**
   - ChatbotController API allows programmatic panel control
   - Floating launcher still works independently
   - Panel opens non-blocking (existing behavior)

4. **Accessibility**
   - Proper ARIA attributes (role="region", aria-labelledby)
   - Keyboard navigation support
   - Respects prefers-reduced-motion

5. **Tests**
   - 7 unit tests covering rendering, CTA clicks, accessibility, and reduced motion

## How to Test Locally

```bash
git checkout feat/landing-assistant-promo
npm install
npm run dev
```

1. Open http://localhost:3000
2. Scroll below hero - promo section should appear
3. Click "Try the Assistant" - panel should slide in from right
4. Click "How it works" - should scroll to the section
5. Verify floating launcher still works (bottom-right)
6. Verify page remains interactive when panel is open (non-blocking)

## Acceptance Criteria

- ✅ Promo appears directly under hero on desktop and mobile
- ✅ Clicking "Try the Assistant" opens ChatbotPanel
- ✅ Floating launcher still works and opens panel
- ✅ Promo is keyboard-accessible with proper ARIA labels
- ✅ Unit tests pass (7 tests, all passing)
- ✅ Build passes successfully

## Visual Design

- Black background with cyan accents matching site theme
- Dot pattern texture background
- Glass morphism effect (backdrop-blur)
- Subtle cyan glow on card
- Animated visual placeholder on right (desktop)
- Pulse animation on primary CTA (respects reduced motion)

## PR Link
https://github.com/Ryan-gomezzz/soyl-website/pull/new/feat/landing-assistant-promo

