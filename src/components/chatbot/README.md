# SOYL Chatbot (MCQ)

A production-ready, MCQ-driven chatbot component for the SOYL marketing website. The chatbot guides users through multiple-choice questions to help them learn about products, request pilots, explore careers, and more.

## Features

- **MCQ-driven flow**: Branching conversation based on multiple-choice questions
- **Session persistence**: Conversation state saved in sessionStorage
- **Privacy-first**: PII redaction, consent checkbox, no data collection without permission
- **Accessible**: Keyboard navigation, focus trap, screen reader support, ARIA labels
- **Responsive**: Full-screen on mobile, centered modal on desktop
- **Analytics hooks**: Integrates with `window.__SOYL_TRACK` if available
- **Server-side logging**: Non-PII session logs stored server-side

## Flow JSON Structure

The chatbot flow is defined in `mcq-flows/default-flow.json`. To edit the conversation flow:

### Node Types

1. **`question`**: Displays text and provides multiple choice options
   ```json
   {
     "type": "question",
     "text": "Your question here?",
     "choices": [
       { "id": "c_1", "text": "Option 1", "next": "n_next_node" }
     ]
   }
   ```

2. **`info`**: Informational message with optional choices
   ```json
   {
     "type": "info",
     "text": "Information text here",
     "choices": [
       { "id": "c_back", "text": "Back", "next": "n_previous" }
     ]
   }
   ```

3. **`end`**: Terminal node with action buttons
   ```json
   {
     "type": "end",
     "text": "Final message",
     "actions": [
       { "type": "mailto", "value": "email@soyl.ai", "subject": "Subject" },
       { "type": "cta", "label": "Button Text", "href": "/path" }
     ]
   }
   ```

### Action Types

- **`mailto`**: Opens email client with pre-filled recipient/subject
- **`cta`**: Button linking to internal or external URL
- **`link`**: Simple link navigation
- **`feedback`**: Shows feedback form (email, company, message)

### Example: Adding a New Node

1. Add node definition to `nodes` object:
   ```json
   "n_new_node": {
     "type": "info",
     "text": "This is a new informational node",
     "choices": [
       { "id": "c_back", "text": "Go back", "next": "n_welcome" }
     ]
   }
   ```

2. Link to it from another node:
   ```json
   "choices": [
     { "id": "c_new_option", "text": "See new info", "next": "n_new_node" }
   ]
   ```

## Privacy & Security

### PII Redaction

The chatbot detects personal information (emails, phone numbers) in feedback messages and:
1. Shows a warning to the user
2. Displays redacted preview
3. Automatically redacts before sending to server

### Consent

Users must consent to analytics before starting the flow. Consent is:
- Required before first interaction
- Stored in sessionStorage
- Logged with each interaction

### Server Logging

Logs are sent to `/api/chatbot/log` with:
- `sessionId`: Anonymous session identifier
- `nodeId`: Current conversation node
- `choiceId`: Selected choice (if applicable)
- `timestamp`: Interaction time
- `consent`: User consent status
- `redacted`: Whether PII was redacted

**Note**: No PII (personally identifiable information) is sent to the server. Only choice IDs and node IDs are logged.

## Accessibility

- **Keyboard navigation**: All choices are keyboard-accessible
- **Focus trap**: Tab/Shift+Tab cycles within modal
- **ESC key**: Closes modal
- **ARIA labels**: Proper dialog and button labels
- **Screen reader support**: Semantic HTML and ARIA attributes
- **Reduced motion**: Respects `prefers-reduced-motion` media query

## Analytics Integration

The chatbot calls `window.__SOYL_TRACK('chatbot:flow_start', data)` when flow starts (if available).

To enable analytics, ensure `window.__SOYL_TRACK` is defined:

```javascript
window.__SOYL_TRACK = function(event, data) {
  // Your analytics code here
  console.log(event, data)
}
```

## Testing

Run tests with:

```bash
npm test -- MCQEngine.test.tsx
```

Tests cover:
- Node navigation
- Consent requirement
- Logging calls
- Back/restart functionality

## Customization

### Styling

Styles are in `ChatbotStyles.css`. The component uses Tailwind CSS primarily, with custom CSS for:
- Absolute positioning (launcher button)
- Focus trap container
- PII warning styles

### Extending Flows

Create additional flow JSON files in `mcq-flows/` and load them dynamically:

```typescript
import customFlow from './mcq-flows/custom-flow.json'

<ChatbotModal flow={customFlow as FlowJson} />
```

## File Structure

```
src/components/chatbot/
├── index.tsx                    # Main chatbot component
├── ChatbotLauncher.tsx          # Floating button
├── ChatbotModal.tsx             # Modal container
├── MCQEngine.tsx                # Flow engine & state
├── ChatbotStyles.css            # Custom styles
├── hooks/
│   └── useSessionId.ts          # Session ID generation
├── mcq-flows/
│   └── default-flow.json        # Default conversation flow
├── __tests__/
│   └── MCQEngine.test.tsx       # Unit tests
└── README.md                    # This file
```

## Server Endpoint

The logging endpoint is at `src/app/api/chatbot/log/route.ts` (App Router).

Logs are written to `var/chatbot-logs.json` (newline-delimited JSON) or console.log if filesystem is not available (e.g., serverless environments).

## Security Notes

⚠️ **Important**: 
- Do NOT collect PII via bot flows
- Always require explicit opt-in
- Always redact PII after confirmation
- Server logs do not contain user-identifiable information
- Contact `privacy@soyl.ai` for deletion requests (as noted in UI)

## Support

For questions or issues:
- Email: `support@soyl.ai`
- See main README for contribution guidelines

