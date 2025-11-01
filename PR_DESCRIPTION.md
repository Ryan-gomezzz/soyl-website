# feat: MCQ chatbot (modal)

## Summary

This PR adds a fully-functional, production-ready **MCQ-driven Chatbot** feature to the SOYL marketing website. The chatbot guides users through multiple-choice questions to help them explore products, request pilots, explore careers, and access documentation.

## Features

- **MCQ-driven flow**: Branching conversation based on multiple-choice questions defined in JSON
- **Modal UI**: Full-screen on mobile, centered modal on desktop with glass-morphism design
- **Session persistence**: Conversation state saved in sessionStorage (persists across modal close/reopen)
- **Server-side logging**: Non-PII session logs stored to `/api/chatbot/log` endpoint
- **Privacy-first**: PII redaction, consent checkbox, no data collection without permission
- **Accessibility**: Keyboard navigation, focus trap, screen reader support, ARIA labels, reduced-motion support
- **Analytics hooks**: Integrates with `window.__SOYL_TRACK` if available

## Files Created

### Frontend Components
- `src/components/chatbot/index.tsx` - Main chatbot component
- `src/components/chatbot/ChatbotLauncher.tsx` - Floating button (bottom-right)
- `src/components/chatbot/ChatbotModal.tsx` - Modal container with focus trap
- `src/components/chatbot/MCQEngine.tsx` - Flow engine & state management
- `src/components/chatbot/ChatbotStyles.css` - Custom styles
- `src/components/chatbot/hooks/useSessionId.ts` - Session ID generation hook
- `src/components/chatbot/mcq-flows/default-flow.json` - Default conversation flow
- `src/components/chatbot/__tests__/MCQEngine.test.tsx` - Unit tests

### Server / API
- `src/app/api/chatbot/log/route.ts` - Serverless endpoint for session logs

### Documentation
- `src/components/chatbot/README.md` - Complete chatbot documentation

### Modified Files
- `src/app/layout.tsx` - Added Chatbot component
- `README.md` - Added chatbot editing guide section

## Flow JSON Structure

The conversation flow is defined in `src/components/chatbot/mcq-flows/default-flow.json`. The flow includes:

- **Welcome node** with 6 main options (Product, R&D, Pricing, Careers, Contact, Docs)
- **Product information** nodes (overview, use cases, architecture)
- **R&D information** nodes (phases, partnerships)
- **Pricing** nodes (tiers, quotes)
- **Careers** nodes (roles, applications)
- **Documentation** nodes (quickstart, API reference)
- **Pilot request** flow with feedback form

See `src/components/chatbot/README.md` for complete documentation on editing flows.

## Privacy & Security

- **Consent required**: Users must consent to analytics before first interaction
- **PII detection**: Automatically detects emails/phone numbers in feedback messages
- **PII redaction**: Shows warning and redacts PII before sending to server
- **No PII logging**: Server logs only contain `sessionId`, `nodeId`, `choiceId`, and `timestamp`
- **Session storage**: Conversation state stored locally, never sent to server
- **Privacy link**: Footer includes "What we collect" disclosure

## Accessibility

- ✅ Keyboard navigation (Tab/Shift+Tab cycles through choices)
- ✅ Focus trap inside modal
- ✅ ESC key closes modal
- ✅ ARIA labels and roles (`role="dialog"`, `aria-modal="true"`)
- ✅ Screen reader support
- ✅ Reduced-motion support (`prefers-reduced-motion`)

## Testing

Unit tests for `MCQEngine`:
- ✅ Renders welcome node
- ✅ Requires consent before allowing choices
- ✅ Navigates to next node on choice click
- ✅ Sends log to API on choice
- ✅ Allows back navigation
- ✅ Restarts flow when restart button is clicked

Run tests: `npm test -- MCQEngine.test.tsx`

## How to Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and click the chatbot launcher (floating button bottom-right).

## How to Edit the Flow

1. Open `src/components/chatbot/mcq-flows/default-flow.json`
2. Add/modify nodes following the structure:
   - `question`: Displays text and provides choices
   - `info`: Informational message with optional choices
   - `end`: Terminal node with action buttons
3. Link nodes via `choices[].next` field
4. Test locally with `npm run dev`

See `src/components/chatbot/README.md` for complete documentation.

## Server Logging

Logs are written to `var/chatbot-logs.json` (newline-delimited JSON) or console.log if filesystem is not available (e.g., serverless environments).

**Note**: Logs do NOT contain PII. Only `sessionId`, `nodeId`, `choiceId`, and `timestamp` are logged.

## Acceptance Criteria

- [x] Chatbot launcher appears and opens modal
- [x] Consent checkbox must be accepted before first choice is selectable
- [x] MCQ flow navigates correctly per JSON
- [x] Session storage preserves progress across modal closes/reopens
- [x] Logs are posted to `/api/chatbot/log` on each answer (server responds 200)
- [x] Feedback form redacts PII or asks user for confirmation before sending
- [x] Unit tests for MCQ engine pass locally
- [x] Build succeeds with no errors
- [x] Linting passes with no errors

## Next Steps

- Replace placeholder content with finalized copy (if needed)
- Add real analytics provider integration (if needed)
- Customize flow JSON with product-specific content
- Add additional flow JSON files for different use cases

## Screenshots

_Add screenshots here when available_

---

**Reviewer**: @ryan-gomez  
**Assignee**: @frontend-dev (if available)
